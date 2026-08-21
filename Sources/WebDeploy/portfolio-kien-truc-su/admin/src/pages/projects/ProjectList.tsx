import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project {
  id: number
  title: string
  category: string
  location: string
  year: string
  image: string
  has_case_study: number
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
          <div className="page-title">Dự án</div>
          <div className="page-sub">Danh sách công trình ({items.length} dự án) — bật "Case Study" để có trang chi tiết đầy đủ</div>
        </div>
        <Link to="/projects/new" className="btn-accent">+ Thêm dự án</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏛</div>
          <div className="empty-state-text">Chưa có dự án nào. Thêm dự án đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {p.image && (
                <img src={p.image} alt={p.title}
                  style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.category} · {p.location} · {p.year}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
                  Thứ tự: {p.sort_order}
                  {!!p.featured && <span className="badge badge-published">Nổi bật</span>}
                  {!!p.has_case_study && <span className="badge badge-new">Có Case Study</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                <Link to={`/projects/${p.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
