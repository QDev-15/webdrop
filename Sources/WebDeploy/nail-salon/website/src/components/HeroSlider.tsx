import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroMosaic() {
  const { settings, slides } = useSite()
  const s = (k: string, fb = '') => settings[k] || fb

  return (
    <section className="ns-hero">
      {/* Left column */}
      <div className="ns-hero-left">
        <div className="ns-hero-badge" data-reveal>
          <span className="ns-hero-dot" />
          {s('hero_badge', '✦ Nail Art & Chăm sóc móng chuyên nghiệp')}
        </div>

        <h1 className="ns-hero-title" data-reveal data-reveal-d="d1">
          {s('hero_title1', 'Vẻ đẹp')}
          <strong>{s('hero_title2', 'Từng Chiếc Móng')}</strong>
          {s('hero_title3', 'Là Nghệ Thuật')}
        </h1>

        <p className="ns-hero-sub" data-reveal data-reveal-d="d2">
          {s('hero_sub', 'Khám phá hàng trăm mẫu nail độc quyền. Từ Gel cơ bản đến Nail Art 3D tinh xảo — chúng tôi mang lại vẻ đẹp hoàn hảo cho từng khách hàng.')}
        </p>

        <div className="ns-hero-actions" data-reveal data-reveal-d="d3">
          <Link to="/dat-lich" className="ns-btn-primary">{s('hero_cta_primary', 'Đặt lịch ngay')}</Link>
          <Link to="/dich-vu" className="ns-btn-outline">{s('hero_cta_secondary', 'Xem dịch vụ')}</Link>
        </div>

        <div className="ns-hero-trust" data-reveal data-reveal-d="d4">
          <div className="ns-trust-item">
            <span className="ns-trust-num">{s('stat_customers', '2.000')}+</span>
            <span className="ns-trust-label">Khách hàng hài lòng</span>
          </div>
          <div className="ns-trust-item">
            <span className="ns-trust-num">{s('stat_years', '5')}+</span>
            <span className="ns-trust-label">Năm kinh nghiệm</span>
          </div>
          <div className="ns-trust-item">
            <span className="ns-trust-num">{s('stat_patterns', '500')}+</span>
            <span className="ns-trust-label">Mẫu nail độc quyền</span>
          </div>
          <div className="ns-trust-item">
            <span className="ns-trust-num">{s('stat_rating', '4.9')}★</span>
            <span className="ns-trust-label">Đánh giá trung bình</span>
          </div>
        </div>
      </div>

      {/* Right column — mosaic grid */}
      <div className="ns-hero-right">
        {slides.length > 0 ? (
          <div className="ns-hero-mosaic">
            {slides.slice(0, 5).map((slide, i) => (
              <div key={slide.id} className={`ns-mosaic-item${i === 0 ? ' tall' : ''}`}>
                <img src={slide.image} alt={slide.title || `Nail ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ height: '100%', background: 'var(--blush-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            💅
          </div>
        )}
      </div>
    </section>
  )
}
