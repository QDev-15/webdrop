import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'

// 4 gradient nền cố định — khớp đúng thiết kế template (background trang trí, không phải nội dung)
const GRADIENTS = [
  'linear-gradient(135deg, #1c1f24 0%, #2a2410 55%, #14161a 100%)',
  'linear-gradient(135deg, #1c1f24 0%, #16232a 55%, #14161a 100%)',
  'linear-gradient(135deg, #1c1f24 0%, #241b0d 55%, #14161a 100%)',
  'linear-gradient(135deg, #1c1f24 0%, #1a2420 55%, #14161a 100%)',
]

// Render *từ* -> in nghiêng màu accent (dùng cho slide 1 "Cập nhật *công nghệ* mỗi ngày")
function renderTitle(title: string) {
  const parts = title.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return <span key={i}>{part}</span>
  })
}

// subtitle format: "label||mô tả||nhãn ảnh||chữ nút chính||link nút chính"
function parseSlide(slide: HeroSlide) {
  const parts = (slide.subtitle || '').split('||')
  return {
    label: parts[0] || '',
    desc: parts[1] || '',
    mediaTag: parts[2] || '',
    primaryText: parts[3] || 'Đọc bài mới nhất',
    primaryLink: parts[4] || '/chuyen-muc',
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
    <section className="bcn-hero">
      {slides.map((slide, i) => {
        const { label, desc, mediaTag, primaryText, primaryLink } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        return (
          <div className={`bcn-hero-slide${i === active ? ' bcn-active' : ''}`} key={slide.id}>
            <div className="bcn-hero-bg" style={{ ['--bcn-grad' as string]: GRADIENTS[i % GRADIENTS.length] }}></div>
            <div className="bcn-hero-grid"></div>
            <div className="bcn-hero-inner">
              <div className="bcn-hero-grid-row">
                <div className="bcn-hero-text">
                  {label && <div className="bcn-hero-label">{label}</div>}
                  <HeadingTag className="bcn-hero-title">{renderTitle(slide.title)}</HeadingTag>
                  {desc && <p className="bcn-hero-sub">{desc}</p>}
                  <div className="bcn-hero-cta">
                    <Link to={primaryLink} className="bcn-btn bcn-btn-accent">{primaryText}</Link>
                    {slide.button_text && (
                      <Link to={slide.button_link || '/'} className="bcn-btn bcn-btn-outline-light">{slide.button_text}</Link>
                    )}
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <div className="bcn-hero-frame" aria-hidden="true"></div>
                  {slide.image && (
                    <div className="bcn-hero-media">
                      {mediaTag && <span className="bcn-hero-media-tag">{mediaTag}</span>}
                      <img src={slide.image} alt={slide.title.replace(/\*/g, '')} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {slides.length > 1 && (
        <div className="bcn-hero-nav">
          <div className="bcn-hero-nav-inner">
            <div className="bcn-hero-dots">
              {slides.map((s, i) => (
                <button key={s.id} className={`bcn-hero-dot${i === active ? ' bcn-active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}></button>
              ))}
            </div>
            <div className="bcn-hero-arrows">
              <button className="bcn-hero-arrow bcn-hero-prev" onClick={() => go(active - 1)} aria-label="Slide trước">
                <i className="bi bi-arrow-left"></i>
              </button>
              <button className="bcn-hero-arrow bcn-hero-next" onClick={() => go(active + 1)} aria-label="Slide tiếp">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
