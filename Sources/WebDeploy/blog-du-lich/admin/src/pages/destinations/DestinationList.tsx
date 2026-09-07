import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Destination {
  id: number
  name: string
  category_label: string
  image: string
  sort_order: number
  status: string
}

export default function DestinationList() {
  const [items, setItems] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Destination[]>('/destinations')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa điểm đến này?')) return
    await api.delete(`/destinations/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Điểm đến yêu thích</div>
          <div className="page-sub">Hiển thị ở khối bento trang chủ — chỉ 5 mục đầu (theo thứ tự) được hiển thị ({items.length} mục)</div>
        </div>
        <Link to="/destinations/new" className="btn-accent">+ Thêm điểm đến</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <div className="empty-state-text">Chưa có điểm đến nào. Thêm điểm đến đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(d => (
            <div key={d.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {d.image && (
                <img src={d.image} alt={d.name}
                  style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{d.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{d.category_label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Thứ tự: {d.sort_order}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${d.status}`}>{d.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                <Link to={`/destinations/${d.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(d.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
