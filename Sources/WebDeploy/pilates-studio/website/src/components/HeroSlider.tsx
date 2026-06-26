import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Slide {
  id: number
  title: string
  subtitle: string
  image_url: string
  cta_text: string
  cta_link: string
}

const TRUST_ITEMS = ['500+ học viên', 'Thiết bị Reformer chuẩn quốc tế', 'HLV có chứng chỉ quốc tế']

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    api.get<Slide[]>('/public/hero-slides')
      .then(data => setSlides(data.length > 0 ? data : [{
        id: 0,
        title: 'Tìm lại sự cân bằng trong cơ thể.',
        subtitle: 'Pilates không chỉ là bài tập — đó là hành trình kết nối tâm trí và cơ thể.',
        image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80&auto=format&fit=crop',
        cta_text: 'Đăng ký dùng thử',
        cta_link: '/dat-lich',
      }]))
      .catch(() => {})
  }, [])

  // Auto advance
  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [slides.length])

  if (!slides.length) return null

  const slide = slides[current]

  return (
    <section className="ps-hero">
      <div className="ps-hero-bg-strip"></div>

      <div className="wd-container ps-hero-content" style={{ width: '100%' }}>
        <div className="row align-items-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="col-lg-6 py-5">
            <div className="ps-hero-label">
              <span className="ps-hero-dot"></span>
              Studio Pilates chuyên nghiệp
            </div>
            <h1 className="ps-hero-title" dangerouslySetInnerHTML={{ __html: slide.title.replace('\n', '<br>') }} />
            {slide.subtitle && (
              <p className="ps-hero-desc">{slide.subtitle}</p>
            )}
            <div className="ps-hero-actions">
              <Link to={slide.cta_link || '/dat-lich'} className="ps-btn-solid">
                {slide.cta_text || 'Đăng ký dùng thử'}
              </Link>
              <Link to="/dich-vu" className="ps-btn-ghost">Xem các lớp</Link>
            </div>
            <div className="ps-trust-row">
              {TRUST_ITEMS.map(t => (
                <div key={t} className="ps-trust-item">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offset image */}
      <div className="ps-hero-img-wrap">
        <img
          className="ps-hero-img"
          src={slide.image_url}
          alt={slide.title}
        />
        <div className="ps-hero-badge-float">
          <div className="badge-num">98<span style={{ fontSize: 16, color: 'var(--stone)' }}>%</span></div>
          <div className="badge-label">Học viên cải thiện tư thế sau 8 buổi</div>
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? 'var(--stone)' : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all .3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
