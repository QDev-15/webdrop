import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  tag: string
  category_name: string
  price: string
  is_active: number
  sort_order: number
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Service[]>('/services')
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xoá dịch vụ "${name}"?`)) return
    try {
      await api.delete(`/services/${id}`)
      load()
    } catch (e: unknown) {
      alert((e as Error).message)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Dịch vụ</h1>
        <Link to="/services/new" className="btn btn-primary">+ Thêm dịch vụ</Link>
      </div>

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên dịch vụ</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr><td colSpan={6} className="empty-row">Chưa có dịch vụ nào.</td></tr>
            ) : services.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  <div className="fw-600">{s.name}</div>
                  {s.tag && <div className="text-muted">{s.tag}</div>}
                </td>
                <td>{s.category_name || '—'}</td>
                <td>{s.price || '—'}</td>
                <td>
                  <span className={`status-dot status-${s.is_active ? 'active' : 'inactive'}`}>
                    {s.is_active ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/services/${s.id}/edit`} className="btn btn-sm btn-ghost">Sửa</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id, s.name)}>Xoá</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
