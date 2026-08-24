import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'
import { renderTitle } from '../utils/text'

// Nút phụ (ghost, luôn là link nội bộ cố định) — hardcode theo index slide, đúng thiết kế gốc.
// Nút chính (accent) lấy từ DB (button_text/button_link) để admin có thể chỉnh sửa.
const SECONDARY_BUTTONS = [
  { text: 'Đặt lịch tư vấn', link: '/lien-he' },
  { text: 'Xem dịch vụ', link: '/dich-vu' },
  { text: 'Về studio', link: '/ve-toi' },
  { text: 'Liên hệ ngay', link: '/lien-he' },
]

function parseSlide(slide: HeroSlide) {
  const [label, ...rest] = (slide.subtitle || '').split('||')
  const desc = rest.join('||')
  return { label, desc }
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
    <section className="pkt-hero">
      {slides.map((slide, i) => {
        const { label, desc } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        const secondary = SECONDARY_BUTTONS[i % SECONDARY_BUTTONS.length]
        return (
          <div className={`pkt-hero-slide${i === active ? ' active' : ''}`} key={slide.id}>
            <div className="pkt-hero-inner">
              {label && <div className="pkt-hero-label">{label}</div>}
              <HeadingTag className="pkt-hero-title">{renderTitle(slide.title)}</HeadingTag>
              {desc && <p className="pkt-hero-sub">{desc}</p>}
              <div className="pkt-hero-actions">
                <Link to={slide.button_link || '/du-an'} className="pkt-btn pkt-btn-accent">
                  {slide.button_text || 'Xem dự án'}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
                <Link to={secondary.link} className="pkt-btn">{secondary.text}</Link>
              </div>
              {slide.image && (
                <div className="pkt-hero-img-wrap">
                  <img className="pkt-hero-img" src={slide.image} alt={(slide.title || '').replace(/\*/g, '')} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              )}
            </div>
          </div>
        )
      })}

      {slides.length > 1 && (
        <>
          <button className="pkt-hero-nav-btn pkt-hero-prev" onClick={() => go(active - 1)} aria-label="Slide trước">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button className="pkt-hero-nav-btn pkt-hero-next" onClick={() => go(active + 1)} aria-label="Slide sau">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <div className="pkt-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={`pkt-hero-dot${i === active ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
