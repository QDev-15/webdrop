import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  category_name: string
  tag: string
  price: string
  price_unit: string
  is_active: number
  sort_order: number
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Service[]>('/services').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dịch vụ nha khoa</div>
          <div className="page-subtitle">Quản lý các dịch vụ chăm sóc răng miệng</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nhóm</th>
                <th>Tên dịch vụ</th>
                <th>Tag</th>
                <th>Giá</th>
                <th>Hiển thị</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>{s.category_name || '—'}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.tag && <span className="badge badge-published"><span className="badge-dot" />{s.tag}</span>}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{s.price} {s.price_unit}</td>
                  <td>{s.is_active ? <span style={{ color: 'var(--accent)' }}>Có</span> : <span style={{ color: 'var(--text-3)' }}>Ẩn</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Chưa có dịch vụ nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
