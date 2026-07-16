import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1400&auto=format&fit=crop&q=80'

// Hero H4 Centered Minimal — template gốc dùng 1 hero tĩnh (không phải carousel nhiều slide).
// Nội dung + ảnh lấy từ hero_slides[0] (quản lý qua Admin → Hero Slides) để vẫn dùng chung bảng
// hero_slides của dự án; tag/note/số liệu float lấy từ settings nhóm "home".
export default function HeroSlider() {
  const { settings, heroSlides } = useSite()
  const slide = heroSlides[0]

  const rawTitle = slide?.title || 'Thực phẩm sạch, tươi mỗi ngày'
  const [titleLine1, titleLine2] = rawTitle.includes(',') ? rawTitle.split(',').map(s => s.trim()) : [rawTitle, '']
  const desc = slide?.subtitle || settings.site_description || ''
  const image = slide?.image || FALLBACK_IMAGE
  const ctaText = slide?.button_text || 'Khám phá sản phẩm'
  const ctaLink = slide?.button_link || '/san-pham'

  const floatNum = settings.hero_float_num || '120'
  const floatSuffix = settings.hero_float_suffix || '+'
  const floatLabel = settings.hero_float_label || 'nông trại liên kết trên khắp Việt Nam'

  return (
    <>
      <section className="tp-hero" aria-label="Giới thiệu">
        <span className="tp-hero-blob tp-hero-blob-1" aria-hidden="true" />
        <span className="tp-hero-blob tp-hero-blob-2" aria-hidden="true" />
        <div className="tp-container">
          <div className="tp-hero-inner">
            <div className="tp-hero-tag" data-reveal>
              <i className="bi bi-patch-check-fill" />
              {settings.hero_tag || '100% Organic — Đạt chuẩn VietGAP'}
            </div>
            <h1 className="tp-hero-title" data-reveal data-delay="1">
              {titleLine1}
              {titleLine2 && <>,<br /><em>{titleLine2}</em></>}
            </h1>
            <p className="tp-hero-desc" data-reveal data-delay="2">{desc}</p>
            <div className="tp-hero-actions" data-reveal data-delay="3">
              <Link to={ctaLink} className="tp-btn tp-btn-primary tp-btn-lg">
                <i className="bi bi-basket3" /> {ctaText}
              </Link>
              <a href="#quy-trinh" className="tp-btn tp-btn-ghost tp-btn-lg">Tìm hiểu quy trình</a>
            </div>
            <p className="tp-hero-note" data-reveal data-delay="4">
              <i className="bi bi-truck" />
              {settings.hero_note || 'Giao hàng lạnh trong 2–4 giờ tại nội thành · Hoàn tiền nếu không hài lòng'}
            </p>
          </div>

          <div className="tp-hero-visual" data-reveal data-delay="3">
            <img src={image} alt={rawTitle} loading="eager" />
            <div className="tp-hero-float-card">
              <div className="tp-float-icon"><i className="bi bi-tree" /></div>
              <div>
                <strong>{floatNum}{floatSuffix} nông trại</strong>
                <span>{floatLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tp-trust" aria-label="Chứng nhận">
        <div className="tp-container">
          <div className="tp-trust-row" data-reveal>
            <div className="tp-trust-item"><i className="bi bi-patch-check" /> Đạt chuẩn VietGAP</div>
            <div className="tp-trust-item"><i className="bi bi-shield-check" /> Không thuốc BVTV</div>
            <div className="tp-trust-item"><i className="bi bi-qr-code" /> Truy xuất nguồn gốc</div>
            <div className="tp-trust-item"><i className="bi bi-snow2" /> Chuỗi lạnh khép kín</div>
            <div className="tp-trust-item"><i className="bi bi-arrow-counterclockwise" /> Đổi trả trong 24h</div>
          </div>
        </div>
      </section>
    </>
  )
}
