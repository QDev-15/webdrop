'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

const STATUS_LABEL: Record<string, string> = { draft: 'Nháp', published: 'Đã đăng' }
const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  draft:     { bg: '#f3f4f6', text: '#6b7280' },
  published: { bg: 'var(--accent-light)', text: 'var(--accent)' },
}

interface Post {
  id: number; title: string; slug: string; status: string; featured: boolean
  createdAt: string; category: { name: string } | null
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [pages, setPages] = useState(1)
  const [counts, setCounts] = useState({ all: 0, published: 0, draft: 0 })
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  // Debounce ô search — chỉ fetch sau khi ngừng gõ 400ms, không reload trang
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 400)
    return () => clearTimeout(t)
  }, [q])

  // Đổi filter/search → quay về trang 1
  useEffect(() => {
    setPage(1)
  }, [status, debouncedQ])

  // Fetch danh sách theo filter hiện tại — mọi thay đổi status/search/page đều gọi API,
  // không điều hướng trang nên không reload
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setFetchError('')

    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    if (debouncedQ) params.set('q', debouncedQ)
    params.set('page', String(page))

    fetch(`/api/admin/posts?${params.toString()}`)
      .then(async res => {
        if (cancelled) return
        if (!res.ok) { setFetchError('Lỗi tải danh sách bài viết'); setLoading(false); return }
        const data = await res.json()
        setPosts(data.posts || [])
        setPages(data.pages || 1)
        if (data.counts) setCounts(data.counts)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) { setFetchError('Lỗi kết nối server'); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [status, debouncedQ, page])

  const filterStatuses = [
    { key: 'all', label: `Tất cả (${counts.all})` },
    { key: 'published', label: `Đã đăng (${counts.published})` },
    { key: 'draft', label: `Nháp (${counts.draft})` },
  ]

  return (
    <AdminLayout title="Bài viết Blog">
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Tìm tiêu đề, slug..."
            aria-label="Tìm bài viết"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {filterStatuses.map(s => (
            <button key={s.key} onClick={() => setStatus(s.key)}
              style={{ fontSize: 12, padding: '6px 12px', borderRadius: 20, border: `1px solid ${status === s.key ? 'var(--accent)' : 'var(--border)'}`, background: status === s.key ? 'var(--accent)' : 'transparent', color: status === s.key ? '#fff' : 'var(--text-2)', whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
              {s.label}
            </button>
          ))}
        </div>
        <Link href="/admin/posts/new"
          style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none', flexShrink: 0 }}>
          + Viết bài
        </Link>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', opacity: loading ? .6 : 1, transition: 'opacity .15s' }}>
        {fetchError ? (
          <div style={{ padding: '56px 20px', textAlign: 'center', color: 'var(--danger)', fontSize: 14 }}>{fetchError}</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '56px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
            {loading ? 'Đang tải...' : debouncedQ || status !== 'all' ? 'Không tìm thấy bài viết phù hợp.' : (
              <>Chưa có bài viết nào. <Link href="/admin/posts/new" style={{ color: 'var(--accent)' }}>Viết bài đầu tiên →</Link></>
            )}
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
            <button key={p} onClick={() => setPage(p)}
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', background: p === page ? 'var(--accent)' : 'var(--surface)', color: p === page ? '#fff' : 'var(--text-2)', border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}` }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
