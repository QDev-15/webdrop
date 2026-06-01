export const dynamic = 'force-dynamic'

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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>
}) {
  const { status, q, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const limit = 20

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (q) {
    where.OR = [
      { code: { contains: q, mode: 'insensitive' } },
      { customer: { name: { contains: q, mode: 'insensitive' } } },
      { title: { contains: q, mode: 'insensitive' } },
    ]
  }

  type OrderRow = Awaited<ReturnType<typeof prisma.order.findMany>>[0] & {
    customer: { name: string; phone: string | null }
  }
  let orders: OrderRow[] = []
  let total = 0
  try {
    const [rows, cnt] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { customer: { select: { name: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])
    orders = rows as OrderRow[]
    total = cnt
  } catch { /* DB offline */ }

  const pages = Math.ceil(total / limit)
  const filterStatuses = ['all', 'new', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled']

  return (
    <AdminLayout title="Đơn hàng">
      <form method="GET" style={{ marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input name="q" defaultValue={q} placeholder="Tìm mã đơn, tên khách..."
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', width: 220 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filterStatuses.map(s => (
            <a key={s} href={`/admin/orders?status=${s}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              style={{ fontSize: 12, padding: '6px 12px', borderRadius: 20, textDecoration: 'none', border: `1px solid ${(status || 'all') === s ? 'var(--accent)' : 'var(--border)'}`, background: (status || 'all') === s ? 'var(--accent)' : 'transparent', color: (status || 'all') === s ? '#fff' : 'var(--text-2)', whiteSpace: 'nowrap' }}>
              {s === 'all' ? 'Tất cả' : STATUS_LABEL[s]}
            </a>
          ))}
        </div>
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--text)', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Tìm</button>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-2)' }}>Tổng: <strong>{total}</strong></span>
      </form>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-light)' }}>
                {['Mã đơn', 'Khách hàng', 'Tiêu đề', 'Giá trị', 'Trạng thái', 'Ngày', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.4px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Không tìm thấy đơn hàng nào</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '11px 16px' }}>
                    <Link href={`/admin/orders/${o.id}`} style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', textDecoration: 'none' }}>{o.code}</Link>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>
                    <div>{o.customer.name}</div>
                    {o.customer.phone && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{o.customer.phone}</div>}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--text-2)', maxWidth: 180 }}>{o.title}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>{fmt(o.total)}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: 11, color: STATUS_COLOR[o.status], background: STATUS_COLOR[o.status] + '18', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <Link href={`/admin/orders/${o.id}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>→</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 6, justifyContent: 'center' }}>
            {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map(p => (
              <a key={p} href={`/admin/orders?page=${p}${status ? `&status=${status}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
