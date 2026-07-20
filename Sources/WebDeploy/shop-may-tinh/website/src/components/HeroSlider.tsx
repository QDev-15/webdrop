import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { settings, heroSlides } = useSite()
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const slides = heroSlides.length > 0 ? heroSlides : []

  useEffect(() => {
    if (slides.length < 2) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [slides.length])

  const jumpTo = (i: number) => {
    setIndex(i)
    if (timerRef.current) clearInterval(timerRef.current)
    if (slides.length > 1) {
      timerRef.current = setInterval(() => setIndex(x => (x + 1) % slides.length), 5000)
    }
  }

  const val = (k: string, fallback = '') => settings[k] || fallback

  return (
    <section className="mt-hero" aria-label="Hero" aria-roledescription="carousel">
      <div className="mt-hero-slides">
        {slides.map((s, i) => (
          <div key={s.id} className={'mt-hero-slide' + (i === index ? ' active' : '')}>
            <img src={s.image} alt={s.title} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      <div className="mt-hero-overlay" />
      <div className="mt-container mt-hero-content">
        <div className="mt-hero-badge" data-reveal>
          <i className="bi bi-lightning-charge-fill" />
          {val('hero_badge', 'Ưu đãi tháng này — Giảm đến 20%')}
        </div>
        <h1 className="mt-hero-title" data-reveal data-delay="1">
          {val('hero_title_pre', 'Dàn máy')} <strong>{val('hero_title_strong', 'hiệu năng đỉnh cao')}</strong><br />
          {val('hero_title_post', 'cho công việc & giải trí')}
        </h1>
        <p className="mt-hero-desc" data-reveal data-delay="2">
          {val('hero_desc', 'Laptop, PC gaming và linh kiện chính hãng — tư vấn cấu hình miễn phí, bảo hành tận tâm trên toàn quốc.')}
        </p>
        <div className="mt-hero-actions" data-reveal data-delay="3">
          <Link to="/san-pham" className="mt-btn mt-btn-primary">
            <i className="bi bi-cpu" /> Khám phá sản phẩm
          </Link>
          <Link to="/lien-he" className="mt-btn mt-btn-glass">Tư vấn cấu hình</Link>
        </div>
        <div className="mt-hero-trust" data-reveal data-delay="4">
          <div className="mt-hero-trust-item"><i className="bi bi-patch-check-fill" /> {val('hero_trust1', 'Bảo hành chính hãng 24 tháng')}</div>
          <div className="mt-hero-trust-item"><i className="bi bi-credit-card-2-front" /> {val('hero_trust2', 'Trả góp 0% lãi suất')}</div>
          <div className="mt-hero-trust-item"><i className="bi bi-truck" /> {val('hero_trust3', 'Giao hàng toàn quốc')}</div>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="mt-hero-dots" role="group" aria-label="Chọn hình ảnh slide">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={'mt-hero-dot' + (i === index ? ' active' : '')}
              aria-label={`Slide ${i + 1}`}
              aria-selected={i === index}
              onClick={() => jumpTo(i)}
            />
          ))}
        </div>
      )}
      <div className="mt-hero-scroll-hint" aria-hidden="true"><i className="bi bi-mouse" /></div>
    </section>
  )
}
