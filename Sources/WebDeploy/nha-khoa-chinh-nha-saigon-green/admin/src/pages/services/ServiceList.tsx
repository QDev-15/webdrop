import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  category_name: string
  price_from: number
  price_unit: string
  duration: string
  is_featured: number
  status: string
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

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xoá dịch vụ "${name}"?`)) return
    await api.delete(`/services/${id}`)
    load()
  }

  async function toggleFeatured(item: Service) {
    await api.put(`/services/${item.id}`, { is_featured: item.is_featured ? 0 : 1 })
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dịch vụ niềng răng</div>
          <div className="page-sub">{items.length} dịch vụ</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✦</div>
          <div className="empty-state-text">Chưa có dịch vụ nào.</div>
          <Link to="/services/new" className="btn-accent" style={{ marginTop: 12 }}>Thêm dịch vụ đầu tiên</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Danh mục</th>
                <th>Giá từ</th>
                <th>Thời gian</th>
                <th>Nổi bật</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500, maxWidth: 220 }}>{s.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.category_name || '—'}</td>
                  <td style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                    {s.price_from ? `${Number(s.price_from).toLocaleString('vi-VN')}đ${s.price_unit ? ' / ' + s.price_unit : ''}` : 'Miễn phí'}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.duration || '—'}</td>
                  <td>
                    <button
                      onClick={() => toggleFeatured(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 0, color: s.is_featured ? '#f59e0b' : 'var(--text-3)' }}
                      title={s.is_featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                    >
                      {s.is_featured ? '★' : '☆'}
                    </button>
                  </td>
                  <td>
                    <span className={`badge ${s.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                      {s.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(s.id, s.name)} className="btn-danger btn-sm">Xoá</button>
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
