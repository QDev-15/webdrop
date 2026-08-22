import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'
import { renderTitle } from '../utils/text'

// Nút phụ (ghost, luôn là link nội bộ cố định) — hardcode theo index slide, đúng thiết kế gốc.
// Nút chính (accent) lấy từ DB (button_text/button_link) để admin có thể chỉnh sửa.
const SECONDARY_BUTTONS = [
  { text: 'Liên hệ hợp tác', link: '/lien-he' },
  { text: 'Xem dịch vụ', link: '/dich-vu' },
  { text: 'Xem dịch vụ', link: '/dich-vu' },
  { text: 'Liên hệ hợp tác', link: '/lien-he' },
]

// Cặp màu blob trang trí luân phiên theo từng slide (FREE — chi tiết trang trí, không phải hành vi khóa cứng).
const BLOB_PAIRS = [
  { a: 'var(--accent)', b: 'var(--teal)' },
  { a: 'var(--gold)', b: 'var(--accent)' },
  { a: 'var(--teal)', b: 'var(--gold)' },
  { a: 'var(--accent)', b: 'var(--teal)' },
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
    <section className="pux-hero" id="heroCarousel">
      {slides.map((slide, i) => {
        const { label, desc } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        const secondary = SECONDARY_BUTTONS[i % SECONDARY_BUTTONS.length]
        const blobs = BLOB_PAIRS[i % BLOB_PAIRS.length]
        return (
          <div className={`pux-hero-slide${i === active ? ' active' : ''}`} key={slide.id} data-slide={i}>
            <div className="pux-hero-left" style={{ background: 'var(--gradient-dark)' }}>
              <span className="blob blob-a" style={{ background: blobs.a }}></span>
              <span className="blob blob-b" style={{ background: blobs.b }}></span>
              {label && <div className="pux-hero-label">{label}</div>}
              <HeadingTag className="pux-hero-heading">{renderTitle(slide.title)}</HeadingTag>
              {desc && <p className="pux-hero-sub">{desc}</p>}
              <div className="pux-hero-actions">
                <Link to={slide.button_link || '/du-an'} className="pux-btn pux-btn-accent">
                  {slide.button_text || 'Xem dự án'} →
                </Link>
                <Link to={secondary.link} className="pux-btn pux-btn-glass">{secondary.text}</Link>
              </div>
            </div>
            <div className="pux-hero-right">
              {slide.image && (
                <img src={slide.image} alt={(slide.title || '').replace(/\*/g, '')} loading={i === 0 ? 'eager' : 'lazy'} />
              )}
            </div>
          </div>
        )
      })}

      {slides.length > 1 && (
        <div className="pux-hero-nav">
          <button className="pux-hero-arrow" onClick={() => go(active - 1)} aria-label="Slide trước">‹</button>
          <div className="pux-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={`pux-hero-dot${i === active ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <button className="pux-hero-arrow" onClick={() => go(active + 1)} aria-label="Slide kế tiếp">›</button>
        </div>
      )}
      <div className="pux-hero-scroll">Cuộn xuống</div>
    </section>
  )
}
