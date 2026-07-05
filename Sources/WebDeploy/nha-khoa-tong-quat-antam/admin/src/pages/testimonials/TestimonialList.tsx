import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  rating: number
  is_featured: number
  sort_order: number
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
          <div className="page-title">Đánh giá bệnh nhân</div>
          <div className="page-sub">{items.length} đánh giá</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Bệnh nhân</th>
              <th>Nội dung</th>
              <th>Đánh giá</th>
              <th>Nổi bật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(rv => (
              <tr key={rv.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {rv.author_avatar
                      ? <img src={rv.author_avatar} alt={rv.author_name} className="thumb" />
                      : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--accent)' }}>
                          {rv.author_name.charAt(0)}
                        </div>
                    }
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{rv.author_name}</div>
                      {rv.author_role && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{rv.author_role}</div>}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rv.content}
                  </div>
                </td>
                <td>
                  <span style={{ color: '#f59e0b' }}>{'★'.repeat(rv.rating)}</span>
                  <span style={{ color: 'var(--text-3)', fontSize: 12 }}> ({rv.rating}/5)</span>
                </td>
                <td>
                  <span className={`badge ${rv.is_featured ? 'badge-confirmed' : 'badge-draft'}`}>
                    {rv.is_featured ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/testimonials/${rv.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(rv.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <div className="empty-state-text">Chưa có đánh giá nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
