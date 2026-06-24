import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Slide {
  id: number
  title: string
  subtitle: string
  badge_text: string
  btn_label: string
  btn_url: string
  image: string
  sort_order: number
  is_active: number
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
    if (!confirm('Xóa slide này?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hero Slides</div>
          <div className="page-sub">Quản lý ảnh slider trang chủ ({slides.length} slides)</div>
        </div>
        <Link to="/slides/new" className="btn-accent">+ Thêm slide</Link>
      </div>

      {slides.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🖼</div>
          <div className="empty-state-text">Chưa có slide nào. Thêm slide đầu tiên!</div>
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
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Thứ tự: {slide.sort_order}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${slide.is_active ? 'published' : 'draft'}`}>{slide.is_active ? 'Đang hiện' : 'Ẩn'}</span>
                <Link to={`/slides/${slide.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(slide.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
