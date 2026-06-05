import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

const SEPAY_API_KEY = process.env.SEPAY_API_KEY ?? ''
const TOKEN_TTL_HOURS = 72
const TOKEN_MAX_USES  = 5

function ok()  { return NextResponse.json({ success: true }) }
function skip() { return NextResponse.json({ success: true, skipped: true }) }

// Parse mã đơn hàng từ nội dung chuyển khoản — dạng WD-XXXXXXXX
function extractOrderCode(content: string): string | null {
  const m = content.match(/WD-[A-Z0-9]{5,12}/i)
  return m ? m[0].toUpperCase() : null
}

export async function POST(req: NextRequest) {
  // 1. Xác thực API Key — Sepay gửi dạng "Apikey XXXX"
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace(/^Apikey\s+/i, '').trim()
  if (!SEPAY_API_KEY || token !== SEPAY_API_KEY) {
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

  // 7. Sinh download token
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
  return ok()
}

function extractSlug(title: string): string {
  const m = title.match(/Template:\s*(.+)/) ?? title.match(/Website Gói B \((.+)\)/)
  return m?.[1]?.trim() ?? ''
}
