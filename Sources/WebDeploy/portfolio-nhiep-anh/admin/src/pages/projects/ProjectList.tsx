import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project {
  id: number
  title: string
  slug: string
  category: string
  image: string
  client_name: string
  year: string
  featured: number
  sort_order: number
  status: string
}

export default function ProjectList() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Project[]>('/projects')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa dự án này?')) return
    await api.delete(`/projects/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dự án (Case Study)</div>
          <div className="page-sub">Danh sách lễ cưới đã ghi hình ({items.length} dự án)</div>
        </div>
        <Link to="/projects/new" className="btn-accent">+ Thêm dự án</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📸</div>
          <div className="empty-state-text">Chưa có dự án nào. Thêm dự án đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {item.image && (
                <img src={item.image} alt={item.title}
                  style={{ width: 90, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>{item.category}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {item.client_name && <>Khách hàng: {item.client_name} · </>}
                  {item.year && <>Năm: {item.year} · </>}
                  Thứ tự: {item.sort_order}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                {!!item.featured && <span className="badge badge-published">Nổi bật</span>}
                <span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                <Link to={`/projects/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
