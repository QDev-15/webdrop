import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { slides } = useSite()
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fallback slides if DB returns empty
  const displaySlides = slides.length > 0 ? slides : [{
    id: 1,
    title: 'Nha khoa AI — Chính xác đến từng chi tiết',
    subtitle: 'SmileTech tiên phong ứng dụng AI chẩn đoán, scan 3D intraoral và hồ sơ số hóa — nâng cao tiêu chuẩn điều trị nha khoa tại Việt Nam.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=80&auto=format&fit=crop',
    btn_text: 'Đặt lịch khám ngay',
    btn_url: '/dat-lich',
    sort_order: 1,
  }]

  const goTo = (idx: number) => setActive(idx)

  useEffect(() => {
    if (displaySlides.length <= 1) return
    timerRef.current = setInterval(() => setActive(a => (a + 1) % displaySlides.length), 6000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [displaySlides.length])

  const slide = displaySlides[active]

  return (
    <section className="st-hero">
      <div className="wd-container">
        <div className="st-hero-grid">
          {/* Text column */}
          <div className="st-hero-text" data-reveal>
            <div className="st-eyebrow" style={{ marginBottom: 22 }}>
              ✦ AI · Scan 3D · Số hóa
            </div>
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <div className="st-hero-actions">
              <Link to="/dat-lich" className="st-btn st-btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Đặt lịch khám ngay
              </Link>
              <Link to="/cong-nghe" className="st-btn st-btn-glass">
                Khám phá công nghệ
              </Link>
            </div>
            <div className="st-hero-trust">
              {[
                'AI chẩn đoán 99.2%',
                'Scan 3D không đau',
                'Hồ sơ số đám mây',
              ].map(t => (
                <div key={t} className="st-hero-trust-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Visual column */}
          <div className="st-hero-visual" data-reveal data-reveal-delay="1">
            <div className="st-hero-visual-frame">
              <img
                src={slide.image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=80&auto=format&fit=crop'}
                alt={slide.title}
                loading="eager"
              />
              <div className="st-hero-badge-float">
                <span className="dot" />
                Đang nhận đặt lịch
              </div>
              <div className="st-hero-glass-card">
                <div className="st-hgc-icon">
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <strong>12.500+ bệnh nhân tin tưởng</strong>
                  <span>Tỷ lệ hài lòng 98.7% · 8+ năm kinh nghiệm</span>
                </div>
              </div>
            </div>

            {/* Slide indicators */}
            {displaySlides.length > 1 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18 }}>
                {displaySlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    style={{
                      width: i === active ? 22 : 7,
                      height: 7,
                      borderRadius: 100,
                      border: 'none',
                      background: i === active ? 'var(--gradient-brand)' : 'var(--border)',
                      transition: 'all .3s ease',
                      cursor: 'pointer',
                      padding: 0,
                    }}
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
