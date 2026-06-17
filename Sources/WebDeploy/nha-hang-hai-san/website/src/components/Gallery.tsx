import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  image: string
  category: string
}

const FALLBACK: GalleryItem[] = [
  { id: 1, title: 'Cua Biển Tươi', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&auto=format&fit=crop', category: 'Hải Sản' },
  { id: 2, title: 'Tôm Sú Hấp Sả', image: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=600&q=80&auto=format&fit=crop', category: 'Hải Sản' },
  { id: 3, title: 'Mực Nướng Sa Tế', image: 'https://images.unsplash.com/photo-1513557234616-d3c6874e36d7?w=600&q=80&auto=format&fit=crop', category: 'Hải Sản' },
  { id: 4, title: 'Bể Hải Sản Sống', image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&q=80&auto=format&fit=crop', category: 'Nhà Hàng' },
  { id: 5, title: 'Không Gian Dùng Bữa', image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=80&auto=format&fit=crop', category: 'Nhà Hàng' },
  { id: 6, title: 'Ghẹ Xanh Hấp Nước Dừa', image: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=600&q=80&auto=format&fit=crop', category: 'Hải Sản' },
  { id: 7, title: 'Cá Chẽm Nướng Muối Ớt', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&auto=format&fit=crop', category: 'Hải Sản' },
  { id: 8, title: 'Bạch Tuộc Xào Bơ Tỏi', image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&q=80&auto=format&fit=crop', category: 'Hải Sản' },
  { id: 9, title: 'Khu Vực Ngoài Trời', image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=80&auto=format&fit=crop', category: 'Nhà Hàng' },
]

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [activeFilter, setActiveFilter] = useState('Tất Cả')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery')
      .then(data => setItems(data && data.length > 0 ? data : FALLBACK))
      .catch(() => setItems(FALLBACK))
  }, [])

  useEffect(() => {
    let ro: IntersectionObserver | undefined
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal-gallery]:not(.visible)')
      ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro!.unobserve(e.target) } })
      }, { threshold: 0.05 })
      els.forEach(el => ro!.observe(el))
    }, 0)
    return () => { clearTimeout(timer); ro?.disconnect() }
  }, [items, activeFilter])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const categories = ['Tất Cả', ...Array.from(new Set(items.map(i => i.category)))]
  const displayed = activeFilter === 'Tất Cả' ? items : items.filter(i => i.category === activeFilter)

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5" data-reveal-gallery>
          <div className="eyebrow">Thư viện ảnh</div>
          <h2 className="sec-title">Khoảnh khắc <em>Vị Biển</em></h2>
          <p className="sec-sub">Những món hải sản tươi ngon và không gian nhà hàng của chúng tôi.</p>
        </div>

        {categories.length > 2 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                padding: '7px 18px', borderRadius: 20, border: '1px solid',
                borderColor: activeFilter === cat ? 'var(--accent)' : 'var(--border)',
                background: activeFilter === cat ? 'var(--accent-light)' : 'transparent',
                color: activeFilter === cat ? 'var(--accent)' : 'var(--text-2)',
                fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all .2s',
              }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="row g-3">
          {displayed.map((item, i) => (
            <div key={item.id} className="col-6 col-md-4 col-lg-3">
              <div
                className={`gallery-item reveal reveal-d${(i % 3) + 1}`}
                data-reveal-gallery
                onClick={() => setLightbox(item)}
                style={{ cursor: 'pointer', borderRadius: 10, overflow: 'hidden', position: 'relative', paddingBottom: '75%', background: 'var(--warm2)' }}
              >
                <img
                  src={item.image} alt={item.title} loading="lazy"
                  onError={e => { const el = (e.target as HTMLImageElement).closest('.gallery-item') as HTMLElement | null; if (el) el.style.display = 'none' }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.07)' }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '16px 12px 10px',
                  background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 100%)',
                  opacity: 0, transition: 'opacity .3s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0' }}
                >
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', lineHeight: 1 }}
          >✕</button>
          <img
            src={lightbox.image} alt={lightbox.title}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
          />
          {lightbox.title && (
            <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: 14, background: 'rgba(0,0,0,.5)', padding: '6px 16px', borderRadius: 20 }}>
              {lightbox.title}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
