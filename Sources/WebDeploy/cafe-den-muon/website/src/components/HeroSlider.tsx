import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { renderTitle } from '../utils/text'

// Nút phụ (ghost, luôn là link nội bộ cố định) — hardcode theo index slide, đúng thiết kế gốc.
// Nút chính (accent) lấy từ DB (button_text/button_link) để admin có thể chỉnh sửa.
const SECONDARY_BUTTONS = [
  { text: 'Khám phá không gian →', link: '/khong-gian' },
  { text: 'Đặt bàn riêng →',       link: '/lien-he' },
  { text: 'Giờ mở cửa & FAQ →',    link: '/gioi-thieu' },
  { text: 'Liên hệ đặt chỗ →',     link: '/lien-he' },
]

function parseSlide(slide: { subtitle: string }) {
  const [label, ...rest] = (slide.subtitle || '').split('||')
  return { label, desc: rest.join('||') }
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
    <section className="cdm-carousel-hero" id="carouselHero">
      {slides.map((slide, i) => {
        const { label, desc } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        const secondary = SECONDARY_BUTTONS[i % SECONDARY_BUTTONS.length]
        const bgVariant = (i % 4) + 1
        return (
          <div className={`cdm-carousel-slide${i === active ? ' active' : ''}`} key={slide.id} data-index={i}>
            <div className={`cdm-slide-bg cdm-slide-bg--${bgVariant}`}>
              <span className="cdm-split-a"></span><span className="cdm-split-b"></span>
              <span className="cdm-split-glow"></span><span className="cdm-noise-grid"></span>
            </div>
            <div className="cdm-container cdm-slide-content">
              {label && <div className="cdm-slide-label"><span className="dot-live"></span>{label}</div>}
              <HeadingTag className="cdm-slide-title">{renderTitle(slide.title)}</HeadingTag>
              {desc && <p className="cdm-slide-sub">{desc}</p>}
              <div className="cdm-slide-cta">
                <Link to={slide.button_link || '/thuc-don'} className="btn-accent">{slide.button_text || 'Xem thực đơn'}</Link>
                <Link to={secondary.link} className="btn-ghost">{secondary.text}</Link>
              </div>
            </div>
          </div>
        )
      })}

      <button className="cdm-car-arrow cdm-car-prev" onClick={() => go(active - 1)} aria-label="Slide trước">‹</button>
      <button className="cdm-car-arrow cdm-car-next" onClick={() => go(active + 1)} aria-label="Slide sau">›</button>
      <div className="cdm-car-dots">
        {slides.map((s, i) => (
          <button key={s.id} className={`cdm-car-dot${i === active ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  )
}
