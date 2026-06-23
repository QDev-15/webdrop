import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  image: string
  category: string
}

const STATIC_GALLERY = [
  { id: 1, title: 'Sảnh chính — 150 chỗ ngồi', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=900&q=80&auto=format&fit=crop', category: '' },
  { id: 2, title: 'Bàn nướng than hoa riêng', image: 'https://images.unsplash.com/photo-1544025162-d76538977abd?w=600&q=80&auto=format&fit=crop', category: '' },
  { id: 3, title: 'Phòng VIP cách âm', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80&auto=format&fit=crop', category: '' },
]

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery')
      .then(data => setItems(data.slice(0, 3)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const els = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      if (!els?.length) return
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [items])

  const display = items.length > 0 ? items : STATIC_GALLERY

  return (
    <section ref={ref} className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center" data-reveal style={{ marginBottom: 40 }}>
          <div className="eyebrow">Không gian</div>
          <h2 className="sec-title">Rộng rãi, <em>hiện đại</em> — xứng tầm bữa tiệc</h2>
          <p className="sec-sub">Hệ thống hút khói tiên tiến, không lo ám mùi. Phòng VIP riêng dành cho tiệc riêng tư và sinh nhật.</p>
        </div>
        <div className="gallery-wide" data-reveal>
          {display.map((item, i) => (
            <div key={item.id} className="gw-item" style={i === 0 ? { gridColumn: 'span 2' } : {}}>
              <img className="gw-img" src={item.image} alt={item.title} loading="lazy" style={i === 0 ? { height: 400 } : { height: 320 }} />
            </div>
          ))}
        </div>
        <div className="text-center mt-4" data-reveal>
          <Link to="/khong-gian" className="btn-ghost">Xem thêm hình ảnh không gian →</Link>
        </div>
      </div>
    </section>
  )
}
