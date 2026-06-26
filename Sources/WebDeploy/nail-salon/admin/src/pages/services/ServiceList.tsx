import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number; category_id: number | null; name: string; tag: string
  description: string; price: string; image: string; featured: number
  sort_order: number; category_name: string
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Service[]>('/services').then(data => { setServices(data); setLoading(false) })
  }, [])

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa dịch vụ "${name}"?`)) return
    await api.delete(`/services/${id}`)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dịch vụ</div>
          <div className="page-sub">Quản lý danh sách dịch vụ và bảng giá</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th><th>Tên dịch vụ</th><th>Danh mục</th>
              <th>Tag</th><th>Giá</th><th>Nổi bật</th><th></th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>
                  {s.image ? <img src={s.image} alt={s.name} className="thumb" /> : <span style={{ color: 'var(--text-3)' }}>—</span>}
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.description.slice(0, 60)}{s.description.length > 60 ? '...' : ''}</div>
                </td>
                <td>{s.category_name || '—'}</td>
                <td>{s.tag || '—'}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{s.price}</td>
                <td>{s.featured ? '⭐' : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id, s.name)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={7}>
                <div className="empty-state"><div className="empty-state-icon">💅</div><div className="empty-state-text">Chưa có dịch vụ nào</div></div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
