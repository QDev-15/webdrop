import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
  tag_class: string
  sort_order: number
  post_count: number
}

export default function CategoryList() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Category[]>('/categories')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa chuyên mục này? Bài viết thuộc chuyên mục này sẽ không còn gắn chuyên mục.')) return
    await api.delete(`/categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chuyên mục</div>
          <div className="page-sub">{items.length} chuyên mục bài viết</div>
        </div>
        <Link to="/categories/new" className="btn-accent">+ Thêm chuyên mục</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-text">Chưa có chuyên mục nào. Thêm chuyên mục đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Chuyên mục</th>
                <th>Slug</th>
                <th>Nhãn màu</th>
                <th>Số bài viết</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td><span style={{ marginRight: 8 }}>{c.icon}</span>{c.name}</td>
                  <td style={{ color: 'var(--text-3)', fontSize: 13 }}>{c.slug}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{c.tag_class || '—'}</td>
                  <td>{c.post_count}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/categories/${c.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
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
