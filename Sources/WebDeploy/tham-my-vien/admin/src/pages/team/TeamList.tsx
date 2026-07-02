import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number
  name: string
  title: string
  specialty: string
  experience: string
  cases_count: number
  badge: string
  image: string
  status: string
  sort_order: number
}

export default function TeamList() {
  const [items, setItems]     = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<TeamMember[]>('/team')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xoá bác sĩ "${name}" khỏi danh sách?`)) return
    await api.delete(`/team/${id}`)
    load()
  }

  async function toggleStatus(m: TeamMember) {
    await api.put(`/team/${m.id}`, { status: m.status === 'active' ? 'inactive' : 'active' })
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ bác sĩ</div>
          <div className="page-sub">{items.length} thành viên</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm bác sĩ</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👨‍⚕️</div>
          <div className="empty-state-text">Chưa có thành viên đội ngũ nào.</div>
          <Link to="/team/new" className="btn-accent" style={{ marginTop: 12 }}>Thêm bác sĩ đầu tiên</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {items.map(m => (
            <div key={m.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {m.image && (
                <div style={{ height: 180, overflow: 'hidden' }}>
                  <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: 16 }}>
                {m.badge && (
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
                    {m.badge}
                  </div>
                )}
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>{m.title}</div>
                {m.specialty && (
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Chuyên khoa: {m.specialty}</div>
                )}
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
                  {m.experience && <span>⏱ {m.experience}</span>}
                  {m.cases_count > 0 && <span>✦ {Number(m.cases_count).toLocaleString('vi-VN')} ca</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Link to={`/team/${m.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                  <button
                    onClick={() => toggleStatus(m)}
                    className={`badge ${m.status === 'active' ? 'badge-published' : 'badge-draft'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {m.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                  </button>
                  <button onClick={() => handleDelete(m.id, m.name)} className="btn-danger btn-sm" style={{ marginLeft: 'auto' }}>Xoá</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
