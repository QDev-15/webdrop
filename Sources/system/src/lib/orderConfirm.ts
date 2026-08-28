import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { sendDownloadEmail } from '@/lib/email'
import { createOrReuseGuestCvAccount } from '@/lib/checkoutAccount'

const TOKEN_TTL_HOURS = 72

type ConfirmResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'already_paid' }

function extractSlug(title: string): string {
  const m = title.match(/Template:\s*(.+)/) ?? title.match(/Website Gói B \((.+)\)/)
  return m?.[1]?.trim() ?? ''
}

// Đánh dấu 1 đơn hàng đã thanh toán — dùng chung cho webhook Sepay (tự động)
// và admin "Xác nhận thanh toán thủ công" (khi webhook không gọi được, vd site chạy local
// hoặc SePay không nhận diện được nội dung chuyển khoản). Idempotent qua check `paidAt`.
export async function confirmOrderPayment(orderCode: string, note: string): Promise<ConfirmResult> {
  const order = await prisma.order.findUnique({
    where: { code: orderCode },
    include: {
      customer: { select: { name: true, email: true } },
      payments: { where: { status: 'pending' }, take: 1 },
    },
  })
  if (!order) return { ok: false, reason: 'not_found' }
  if (order.paidAt !== null) return { ok: false, reason: 'already_paid' }

  // Đơn CV — tạo/tái sử dụng tài khoản khách hàng (CustomerAccount), không cần download token
  if (order.type === 'cv') {
    const customerEmail = order.customer.email
    if (!customerEmail) return { ok: false, reason: 'not_found' }

    await prisma.$transaction(async (tx) => {
      const { credentialToken } = await createOrReuseGuestCvAccount(tx, order.customerId, order.customer.name, customerEmail)

      await tx.order.update({
        where: { id: order.id },
        data: { status: 'confirmed', paidAt: new Date(), downloadToken: credentialToken },
      })

      if (order.payments.length > 0) {
        await tx.payment.update({ where: { id: order.payments[0].id }, data: { status: 'paid', paidAt: new Date() } })
      }

      const now = new Date()
      await tx.revenue.create({
        data: {
          orderId: order.id,
          paymentId: order.payments[0]?.id ?? null,
          amount: order.total,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          note,
        },
      })
    })

    return { ok: true }
  }

  // Đơn template/website — sinh download token
  const downloadToken  = randomUUID()
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000)

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: 'confirmed', paidAt: new Date(), downloadToken, tokenExpiresAt, tokenUsedCount: 0 },
    })

    if (order.payments.length > 0) {
      await tx.payment.update({ where: { id: order.payments[0].id }, data: { status: 'paid', paidAt: new Date() } })
    }

    const now = new Date()
    await tx.revenue.create({
      data: {
        orderId: order.id,
        paymentId: order.payments[0]?.id ?? null,
        amount: order.total,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        note,
      },
    })
  })

  if (order.customer.email) {
    const emailToggle = await prisma.setting.findFirst({ where: { key: 'email_send_download' } })
    if (emailToggle?.value === 'true') {
      const slug = extractSlug(order.title)
      sendDownloadEmail({
        to:           order.customer.email,
        customerName: order.customer.name,
        orderCode:    order.code,
        downloadToken,
        type:         order.type === 'website' ? 'website' : 'template',
        slug,
        amount:       Number(order.total),
      }).catch(e => console.error('[email] sendDownloadEmail failed:', e))
    }
  }

  return { ok: true }
}
