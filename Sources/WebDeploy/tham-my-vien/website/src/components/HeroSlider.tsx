import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { settings } = useSite()

  const badge   = settings.hero_badge    || 'Thẩm Mỹ Y Khoa Cao Cấp'
  const title1  = settings.hero_title_1  || 'Vẻ đẹp'
  const titleEm = settings.hero_title_em || 'hoàn hảo'
  const title3  = settings.hero_title_3  || 'từ chuyên gia.'
  const sub     = settings.hero_subtitle || 'Kết hợp giữa công nghệ y khoa tiên tiến và nghệ thuật thẩm mỹ — mang lại vẻ đẹp tự nhiên, an toàn và bền vững cho bạn.'
  const image   = settings.hero_image    || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80'
  const cases   = settings.stat_cases    || '8,500+'

  return (
    <section className="tmv-hero">
      {/* Left: dark panel */}
      <div className="tmv-hero-left">
        <div className="tmv-hero-left-bg-dot" />
        <div className="tmv-hero-content">
          <div className="tmv-hero-badge" data-reveal>
            <span className="tmv-hero-dot" /> {badge}
          </div>
          <h1 className="tmv-hero-title" data-reveal data-delay="1">
            {title1} <em>{titleEm}</em><br />{title3}
          </h1>
          <p className="tmv-hero-sub" data-reveal data-delay="2">{sub}</p>

          <div className="tmv-hero-badges" data-reveal data-delay="3">
            {['Bộ Y tế cấp phép', 'ISO 14644 Phòng mổ', 'FDA Cleared', '15+ năm kinh nghiệm'].map(c => (
              <div key={c} className="tmv-hero-chip">
                <span className="tmv-hero-chip-dot" />
                {c}
              </div>
            ))}
          </div>

          <div className="tmv-hero-ctas" data-reveal data-delay="4">
            <Link to="/tu-van" className="tmv-btn tmv-btn-gold">
              Đặt lịch tư vấn miễn phí
            </Link>
            <Link to="/dich-vu" className="tmv-btn tmv-btn-ghost-on-dark">
              Khám phá dịch vụ →
            </Link>
          </div>

          <div className="tmv-hero-trust" data-reveal>
            <div className="tmv-ht">
              <span className="tmv-ht-num">{cases}</span>
              <span className="tmv-ht-label">Ca thực hiện thành công</span>
            </div>
            <div className="tmv-ht">
              <span className="tmv-ht-num">{settings.stat_doctors || '15'}+</span>
              <span className="tmv-ht-label">Bác sĩ chuyên khoa</span>
            </div>
            <div className="tmv-ht">
              <span className="tmv-ht-num">{settings.stat_years || '12'}+</span>
              <span className="tmv-ht-label">Năm kinh nghiệm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: image */}
      <div className="tmv-hero-right">
        <img
          src={image}
          alt="Thẩm mỹ viện — dịch vụ cao cấp"
          className="tmv-hero-img"
          loading="eager"
        />
        <div className="tmv-hero-cred">
          <div className="tmv-hero-cred-num">{settings.stat_satisfaction || '98'}%</div>
          <div className="tmv-hero-cred-label">Khách hàng hài lòng</div>
        </div>
      </div>
    </section>
  )
}
