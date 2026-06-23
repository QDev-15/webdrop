import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
}

const CATEGORIES = [
  { value: '', label: 'Tất cả' },
  { value: 'interior', label: 'Không gian' },
  { value: 'food', label: 'Món ăn' },
  { value: 'kitchen', label: 'Bếp' },
  { value: 'wine', label: 'Rượu vang' },
  { value: 'event', label: 'Sự kiện' },
]

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [active, setActive] = useState('')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery')
      .then(setItems)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [items, active])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const filtered = active ? items.filter(i => i.category === active) : items

  // Only show categories that have items
  const availableCats = CATEGORIES.filter(c => c.value === '' || items.some(i => i.category === c.value))

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        {/* Filter tabs */}
        {availableCats.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {availableCats.map(c => (
              <button key={c.value} onClick={() => setActive(c.value)}
                style={{
                  padding: '8px 20px', borderRadius: 20, border: '1px solid',
                  borderColor: active === c.value ? 'var(--accent)' : 'var(--border)',
                  background: active === c.value ? 'var(--accent)' : 'transparent',
                  color: active === c.value ? '#fff' : 'var(--text-2)',
                  cursor: 'pointer', fontSize: 13, transition: 'all .2s',
                }}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="gallery-grid">
          {filtered.map(item => (
            <div className="gallery-item reveal" key={item.id} onClick={() => setLightbox(item)}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="gallery-overlay">
                <span>{item.title || 'Xem ảnh'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>
          <img
            className="lightbox-img"
            src={lightbox.image}
            alt={lightbox.title}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
