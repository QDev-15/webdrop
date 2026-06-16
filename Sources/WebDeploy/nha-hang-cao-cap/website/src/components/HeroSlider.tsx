import { useState, useEffect, useRef } from 'react'
import { useSite } from '../App'

const DEFAULT_SLIDE = {
  id: 0,
  title: 'Nghệ thuật <em>ẩm thực</em> đỉnh cao',
  subtitle: 'Hành trình vị giác tinh tế qua từng món ăn được chế tác với tâm huyết và nguyên liệu thượng hạng từ khắp thế giới.',
  button_text: 'Khám phá thực đơn',
  button_link: '#thuc-don',
  image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
  sort_order: 0,
}

export default function HeroSlider() {
  const { settings, slides } = useSite()
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const items = slides.length > 0 ? slides : [DEFAULT_SLIDE]

  useEffect(() => {
    if (items.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % items.length)
    }, 6000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [items.length])

  const siteName = settings.site_name || 'La Maison'

  const slide = items[current]

  return (
    <section id="trang-chu" className="hero-split">
      {/* Left panel */}
      <div className="hero-panel">
        <div className="hp-logo">
          {siteName} <br /><span>Fine Dining</span>
        </div>

        <div className="hp-content">
          <div className="hp-eyebrow">Restaurant &amp; Cuisine</div>
          <h1
            className="hp-title"
            dangerouslySetInnerHTML={{ __html: slide.title }}
          />
          <p className="hp-sub">{slide.subtitle}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={slide.button_link || '#thuc-don'} className="btn-accent">
              {slide.button_text || 'Khám phá thực đơn'}
            </a>
            <a href="#dat-ban" className="btn-outline-dark">Đặt bàn</a>
          </div>
        </div>

        <div className="hp-bottom">
          {/* Slide indicators */}
          {items.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 24 : 8,
                    height: 2,
                    background: i === current ? 'var(--accent-mid)' : 'rgba(255,255,255,.2)',
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all .3s',
                    padding: 0,
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
          <div className="hp-meta">
            <div>
              <div className="hm-label">Địa chỉ</div>
              <div className="hm-value">{settings.site_address || '12 Lý Thái Tổ, Hoàn Kiếm, Hà Nội'}</div>
            </div>
            <div>
              <div className="hm-label">Giờ mở cửa</div>
              <div className="hm-value">{settings.working_hours || '18:00 – 22:30'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — image */}
      <div className="hero-image">
        {items.map((s, i) => (
          <img
            key={s.id}
            src={s.image || DEFAULT_SLIDE.image}
            alt={s.title.replace(/<[^>]+>/g, '')}
            style={{ opacity: i === current ? 1 : 0 }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, var(--dark2) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />
      </div>
    </section>
  )
}
