import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Amenity {
  id: number
  name: string
  description: string
  image: string
  sort_order: number
}

export default function AmenityList() {
  const [items, setItems] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Amenity[]>('/amenities')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa tiện ích này?')) return
    await api.delete(`/amenities/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tiện ích nội khu</div>
          <div className="page-sub">Hồ bơi, gym, công viên... ({items.length} tiện ích)</div>
        </div>
        <Link to="/amenities/new" className="btn-accent">+ Thêm tiện ích</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏊</div>
          <div className="empty-state-text">Chưa có tiện ích nào. Thêm tiện ích đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ảnh</th><th>Tên tiện ích</th><th>Mô tả</th><th>Thứ tự</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id}>
                  <td>{a.image ? <img src={a.image} alt={a.name} className="thumb" /> : '—'}</td>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 340 }}>{a.description || '—'}</td>
                  <td>{a.sort_order}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/amenities/${a.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(a.id)} className="btn-danger btn-sm">Xóa</button>
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
