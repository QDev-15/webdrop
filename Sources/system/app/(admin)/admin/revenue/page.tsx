export const dynamic = 'force-dynamic'

import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'

function fmt(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) {
  const { year: yearStr } = await searchParams
  const year = parseInt(yearStr || String(new Date().getFullYear()))

  const monthlyData = await Promise.all(
    Array.from({ length: 12 }, (_, i) => i + 1).map(async month => {
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 0, 23, 59, 59)
      const [rev, exp] = await Promise.all([
        prisma.payment.aggregate({ where: { status: 'paid', paidAt: { gte: start, lte: end } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: null } })),
        prisma.expense.aggregate({ where: { paidAt: { gte: start, lte: end } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: null } })),
      ])
      return { month, revenue: Number(rev._sum.amount || 0), expense: Number(exp._sum.amount || 0) }
    })
  )

  const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0)
  const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0)
  const profit = totalRevenue - totalExpense
  const maxBar = Math.max(...monthlyData.map(m => m.revenue), 1)

  const recentExpenses = await prisma.expense.findMany({ orderBy: { paidAt: 'desc' }, take: 10 }).catch(() => [])

  return (
    <AdminLayout title="Báo cáo doanh thu">
      {/* Year selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        {[year - 1, year, year + 1].map(y => (
          <a key={y} href={`/admin/revenue?year=${y}`}
            style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, textDecoration: 'none', border: `1px solid ${y === year ? 'var(--accent)' : 'var(--border)'}`, background: y === year ? 'var(--accent)' : 'transparent', color: y === year ? '#fff' : 'var(--text-2)' }}>
            {y}
          </a>
        ))}
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Doanh thu', value: fmt(totalRevenue), color: 'var(--accent)' },
          { label: 'Chi phí', value: fmt(totalExpense), color: '#dc2626' },
          { label: 'Lợi nhuận', value: fmt(profit), color: profit >= 0 ? 'var(--accent)' : '#dc2626' },
        ].map(s => (
          <div key={s.label} className="col-md-4">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>{s.label} {year}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: '-.5px' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 20 }}>Doanh thu theo tháng — {year}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 140 }}>
          {monthlyData.map(m => (
            <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>
                {m.revenue > 0 ? (m.revenue >= 1000000 ? (m.revenue / 1000000).toFixed(1) + 'tr' : (m.revenue / 1000) + 'k') : ''}
              </div>
              <div style={{ width: '100%', background: 'var(--accent)', borderRadius: '4px 4px 0 0', height: `${Math.round((m.revenue / maxBar) * 100)}%`, minHeight: m.revenue > 0 ? 4 : 0, transition: 'height .3s' }} />
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{MONTHS[m.month - 1]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chi phí gần đây */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Chi phí gần đây</div>
        </div>
        {recentExpenses.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có chi phí nào</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-light)' }}>
                {['Loại', 'Tiêu đề', 'Số tiền', 'Ngày'].map(h => (
                  <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-3)', textTransform: 'capitalize' }}>{e.type}</td>
                  <td style={{ padding: '10px 16px', fontSize: 13 }}>{e.title}</td>
                  <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500, color: '#dc2626' }}>{fmt(Number(e.amount))}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-3)' }}>{e.paidAt ? new Date(e.paidAt).toLocaleDateString('vi-VN') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
