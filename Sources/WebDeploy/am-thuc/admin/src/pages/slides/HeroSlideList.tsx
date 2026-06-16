import { useEffect, useState } from 'react'
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
    if (!confirm('Xóa slide này?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Hero Slides</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{slides.length} slides</p>
        </div>
        <Link to="/slides/new" className="btn-accent" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          + Thêm slide
        </Link>
      </div>

      {slides.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🖼</div>
          <div style={{ fontSize: 14, color: 'var(--text-3)' }}>Chưa có slide nào</div>
          <Link to="/slides/new" className="btn-accent" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 16 }}>Thêm slide đầu tiên</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slides.map(slide => (
            <div key={slide.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              {slide.image ? (
                <img src={slide.image} alt={slide.title} style={{ width: 120, height: 72, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 120, height: 72, borderRadius: 8, background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🖼</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{slide.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.subtitle}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: slide.status === 'published' ? 'var(--accent-light)' : 'var(--warm)', color: slide.status === 'published' ? 'var(--accent)' : 'var(--text-3)', fontWeight: 500 }}>
                    {slide.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Thứ tự: {slide.sort_order}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Link to={`/slides/${slide.id}/edit`} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-2)', textDecoration: 'none' }}>
                  Sửa
                </Link>
                <button onClick={() => handleDelete(slide.id)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, border: '1px solid #fdd', background: '#fff0f0', color: 'var(--danger)', cursor: 'pointer' }}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
