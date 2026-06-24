import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import type { HeroSlide } from '../contexts/SiteContext'

const FALLBACK: HeroSlide[] = [
  {
    id: 1,
    title: 'Da khỏe mạnh từ bên trong',
    subtitle: 'Phòng khám da liễu chuyên sâu — công nghệ hiện đại, phác đồ cá nhân hóa cho từng bệnh nhân.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=80&auto=format&fit=crop',
    badge_text: '98% bệnh nhân hài lòng',
    btn_label: 'Đặt lịch tư vấn miễn phí',
    btn_url: '/dat-lich',
    sort_order: 1,
  },
]

export default function HeroSlider() {
  const { slides, settings } = useSite()
  const displaySlides = slides.length > 0 ? slides : FALLBACK
  const [active, setActive] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const badgePercent = settings['hero_badge_percent'] || '98%'
  const badgeLabel = settings['hero_badge_label'] || 'Tỷ lệ hài lòng của bệnh nhân'

  function startTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (displaySlides.length > 1) {
      intervalRef.current = window.setInterval(() => {
        setActive(a => (a + 1) % displaySlides.length)
      }, 6000)
    }
  }

  useEffect(() => {
    startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [displaySlides.length])

  const slide = displaySlides[active] ?? displaySlides[0]

  return (
    <section className="csd-hero">
      <div className="wd-container">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <div className="csd-hero-label">
              <div className="csd-hero-dot" />
              {slide.badge_text || 'Phòng khám da liễu chuyên sâu'}
            </div>
            <h1 className="csd-hero-h1"
              dangerouslySetInnerHTML={{ __html: slide.title.replace(/\n/g, '<br/>') }}
            />
            <p className="csd-hero-p">{slide.subtitle}</p>
            <div className="d-flex gap-3 flex-wrap">
              <Link to={slide.btn_url || '/dat-lich'} className="csd-btn-accent">{slide.btn_label || 'Đặt lịch ngay'}</Link>
              <Link to="/dich-vu" className="csd-btn-ghost">Xem dịch vụ</Link>
            </div>
            <div className="csd-hero-trust">
              <div className="csd-ht-item">
                <div className="csd-ht-icon">🔬</div>
                <span>Công nghệ laser hiện đại</span>
              </div>
              <div className="csd-ht-item">
                <div className="csd-ht-icon">👨‍⚕️</div>
                <span>Bác sĩ da liễu chuyên sâu</span>
              </div>
              <div className="csd-ht-item">
                <div className="csd-ht-icon">✓</div>
                <span>Phác đồ cá nhân hóa</span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="csd-hero-image-wrap">
              <img
                src={slide.image || FALLBACK[0].image}
                alt={slide.title}
                className="csd-hero-main-img"
                loading="eager"
              />
              <div className="csd-hero-badge">
                <div className="csd-hero-badge-num">{badgePercent}</div>
                <div className="csd-hero-badge-label">{badgeLabel}</div>
              </div>
              <div className="csd-hero-badge2">
                <div className="csd-hero-badge2-text">Tư vấn miễn phí</div>
                <div className="csd-hero-badge2-sub">Không cam kết mua ngay</div>
              </div>
            </div>
            {displaySlides.length > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-3">
                {displaySlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActive(i); startTimer() }}
                    style={{
                      width: i === active ? 24 : 8, height: 8,
                      borderRadius: 4, border: 'none',
                      background: i === active ? 'var(--accent)' : 'var(--border)',
                      transition: 'all .3s', cursor: 'pointer', padding: 0,
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
