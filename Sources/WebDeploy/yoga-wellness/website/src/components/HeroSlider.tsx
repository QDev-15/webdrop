import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  button_text: string
  button_link: string
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Slide[]>('/public/hero-slides').then(data => {
      setSlides(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  if (loading || slides.length === 0) return <div className="yw-hero" style={{ minHeight: '480px' }}></div>

  const slide = slides[current]
  const isInternalLink = slide.button_link && (slide.button_link.startsWith('/') || slide.button_link.startsWith('dat-lich'))

  return (
    <div className="yw-hero" style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="yw-hero-overlay"></div>
      <div className="wd-container">
        <div className="yw-hero-content" data-reveal>
          <h1 className="yw-hero-title">{slide.title}</h1>
          {slide.subtitle && <p className="yw-hero-sub">{slide.subtitle}</p>}
          {slide.button_text && (isInternalLink ? (
            <a href={slide.button_link.startsWith('/') ? slide.button_link : '/' + slide.button_link} className="yw-btn">{slide.button_text}</a>
          ) : (
            <a href={slide.button_link} target="_blank" rel="noopener noreferrer" className="yw-btn">{slide.button_text}</a>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="yw-hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}></button>
          ))}
        </div>
      )}
    </div>
  )
}
