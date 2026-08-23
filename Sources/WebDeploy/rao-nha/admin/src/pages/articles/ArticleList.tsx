import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Article { id: number; title: string; slug: string; category: string; thumbnail: string; author: string; published_at: string }

export default function ArticleList() {
  const [items, setItems] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Article[]>('/articles')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa bài viết này?')) return
    await api.delete(`/articles/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tin tức</div>
          <div className="page-sub">{items.length} bài viết</div>
        </div>
        <Link to="/articles/new" className="btn-accent">+ Viết bài mới</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Ảnh</th><th>Tiêu đề</th><th>Chuyên mục</th><th>Tác giả</th><th>Ngày đăng</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {items.map(a => (
              <tr key={a.id}>
                <td>{a.thumbnail && <img src={a.thumbnail} alt={a.title} className="thumb" />}</td>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</td>
                <td><span className="badge badge-confirmed">{a.category}</span></td>
                <td style={{ fontSize: 12.5 }}>{a.author}</td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(a.published_at).toLocaleDateString('vi-VN')}</td>
                <td>
                  <Link to={`/articles/${a.id}/edit`} className="btn-ghost btn-sm" style={{ marginRight: 6 }}>Sửa</Link>
                  <button onClick={() => handleDelete(a.id)} className="btn-danger btn-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">📰</div><div className="empty-state-text">Chưa có bài viết nào.</div></div>}
      </div>
    </div>
  )
}
