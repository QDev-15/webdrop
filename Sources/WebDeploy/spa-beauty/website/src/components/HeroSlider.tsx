import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1400&q=70&auto=format&fit=crop',
]

const GALLERY_FALLBACK = [
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80&auto=format&fit=crop',
]

export default function HeroSlider() {
  const { settings: s, slides } = useSite()
  const [current, setCurrent] = useState(0)

  const images = slides.length > 0 ? slides.map(sl => sl.image) : FALLBACK_IMAGES

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setCurrent(i => (i + 1) % images.length), 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section className="sb-hero">
      <div
        className="sb-hero-bg"
        style={{ backgroundImage: `url(${images[current]})` }}
      />
      <div className="sb-hero-overlay" />

      <div className="wd-container w-100 position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="sb-hero-badge">
              <span className="sb-hero-dot" />
              {s.hero_badge || 'Spa & Làm đẹp cao cấp'}
            </div>
            <h1 className="sb-hero-title">
              {s.hero_title1 || 'Không gian'}<br />
              của <em>{s.hero_title2 || 'thư giãn'}</em><br />
              {s.hero_title3 || '& làm đẹp.'}
            </h1>
            <p className="sb-hero-sub">
              {s.hero_sub || 'Mỗi lần đến với chúng tôi là một hành trình chăm sóc toàn diện — từ tâm hồn đến vẻ ngoài.'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/dat-lich" className="sb-btn-accent">{s.hero_cta_primary || 'Đặt lịch ngay'} →</Link>
              <Link to="/dich-vu" className="sb-btn-ghost" style={{ color: 'rgba(255,255,255,.6)', borderColor: 'rgba(255,255,255,.2)', background: 'transparent' }}>
                {s.hero_cta_secondary || 'Xem dịch vụ'}
              </Link>
            </div>
            <div className="sb-hero-trust">
              <div className="sb-trust-item"><span className="sb-trust-dot" />{s.stat_customers || '500+'} khách hàng tin tưởng</div>
              <div className="sb-trust-item"><span className="sb-trust-dot" />{s.stat_years || '5'} năm kinh nghiệm</div>
              <div className="sb-trust-item"><span className="sb-trust-dot" />Đội ngũ chuyên nghiệp</div>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block">
            <div className="sb-gallery-strip">
              {GALLERY_FALLBACK.map((img, i) => (
                <div key={i} className="sb-gs-item" style={i === 1 ? { marginTop: 24 } : {}}>
                  <img src={img} alt={`Spa ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8, height: 8, borderRadius: 4,
                background: i === current ? '#fff' : 'rgba(255,255,255,.3)',
                border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
