import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Post {
  id: number
  title: string
  slug: string
  thumbnail: string
  category_name: string | null
  read_time: number
  published_date: string
  featured: number
  status: string
}

export default function PostList() {
  const [items, setItems] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Post[]>('/posts')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa bài viết này?')) return
    await api.delete(`/posts/${id}`)
    load()
  }

  const filtered = search.trim()
    ? items.filter(i => i.title.toLowerCase().includes(search.trim().toLowerCase()))
    : items

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bài viết</div>
          <div className="page-sub">{items.length} bài viết</div>
        </div>
        <Link to="/posts/new" className="btn-accent">+ Thêm bài viết</Link>
      </div>

      <div className="form-group" style={{ maxWidth: 320 }}>
        <input
          type="search"
          className="form-control"
          placeholder="Tìm theo tiêu đề..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">Chưa có bài viết nào. Thêm bài viết đầu tiên!</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">Không tìm thấy bài viết nào khớp "{search}"</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Tiêu đề</th>
                <th>Chuyên mục</th>
                <th>Ngày đăng</th>
                <th>Nổi bật</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.thumbnail && <img src={p.thumbnail} alt={p.title} className="thumb" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
                  </td>
                  <td style={{ maxWidth: 320 }}>{p.title}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.category_name ?? '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-3)' }}>{p.published_date}</td>
                  <td>{p.featured ? <span className="badge badge-published">Nổi bật</span> : '—'}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Đang hiện' : 'Nháp'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/posts/${p.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Xóa</button>
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
