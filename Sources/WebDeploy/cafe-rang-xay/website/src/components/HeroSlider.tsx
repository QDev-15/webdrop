import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { HeroSlide } from '../contexts/SiteContext'

// Render tiêu đề: "\n" -> xuống dòng, "*từ*" -> in nghiêng màu accent (xem quy ước encode trong Database.php)
function renderTitle(title: string) {
  const lines = title.split('\n')
  return lines.map((line, li) => (
    <span key={li}>
      {line.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>
      )}
      {li < lines.length - 1 && <br />}
    </span>
  ))
}

// subtitle format: "label||desc||primaryText||primaryLink"
function parseSlide(slide: HeroSlide) {
  const parts = (slide.subtitle || '').split('||')
  const images = (slide.image || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  return {
    label: parts[0] || '',
    desc: parts[1] || '',
    primaryText: parts[2] || 'Xem thực đơn',
    primaryLink: parts[3] || '/thuc-don',
    images,
  }
}

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAutoplay = () => {
    stopAutoplay()
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
  }
  const stopAutoplay = () => { if (timerRef.current) clearInterval(timerRef.current) }

  useEffect(() => {
    startAutoplay()
    return stopAutoplay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length])

  if (slides.length === 0) return null

  function goTo(i: number) {
    setCurrent(((i % slides.length) + slides.length) % slides.length)
    startAutoplay()
  }

  return (
    <section className="crx-hero" id="crxHero" onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
      {slides.map((slide, i) => {
        const { label, desc, primaryText, primaryLink, images } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        return (
          <div className={`crx-hero-slide${i === current ? ' active' : ''}`} key={slide.id} data-slide={i}>
            <div className="crx-container w-100">
              <div className="crx-hero-slide-inner">
                <div className="crx-hero-text">
                  {label && <div className="crx-hero-label">{label}</div>}
                  <HeadingTag className="crx-hero-title">{renderTitle(slide.title)}</HeadingTag>
                  {desc && <p className="crx-hero-sub">{desc}</p>}
                  <div className="crx-hero-cta-row">
                    <Link to={primaryLink} className="crx-btn crx-btn-accent">{primaryText}</Link>
                    {slide.button_text && (
                      <Link to={slide.button_link || '/lien-he'} className="crx-btn crx-btn-outline-light">{slide.button_text}</Link>
                    )}
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="crx-hero-grid">
                    {images.slice(0, 4).map((img, idx) => (
                      <Link to={primaryLink} key={idx}>
                        <img src={img} alt={`${slide.title.replace(/\*/g, '').replace(/\n/g, ' ')} — ảnh ${idx + 1}`} loading="lazy" />
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
          <button className="crx-hero-nav-btn crx-hero-prev" onClick={() => goTo(current - 1)} aria-label="Slide trước">‹</button>
          <button className="crx-hero-nav-btn crx-hero-next" onClick={() => goTo(current + 1)} aria-label="Slide sau">›</button>
          <div className="crx-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={`crx-hero-dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
