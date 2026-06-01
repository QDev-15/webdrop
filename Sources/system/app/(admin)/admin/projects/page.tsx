export const dynamic = 'force-dynamic'

import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'

const STATUS_LABEL: Record<string, string> = {
  planning: 'Lên kế hoạch', designing: 'Thiết kế', developing: 'Phát triển',
  reviewing: 'Review', delivered: 'Đã bàn giao', done: 'Hoàn thành',
}
const STATUS_COLOR: Record<string, string> = {
  planning: '#6b7280', designing: '#9333ea', developing: '#d97706',
  reviewing: '#ea580c', delivered: '#0369a1', done: 'var(--accent)',
}
const TYPE_LABEL: Record<string, string> = { goi_b: 'Gói B', goi_c: 'Gói C' }

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const { status, q } = await searchParams

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (q) where.OR = [
    { name: { contains: q, mode: 'insensitive' } },
    { domain: { contains: q, mode: 'insensitive' } },
    { customer: { name: { contains: q, mode: 'insensitive' } } },
  ]

  type ProjectRow = Awaited<ReturnType<typeof prisma.project.findMany>>[0] & {
    customer: { name: string; phone: string | null }
    _count: { milestones: number }
  }
  let projects: ProjectRow[] = []
  let total = 0
  try {
    const [rows, cnt] = await Promise.all([
      prisma.project.findMany({
        where,
        include: { customer: { select: { name: true, phone: true } }, _count: { select: { milestones: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ])
    projects = rows as ProjectRow[]
    total = cnt
  } catch { /* DB offline */ }

  const filterStatuses = ['all', 'planning', 'designing', 'developing', 'reviewing', 'delivered', 'done']

  return (
    <AdminLayout title="Dự án">
      <form method="GET" style={{ marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input name="q" defaultValue={q} placeholder="Tìm dự án, domain, khách hàng..."
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', width: 240 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filterStatuses.map(s => (
            <a key={s} href={`/admin/projects?status=${s}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, textDecoration: 'none', border: `1px solid ${(status || 'all') === s ? 'var(--accent)' : 'var(--border)'}`, background: (status || 'all') === s ? 'var(--accent)' : 'transparent', color: (status || 'all') === s ? '#fff' : 'var(--text-2)', whiteSpace: 'nowrap' }}>
              {s === 'all' ? 'Tất cả' : STATUS_LABEL[s]}
            </a>
          ))}
        </div>
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--text)', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Tìm</button>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-2)' }}>Tổng: <strong>{total}</strong> dự án</span>
      </form>

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)', fontSize: 14 }}>
          Chưa có dự án nào. Dự án được tạo tự động khi đơn hàng Gói B/C được xác nhận.
        </div>
      ) : (
        <div className="row g-3">
          {projects.map(p => (
            <div key={p.id} className="col-lg-6">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{TYPE_LABEL[p.type]} · {p._count.milestones} milestones</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: STATUS_COLOR[p.status], background: STATUS_COLOR[p.status] + '18', padding: '3px 10px', borderRadius: 20, flexShrink: 0, marginLeft: 8 }}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>👤 {p.customer.name} {p.customer.phone ? `· ${p.customer.phone}` : ''}</div>
                  {p.domain && <div style={{ fontSize: 12, color: 'var(--accent)' }}>🌐 {p.domain}</div>}
                  {p.adminUrl && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>⚙️ {p.adminUrl}</div>}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(p.createdAt).toLocaleDateString('vi-VN')}</div>
                  <Link href={`/admin/orders/${p.orderId}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Xem đơn hàng →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
