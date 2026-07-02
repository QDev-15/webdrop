import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  customer_name: string
  avatar: string
  meta: string
  rating: number
  content: string
  status: string
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
          <div className="page-title">Đánh giá khách hàng</div>
          <div className="page-sub">{items.length} đánh giá</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">★</div>
          <div className="empty-state-text">Chưa có đánh giá nào.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {items.map(t => (
            <div key={t.id} className="card">
              <div style={{ color: '#f59e0b', fontSize: 13, marginBottom: 10 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14, fontStyle: 'italic' }}>
                "{t.content.length > 140 ? t.content.slice(0, 140) + '…' : t.content}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                {t.avatar
                  ? <img src={t.avatar} alt={t.customer_name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg)' }} />}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.customer_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.meta}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${t.status}`}>{t.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                  <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
