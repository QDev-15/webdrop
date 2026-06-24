import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number; name: string; category_name?: string; category_label: string; price: string; duration: string; is_active: number; sort_order: number
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  function load() {
    api.get<Service[]>('/services')
      .then(setItems)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm('Xoá dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dịch vụ điều trị</h1>
          <p className="page-sub">Quản lý các dịch vụ và giá điều trị</p>
        </div>
        <Link to="/services/new" className="btn btn-primary">+ Thêm dịch vụ</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Tên dịch vụ</th><th>Danh mục</th><th>Giá</th><th>Thời gian</th><th>Hiển thị</th><th></th></tr>
        </thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={6} className="table-empty">Chưa có dịch vụ nào.</td></tr>}
          {items.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.category_name ?? s.category_label ?? '—'}</td>
              <td>{s.price || '—'}</td>
              <td>{s.duration || '—'}</td>
              <td><span className={`status-badge ${s.is_active ? 'done' : 'cancelled'}`}>{s.is_active ? 'Hiển thị' : 'Ẩn'}</span></td>
              <td className="table-actions">
                <button className="btn-icon" onClick={() => navigate(`/services/${s.id}/edit`)}>✎</button>
                <button className="btn-icon danger" onClick={() => handleDelete(s.id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
