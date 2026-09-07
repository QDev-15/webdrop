import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  show_on_home: number
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
    if (!confirm('Xóa chuyên mục này? Các bài viết thuộc chuyên mục sẽ chuyển về "không có chuyên mục".')) return
    await api.delete(`/categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chuyên mục bài viết</div>
          <div className="page-sub">{items.length} chuyên mục</div>
        </div>
        <Link to="/categories/new" className="btn-accent">+ Thêm chuyên mục</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-text">Chưa có chuyên mục nào. Thêm chuyên mục đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(c => (
            <div key={c.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>/{c.slug} · {c.post_count} bài viết</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge ${c.show_on_home ? 'badge-published' : 'badge-draft'}`}>
                  {c.show_on_home ? 'Hiện ở trang chủ' : 'Ẩn ở trang chủ'}
                </span>
                <Link to={`/categories/${c.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
