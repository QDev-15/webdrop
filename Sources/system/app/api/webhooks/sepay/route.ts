import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID, timingSafeEqual } from 'crypto'
import { sendDownloadEmail } from '@/lib/email'
import { hashPassword } from '@/lib/auth'
import { getSepayApiKey } from '@/lib/sepay'

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

const TOKEN_TTL_HOURS = 72
const TOKEN_MAX_USES  = 5

function ok()  { return NextResponse.json({ success: true }) }
function skip() { return NextResponse.json({ success: true, skipped: true }) }

// Parse mã đơn hàng từ nội dung chuyển khoản — dạng WDXXXXXXXX (mới) hoặc WD-XXXXXXXX (cũ)
function extractOrderCode(content: string): string | null {
  const m = content.match(/WD-?[A-Z0-9]{5,12}/i)
  return m ? m[0].toUpperCase() : null
}

export async function POST(req: NextRequest) {
  // 1. Xác thực API Key — Sepay gửi dạng "Apikey XXXX"
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace(/^Apikey\s+/i, '').trim()
  const sepayApiKey = await getSepayApiKey()
  if (!sepayApiKey || !safeEqual(token, sepayApiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 2. Chỉ xử lý giao dịch tiền vào
  const transferType = (body.transferType as string) ?? ''
  if (transferType && transferType !== 'in') return skip()

  const content        = String(body.content ?? body.description ?? '')
  const transferAmount = Number(body.transferAmount ?? body.amount ?? 0)

  // 3. Tìm mã đơn trong nội dung chuyển khoản
  const orderCode = extractOrderCode(content)
  if (!orderCode) return skip()

  // 4. Tìm đơn hàng
  const order = await prisma.order.findUnique({
    where: { code: orderCode },
    include: {
      customer: { select: { name: true, email: true } },
      payments: { where: { status: 'pending' }, take: 1 },
    },
  })
  if (!order) return skip()

  // 5. Idempotent — đã xử lý rồi thì bỏ qua
  if (order.paidAt !== null) return skip()

  // 6. Kiểm tra số tiền (cho phép sai lệch tối đa 1000đ do phí)
  const expected = Number(order.total)
  if (transferAmount < expected - 1000) {
    console.warn(`[sepay] Đơn ${orderCode}: thiếu tiền (nhận ${transferAmount}, cần ${expected})`)
    return skip()
  }

  // 7a. Xử lý đơn CV — tạo tài khoản user, không cần download token
  if (order.type === 'cv') {
    const customerEmail = order.customer.email
    if (!customerEmail) {
      console.warn(`[sepay] Đơn CV ${orderCode}: không có email — bỏ qua tạo tài khoản`)
      return skip()
    }

    const tempPassword = 'WD' + randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()

    await prisma.$transaction(async (tx) => {
      // Tạo user nếu chưa tồn tại
      const existingUser = await tx.user.findUnique({ where: { email: customerEmail } })
      let credentialToken: string

      if (!existingUser) {
        const newUser = await tx.user.create({
          data: { name: order.customer.name, email: customerEmail, password: hashPassword(tempPassword), role: 'user' },
        })
        const slug = generateCvSlug(order.customer.name)
        await tx.cvProfile.create({
          data: { userId: newUser.id, slug, templateType: 'classic', data: { create: {} } },
        })
        // Lưu mật khẩu tạm vào downloadToken để client lấy và hiển thị
        credentialToken = tempPassword
      } else {
        // User đã tồn tại, tạo cv profile nếu chưa có
        const existingProfile = await tx.cvProfile.findUnique({ where: { userId: existingUser.id } })
        if (!existingProfile) {
          const slug = generateCvSlug(order.customer.name)
          await tx.cvProfile.create({
            data: { userId: existingUser.id, slug, templateType: 'classic', data: { create: {} } },
          })
        }
        credentialToken = 'EXISTING_USER'
      }

      await tx.order.update({
        where: { id: order.id },
        data: { status: 'confirmed', paidAt: new Date(), downloadToken: credentialToken },
      })

      if (order.payments.length > 0) {
        await tx.payment.update({
          where: { id: order.payments[0].id },
          data: { status: 'paid', paidAt: new Date() },
        })
      }

      const now = new Date()
      await tx.revenue.create({
        data: {
          orderId: order.id,
          paymentId: order.payments[0]?.id ?? null,
          amount: order.total,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          note: `CV Builder — Sepay ${body.referenceCode ?? ''}`,
        },
      })
    })

    console.log(`[sepay] Đơn CV ${orderCode} đã thanh toán — tài khoản CV tạo OK`)
    return ok()
  }

  // 7b. Đơn template/website — sinh download token
  const downloadToken  = randomUUID()
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000)

  // 8. Update order + payment trong 1 transaction
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status:        'confirmed',
        paidAt:        new Date(),
        downloadToken,
        tokenExpiresAt,
        tokenUsedCount: 0,
      },
    })

    if (order.payments.length > 0) {
      await tx.payment.update({
        where: { id: order.payments[0].id },
        data:  { status: 'paid', paidAt: new Date() },
      })
    }

    // Ghi nhận doanh thu
    const now = new Date()
    await tx.revenue.create({
      data: {
        orderId:  order.id,
        paymentId: order.payments[0]?.id ?? null,
        amount:   order.total,
        month:    now.getMonth() + 1,
        year:     now.getFullYear(),
        note:     `Thanh toán tự động qua Sepay — ${body.referenceCode ?? ''}`,
      },
    })
  })

  console.log(`[sepay] Đơn ${orderCode} đã thanh toán — token sinh OK`)

  // Gửi email download nếu tính năng được bật và khách có email
  if (order.customer.email) {
    const emailToggle = await prisma.setting.findFirst({ where: { key: 'email_send_download' } })
    if (emailToggle?.value === 'true') {
      const slug = extractSlug(order.title)
      sendDownloadEmail({
        to:            order.customer.email,
        customerName:  order.customer.name,
        orderCode:     order.code,
        downloadToken,
        type:          order.type === 'website' ? 'website' : 'template',
        slug,
        amount:        Number(order.total),
      }).catch(e => console.error('[email] sendDownloadEmail failed:', e))
    }
  }

  return ok()
}

function extractSlug(title: string): string {
  const m = title.match(/Template:\s*(.+)/) ?? title.match(/Website Gói B \((.+)\)/)
  return m?.[1]?.trim() ?? ''
}

function generateCvSlug(name: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30)
    .replace(/-$/, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}
