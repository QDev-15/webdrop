import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  name: string
  role: string
  location: string
  rating: number
  content: string
  avatar: string
  is_published: number
  sort_order: number
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#f59e0b', letterSpacing: 1 }}>
      {'★'.repeat(Math.max(0, Math.min(5, rating)))}{'☆'.repeat(Math.max(0, 5 - Math.min(5, rating)))}
    </span>
  )
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Testimonial[]>('/testimonials')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đánh giá khách hàng</div>
          <div className="page-sub">{items.length} đánh giá</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
          <div>Chưa có đánh giá nào. <Link to="/testimonials/new" style={{ color: 'var(--accent)' }}>Thêm đánh giá đầu tiên</Link>!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Vai trò</th>
                <th>Địa điểm</th>
                <th>Đánh giá</th>
                <th>Xuất bản</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.role || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.location || '—'}</td>
                  <td><Stars rating={item.rating} /></td>
                  <td>
                    {item.is_published ? (
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 500 }}>Hiển thị</span>
                    ) : (
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'var(--warm)', color: 'var(--text-3)', fontWeight: 500 }}>Ẩn</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/testimonials/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
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
