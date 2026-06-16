import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  image: string
  category: string
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery').then(setItems).catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Hình ảnh</div>
          <h2 className="sec-title">Không gian <em>nhà hàng</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {items.map((item, i) => (
            <div key={item.id} className={`reveal reveal-d${(i % 3) + 1}`} style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
              <img
                src={item.image}
                alt={item.title || ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
                loading="lazy"
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              {item.title && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,.6), transparent)', padding: '24px 16px 12px', color: '#fff', fontSize: 13, fontWeight: 500 }}>
                  {item.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
