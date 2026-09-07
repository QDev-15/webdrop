import { useCallback, useEffect, useRef, useState } from 'react'
import { useSite } from '../App'

const FALLBACK_SLIDES = [
  {
    id: 0,
    title: 'Nơi trang sách gặp tách cà phê',
    subtitle: 'Một góc nhỏ giữa thành phố ồn ào — nơi bạn có thể ngồi lại, đọc hết một chương sách và uống cạn một tách trà mà không ai giục giã.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80&auto=format&fit=crop',
    button_text: 'Xem thực đơn',
    button_link: '/menu',
  },
]

export default function HeroSlider() {
  const { slides, loading } = useSite()
  const items = slides.length > 0 ? slides : FALLBACK_SLIDES
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((i: number) => {
    setCurrent(((i % items.length) + items.length) % items.length)
  }, [items.length])

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % items.length)
    }, 5000)
  }, [items.length])

  useEffect(() => {
    restart()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [restart])

  if (loading) {
    return (
      <section className="csa-hero" id="csaHero">
        <div className="csa-hero-slide active">
          <div className="csa-hero-inner">
            <div className="csa-hero-img-wrap">
              <span className="csa-hero-bookmark" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="csa-hero" id="csaHero">
      {items.map((slide, i) => {
        const isFirst = i === 0
        const Heading = isFirst ? 'h1' : 'h2'
        return (
          <div className={`csa-hero-slide${i === current ? ' active' : ''}`} key={slide.id} data-slide={i}>
            <div className="csa-hero-inner">
              <div className="csa-hero-label">Cà phê sách yên tĩnh</div>
              <Heading className="csa-hero-title">{slide.title}</Heading>
              <p className="csa-hero-sub">{slide.subtitle}</p>
              <div className="csa-hero-actions">
                <a href={slide.button_link || '/menu'} className="csa-btn csa-btn-accent">{slide.button_text || 'Xem thực đơn'}</a>
                <a href="/khong-gian" className="csa-btn">Khám phá không gian</a>
              </div>
              <div className="csa-hero-img-wrap">
                <span className="csa-hero-bookmark" aria-hidden="true"></span>
                <img className="csa-hero-img" src={slide.image} alt={slide.title} loading={isFirst ? 'eager' : 'lazy'} />
              </div>
            </div>
          </div>
        )
      })}

      {items.length > 1 && (
        <>
          <button className="csa-hero-nav-btn csa-hero-prev" onClick={() => { goTo(current - 1); restart() }} aria-label="Slide trước">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <button className="csa-hero-nav-btn csa-hero-next" onClick={() => { goTo(current + 1); restart() }} aria-label="Slide tiếp theo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M9 6l6 6-6 6"/></svg>
          </button>
          <div className="csa-hero-dots">
            {items.map((slide, i) => (
              <button
                key={slide.id}
                className={`csa-hero-dot${i === current ? ' active' : ''}`}
                onClick={() => { goTo(i); restart() }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
