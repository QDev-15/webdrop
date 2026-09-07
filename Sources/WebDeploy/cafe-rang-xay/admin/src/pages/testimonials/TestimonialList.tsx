import { useState, useEffect } from 'react'
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

  async function load() {
    try { setItems(await api.get<Testimonial[]>('/testimonials')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoa danh gia nay?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh gia khach hang</div>
          <div className="page-sub">{items.length} danh gia</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Them danh gia</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {item.author_avatar ? (
              <img src={item.author_avatar} alt={item.author_name} className="thumb" style={{ borderRadius: '50%' }} />
            ) : (
              <div className="thumb" style={{ borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{item.author_name}</div>
                {item.author_title && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{item.author_title}</div>}
                <div style={{ color: '#f59e0b', fontSize: 12 }}>{'★'.repeat(item.rating ?? 5)}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.6 }}>"{item.content}"</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
              <span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hien' : 'An'}</span>
              <Link to={`/testimonials/${item.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
              <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xoa</button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-text">Chua co danh gia nao.</div></div>}
    </div>
  )
}
