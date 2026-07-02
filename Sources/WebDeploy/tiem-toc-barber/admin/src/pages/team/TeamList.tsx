import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number
  name: string
  role: string
  specialty: string
  image: string
  sort_order: number
  status: string
}

export default function TeamList() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<TeamMember[]>('/team')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa stylist này?')) return
    await api.delete(`/team/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Stylist</div>
          <div className="page-sub">Quản lý đội ngũ stylist ({items.length} người)</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm stylist</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💈</div>
          <div className="empty-state-text">Chưa có stylist nào. Thêm stylist đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {items.map(m => (
            <div key={m.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: 'var(--bg)' }}>
                {m.image
                  ? <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%' }} />}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, marginBottom: 6 }}>{m.role}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.5 }}>{m.specialty}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge badge-${m.status}`}>{m.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/team/${m.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(m.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
