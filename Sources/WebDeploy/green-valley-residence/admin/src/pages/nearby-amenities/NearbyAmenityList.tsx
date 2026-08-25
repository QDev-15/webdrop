import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface NearbyAmenity {
  id: number
  name: string
  distance: string
  sort_order: number
}

export default function NearbyAmenityList() {
  const [items, setItems] = useState<NearbyAmenity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<NearbyAmenity[]>('/nearby-amenities')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa tiện ích này?')) return
    await api.delete(`/nearby-amenities/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tiện ích xung quanh</div>
          <div className="page-sub">Trường học, bệnh viện, TTTM gần dự án ({items.length} mục)</div>
        </div>
        <Link to="/nearby-amenities/new" className="btn-accent">+ Thêm tiện ích</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📍</div>
          <div className="empty-state-text">Chưa có tiện ích nào. Thêm tiện ích đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tên tiện ích</th><th>Khoảng cách</th><th>Thứ tự</th><th>Thao tác</th></tr></thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td>{a.distance || '—'}</td>
                  <td>{a.sort_order}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/nearby-amenities/${a.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
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
