import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery').then(d => {
      setItems(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
  if (!items.length) return null

  return (
    <>
      <div className="photo-grid">
        {items.map(item => (
          <div key={item.id} style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: 10 }} onClick={() => setLightbox(item)}>
            <img
              src={item.image}
              alt={item.title || 'Hình ảnh quán'}
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', transition: 'transform .3s', display: 'block' }}
              loading="lazy"
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={lightbox.image} alt={lightbox.title || ''} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 12, display: 'block' }} />
            {lightbox.title && <div style={{ textAlign: 'center', color: '#fff', marginTop: 12, fontSize: 14 }}>{lightbox.title}</div>}
          </div>
          <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 20, right: 24, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 20, width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </>
  )
}
