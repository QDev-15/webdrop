import { useState, useEffect } from 'react'
import { Settings } from '../App'

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 0,
    title: 'Ngon bình dân<br/><em>no bụng</em>',
    subtitle: 'Phở, cơm tấm, bún bò tươi mỗi ngày — từ 20.000đ. Mở cửa 6:00 sáng, không nghỉ lễ.',
    button_text: 'Xem thực đơn',
    button_link: '/thuc-don',
    image: '',
  },
]

interface Props {
  slides: Slide[]
  settings: Settings
}

export default function HeroSlider({ slides, settings }: Props) {
  const data = slides.length > 0 ? slides : DEFAULT_SLIDES
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (data.length <= 1) return
    const id = setInterval(() => setCurrent(c => (c + 1) % data.length), 5500)
    return () => clearInterval(id)
  }, [data.length])

  const slide = data[current]

  return (
    <section className="hero" style={slide.image ? { backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      <div className="hero-pattern" />
      {!slide.image && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(217,119,6,.08) 0%, transparent 60%)' }} />}

      <div className="wd-container" style={{ position: 'relative', zIndex: 2, paddingTop: 'clamp(32px,6vw,64px)', paddingBottom: 'clamp(32px,6vw,64px)' }}>
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="hero-content">
              <div className="hero-label">
                <span style={{ color: '#fcd34d' }}>●</span>
                Mở cửa {settings.working_hours?.split('|')[0]?.trim() || '6:00 – 22:00 mỗi ngày'}
              </div>
              <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: slide.title }} />
              <p className="hero-sub">{slide.subtitle}</p>
              <div className="hero-actions">
                <a href={slide.button_link || '/thuc-don'} className="btn-hero-cta">
                  {slide.button_text || 'Xem thực đơn'} <span>→</span>
                </a>
                <a href="/cua-hang" className="btn-hero-ghost">📍 Tìm quán</a>
              </div>
              <div className="hero-meta-bar">
                <div className="hm-item"><div className="hm-dot" />{settings.site_address || '123 Nguyễn Trãi, Q.5, TP.HCM'}</div>
                <div className="hm-item"><div className="hm-dot" /><a href={`tel:${(settings.site_phone || '0901234567').replace(/\s/g,'')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{settings.site_phone || '0901 234 567'}</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {data.length > 1 && (
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{ width: i === current ? 22 : 6, height: 6, borderRadius: 3, border: 'none', background: i === current ? '#fcd34d' : 'rgba(255,255,255,.3)', cursor: 'pointer', transition: 'all .35s', padding: 0 }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
