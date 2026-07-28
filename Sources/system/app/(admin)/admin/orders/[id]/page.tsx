export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import OrderStatusUpdater from './OrderStatusUpdater'

function fmt(amount: unknown) {
  const n = typeof amount === 'number' ? amount : (amount as { toNumber(): number }).toNumber()
  return n.toLocaleString('vi-VN') + 'đ'
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', in_progress: 'Đang xử lý',
  delivered: 'Đã bàn giao', completed: 'Hoàn thành', cancelled: 'Đã huỷ',
}
const STATUS_COLORS: Record<string, string> = {
  new: '#1d4ed8', confirmed: '#9333ea', in_progress: '#d97706',
  delivered: '#0369a1', completed: 'var(--accent)', cancelled: '#dc2626',
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      customer: true,
      items: true,
      payments: true,
    },
  }).catch(() => null)

  if (!order) notFound()

  return (
    <AdminLayout title={`Đơn hàng ${order.code}`}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link href="/admin/orders" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>← Đơn hàng</Link>
        <span style={{ color: 'var(--text-3)' }}>›</span>
        <span style={{ fontSize: 13, color: 'var(--text)' }}>{order.code}</span>
      </div>

      <div className="row g-3">
        {/* Thông tin đơn */}
        <div className="col-lg-8">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.3px' }}>{order.code}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{new Date(order.createdAt).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: STATUS_COLORS[order.status], background: STATUS_COLORS[order.status] + '18', padding: '4px 12px', borderRadius: 20 }}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>Sản phẩm / dịch vụ</div>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                  <div>
                    <span style={{ color: 'var(--text)' }}>{item.itemName}</span>
                    <span style={{ color: 'var(--text-3)', marginLeft: 8 }}>x{item.qty}</span>
                  </div>
                  <div style={{ fontWeight: 500 }}>{fmt(item.subtotal)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 15, fontWeight: 600 }}>
                <span>Tổng cộng</span>
                <span style={{ color: 'var(--accent)' }}>{fmt(order.total)}</span>
              </div>
            </div>

            {order.note && (
              <div style={{ marginTop: 16, background: 'var(--warm)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-2)' }}>
                <strong>Ghi chú:</strong> {order.note}
              </div>
            )}
          </div>

          {/* Thanh toán */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Thanh toán</div>
            {order.payments.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Chưa có thanh toán</div>
            ) : order.payments.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                <div>
                  <span style={{ textTransform: 'capitalize' }}>{p.method}</span>
                  {p.paidAt && <span style={{ color: 'var(--text-3)', marginLeft: 8 }}>{new Date(p.paidAt).toLocaleDateString('vi-VN')}</span>}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>{fmt(p.amount)}</span>
                  <span style={{ fontSize: 11, color: p.status === 'paid' ? 'var(--accent)' : '#d97706', background: p.status === 'paid' ? 'var(--accent-light)' : '#fffbeb', padding: '2px 8px', borderRadius: 5 }}>
                    {p.status === 'paid' ? 'Đã thanh toán' : p.status === 'pending' ? 'Chờ thanh toán' : 'Hoàn tiền'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Khách hàng + Cập nhật */}
        <div className="col-lg-4">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Khách hàng</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{order.customer.name}</div>
            {order.customer.phone && <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 2 }}>📞 {order.customer.phone}</div>}
            {order.customer.email && <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 2 }}>✉️ {order.customer.email}</div>}
            {order.customer.company && <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>🏢 {order.customer.company}</div>}
            <Link href={`/admin/customers/${order.customer.id}`}
              style={{ display: 'block', marginTop: 12, fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              Xem hồ sơ khách hàng →
            </Link>
          </div>

          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} isPaid={order.paidAt !== null} />
        </div>
      </div>
    </AdminLayout>
  )
}
