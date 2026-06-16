import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  sort_order: number
}

const FALLBACK_GALLERY = [
  { id: 1, title: 'Không gian chính', image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80', category: 'Nội thất' },
  { id: 2, title: 'Wagyu A5 Bít tết', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80', category: 'Món ăn' },
  { id: 3, title: 'Bếp mở cao cấp', image: 'https://images.unsplash.com/photo-1583394293214-0b4e26f18efa?w=800&q=80', category: 'Bếp' },
  { id: 4, title: 'Phòng riêng Private Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', category: 'Sự kiện' },
  { id: 5, title: 'Hầm rượu vang', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80', category: 'Wine' },
  { id: 6, title: 'Dessert nghệ thuật', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80', category: 'Món ăn' },
]

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery')
      .then(d => setItems(d || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const displayItems = items.length > 0 ? items : FALLBACK_GALLERY as GalleryItem[]

  return (
    <section id="thu-vien" className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 56px)' }}>
          <div className="eyebrow">Thư viện ảnh</div>
          <h2 className="sec-title" style={{ marginBottom: 0 }}>
            Khoảnh khắc <em>đáng nhớ</em>
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: 40 }}>Đang tải...</div>
        ) : (
          <div className="gallery-grid">
            {displayItems.map(item => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => setLightbox(item)}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="gallery-overlay">
                  <div>
                    {item.category && (
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                        {item.category}
                      </div>
                    )}
                    <div className="gallery-title">{item.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: '100%', position: 'relative' }}>
            <img
              src={lightbox.image}
              alt={lightbox.title}
              style={{ width: '100%', borderRadius: 12, display: 'block', maxHeight: '80vh', objectFit: 'contain' }}
            />
            {lightbox.title && (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.6)', fontSize: 14, marginTop: 12 }}>
                {lightbox.title}
              </div>
            )}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute',
                top: -40,
                right: 0,
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,.7)',
                fontSize: 28,
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
