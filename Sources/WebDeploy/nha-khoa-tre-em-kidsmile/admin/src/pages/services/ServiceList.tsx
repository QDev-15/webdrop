import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  tags: string
  price: string
  price_unit: string
  is_featured: number
  category_name?: string
  sort_order: number
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
          <div className="page-title">Dịch vụ</div>
          <div className="page-sub">
            {services.length} dịch vụ ·{' '}
            <Link to="/services/categories" style={{ color: 'var(--accent)' }}>Quản lý nhóm</Link>
          </div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Tên dịch vụ</th>
              <th>Nhóm</th>
              <th>Giá</th>
              <th>Nổi bật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map(svc => (
              <tr key={svc.id}>
                <td style={{ fontSize: 22 }}>{svc.icon || '🦷'}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{svc.name}</div>
                  {svc.description && (
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {svc.description}
                    </div>
                  )}
                </td>
                <td>
                  {svc.category_name
                    ? <span className="badge badge-published">{svc.category_name}</span>
                    : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>
                  }
                </td>
                <td>
                  {svc.price
                    ? <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>{svc.price}</span>
                    : '—'
                  }
                  {svc.price_unit && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{svc.price_unit}</div>}
                </td>
                <td>
                  {svc.is_featured
                    ? <span className="badge badge-confirmed">Nổi bật</span>
                    : <span className="badge badge-draft">Thường</span>
                  }
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/services/${svc.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(svc.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🦷</div>
            <div className="empty-state-text">Chưa có dịch vụ nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
