import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project {
  id: number
  title: string
  image: string
  status_label: string
  investor: string
  price_label: string
  area_label: string
  sort_order: number
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
          <div className="page-title">Dự án đang phân phối</div>
          <div className="page-sub">{items.length} dự án</div>
        </div>
        <Link to="/projects/new" className="btn-accent">+ Thêm dự án</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏗</div>
          <div className="empty-state-text">Chưa có dự án nào. Thêm dự án đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {items.map(p => (
            <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={p.image || 'https://via.placeholder.com/400x220'} alt={p.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
              <div style={{ padding: 16 }}>
                <span className="badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{p.status_label}</span>
                <div style={{ fontWeight: 600, fontSize: 14, margin: '8px 0 4px' }}>{p.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.investor} · {p.price_label} · {p.area_label}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Link to={`/projects/${p.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                  <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
