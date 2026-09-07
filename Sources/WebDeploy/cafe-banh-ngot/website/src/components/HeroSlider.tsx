import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type HeroSlide } from '../contexts/SiteContext'
import { renderTitle, plainText } from '../utils/text'

// Nút phụ (ghost) — hardcode theo index slide, đúng thiết kế gốc (không có cột riêng
// trong hero_slides cho nút thứ 2). Nút chính (accent) lấy từ button_text/button_link để admin chỉnh sửa.
const SECONDARY_BUTTONS = [
  { text: 'Đặt bánh sinh nhật', link: '/lien-he' },
  { text: 'Đặt chỗ trước', link: '/lien-he' },
  { text: 'Đặt bàn nhóm', link: '/lien-he' },
  { text: 'Về Rosette', link: '/gioi-thieu' },
]

// Ảnh showcase 5 ô còn lại (6 ô/slide) — trang trí thuần tuý, giữ đúng ảnh gốc từ template
// (ô đầu tiên dùng slide.image từ DB để admin vẫn kiểm soát được ảnh chính của mỗi slide).
const SHOWCASE_EXTRA = [
  [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&q=80&auto=format&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541599468348-e96984315921?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517705008128-361805f42e07?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&q=80&auto=format&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80&auto=format&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&q=80&auto=format&fit=crop',
  ],
]

function parseSlide(slide: HeroSlide) {
  const [tag, ...rest] = (slide.subtitle || '').split('||')
  const desc = rest.join('||')
  return { tag, desc }
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
    <section className="cbn-carousel-hero" id="cbnHero">
      {slides.map((slide, i) => {
        const { tag, desc } = parseSlide(slide)
        const HeadingTag = i === 0 ? 'h1' : 'h2'
        const secondary = SECONDARY_BUTTONS[i % SECONDARY_BUTTONS.length]
        const showcase = [slide.image, ...SHOWCASE_EXTRA[i % SHOWCASE_EXTRA.length]].filter(Boolean)
        return (
          <div className={`cbn-carousel-slide s${(i % 4) + 1}${i === active ? ' active' : ''}`} key={slide.id} data-slide={i}>
            <div className="cbn-slide-inner">
              <div className="cbn-slide-text">
                {tag && <span className="cbn-slide-tag">{tag}</span>}
                <HeadingTag className="cbn-slide-title">{renderTitle(slide.title)}</HeadingTag>
                {desc && <p className="cbn-slide-sub">{desc}</p>}
                <div className="cbn-slide-cta">
                  <Link to={slide.button_link || '/menu'} className="cbn-btn-accent">{slide.button_text || 'Xem thực đơn'}</Link>
                  <Link to={secondary.link} className="cbn-btn-ghost">{secondary.text}</Link>
                </div>
              </div>
              <div className="cbn-slide-showcase">
                {showcase.map((img, si) => (
                  <div className="cbn-showcase-img" key={si}>
                    <img src={img} alt={plainText(slide.title)} loading={i === 0 && si === 0 ? 'eager' : 'lazy'} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {slides.length > 1 && (
        <div className="cbn-carousel-nav">
          <button className="cbn-carousel-arrow" onClick={() => go(active - 1)} aria-label="Slide trước">‹</button>
          <div className="cbn-carousel-dots">
            {slides.map((s, i) => (
              <button key={s.id} className={i === active ? 'active' : ''} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <button className="cbn-carousel-arrow" onClick={() => go(active + 1)} aria-label="Slide sau">›</button>
        </div>
      )}
    </section>
  )
}
