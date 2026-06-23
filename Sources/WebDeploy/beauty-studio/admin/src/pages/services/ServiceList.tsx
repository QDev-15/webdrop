import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  category_id: number | null
  category_name: string
  name: string
  description: string
  price: string
  image: string
  badge: string
  sort_order: number
  is_featured: number
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setServices(await api.get<Service[]>('/services')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh sách dịch vụ</div>
          <div className="page-sub">{services.length} dịch vụ</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên dịch vụ</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Nổi bật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>
                  {s.image
                    ? <img src={s.image} alt={s.name} className="thumb" />
                    : <div className="thumb" style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💄</div>
                  }
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  {s.badge && <span className="badge badge-confirmed" style={{ marginTop: 4 }}>{s.badge}</span>}
                </td>
                <td style={{ color: 'var(--text-2)' }}>{s.category_name || '—'}</td>
                <td style={{ color: 'var(--accent)', fontWeight: 500 }}>{s.price}</td>
                <td>{s.is_featured ? <span className="badge badge-published">Nổi bật</span> : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>Chưa có dịch vụ nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
