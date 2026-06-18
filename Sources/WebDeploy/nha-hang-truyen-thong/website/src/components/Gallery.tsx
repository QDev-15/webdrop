import { useState, useEffect, useRef } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  image: string
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery').then(setItems).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = ref.current?.querySelectorAll<Element>('[data-reveal]:not(.visible)') ?? []
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [items])

  const displayItems = items.length > 0 ? items.slice(0, 5) : [
    { id: 1, title: 'Không gian chính', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop' },
    { id: 2, title: 'Góc bếp',          image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fit=crop' },
    { id: 3, title: 'Bàn ăn',           image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80&auto=format&fit=crop' },
    { id: 4, title: 'Trang trí',         image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop' },
    { id: 5, title: 'Phòng riêng',      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80&auto=format&fit=crop' },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }} ref={ref}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s, transform .7s' }}>
          <div className="eyebrow">Không gian</div>
          <h2 className="sec-title">Ấm cúng như <em>ngôi nhà thứ hai</em></h2>
          <p className="sec-sub">Không gian được thiết kế theo phong cách truyền thống Việt Nam — mộc mạc, gần gũi, thân thuộc.</p>
        </div>
        <div className="gallery-masonry" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s .1s, transform .7s .1s' }}>
          {displayItems.map(item => (
            <div key={item.id} className="gm-item">
              <img src={item.image} alt={item.title || 'Không gian nhà hàng'} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
