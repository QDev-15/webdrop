import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'
import { renderTitle } from '../utils/text'

// Nút phụ (outline) của mỗi slide hardcode theo vị trí — đúng nội dung gốc template
// (mỗi slide trong template có 1 nút phụ khác nhau, không lưu DB vì hero_slides core
// chỉ có 1 cặp button_text/button_link cho nút chính).
const SECONDARY_BUTTONS = [
  { text: 'Dùng công cụ tính toán', link: '/cong-cu-tinh-toan' },
  { text: 'Xem bài viết Ngân sách', link: '/chuyen-muc?cat=ngan-sach' },
  { text: 'Xem bài viết Tiết kiệm', link: '/chuyen-muc?cat=tiet-kiem' },
  { text: 'Tính lãi kép', link: '/cong-cu-tinh-toan' },
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
    <section className="btc-hero">
      {slides.map((slide, i) => {
        const { label, desc } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        const secondary = SECONDARY_BUTTONS[i % SECONDARY_BUTTONS.length]
        return (
          <div className={`btc-hero-slide${i === active ? ' active' : ''}`} key={slide.id}>
            <div className="btc-hero-left">
              {label && <span className="btc-hero-label">{label}</span>}
              <HeadingTag className="btc-hero-title">{renderTitle(slide.title)}</HeadingTag>
              {desc && <p className="btc-hero-desc">{desc}</p>}
              <div className="btc-hero-cta">
                <Link to={slide.button_link || '/chuyen-muc'} className="btc-btn btc-btn-primary">{slide.button_text || 'Khám phá bài viết'}</Link>
                <Link to={secondary.link} className="btc-btn btc-btn-outline">{secondary.text}</Link>
              </div>
            </div>
            <div className="btc-hero-right">
              {slide.image && <img src={slide.image} alt={(slide.title || '').replace(/\*/g, '')} loading={i === 0 ? 'eager' : 'lazy'} />}
            </div>
          </div>
        )
      })}

      {slides.length > 1 && (
        <>
          <button className="btc-hero-nav btc-hero-prev" onClick={() => go(active - 1)} aria-label="Slide trước">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className="btc-hero-nav btc-hero-next" onClick={() => go(active + 1)} aria-label="Slide tiếp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div className="btc-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={`btc-hero-dot${i === active ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}></button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
