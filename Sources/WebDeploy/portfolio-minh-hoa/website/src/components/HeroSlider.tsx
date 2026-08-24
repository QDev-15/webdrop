import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'

// Render tiêu đề có cú pháp *từ* -> in nghiêng màu accent
function renderTitle(title: string) {
  const parts = title.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return <span key={i}>{part}</span>
  })
}

// subtitle format: "tag||desc||primaryBtnText||primaryBtnLink"
function parseSlide(slide: HeroSlide) {
  const parts = (slide.subtitle || '').split('||')
  return {
    tag: parts[0] || '',
    desc: parts[1] || '',
    primaryText: parts[2] || 'Xem dự án',
    primaryLink: parts[3] || '/du-an',
  }
}

export default function HeroSlider() {
  const { slides } = useSite()
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  function go(n: number) {
    setActive(((n % slides.length) + slides.length) % slides.length)
    restart()
  }

  return (
    <section className="pmh-carousel-hero" id="pmhHero">
      {slides.map((slide, i) => {
        const { tag, desc, primaryText, primaryLink } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        return (
          <div className={`pmh-carousel-slide s${(i % 4) + 1}${i === active ? ' active' : ''}`} key={slide.id}>
            <div className="pmh-slide-inner">
              <div className="pmh-slide-content">
                {tag && <span className="pmh-slide-tag">{tag}</span>}
                <HeadingTag className="pmh-slide-title">{renderTitle(slide.title)}</HeadingTag>
                {desc && <p className="pmh-slide-sub">{desc}</p>}
                <div className="pmh-slide-cta">
                  <Link to={primaryLink} className="pmh-btn pmh-btn-primary">{primaryText}</Link>
                  {slide.button_text && (
                    <Link to={slide.button_link || '/lien-he'} className="pmh-btn pmh-btn-ghost-dark">{slide.button_text}</Link>
                  )}
                </div>
              </div>
            </div>
            {slide.image && (
              <div className="pmh-slide-visual">
                <div className="pmh-tape"></div>
                <img src={slide.image} alt={slide.title.replace(/\*/g, '')} loading="lazy" />
              </div>
            )}
          </div>
        )
      })}

      {slides.length > 1 && (
        <div className="pmh-carousel-nav">
          <button className="pmh-carousel-arrow" onClick={() => go(active - 1)} aria-label="Slide trước">&#8249;</button>
          <div className="pmh-carousel-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={i === active ? 'active' : ''} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <button className="pmh-carousel-arrow" onClick={() => go(active + 1)} aria-label="Slide sau">&#8250;</button>
        </div>
      )}
    </section>
  )
}
