export const dynamic = 'force-dynamic'

import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const limit = 20

  const where = q ? {
    OR: [
      { name: { contains: q, mode: 'insensitive' as const } },
      { email: { contains: q, mode: 'insensitive' as const } },
      { phone: { contains: q, mode: 'insensitive' as const } },
      { company: { contains: q, mode: 'insensitive' as const } },
    ],
  } : {}

  type CustomerRow = {
    id: number; name: string; email: string | null; phone: string | null
    company: string | null; createdAt: Date
    orders: { total: unknown }[]
    _count: { orders: number }
  }
  let customers: CustomerRow[] = []
  let total = 0
  try {
    const [rows, cnt] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          orders: { select: { total: true }, orderBy: { createdAt: 'desc' } },
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ])
    customers = rows as CustomerRow[]
    total = cnt
  } catch { /* DB offline */ }

  const pages = Math.ceil(total / limit)

  return (
    <AdminLayout title="Khách hàng">
      <form method="GET" style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input name="q" defaultValue={q} placeholder="Tìm tên, email, SĐT, công ty..."
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', width: 260 }} />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--text)', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Tìm</button>
        {q && <Link href="/admin/customers" style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none' }}>✕ Xoá bộ lọc</Link>}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-2)' }}>Tổng: <strong>{total}</strong></span>
        <Link href="/admin/customers/new" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
          + Thêm khách
        </Link>
      </form>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {customers.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Không tìm thấy khách hàng nào</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                  {['Khách hàng', 'Email', 'SĐT', 'Công ty', 'Đơn hàng', 'Tổng chi', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => {
                  const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.total), 0)
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <Link href={`/admin/customers/${c.id}`} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', textDecoration: 'none' }}>{c.name}</Link>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{c.email ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{c.phone ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-3)' }}>{c.company ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'center', color: c._count.orders > 0 ? 'var(--text)' : 'var(--text-3)' }}>{c._count.orders}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>
                        {totalSpent > 0 ? totalSpent.toLocaleString('vi-VN') + 'đ' : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Link href={`/admin/customers/${c.id}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>→</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 6, justifyContent: 'center' }}>
            {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map(p => (
              <a key={p} href={`/admin/customers?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                style={{ width: 32, height: 32, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, textDecoration: 'none', border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}`, background: p === page ? 'var(--accent)' : 'transparent', color: p === page ? '#fff' : 'var(--text-2)' }}>
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
