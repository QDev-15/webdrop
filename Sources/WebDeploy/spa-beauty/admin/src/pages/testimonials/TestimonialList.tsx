import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number; author_name: string; author_location: string; author_avatar: string
  content: string; rating: number; sort_order: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try { setItems(await api.get<Testimonial[]>('/testimonials')) }
    catch { setError('Không thể tải đánh giá.') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function remove(id: number) {
    if (!confirm('Xóa đánh giá này?')) return
    try { await api.delete(`/testimonials/${id}`); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Lỗi xóa') }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Đánh giá khách hàng</div></div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="admin-loading">Đang tải...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              {t.author_avatar && <img src={t.author_avatar} alt={t.author_name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{t.author_name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.author_location}</span>
                  <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(t.rating)}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', fontStyle: 'italic', margin: 0 }}>{t.content}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button className="btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(t.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
