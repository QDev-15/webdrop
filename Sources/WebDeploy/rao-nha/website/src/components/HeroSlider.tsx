import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'

function renderTitle(title: string) {
  const parts = title.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => (
    part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>
  ))
}

function parseSlide(slide: HeroSlide) {
  const [label, ...rest] = (slide.subtitle || '').split('||')
  const desc = rest.join('||')
  const images = (slide.image || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  return { label, desc, images }
}

export default function HeroSlider() {
  const { heroSlides } = useSite()
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive(i => (heroSlides.length ? (i + 1) % heroSlides.length : 0))
    }, 5000)
  }

  useEffect(() => {
    if (heroSlides.length <= 1) return
    restart()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSlides.length])

  if (heroSlides.length === 0) return null

  function go(n: number) {
    setActive(((n % heroSlides.length) + heroSlides.length) % heroSlides.length)
    restart()
  }

  return (
    <section className="rn-hero" id="heroCarousel">
      {heroSlides.map((slide, i) => {
        const { label, desc, images } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        return (
          <div className={'rn-hero-slide' + (i === active ? ' active' : '')} key={slide.id} data-slide={i}>
            <div className="rn-container rn-hero-slide-inner">
              <div>
                {label && <span className="rn-hero-label">{label}</span>}
                <HeadingTag className={i === 0 ? undefined : 'rn-hero-heading'}>{renderTitle(slide.title)}</HeadingTag>
                {desc && <p className="rn-hero-sub">{desc}</p>}
                <div className="rn-hero-ctas">
                  <Link to={slide.button_link || '/bat-dong-san'} className="btn-rn btn-rn-primary">{slide.button_text || 'Xem tất cả tin đăng'}</Link>
                  {i === 0 && <Link to="/dang-tin" className="btn-rn btn-rn-ghost">Đăng tin miễn phí</Link>}
                </div>
              </div>
              {images.length > 0 && (
                <div className="rn-hero-grid">
                  {images.slice(0, 3).map((img, idx) => (
                    <div key={idx}><img src={img} alt={`${slide.title.replace(/\*/g, '')} — ảnh ${idx + 1}`} loading="lazy" /></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
      <button className="rn-hero-nav rn-hero-prev" aria-label="Slide trước" onClick={() => go(active - 1)}>‹</button>
      <button className="rn-hero-nav rn-hero-next" aria-label="Slide sau" onClick={() => go(active + 1)}>›</button>
      <div className="rn-hero-dots">
        {heroSlides.map((s, i) => (
          <button key={s.id} className={'rn-hero-dot' + (i === active ? ' active' : '')} onClick={() => go(i)} />
        ))}
      </div>
    </section>
  )
}
