import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Testimonial[]>('/testimonials')) } finally { setLoading(false) }
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
          <div className="page-title">Đánh giá độc giả</div>
          <div className="page-sub">{items.length} đánh giá — hiển thị ở trang Về tôi</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-text">Chưa có đánh giá nào.</div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {items.map(t => (
            <div key={t.id} className="card">
              <div style={{ color: '#f0a63a', marginBottom: 8 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 12, minHeight: 60 }}>{t.content}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                {t.author_avatar && <img src={t.author_avatar} className="thumb" style={{ borderRadius: '50%' }} alt={t.author_name} />}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{t.author_name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{t.author_role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
