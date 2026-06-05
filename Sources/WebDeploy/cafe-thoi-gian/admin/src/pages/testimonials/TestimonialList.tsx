import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
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

  const load = () => {
    setLoading(true)
    api.get<Testimonial[]>('/testimonials').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Đánh giá khách hàng</div><div className="page-sub">{items.length} đánh giá</div></div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      {loading ? <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map(t => (
            <div key={t.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {t.author_avatar && <img src={t.author_avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt={t.author_name} />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{t.author_name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{t.author_title}</span>
                    <span style={{ color: '#f59e0b', fontSize: '12px' }}>{'★'.repeat(t.rating)}</span>
                    <span className={`badge ${t.status === 'published' ? 'badge-published' : 'badge-draft'}`} style={{ marginLeft: 'auto' }}>{t.status === 'published' ? 'Công khai' : 'Ẩn'}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', fontStyle: 'italic' }}>"{t.content}"</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Xóa</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-text">Chưa có đánh giá nào</div></div>}
        </div>
      )}
    </div>
  )
}
