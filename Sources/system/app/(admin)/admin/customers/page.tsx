export const dynamic = 'force-dynamic'

import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'

function formatDate(d: Date): string {
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function CustomersPage() {
  const [customers, totalCount] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { orders: { select: { total: true, createdAt: true } } },
      take: 50,
    }),
    prisma.customer.count(),
  ])

  return (
    <AdminLayout title="Khách hàng">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
          Tổng: <strong>{totalCount}</strong> khách hàng
          {totalCount > 50 && <span style={{ color: 'var(--text-3)', marginLeft: 6 }}>(hiển thị 50 gần nhất)</span>}
        </div>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {customers.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Chưa có khách hàng nào</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                {['Khách hàng', 'Email', 'SĐT', 'Đơn hàng', 'Tổng chi', 'Ngày tạo'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map(c => {
                const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.total), 0)
                const lastOrder = [...c.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                          {c.name.charAt(0)}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{c.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)', fontWeight: 300 }}>{c.email ?? '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)' }}>{c.phone ?? '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text)', textAlign: 'center' }}>{c.orders.length}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                      {totalSpent > 0 ? totalSpent.toLocaleString('vi-VN') + 'đ' : '—'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-3)' }}>
                      {lastOrder ? formatDate(lastOrder.createdAt) : formatDate(c.createdAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
