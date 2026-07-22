import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

// H10 Geometric Split — hero TĨNH (không phải carousel). Ảnh lấy từ hero_slides[0]
// (chủ shop tự đổi qua admin menu "Hero Slides"), phần chữ lấy từ settings nhóm 'hero'.
export default function HeroSlider() {
  const { settings, heroSlides } = useSite()
  const val = (k: string, fallback = '') => settings[k] || fallback
  const heroImage = heroSlides[0]?.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80'

  return (
    <section className="ma-hero" aria-label="Giới thiệu">
      <div className="ma-hero-split" aria-hidden="true">
        <span className="ma-split-dark" />
        <span className="ma-split-line" />
        <span className="ma-split-line2" />
      </div>
      <div className="ma-container ma-hero-grid">
        <div className="ma-hero-content" data-reveal>
          <div className="ma-hero-tag"><i className="bi bi-patch-check-fill" /> {val('hero_tag', 'Đại lý ủy quyền chính hãng')}</div>
          <h1 className="ma-hero-title">
            {val('hero_title_pre', 'Bắt trọn từng')}<br /><em>{val('hero_title_em', 'khoảnh khắc sắc nét')}</em>
          </h1>
          <p className="ma-hero-desc">{val('hero_desc', 'Thân máy mirrorless & DSLR, ống kính, tripod và phụ kiện chính hãng — tư vấn kỹ thuật chuyên sâu, bảo hành toàn quốc, hỗ trợ trả góp 0%.')}</p>
          <div className="ma-hero-actions">
            <Link to="/san-pham" className="ma-btn ma-btn-primary ma-btn-lg"><i className="bi bi-camera" /> Khám phá sản phẩm</Link>
            <Link to="/dich-vu" className="ma-btn ma-btn-outline-dark ma-btn-lg">Quy trình mua hàng</Link>
          </div>
          <p className="ma-hero-note"><i className="bi bi-shield-check" /> {val('hero_note', 'Bảo hành chính hãng 24 tháng · Đổi trả trong 7 ngày')}</p>
        </div>
        <div className="ma-hero-visual" data-reveal data-delay="2">
          <img src={heroImage} alt="Thân máy ảnh mirrorless cao cấp đặt trên bàn gỗ tối giản" loading="eager" />
          <div className="ma-hero-float-card">
            <div className="ma-float-icon"><i className="bi bi-award" /></div>
            <div>
              <strong>{val('hero_float_num', '30+ thương hiệu')}</strong>
              <span>{val('hero_float_label', 'phân phối chính hãng')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
