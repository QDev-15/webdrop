import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Post {
  id: number
  title: string
  slug: string
  thumbnail: string
  category_name: string | null
  category_slug: string | null
  read_time: number
  home_section: string
  trending_order: number
  status: string
  published_at: string
}

const PER_PAGE = 20

export default function PostList() {
  const [items, setItems] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), per_page: String(PER_PAGE) })
    if (q.trim()) params.set('q', q.trim())
    api.getPaged<Post[]>(`/posts?${params.toString()}`)
      .then(({ data, total }) => { setItems(data); setTotal(total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, q])

  useEffect(() => { load() }, [load])

  // Debounce tìm kiếm 400ms, reset về trang 1 mỗi lần đổi từ khóa
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400)
    return () => clearTimeout(t)
  }, [q])

  async function handleDelete(id: number) {
    if (!confirm('Xóa bài viết này?')) return
    await api.delete(`/posts/${id}`)
    load()
  }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bài viết</div>
          <div className="page-sub">{total} bài viết</div>
        </div>
        <Link to="/posts/new" className="btn-accent">+ Thêm bài viết</Link>
      </div>

      <div className="form-group" style={{ maxWidth: 360 }}>
        <input
          type="search"
          className="form-control"
          placeholder="Tìm theo tiêu đề hoặc mô tả ngắn..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">
            {q.trim() ? `Không tìm thấy bài viết nào khớp "${q.trim()}"` : 'Chưa có bài viết nào. Thêm bài viết đầu tiên!'}
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(post => (
              <div key={post.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                {post.thumbnail && (
                  <img src={post.thumbnail} alt={post.title}
                    style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 4 }}>
                    {post.category_name ?? 'Chưa phân loại'} · {post.read_time} phút đọc
                    {post.home_section && <> · <span style={{ color: 'var(--accent)' }}>{post.home_section}</span></>}
                    {post.trending_order > 0 && <> · 🔥 #{post.trending_order} thịnh hành</>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                  <span className={`badge badge-${post.status}`}>{post.status === 'published' ? 'Đang hiện' : 'Bản nháp'}</span>
                  <Link to={`/posts/${post.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                  <button onClick={() => handleDelete(post.id)} className="btn-danger btn-sm">Xóa</button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              <button className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Trước</button>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Trang {page} / {totalPages}</span>
              <button className="btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
