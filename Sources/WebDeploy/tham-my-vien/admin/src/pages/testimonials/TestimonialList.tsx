import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  service_name: string
  rating: number
  content: string
  status: string
  created_at: string
}

export default function TestimonialList() {
  const [items, setItems]     = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Testimonial[]>('/testimonials')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xoá đánh giá của "${name}"?`)) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  async function toggleStatus(t: Testimonial) {
    await api.put(`/testimonials/${t.id}`, { status: t.status === 'published' ? 'draft' : 'published' })
    load()
  }

  const stars = (n: number) => '★'.repeat(Math.max(1, Math.min(5, n))) + '☆'.repeat(5 - Math.max(1, Math.min(5, n)))

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
        <div className="empty-state">
          <div className="empty-state-icon">★</div>
          <div className="empty-state-text">Chưa có đánh giá nào.</div>
          <Link to="/testimonials/new" className="btn-accent" style={{ marginTop: 12 }}>Thêm đánh giá đầu tiên</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{t.author_name}</div>
                    {t.author_title && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.author_title}</div>}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{t.service_name || '—'}</td>
                  <td style={{ color: '#f59e0b', fontSize: 15, letterSpacing: 1 }}>{stars(t.rating)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)', maxWidth: 250 }}>
                    <div style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {t.content}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(t)}
                      className={`badge ${t.status === 'published' ? 'badge-published' : 'badge-draft'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {t.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(t.id, t.author_name)} className="btn-danger btn-sm">Xoá</button>
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
