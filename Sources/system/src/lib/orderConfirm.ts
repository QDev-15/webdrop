import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { sendDownloadEmail, sendCvCredentialsEmail } from '@/lib/email'
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

    const result = await prisma.$transaction(async (tx) => {
      const { credentialToken, isNewAccount } = await createOrReuseGuestCvAccount(tx, order.customerId, order.customer.name, customerEmail)

      // UPDATE có điều kiện paidAt=null — chống race condition (webhook Sepay retry + admin xác nhận
      // thủ công gần như đồng thời có thể cùng đọc paidAt=null trước khi bên nào update xong, dẫn tới
      // ghi trùng Revenue/gửi email 2 lần). Nếu 0 dòng bị ảnh hưởng nghĩa là request khác đã xử lý xong.
      const { count } = await tx.order.updateMany({
        where: { id: order.id, paidAt: null },
        data: { status: 'confirmed', paidAt: new Date(), downloadToken: credentialToken, newCvAccount: isNewAccount },
      })
      if (count === 0) return null

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

      return { isNewAccount, credentialToken }
    })

    if (!result) return { ok: false, reason: 'already_paid' }

    // Gửi email thông tin đăng nhập nếu là tài khoản mới tạo (có mật khẩu tạm cần gửi) — tránh mất
    // mật khẩu tạm vĩnh viễn nếu khách đóng tab trước khi trang polling kịp hiển thị.
    if (result.isNewAccount && result.credentialToken) {
      const emailToggle = await prisma.setting.findFirst({ where: { key: 'email_send_download' } })
      if (emailToggle?.value === 'true') {
        sendCvCredentialsEmail({
          to: customerEmail,
          name: order.customer.name,
          email: customerEmail,
          password: result.credentialToken,
          orderCode: order.code,
        }).catch(e => console.error('[email] sendCvCredentialsEmail failed:', e))
      }
    }

    return { ok: true }
  }

  // Đơn template/website — sinh download token
  const downloadToken  = randomUUID()
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000)

  const confirmed = await prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: order.id, paidAt: null },
      data: { status: 'confirmed', paidAt: new Date(), downloadToken, tokenExpiresAt, tokenUsedCount: 0 },
    })
    if (count === 0) return false

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
    return true
  })

  if (!confirmed) return { ok: false, reason: 'already_paid' }

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
