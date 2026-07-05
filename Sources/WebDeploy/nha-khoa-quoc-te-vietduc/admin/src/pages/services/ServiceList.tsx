import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  category_id: number | null
  category_name: string | null
  name: string
  tag: string
  price: string
  price_unit: string
  is_active: number
  sort_order: number
}

export default function ServiceList() {
  const [items, setItems]     = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Service[]>('/services')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Dịch Vụ</h1>
          <p className="adm-page-sub">{items.length} dịch vụ</p>
        </div>
        <Link to="/services/new" className="adm-btn-primary">+ Thêm dịch vụ</Link>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Nhóm</th>
              <th>Tag</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.category_name || '—'}</td>
                <td><span className="adm-tag">{s.tag || '—'}</span></td>
                <td style={{ fontSize: 13 }}>{s.price ? `${s.price} ${s.price_unit}` : '—'}</td>
                <td><span className={`adm-badge ${s.is_active ? 'active' : 'inactive'}`}>{s.is_active ? 'Hiện' : 'Ẩn'}</span></td>
                <td>
                  <Link to={`/services/${s.id}/edit`} className="adm-btn-ghost adm-btn-sm">Sửa</Link>
                  {' '}
                  <button onClick={() => handleDelete(s.id)} className="adm-btn-danger adm-btn-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="adm-empty">Chưa có dịch vụ nào.</p>}
      </div>
    </div>
  )
}
