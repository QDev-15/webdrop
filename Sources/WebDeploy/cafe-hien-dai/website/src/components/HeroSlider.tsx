import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite, parseSlideSubtitle, renderAccentText } from '../contexts/SiteContext'

// bg_variant cycle theo vị trí — đúng 4 kiểu nền cố định của template (bg1/bg2/bg4 tối, bg3 sáng)
const BG_CLASSES = ['chd-slide-bg1', 'chd-slide-bg2', 'chd-slide-bg3', 'chd-slide-bg4']

export default function HeroSlider() {
  const { slides } = useSite()
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const count = slides.length

  function show(i: number) {
    setCurrent(((i % count) + count) % count)
  }

  function resetAuto() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % count), 5000)
  }

  useEffect(() => {
    if (count === 0) return
    resetAuto()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  if (count === 0) return null

  return (
    <section className="chd-carousel-hero">
      {slides.map((slide, i) => {
        const { label, description, secondaryText, secondaryLink } = parseSlideSubtitle(slide.subtitle)
        const bgClass = BG_CLASSES[i % BG_CLASSES.length]
        const isLight = bgClass === 'chd-slide-bg3'
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        return (
          <div key={slide.id} className={`chd-carousel-slide ${bgClass}${i === current ? ' chd-active' : ''}`}>
            <div className="chd-container">
              <div className="chd-slide-grid">
                <div className="chd-slide-text">
                  {label && <div className="chd-slide-label">{label}</div>}
                  <HeadingTag className="chd-slide-title">{renderAccentText(slide.title)}</HeadingTag>
                  {description && <p className="chd-slide-sub">{description}</p>}
                  <div className="chd-slide-actions">
                    {slide.button_text && (
                      <Link to={slide.button_link || '/'} className={`chd-btn ${isLight ? 'chd-btn-accent' : 'chd-btn-white'}`}>{slide.button_text}</Link>
                    )}
                    {secondaryText && (
                      <Link to={secondaryLink || '/'} className={`chd-btn ${isLight ? 'chd-btn-ghost' : 'chd-btn-outline-light'}`}>{secondaryText}</Link>
                    )}
                  </div>
                </div>
                <div className="chd-slide-visual">
                  {slide.image && <img src={slide.image} alt={slide.title.replace(/\*/g, '')} loading={i === 0 ? 'eager' : 'lazy'} />}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <button className="chd-hero-nav-btn chd-hero-prev" onClick={() => { show(current - 1); resetAuto() }} aria-label="Slide trước">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <button className="chd-hero-nav-btn chd-hero-next" onClick={() => { show(current + 1); resetAuto() }} aria-label="Slide sau">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6"/></svg>
      </button>
      <div className="chd-hero-dots">
        {slides.map((slide, i) => (
          <button key={slide.id} className={`chd-hero-dot${i === current ? ' chd-active' : ''}`} onClick={() => { show(i); resetAuto() }} aria-label={`Slide ${i + 1}`}></button>
        ))}
      </div>
    </section>
  )
}
