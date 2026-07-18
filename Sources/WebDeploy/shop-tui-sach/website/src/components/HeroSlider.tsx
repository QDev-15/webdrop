import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=80'

// Hero H2 Split 45/55 — template gốc dùng 1 hero tĩnh (không phải carousel nhiều slide).
// Nội dung + ảnh lấy từ hero_slides[0] (quản lý qua Admin → Hero Slides) để vẫn dùng chung
// bảng hero_slides của dự án; tag + 3 chỉ số dưới action lấy từ settings nhóm "hero".
export default function HeroSlider() {
  const { settings, heroSlides } = useSite()
  const slide = heroSlides[0]

  const title = slide?.title || 'Nghệ thuật da thật thủ công tinh xảo'
  const [titleMain, titleEm] = splitTitle(title)
  const desc = slide?.subtitle || settings.site_description || ''
  const image = slide?.image || FALLBACK_IMAGE
  const ctaText = slide?.button_text || 'Khám phá bộ sưu tập'
  const ctaLink = slide?.button_link || '/san-pham'

  const stats = [1, 2, 3].map(i => ({
    num: settings[`hero_stat${i}_num`] || '',
    suffix: settings[`hero_stat${i}_suffix`] || '',
    label: settings[`hero_stat${i}_label`] || '',
  })).filter(s => s.label)

  return (
    <section className="ts-hero" aria-label="Hero">
      <div className="ts-hero-text">
        <div className="ts-hero-kicker">{settings.hero_tag || 'Bộ sưu tập mới'}</div>
        <h1 data-reveal>
          {titleMain}{titleEm && <><br /><em>{titleEm}</em></>}
        </h1>
        <p data-reveal data-reveal-d1>{desc}</p>
        <div className="ts-hero-actions" data-reveal data-reveal-d2>
          <Link to={ctaLink} className="ts-btn solid">{ctaText}</Link>
          <Link to="/lien-he" className="ts-btn">Liên hệ tư vấn</Link>
        </div>
        {stats.length > 0 && (
          <div className="ts-hero-meta" data-reveal data-reveal-d3>
            {stats.map((s, i) => (
              <div key={i}><strong>{s.num}{s.suffix}</strong><span>{s.label}</span></div>
            ))}
          </div>
        )}
      </div>
      <div className="ts-hero-media">
        <img src={image} alt={title} loading="eager" />
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
