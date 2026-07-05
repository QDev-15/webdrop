import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_meta: string
  author_avatar: string
  content: string
  rating: number
  is_featured: number
  sort_order: number
}

export default function TestimonialList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setTestimonials(await api.get<Testimonial[]>('/testimonials')) }
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
          <div className="page-title">Đánh giá phụ huynh</div>
          <div className="page-sub">{testimonials.length} đánh giá</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên phụ huynh</th>
              <th>Thông tin bé</th>
              <th>Nội dung</th>
              <th>Đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 500 }}>{t.author_name}</td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.author_meta || '—'}</td>
                <td style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.content}
                </td>
                <td>
                  <span style={{ color: '#f59e0b' }}>{'★'.repeat(t.rating || 5)}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {testimonials.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <div className="empty-state-text">Chưa có đánh giá nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
