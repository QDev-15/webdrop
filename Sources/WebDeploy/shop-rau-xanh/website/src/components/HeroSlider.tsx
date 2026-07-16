import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'

// Hero H6 Asymmetric Offset — template gốc dùng 1 ảnh blob lệch (không phải carousel nhiều slide).
// Nội dung + ảnh lấy từ hero_slides[0] (quản lý qua Admin → Hero Slides) để vẫn dùng chung bảng
// hero_slides của dự án; tag + số liệu float lấy từ settings nhóm "home".
export default function HeroSlider() {
  const { settings, heroSlides } = useSite()
  const slide = heroSlides[0]

  const rawTitle = slide?.title || 'Rau củ tươi mộc, hái sáng nay — giao tận tay hôm nay'
  const [titleLine1, titleLine2] = rawTitle.includes(' — ') ? rawTitle.split(' — ') : [rawTitle, '']
  const desc = slide?.subtitle || settings.site_description || ''
  const image = slide?.image || FALLBACK_IMAGE
  const ctaText = slide?.button_text || 'Xem sản phẩm'
  const ctaLink = slide?.button_link || '/san-pham'

  const floatNum = settings.hero_float_num || '120'
  const floatSuffix = settings.hero_float_suffix || '+'
  const floatLabel = settings.hero_float_label || 'liên kết trực tiếp'

  return (
    <section className="rx-hero" aria-label="Giới thiệu">
      <div className="rx-container">
        <div className="rx-hero-inner">
          <div className="rx-hero-content">
            <div className="rx-hero-tag" data-reveal>
              <i className="bi bi-flower2" />
              {settings.hero_tag || 'Hơn 4 năm đồng hành cùng nông trại Việt'}
            </div>
            <h1 className="rx-hero-title" data-reveal data-delay="1">
              {titleLine1}
              {titleLine2 && <>,<br /><strong className="rx-wavy">{titleLine2}</strong></>}
            </h1>
            <p className="rx-hero-desc" data-reveal data-delay="2">{desc}</p>
            <div className="rx-hero-actions" data-reveal data-delay="3">
              <Link to={ctaLink} className="rx-btn rx-btn-primary">
                <i className="bi bi-basket2" /> {ctaText}
              </Link>
              <a href="#rx-quy-trinh" className="rx-btn rx-btn-ghost">Quy trình của chúng tôi</a>
            </div>
            <div className="rx-hero-badges" data-reveal data-delay="4">
              <span className="rx-hero-badge"><i className="bi bi-patch-check" /> 100% hữu cơ</span>
              <span className="rx-hero-badge"><i className="bi bi-truck" /> Giao trong ngày</span>
              <span className="rx-hero-badge"><i className="bi bi-arrow-repeat" /> Đổi trả dễ dàng</span>
            </div>
          </div>
        </div>

        <div className="rx-hero-visual rx-blob" data-reveal data-delay="2">
          <img src={image} alt={rawTitle} loading="eager" />
        </div>
        <div className="rx-hero-float" data-reveal data-delay="3">
          <div className="rx-hero-float-icon"><i className="bi bi-tree" /></div>
          <div>
            <strong>{floatNum}{floatSuffix} nông trại</strong>
            <span>{floatLabel}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
