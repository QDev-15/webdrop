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

// Prisma enum dùng underscore, CSS class dùng hyphen
function statusClass(status: string): string {
  return status.replaceAll('_', '-')
}

export default async function AdminDashboardPage() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalOrders, newOrdersThisMonth,
    totalCustomers, newCustomersThisMonth,
    templatesSold,
    revenueThisMonth, revenueLastMonth,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.customer.count(),
    prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.template.aggregate({ _sum: { salesCount: true } }),
    prisma.payment.aggregate({ where: { status: 'paid', paidAt: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: 'paid', paidAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { name: true, phone: true } } },
    }),
  ])

  const revThis = Number(revenueThisMonth._sum.amount ?? 0)
  const revLast = Number(revenueLastMonth._sum.amount ?? 0)
  const revDiff = revLast > 0 ? Math.round(((revThis - revLast) / revLast) * 100) : 0

  const stats = [
    { label: 'Doanh thu tháng', value: formatVND(revThis), change: revLast > 0 ? `${revDiff > 0 ? '+' : ''}${revDiff}% so với tháng trước` : '—', up: revDiff > 0 },
    { label: 'Đơn hàng mới', value: String(newOrdersThisMonth), change: `Tổng: ${totalOrders} đơn`, up: true },
    { label: 'Khách hàng', value: String(totalCustomers), change: `+${newCustomersThisMonth} tháng này`, up: newCustomersThisMonth > 0 },
    { label: 'Templates đã bán', value: String(templatesSold._sum.salesCount ?? 0), change: 'Tổng số bán', up: true },
  ]

  return (
    <AdminLayout title="Tổng quan">
      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-change${s.up ? ' up' : ' down'}`}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Đơn hàng gần đây</div>
          <a href="/admin/orders" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Xem tất cả →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {recentOrders.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có đơn hàng nào</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  {['Mã đơn', 'Khách hàng', 'Tiêu đề', 'Giá trị', 'Ngày', 'Trạng thái'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.code} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>{order.code}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{order.customer.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 300 }}>{order.customer.phone}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{order.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{formatVND(Number(order.total))}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>{formatDate(order.createdAt)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`status-badge ${statusClass(order.status)}`}>{statusLabel[order.status] ?? order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
