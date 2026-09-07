import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'
import { renderEmphasis } from '../utils/renderEmphasis'

// subtitle format: "tag||desc||ghostBtnText||ghostBtnLink" — button_text/button_link (core columns)
// dùng cho nút PRIMARY. Xem Database.php::seedHeroSlides() comment.
function parseSlide(slide: HeroSlide) {
  const parts = (slide.subtitle || '').split('||')
  return {
    tag: parts[0] || '',
    desc: parts[1] || '',
    ghostText: parts[2] || '',
    ghostLink: parts[3] || '/',
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
    <section className="bmb-hero" id="bmbHero">
      {slides.map((slide, i) => {
        const { tag, desc, ghostText, ghostLink } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        return (
          <div className={`bmb-hero-slide s${(i % 4) + 1}${i === active ? ' active' : ''}`} key={slide.id} data-slide={i}>
            {slide.image && (
              <div className="bmb-hero-blob">
                <img src={slide.image} alt={slide.title.replace(/\*/g, '')} loading="lazy" />
              </div>
            )}
            <div className="bmb-hero-inner">
              {tag && <span className="bmb-hero-tag">{tag}</span>}
              <HeadingTag className="bmb-hero-title">{renderEmphasis(slide.title)}</HeadingTag>
              {desc && <p className="bmb-hero-sub">{desc}</p>}
              <div className="bmb-hero-cta">
                {slide.button_text && (
                  <Link to={slide.button_link || '/'} className="bmb-btn bmb-btn-primary">{slide.button_text}</Link>
                )}
                {ghostText && (
                  <Link to={ghostLink} className="bmb-btn bmb-btn-ghost">{ghostText}</Link>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {slides.length > 1 && (
        <div className="bmb-hero-nav">
          <button className="bmb-hero-arrow" onClick={() => go(active - 1)} aria-label="Slide trước">‹</button>
          <div className="bmb-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={i === active ? 'active' : ''} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <button className="bmb-hero-arrow" onClick={() => go(active + 1)} aria-label="Slide sau">›</button>
        </div>
      )}
    </section>
  )
}
