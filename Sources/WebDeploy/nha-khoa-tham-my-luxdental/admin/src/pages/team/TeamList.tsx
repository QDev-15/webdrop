import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  experience_years: number
  credentials: string
  tag: string
  sort_order: number
}

export default function TeamList() {
  const [items, setItems] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = () => {
    api.get<Doctor[]>('/team').then(setItems).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const del = async (id: number) => {
    if (!confirm('Xóa bác sĩ này?')) return
    try { await api.delete(`/team/${id}`); setMsg('Đã xóa.'); load() }
    catch { setMsg('Lỗi xóa.') }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Đội ngũ bác sĩ</h1>
        <Link to="/team/new" style={{ padding: '9px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
          + Thêm bác sĩ
        </Link>
      </div>
      {msg && <div style={{ marginBottom: 12, color: 'var(--accent)', fontSize: 13 }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {items.map(d => (
          <div key={d.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {d.photo && <img src={d.photo} alt={d.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />}
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>{d.role}</div>
              {d.tag && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{d.tag}</div>}
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8, lineHeight: 1.5 }}>{d.credentials}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Link to={`/team/${d.id}/edit`} style={{ flex: 1, padding: '7px', textAlign: 'center', background: 'var(--warm)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, textDecoration: 'none', color: 'var(--text)' }}>Sửa</Link>
                <button onClick={() => del(d.id)} style={{ flex: 1, padding: '7px', background: '#fee2e2', color: 'var(--danger)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có bác sĩ nào.</div>}
    </div>
  )
}
