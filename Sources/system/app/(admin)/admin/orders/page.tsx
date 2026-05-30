export const dynamic = 'force-dynamic'

import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ'
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const statusLabel: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', in_progress: 'Đang xử lý',
  delivered: 'Đã giao', completed: 'Hoàn thành', cancelled: 'Đã huỷ',
}

function statusClass(status: string): string {
  return status.replaceAll('_', '-')
}

export default async function OrdersPage() {
  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { name: true, phone: true, email: true } } },
      take: 50,
    }),
    prisma.order.count(),
  ])

  return (
    <AdminLayout title="Đơn hàng">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
          Tổng: <strong>{totalCount}</strong> đơn hàng
          {totalCount > 50 && <span style={{ color: 'var(--text-3)', marginLeft: 6 }}>(hiển thị 50 gần nhất)</span>}
        </div>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {orders.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Chưa có đơn hàng nào</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                  {['Mã đơn', 'Khách hàng', 'Tiêu đề', 'Giá trị', 'Ngày', 'Trạng thái'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.code} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>{o.code}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{o.customer.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 300 }}>{o.customer.phone}</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{o.title}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{formatVND(Number(o.total))}</td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-3)' }}>{formatDate(o.createdAt)}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span className={`status-badge ${statusClass(o.status)}`}>{statusLabel[o.status] ?? o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
