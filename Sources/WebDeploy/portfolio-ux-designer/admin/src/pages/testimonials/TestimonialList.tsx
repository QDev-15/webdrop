import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  sort_order: number
  status: string
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
          <div className="page-sub">Hiển thị ở trang chủ (3 đầu) &amp; trang Về tôi ({items.length} đánh giá)</div>
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
            <div key={t.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                {t.author_avatar && (
                  <img src={t.author_avatar} alt={t.author_name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{t.author_name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>{t.author_title}</div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-2)', fontStyle: 'italic', margin: 0 }}>&quot;{t.content}&quot;</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                  <span className={`badge badge-${t.status}`}>{t.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
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
