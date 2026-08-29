import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { timingSafeEqual } from 'crypto'
import { getSepayApiKey } from '@/lib/sepay'
import { confirmOrderPayment } from '@/lib/orderConfirm'

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

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

  // 4. Tìm đơn hàng (chỉ để kiểm tra tồn tại + số tiền — confirmOrderPayment tự query lại)
  const order = await prisma.order.findUnique({ where: { code: orderCode } })
  if (!order) return skip()

  // 5. Idempotent — đã xử lý rồi thì bỏ qua
  if (order.paidAt !== null) return skip()

  // 6. Kiểm tra số tiền (cho phép sai lệch tối đa 1000đ do phí)
  const expected = Number(order.total)
  if (transferAmount < expected - 1000) {
    console.warn(`[sepay] Đơn ${orderCode}: thiếu tiền (nhận ${transferAmount}, cần ${expected})`)
    return skip()
  }

  // 7. Xác nhận thanh toán — logic dùng chung với admin "Xác nhận thủ công"
  //    Bọc try/catch: nếu confirmOrderPayment lỗi (bug, DB tạm gián đoạn...), trả 500 rõ ràng để
  //    Sepay tự retry theo cơ chế của họ, thay vì để lỗi không kiểm soát rơi ra ngoài.
  try {
    const result = await confirmOrderPayment(orderCode, `Thanh toán tự động qua Sepay — ${body.referenceCode ?? ''}`)
    if (!result.ok) return skip()
  } catch (e) {
    console.error(`[sepay] Lỗi xác nhận đơn ${orderCode}:`, e)
    return NextResponse.json({ error: 'Internal error, please retry' }, { status: 500 })
  }

  console.log(`[sepay] Đơn ${orderCode} đã thanh toán`)
  return ok()
}
