import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Post {
  id: number
  title: string
  slug: string
  type: 'article' | 'recipe'
  image: string
  status: string
  featured: number
  read_minutes: number
  views: number
  saved_count: number
  published_at: string
  category_name: string | null
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState<'' | 'article' | 'recipe'>('')
  const [q, setQ] = useState('')

  useEffect(() => { load() }, [type, q])

  async function load() {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (type) qs.set('type', type)
      if (q) qs.set('q', q)
      const query = qs.toString()
      setPosts(await api.get<Post[]>(`/posts${query ? `?${query}` : ''}`))
    } finally { setLoading(false) }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Xóa bài viết "${title}"?`)) return
    await api.delete(`/posts/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bài viết & Công thức</div>
          <div className="page-sub">{posts.length} mục</div>
        </div>
        <Link to="/posts/new" className="btn-accent">+ Thêm mới</Link>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {(['', 'article', 'recipe'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} className={type === t ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {t === '' ? 'Tất cả' : t === 'article' ? 'Bài viết' : 'Công thức'}
          </button>
        ))}
        <input
          className="form-control"
          style={{ maxWidth: 260, marginLeft: 'auto' }}
          placeholder="Tìm theo tiêu đề..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">{q ? `Không tìm thấy bài viết nào khớp "${q}"` : 'Chưa có bài viết nào. Thêm bài đầu tiên!'}</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Loại</th>
                <th>Chuyên mục</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
                <th>Ngày đăng</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.image && <img src={p.image} alt={p.title} className="thumb" />}
                      <div style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title} {!!p.featured && <span title="Nổi bật">⭐</span>}
                      </div>
                    </div>
                  </td>
                  <td>{p.type === 'recipe' ? '🍲 Công thức' : '📰 Bài viết'}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.category_name || '—'}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Đã đăng' : 'Bản nháp'}</span></td>
                  <td>{p.views}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(p.published_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/posts/${p.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(p.id, p.title)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
