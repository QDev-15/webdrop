import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import type { HeroSlide } from '../contexts/SiteContext'

const FALLBACK: HeroSlide[] = [
  {
    id: 1,
    title: 'Hướng dẫn doanh nghiệp <em>phát triển</em> bền vững',
    subtitle: 'Tư vấn Chiến lược\nChiến lược kinh doanh hiệu quả, dựa trên phân tích sâu sắc thị trường và năng lực nội bộ của bạn.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    button_text: 'Bắt đầu tư vấn',
    button_link: '/lien-he',
    sort_order: 1,
  },
]

const AUTOPLAY_MS = 5000

// Tách subtitle thành [nhãn nhỏ phía trên tiêu đề, đoạn mô tả] — dòng đầu tiên là nhãn (sc-carousel-label)
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
    <section className="sc-carousel-hero">
      <div className="sc-carousel-inner">
        {displaySlides.map((slide, i) => {
          const [label, desc] = splitSubtitle(slide.subtitle || '')
          return (
            <div key={slide.id} className={`sc-carousel-slide${i === current ? ' active' : ''}`}>
              <div className="sc-carousel-bg" style={{ backgroundImage: `url('${slide.image}')` }} />
              <div className="wd-container">
                <div className="sc-carousel-content">
                  {label && <div className="sc-carousel-label">{label}</div>}
                  <h1 className="sc-carousel-title" dangerouslySetInnerHTML={{ __html: slide.title }} />
                  {desc && <p className="sc-carousel-sub">{desc}</p>}
                  <div className="sc-carousel-cta">
                    <Link to={slide.button_link || '/lien-he'} className="btn-sc">{slide.button_text || 'Tư vấn ngay'}</Link>
                    <Link to="/ve-chung-toi" className="btn-sc" style={{ background: 'transparent', color: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.2)' }}>Tìm hiểu thêm</Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {displaySlides.length > 1 && (
        <>
          <button className="sc-carousel-btn sc-carousel-prev" aria-label="Previous slide" onClick={() => goTo(current - 1)}>❮</button>
          <button className="sc-carousel-btn sc-carousel-next" aria-label="Next slide" onClick={() => goTo(current + 1)}>❯</button>

          <div className="sc-carousel-indicators">
            {displaySlides.map((s, i) => (
              <button
                key={s.id}
                className={`sc-carousel-dot${i === current ? ' active' : ''}`}
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
