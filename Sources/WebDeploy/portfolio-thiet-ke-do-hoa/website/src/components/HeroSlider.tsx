import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'
import { renderTitle } from '../utils/text'

// Nút phụ (ghost trắng, luôn là link nội bộ cố định) — hardcode theo index slide, đúng thiết kế gốc.
// Nút chính (đỏ, ptk-btn-red) lấy từ DB (button_text/button_link) để admin có thể chỉnh sửa.
const SECONDARY_BUTTONS = [
  { text: 'Về tôi', link: '/ve-toi' },
  { text: 'Xem dịch vụ', link: '/dich-vu' },
  { text: 'Liên hệ', link: '/lien-he' },
  { text: 'Hành trình của tôi', link: '/ve-toi' },
]

function parseSlide(slide: HeroSlide) {
  const [tone, label, desc] = (slide.subtitle || '').split('||')
  return { tone: tone || 'red', label: label || '', desc: desc || '' }
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
    <section className="ptk-hero" id="heroCarousel">
      {slides.map((slide, i) => {
        const { tone, label, desc } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        const secondary = SECONDARY_BUTTONS[i % SECONDARY_BUTTONS.length]
        return (
          <div className={`ptk-hero-slide${i === active ? ' active' : ''}`} data-tone={tone} key={slide.id}>
            <div className="ptk-hero-inner ptk-container">
              <div className="ptk-hero-num">{String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
              {label && <div className="ptk-hero-label"><span className="ptk-hero-swatch"></span> {label}</div>}
              <HeadingTag className="ptk-hero-h">{renderTitle(slide.title)}</HeadingTag>
              {desc && <p className="ptk-hero-p">{desc}</p>}
              <div className="ptk-hero-ctas">
                <Link to={slide.button_link || '/du-an'} className="ptk-btn ptk-btn-red">{slide.button_text || 'Xem dự án'}</Link>
                <Link to={secondary.link} className="ptk-btn ptk-btn-white">{secondary.text}</Link>
              </div>
            </div>
          </div>
        )
      })}

      {slides.length > 1 && (
        <>
          <div className="ptk-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={`ptk-hero-dot${i === active ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <div className="ptk-hero-nav">
            <button className="ptk-hero-arrow" onClick={() => go(active - 1)} aria-label="Slide trước">‹</button>
            <button className="ptk-hero-arrow" onClick={() => go(active + 1)} aria-label="Slide sau">›</button>
          </div>
        </>
      )}
    </section>
  )
}
