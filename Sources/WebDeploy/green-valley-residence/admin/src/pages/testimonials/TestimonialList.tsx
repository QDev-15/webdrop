import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  avatar: string
  content: string
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
          <div className="page-sub">Cư dân & khách đặt chỗ ({items.length} đánh giá)</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <div className="empty-state-text">Chưa có đánh giá nào. Thêm đánh giá đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              {t.avatar ? (
                <img src={t.avatar} alt={t.author_name} className="thumb" style={{ borderRadius: '50%', flexShrink: 0 }} />
              ) : (
                <div className="thumb" style={{ borderRadius: '50%', flexShrink: 0, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--accent)' }}>
                  {t.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.author_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>{t.author_role || '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{t.content}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
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
