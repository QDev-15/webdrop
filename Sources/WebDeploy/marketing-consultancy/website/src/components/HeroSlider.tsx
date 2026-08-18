import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import type { HeroSlide } from '../contexts/SiteContext'

const FALLBACK: HeroSlide[] = [
  {
    id: 1,
    title: 'Phát triển thương hiệu với <em>chiến lược Marketing</em> thông minh',
    subtitle: 'Tư vấn Marketing Toàn Diện\nChúng tôi giúp doanh nghiệp hiểu rõ khách hàng, xây dựng chiến lược marketing mạnh mẽ và đạt được tăng trưởng bền vững.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    button_text: 'Bắt đầu tư vấn',
    button_link: '/lien-he',
    sort_order: 1,
  },
]

const AUTOPLAY_MS = 5000

// Tách subtitle thành [nhãn nhỏ phía trên tiêu đề, đoạn mô tả] — dòng đầu tiên là nhãn (mc-carousel-label)
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
    <section className="mc-carousel-hero">
      <div className="mc-carousel-inner">
        {displaySlides.map((slide, i) => {
          const [label, desc] = splitSubtitle(slide.subtitle || '')
          return (
            <div key={slide.id} className={`mc-carousel-slide${i === current ? ' active' : ''}`}>
              <div className="mc-carousel-bg" style={{ backgroundImage: `url('${slide.image}')` }} />
              <div className="wd-container">
                <div className="mc-carousel-content">
                  {label && <div className="mc-carousel-label">{label}</div>}
                  <h1 className="mc-carousel-title" dangerouslySetInnerHTML={{ __html: slide.title }} />
                  {desc && <p className="mc-carousel-sub">{desc}</p>}
                  <div className="mc-carousel-cta">
                    <Link to={slide.button_link || '/lien-he'} className="btn-mc-primary">{slide.button_text || 'Bắt đầu tư vấn'}</Link>
                    <Link to="/ve-chung-toi" className="btn-mc-secondary">Tìm hiểu thêm</Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {displaySlides.length > 1 && (
        <>
          <button className="mc-carousel-btn mc-carousel-prev" aria-label="Previous slide" onClick={() => goTo(current - 1)}>❮</button>
          <button className="mc-carousel-btn mc-carousel-next" aria-label="Next slide" onClick={() => goTo(current + 1)}>❯</button>

          <div className="mc-carousel-indicators">
            {displaySlides.map((s, i) => (
              <button
                key={s.id}
                className={`mc-carousel-dot${i === current ? ' active' : ''}`}
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
