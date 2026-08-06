import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
  status: string
  created_at: string
}

export default function HeroSlideList() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setSlides(await api.get<Slide[]>('/hero-slides')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoa slide nay?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hero Slides</div>
          <div className="page-sub">Quan ly anh slider trang chu ({slides.length} slides)</div>
        </div>
        <Link to="/slides/new" className="btn-accent">+ Them slide</Link>
      </div>

      {slides.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🖼</div>
          <div className="empty-state-text">Chua co slide nao. Them slide dau tien!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slides.map(slide => (
            <div key={slide.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {slide.image && (
                <img src={slide.image} alt={slide.title}
                  style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.title}</div>
                {slide.subtitle && (
                  <div style={{ fontSize: 13, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.subtitle}</div>
                )}
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Thu tu: {slide.sort_order}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${slide.status}`}>{slide.status === 'published' ? 'Dang hien' : 'An'}</span>
                <Link to={`/slides/${slide.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
                <button onClick={() => handleDelete(slide.id)} className="btn-danger btn-sm">Xoa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
