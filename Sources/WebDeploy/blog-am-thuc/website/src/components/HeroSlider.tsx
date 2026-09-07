import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { renderEmphasisTitle, splitHeroSubtitle } from '../utils'

// Nút phụ (ghost) + tone gradient nền không lưu DB — hardcode theo index, đúng nội dung/link
// tương ứng từng slide trong template gốc (mỗi slide có 1 chủ đề khác nhau).
const GHOST_CTA = [
  { text: 'Khám phá chuyên mục', link: '/chuyen-muc' },
  { text: 'Xem chuyên mục Review', link: '/chuyen-muc?tab=review' },
  { text: 'Tất cả chuyên mục', link: '/chuyen-muc' },
  { text: 'Câu chuyện Bếp Xanh', link: '/ve-toi' },
]

export default function HeroSlider() {
  const { heroSlides, posts } = useSite()
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const galleryImages = posts.filter(p => p.image).map(p => ({
    src: p.image,
    alt: p.title,
    link: p.type === 'recipe' ? `/cong-thuc-nau-an/${p.slug}` : `/bai-viet/${p.slug}`,
  }))

  function restart() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (heroSlides.length ? (c + 1) % heroSlides.length : 0))
    }, 5000)
  }

  useEffect(() => {
    if (heroSlides.length < 2) return
    restart()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSlides.length])

  if (heroSlides.length === 0) return null

  function goTo(i: number) {
    setCurrent((i + heroSlides.length) % heroSlides.length)
    restart()
  }

  return (
    <section className="bam-hero">
      {heroSlides.map((slide, i) => {
        const { label, desc } = splitHeroSubtitle(slide.subtitle)
        const ghost = GHOST_CTA[i % GHOST_CTA.length]
        const tone = (i % 4) + 1
        // 5 ảnh phụ lấy từ nội dung thật (bài viết/công thức gần đây) — xoay vòng theo index slide
        const offset = (i * 3) % Math.max(galleryImages.length, 1)
        const secondary = galleryImages.length
          ? Array.from({ length: 5 }, (_, k) => galleryImages[(offset + k) % galleryImages.length])
          : []

        return (
          <div key={slide.id} className={'bam-hero-slide' + (i === current ? ' active' : '')} data-tone={tone}>
            <div className="bam-hero-inner">
              <div className="bam-hero-text">
                {label && <div className="bam-hero-label">{label}</div>}
                {i === 0 ? (
                  <h1 className="bam-hero-title">{renderEmphasisTitle(slide.title)}</h1>
                ) : (
                  <h2 className="bam-hero-title">{renderEmphasisTitle(slide.title)}</h2>
                )}
                {desc && <p className="bam-hero-desc">{desc}</p>}
                <div className="bam-hero-ctas">
                  {slide.button_text && (
                    <Link to={slide.button_link || '/'} className="bam-btn bam-btn-primary">{slide.button_text}</Link>
                  )}
                  <Link to={ghost.link} className="bam-btn bam-btn-ghost">{ghost.text}</Link>
                </div>
              </div>
              <div className="bam-hero-photogrid">
                <Link to={slide.button_link || '/'}>
                  <img src={slide.image} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
                </Link>
                {secondary.map((img, k) => (
                  <Link key={k} to={img.link}>
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      <div className="bam-hero-nav">
        <button className="bam-hero-arrow bam-hero-prev" aria-label="Slide trước" onClick={() => goTo(current - 1)}>
          <i className="bi bi-chevron-left" />
        </button>
        <div className="bam-hero-dots">
          {heroSlides.map((s, i) => (
            <button key={s.id} className={'bam-hero-dot' + (i === current ? ' active' : '')} aria-label={`Slide ${i + 1}`} onClick={() => goTo(i)} />
          ))}
        </div>
        <button className="bam-hero-arrow bam-hero-next" aria-label="Slide tiếp" onClick={() => goTo(current + 1)}>
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </section>
  )
}
