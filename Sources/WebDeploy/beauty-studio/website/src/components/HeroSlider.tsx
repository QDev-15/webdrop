import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { slides, settings } = useSite()
  const [active, setActive]  = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setActive(p => (p + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])

  const current = slides[active]

  return (
    <section style={{ paddingTop: 64, minHeight: '100svh', position: 'relative', overflow: 'hidden', background: 'var(--dark)', display: 'flex', alignItems: 'stretch' }}>
      {/* Background images */}
      {slides.map((s, i) => (
        <div key={s.id} style={{
          position: 'absolute', inset: 0,
          opacity: i === active ? 1 : 0,
          transition: 'opacity 1.2s ease',
          zIndex: 0,
        }}>
          {s.image && (
            <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(8,8,8,.82) 0%, rgba(8,8,8,.55) 50%, rgba(8,8,8,.25) 100%)' }} />
        </div>
      ))}

      {/* Content */}
      <div className="wd-container" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', minHeight: 'calc(100svh - 64px)', padding: '60px clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 22 }}>
            <span style={{ width: 28, height: 1, background: 'var(--accent)', display: 'block' }} />
            {settings.site_name} — {settings.site_tagline}
          </div>

          <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 20 }}>
            {current ? current.title.split('|').map((part, i) => (
              i % 2 === 0 ? <span key={i}>{part}</span> : <em key={i} style={{ color: 'var(--accent)', fontStyle: 'normal', fontWeight: 300 }}>{part}</em>
            )) : 'Chào mừng đến với Beauty Studio'}
          </h1>

          {current?.subtitle && (
            <p style={{ fontSize: 'clamp(14px,1.5vw,17px)', fontWeight: 300, color: 'rgba(255,255,255,.65)', lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
              {current.subtitle}
            </p>
          )}

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to={current?.cta_link || '/dat-lich'} className="bst-btn-primary">
              ✨ {current?.cta_text || 'Đặt lịch ngay'}
            </Link>
            <Link to="/dich-vu" className="bst-btn-outline">Xem dịch vụ & giá →</Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 28 : 8, height: 8, borderRadius: 4,
                background: i === active ? 'var(--accent)' : 'rgba(255,255,255,.3)',
                border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
