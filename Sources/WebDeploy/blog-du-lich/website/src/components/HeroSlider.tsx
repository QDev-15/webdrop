import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'

// Render tiêu đề có cú pháp *từ* -> in đậm không nghiêng màu accent
function renderTitle(title: string) {
  const parts = title.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={i}>{part.slice(1, -1)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

// subtitle format: "label||desc||primaryText||primaryLink||tone"
function parseSlide(slide: HeroSlide) {
  const parts = (slide.subtitle || '').split('||')
  return {
    label: parts[0] || '',
    desc: parts[1] || '',
    primaryText: parts[2] || 'Khám phá',
    primaryLink: parts[3] || '/chuyen-muc',
    tone: parts[4] || 'forest',
  }
}

export default function HeroSlider() {
  const { slides, settings } = useSite()
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const ticker = (settings.hero_ticker || '').split('|').filter(Boolean)

  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive(i => (slides.length ? (i + 1) % slides.length : 0))
    }, 5000)
  }

  useEffect(() => {
    if (slides.length <= 1) return
    restart()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length])

  if (slides.length === 0) return null

  function show(i: number) {
    setActive(((i % slides.length) + slides.length) % slides.length)
    restart()
  }

  return (
    <header className="bdl-hero">
      {slides.map((slide, i) => {
        const { label, desc, primaryText, primaryLink, tone } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        return (
          <div key={slide.id} className={`bdl-hero-slide${i === active ? ' active' : ''}`} data-tone={tone}>
            <div className="bdl-hero-inner bdl-container">
              <div className="bdl-hero-text">
                {label && <div className="bdl-hero-label">{label}</div>}
                <HeadingTag className="bdl-hero-title">{renderTitle(slide.title)}</HeadingTag>
                {desc && <p className="bdl-hero-sub">{desc}</p>}
                <div className="bdl-hero-cta-row">
                  <Link to={primaryLink} className="bdl-btn bdl-btn-accent">{primaryText}</Link>
                  {slide.button_text && (
                    <Link to={slide.button_link || '/lien-he'} className="bdl-btn bdl-btn-outline-light">{slide.button_text}</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {ticker.length > 0 && (
        <div className="bdl-hero-ticker" aria-hidden="true">
          <div className="bdl-hero-ticker-track">
            {[...ticker, ...ticker].map((t, i) => <span key={i}>✈ {t}</span>)}
          </div>
        </div>
      )}

      <div className="bdl-hero-scrollhint"><span>Cuộn xuống khám phá</span><span className="bdl-hero-scrollhint-arrow">↓</span></div>

      {slides.length > 1 && (
        <>
          <button className="bdl-hero-nav-btn bdl-hero-prev" onClick={() => show(active - 1)} aria-label="Slide trước">‹</button>
          <button className="bdl-hero-nav-btn bdl-hero-next" onClick={() => show(active + 1)} aria-label="Slide sau">›</button>
          <div className="bdl-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={`bdl-hero-dot${i === active ? ' active' : ''}`} onClick={() => show(i)} aria-label={`Slide ${i + 1}`}></button>
            ))}
          </div>
        </>
      )}
    </header>
  )
}
