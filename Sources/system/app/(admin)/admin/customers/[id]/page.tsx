export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'

function fmt(amount: unknown) {
  const n = typeof amount === 'number' ? amount : (amount as { toNumber(): number }).toNumber()
  return n.toLocaleString('vi-VN') + 'đ'
}

const STATUS_LABEL: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', in_progress: 'Đang xử lý',
  delivered: 'Bàn giao', completed: 'Hoàn thành', cancelled: 'Đã huỷ',
}
const STATUS_COLOR: Record<string, string> = {
  new: '#1d4ed8', confirmed: '#9333ea', in_progress: '#d97706',
  delivered: '#0369a1', completed: 'var(--accent)', cancelled: '#dc2626',
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(id) },
    include: {
      orders: { orderBy: { createdAt: 'desc' }, include: { payments: { select: { status: true, amount: true } } } },
      contacts: true,
    },
  }).catch(() => null)

  if (!customer) notFound()

  const totalSpent = customer.orders.reduce((s, o) => s + Number(o.total), 0)
  const paidOrders = customer.orders.filter(o => o.status === 'completed').length

  return (
    <AdminLayout title={customer.name}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link href="/admin/customers" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>← Khách hàng</Link>
        <span style={{ color: 'var(--text-3)' }}>›</span>
        <span style={{ fontSize: 13, color: 'var(--text)' }}>{customer.name}</span>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>
              👤
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{customer.name}</div>
            {customer.company && <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>{customer.company}</div>}

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {customer.phone && <div style={{ fontSize: 13, color: 'var(--text-2)' }}>📞 {customer.phone}</div>}
              {customer.email && <div style={{ fontSize: 13, color: 'var(--text-2)' }}>✉️ {customer.email}</div>}
              {customer.address && <div style={{ fontSize: 13, color: 'var(--text-2)' }}>📍 {customer.address}</div>}
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 16, paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{customer.orders.length}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Đơn hàng</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{fmt(totalSpent)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Tổng chi</div>
              </div>
            </div>

            {customer.note && (
              <div style={{ marginTop: 14, background: 'var(--warm)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text-2)' }}>
                {customer.note}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-8">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Lịch sử đơn hàng ({customer.orders.length})</div>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{paidOrders} hoàn thành</span>
            </div>
            {customer.orders.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có đơn hàng nào</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-light)' }}>
                      {['Mã đơn', 'Tiêu đề', 'Giá trị', 'Trạng thái', 'Ngày'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.4px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '11px 16px' }}>
                          <Link href={`/admin/orders/${o.id}`} style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', textDecoration: 'none' }}>{o.code}</Link>
                        </td>
                        <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--text)', maxWidth: 200 }}>{o.title}</td>
                        <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500 }}>{fmt(o.total)}</td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontSize: 11, color: STATUS_COLOR[o.status], background: STATUS_COLOR[o.status] + '18', padding: '3px 9px', borderRadius: 20 }}>
                            {STATUS_LABEL[o.status]}
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                          {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
