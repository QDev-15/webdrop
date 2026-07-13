import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSite } from '../contexts/SiteContext'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=80'

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let cur = 0
      const step = Math.max(1, Math.ceil(target / 60))
      const t = setInterval(() => {
        cur = Math.min(cur + step, target)
        setValue(cur)
        if (cur >= target) clearInterval(t)
      }, 25)
      io.disconnect()
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return <span ref={ref}>{value}{suffix}</span>
}

// Hero H1 Full-Screen Overlay — template gốc dùng 1 ảnh nền full-screen (không phải carousel nhiều slide).
// Ảnh + tiêu đề/mô tả/CTA lấy từ hero_slides[0] (quản lý qua Admin → Hero Slides) để vẫn tận dụng
// đúng bảng hero_slides dùng chung của dự án; tag + 3 chỉ số dưới hero lấy từ settings nhóm "hero".
export default function HeroSlider() {
  const { settings, heroSlides } = useSite()
  const slide = heroSlides[0]

  const title = slide?.title || 'Bước đi khác biệt mỗi ngày'
  const [titleMain, titleTail] = splitTitle(title)
  const desc = slide?.subtitle || settings.site_description || ''
  const image = slide?.image || FALLBACK_IMAGE
  const ctaText = slide?.button_text || 'Khám phá ngay'
  const ctaLink = slide?.button_link || '/san-pham'

  const stats = [1, 2, 3].map(i => ({
    num: Number(settings[`hero_stat${i}_num`] || 0),
    suffix: settings[`hero_stat${i}_suffix`] || '',
    label: settings[`hero_stat${i}_label`] || '',
  })).filter(s => s.label)

  return (
    <section className="gd-hero" aria-label="Hero">
      <div className="gd-hero-bg">
        <img src={image} alt={title} loading="eager" />
      </div>
      <div className="gd-container">
        <div className="gd-hero-inner">
          <div className="gd-hero-tag" data-reveal>
            <i className="bi bi-lightning-charge-fill" />
            {settings.hero_tag || 'Bộ sưu tập mới ra mắt'}
          </div>
          <h1 className="gd-hero-title" data-reveal data-delay="1">
            {titleMain}{titleTail && <><br /><em>{titleTail}</em></>}
          </h1>
          <p className="gd-hero-desc" data-reveal data-delay="2">{desc}</p>
          <div className="gd-hero-actions" data-reveal data-delay="3">
            <Link to={ctaLink} className="gd-btn gd-btn-primary">
              <i className="bi bi-lightning-charge-fill" />
              {ctaText}
            </Link>
            <Link to="/san-pham" className="gd-btn gd-btn-outline">Xem bộ sưu tập</Link>
          </div>
          {stats.length > 0 && (
            <div className="gd-hero-stats" data-reveal data-delay="4">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="gd-hero-stat-num"><CountUp target={s.num} suffix={s.suffix} /></div>
                  <div className="gd-hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function splitTitle(title: string): [string, string] {
  const words = title.trim().split(' ')
  if (words.length <= 2) return [title, '']
  const half = Math.ceil(words.length / 2)
  return [words.slice(0, half).join(' '), words.slice(half).join(' ')]
}
