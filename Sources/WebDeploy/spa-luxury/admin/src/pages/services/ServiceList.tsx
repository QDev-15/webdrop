import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  description: string
  category_id: number
  category_name: string
  duration_minutes: number
  price: number
  price_unit: string
  is_featured: number
  image: string
  sort_order: number
}

function formatPrice(price: number, unit: string) {
  if (!price || unit === 'miễn phí') return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
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

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh sách dịch vụ</div>
          <div className="page-sub">{items.length} dịch vụ</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💆</div>
          <div>Chưa có dịch vụ nào. <Link to="/services/new" style={{ color: 'var(--accent)' }}>Thêm dịch vụ đầu tiên</Link>!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên dịch vụ</th>
                <th>Danh mục</th>
                <th>Thời gian</th>
                <th>Giá</th>
                <th>Nổi bật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div style={{ width: 56, height: 40, background: 'var(--warm)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💆</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    {item.description && (
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{item.category_name || '—'}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: 13 }}>
                    {item.duration_minutes ? `${item.duration_minutes} phút` : '—'}
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 500 }}>
                    {formatPrice(item.price, item.price_unit)}
                    {item.price_unit && item.price_unit !== 'miễn phí' && (
                      <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 4 }}>/{item.price_unit}</span>
                    )}
                  </td>
                  <td>
                    {item.is_featured ? (
                      <span style={{ color: '#f59e0b', fontSize: 18 }}>★</span>
                    ) : (
                      <span style={{ color: 'var(--border)', fontSize: 18 }}>☆</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/services/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
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
