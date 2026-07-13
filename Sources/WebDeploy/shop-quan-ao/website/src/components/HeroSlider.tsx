import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80'

// Hero H12 Two-Column Equal — template gốc chỉ có 1 ảnh hero tĩnh (không phải carousel).
// Ảnh + tiêu đề/mô tả/CTA lấy từ hero_slides[0] (quản lý qua Admin → Hero Slides) để vẫn
// tận dụng đúng bảng hero_slides dùng chung của dự án; các chi tiết trang trí (tag, ghi chú,
// đánh giá, badge sale) lấy từ settings nhóm "hero".
export default function HeroSlider() {
  const { settings, heroSlides } = useSite()
  const slide = heroSlides[0]

  const title = slide?.title || 'Vẻ đẹp nhẹ nhàng trong từng thớ vải'
  const [titleMain, titleTail] = splitTitle(title)
  const desc = slide?.subtitle || settings.site_description || ''
  const image = slide?.image || FALLBACK_IMAGE
  const ctaText = slide?.button_text || 'Khám phá ngay'
  const ctaLink = slide?.button_link || '/san-pham'

  return (
    <section className="qa-hero" aria-label="Hero">
      <div className="qa-container">
        <div className="qa-hero-inner">
          <div>
            <div className="qa-hero-tag" data-reveal>
              <i className="bi bi-flower2" />
              {settings.hero_tag || 'Bộ sưu tập mới'}
            </div>
            <h1 className="qa-hero-title" data-reveal data-delay="1">
              {titleMain}{titleTail && <><br /><strong>{titleTail}</strong></>}
            </h1>
            <p className="qa-hero-desc" data-reveal data-delay="2">{desc}</p>
            <div className="qa-hero-actions" data-reveal data-delay="3">
              <Link to={ctaLink} className="qa-btn qa-btn-primary">
                <i className="bi bi-bag-heart" /> {ctaText}
              </Link>
              <Link to="/san-pham" className="qa-btn qa-btn-ghost">Xem bộ sưu tập</Link>
            </div>
            {settings.hero_note && <p className="qa-hero-note" data-reveal data-delay="4">{settings.hero_note}</p>}
          </div>
          <div className="qa-hero-visual" data-reveal data-delay="2">
            <div className="qa-hero-img-main">
              <img src={image} alt={title} loading="eager" />
            </div>
            {(settings.hero_rating_score || settings.hero_rating_count) && (
              <div className="qa-hero-float-card">
                <div className="qa-float-icon"><i className="bi bi-stars" /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{settings.hero_rating_score || '4.9/5'} sao</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{settings.hero_rating_count || ''} đánh giá</div>
                </div>
              </div>
            )}
            {settings.hero_sale_percent && (
              <div className="qa-hero-float-badge">-{settings.hero_sale_percent}%<br />Sale</div>
            )}
          </div>
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
