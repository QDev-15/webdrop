import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { confirmOrderPayment } from '@/lib/orderConfirm'

// Xác nhận thanh toán thủ công — dùng khi webhook Sepay không gọi được (site chạy local,
// hoặc nội dung chuyển khoản không khớp mã đơn) nhưng admin đã tự kiểm tra tiền đã về tài khoản.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id: parseInt(id) } })
  if (!order) return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 })
  if (order.paidAt !== null) return NextResponse.json({ error: 'Đơn hàng đã được xác nhận thanh toán trước đó' }, { status: 409 })

  const result = await confirmOrderPayment(order.code, `Xác nhận thủ công bởi ${session.email} — webhook Sepay không xử lý được`)
  if (!result.ok) {
    return NextResponse.json({ error: result.reason === 'already_paid' ? 'Đơn hàng đã được xác nhận' : 'Không tìm thấy đơn hàng' }, { status: 409 })
  }

  return NextResponse.json({ success: true })
}
