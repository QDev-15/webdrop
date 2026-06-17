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

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery').then(setItems).catch(() => {})
  }, [])

  if (!items.length) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Thư viện ảnh</div>
          <h2 className="sec-title">Khoảnh khắc <em>tại nhà hàng</em></h2>
        </div>
        <div className="row g-3">
          {items.map((item, i) => (
            <div key={item.id} className={`col-6 col-md-4 reveal${i > 0 ? ` reveal-d${Math.min(i % 3, 3) as 1 | 2 | 3}` : ''}`}>
              <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--warm2)', cursor: 'pointer' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease', display: 'block' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {item.title && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,.6))', color: '#fff', fontSize: '13px', fontWeight: 300 }}>
                    {item.title}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
