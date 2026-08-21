import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'

// Render tiêu đề có cú pháp *từ* -> in nghiêng màu accent (xem quy ước encode trong Database.php)
function renderTitle(title: string) {
  const parts = title.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return <span key={i}>{part}</span>
  })
}

function parseSlide(slide: HeroSlide) {
  const [label, ...rest] = (slide.subtitle || '').split('||')
  const desc = rest.join('||')
  const images = (slide.image || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  return { label, desc, images }
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
    <section className="pna-hero" aria-label="Ảnh nổi bật">
      {slides.map((slide, i) => {
        const { label, desc, images } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        return (
          <div className={`pna-hero-slide${i === active ? ' active' : ''}`} key={slide.id}>
            <div className="wd-container">
              <div className="pna-hero-slide-inner">
                <div className="pna-hero-text">
                  {label && <div className="pna-hero-label">{label}</div>}
                  <HeadingTag className="pna-hero-title">{renderTitle(slide.title)}</HeadingTag>
                  {desc && <p className="pna-hero-sub">{desc}</p>}
                  <div className="pna-hero-cta-row">
                    <Link to="/du-an" className="pna-btn pna-btn-accent">Xem dự án</Link>
                    {slide.button_text && (
                      <Link to={slide.button_link || '/lien-he'} className="pna-btn pna-btn-outline-light">{slide.button_text}</Link>
                    )}
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="pna-hero-grid">
                    {images.slice(0, 5).map((img, idx) => (
                      <Link to="/du-an" key={idx}>
                        <img src={img} alt={`${slide.title.replace(/\*/g, '')} — ảnh ${idx + 1}`} loading="lazy" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {slides.length > 1 && (
        <>
          <button className="pna-hero-nav-btn pna-hero-prev" onClick={() => go(active - 1)} aria-label="Slide trước">&#8249;</button>
          <button className="pna-hero-nav-btn pna-hero-next" onClick={() => go(active + 1)} aria-label="Slide sau">&#8250;</button>
          <div className="pna-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={`pna-hero-dot${i === active ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
