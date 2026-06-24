import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  tag: string
  category_name: string
  price_from: number
  duration: string
  featured: number
  active: number
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Service[]>('/services').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa dịch vụ này?')) return
    try { await api.delete(`/services/${id}`); load() } catch {}
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dịch vụ massage</div>
          <div className="page-sub">Quản lý các liệu trình dịch vụ</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      {loading ? <div style={{ color: 'var(--text-3)' }}>Đang tải...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>ID</th><th>Tên dịch vụ</th><th>Tag</th><th>Danh mục</th><th>Giá từ</th><th>Thời lượng</th><th>Nổi bật</th><th>Trạng thái</th><th>Thao tác</th>
            </tr></thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, background: 'var(--warm)', color: 'var(--text-2)' }}>{s.tag}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.category_name}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{Number(s.price_from).toLocaleString('vi-VN')}d</td>
                  <td style={{ fontSize: 12 }}>{s.duration}</td>
                  <td><span style={{ color: s.featured ? '#f59e0b' : 'var(--text-3)' }}>{s.featured ? 'Nổi bật' : '-'}</span></td>
                  <td><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: s.active ? 'var(--accent-light)' : 'var(--warm)', color: s.active ? 'var(--accent)' : 'var(--text-3)' }}>{s.active ? 'Hiện' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Xóa</button>
                    </div>
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
