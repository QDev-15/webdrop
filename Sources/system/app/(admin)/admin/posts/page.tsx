export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const STATUS_LABEL: Record<string, string> = { draft: 'Nháp', published: 'Đã đăng' }
const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  draft:     { bg: '#f3f4f6', text: '#6b7280' },
  published: { bg: 'var(--accent-light)', text: 'var(--accent)' },
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { q, status, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const limit = 20

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (q) where.OR = [
    { title: { contains: q, mode: 'insensitive' } },
    { slug: { contains: q, mode: 'insensitive' } },
  ]

  let posts: Array<{
    id: number; title: string; slug: string; status: string; featured: boolean
    createdAt: Date; category: { name: string } | null
  }> = []
  let total = 0
  let counts = { all: 0, published: 0, draft: 0 }

  try {
    const [rows, cnt, all, pub, drf] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { category: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
      prisma.post.count({}),
      prisma.post.count({ where: { status: 'published' } }),
      prisma.post.count({ where: { status: 'draft' } }),
    ])
    posts = rows
    total = cnt
    counts = { all, published: pub, draft: drf }
  } catch { /* DB offline */ }

  const pages = Math.ceil(total / limit)
  const filterStatuses = [
    { key: 'all', label: `Tất cả (${counts.all})` },
    { key: 'published', label: `Đã đăng (${counts.published})` },
    { key: 'draft', label: `Nháp (${counts.draft})` },
  ]

  return (
    <AdminLayout title="Bài viết Blog">
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <form method="GET" style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Tìm tiêu đề, slug..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none' }} />
          <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--text)', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)', flexShrink: 0 }}>Tìm</button>
        </form>
        <div style={{ display: 'flex', gap: 6 }}>
          {filterStatuses.map(s => (
            <a key={s.key} href={`/admin/posts?status=${s.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              style={{ fontSize: 12, padding: '6px 12px', borderRadius: 20, textDecoration: 'none', border: `1px solid ${(status || 'all') === s.key ? 'var(--accent)' : 'var(--border)'}`, background: (status || 'all') === s.key ? 'var(--accent)' : 'transparent', color: (status || 'all') === s.key ? '#fff' : 'var(--text-2)', whiteSpace: 'nowrap' }}>
              {s.label}
            </a>
          ))}
        </div>
        <Link href="/admin/posts/new"
          style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none', flexShrink: 0 }}>
          + Viết bài
        </Link>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {posts.length === 0 ? (
          <div style={{ padding: '56px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
            Chưa có bài viết nào. <Link href="/admin/posts/new" style={{ color: 'var(--accent)' }}>Viết bài đầu tiên →</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-light)' }}>
                  {['Tiêu đề', 'Danh mục', 'Trạng thái', 'Ngày tạo', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.4px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>
                        {p.featured && <span style={{ fontSize: 10, background: 'var(--warm2)', color: 'var(--text-2)', padding: '1px 6px', borderRadius: 4, marginRight: 6 }}>Nổi bật</span>}
                        {p.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>/blog/{p.slug}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{p.category?.name || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: STATUS_COLOR[p.status].text, background: STATUS_COLOR[p.status].bg, padding: '3px 10px', borderRadius: 20 }}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                      {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/admin/posts/${p.id}/edit`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Sửa</Link>
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none' }}>Xem →</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 16, justifyContent: 'center' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <a key={p} href={`/admin/posts?page=${p}${status ? `&status=${status}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 13, textDecoration: 'none', background: p === page ? 'var(--accent)' : 'var(--surface)', color: p === page ? '#fff' : 'var(--text-2)', border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}` }}>
              {p}
            </a>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
