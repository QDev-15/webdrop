import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import type { HeroSlide } from '../contexts/SiteContext'

const FALLBACK: HeroSlide[] = [
  {
    id: 1,
    title: 'Biến đổi <em>Doanh nghiệp</em> bằng AI',
    subtitle: 'Công nghệ Digital Tiên tiến\nAI-powered solutions giúp tối ưu hóa quy trình, tăng tốc độ ra quyết định, và unlock revenue streams mới.',
    image: 'https://images.unsplash.com/photo-1535224206399-a3fc77abdee2?w=1200&h=800&fit=crop',
    button_text: 'Yêu cầu demo',
    button_link: '/lien-he',
    sort_order: 1,
  },
]

const AUTOPLAY_MS = 5000

// Tách subtitle thành [nhãn nhỏ phía trên tiêu đề, đoạn mô tả] — dòng đầu tiên là nhãn (di-carousel-label)
function splitSubtitle(subtitle: string): [string, string] {
  const idx = subtitle.indexOf('\n')
  if (idx === -1) return ['', subtitle]
  return [subtitle.slice(0, idx), subtitle.slice(idx + 1)]
}

export default function HeroSlider() {
  const { slides } = useSite()
  const displaySlides = slides.length > 0 ? slides : FALLBACK
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<number | null>(null)

  function goTo(n: number) {
    setCurrent(((n % displaySlides.length) + displaySlides.length) % displaySlides.length)
    resetTimer()
  }

  function resetTimer() {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setCurrent(c => (c + 1) % displaySlides.length)
    }, AUTOPLAY_MS)
  }

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, displaySlides.length])

  return (
    <section className="di-carousel-hero">
      <div className="di-carousel-inner">
        {displaySlides.map((slide, i) => {
          const [label, desc] = splitSubtitle(slide.subtitle || '')
          return (
            <div key={slide.id} className={`di-carousel-slide${i === current ? ' active' : ''}`}>
              <div className="di-carousel-bg" style={{ backgroundImage: `url('${slide.image}')` }} />
              <div className="wd-container">
                <div className="di-carousel-content">
                  {label && <div className="di-carousel-label">{label}</div>}
                  <h1 className="di-carousel-title" dangerouslySetInnerHTML={{ __html: slide.title }} />
                  {desc && <p className="di-carousel-sub">{desc}</p>}
                  <div className="di-carousel-cta">
                    <Link to={slide.button_link || '/lien-he'} className="btn-di-primary">{slide.button_text || 'Yêu cầu demo'}</Link>
                    <Link to="/ve-chung-toi" className="btn-di-secondary">Tìm hiểu thêm</Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {displaySlides.length > 1 && (
        <>
          <button className="di-carousel-btn di-carousel-prev" aria-label="Previous slide" onClick={() => goTo(current - 1)}>❮</button>
          <button className="di-carousel-btn di-carousel-next" aria-label="Next slide" onClick={() => goTo(current + 1)}>❯</button>

          <div className="di-carousel-indicators">
            {displaySlides.map((s, i) => (
              <button
                key={s.id}
                className={`di-carousel-dot${i === current ? ' active' : ''}`}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
