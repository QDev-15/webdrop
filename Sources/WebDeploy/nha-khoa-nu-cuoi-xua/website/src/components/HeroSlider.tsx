import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const MARQUEE_ITEMS = [
  'Nha Khoa Thẩm Mỹ', 'Implant Răng', 'Niềng Răng Trong Suốt', 'Tẩy Trắng Răng',
  'Răng Sứ Veneer', 'Nhổ Răng Khôn', 'Nha Khoa Trẻ Em', 'Điều Trị Tủy Răng',
  'Nha Khoa Thẩm Mỹ', 'Implant Răng', 'Niềng Răng Trong Suốt', 'Tẩy Trắng Răng',
  'Răng Sứ Veneer', 'Nhổ Răng Khôn', 'Nha Khoa Trẻ Em', 'Điều Trị Tủy Răng',
]

export default function HeroSlider() {
  const { settings } = useSite()

  const badge        = settings.hero_badge        || 'Từ Năm 2008'
  const title        = settings.hero_title        || 'Nụ Cười Đẹp'
  const titleSpan    = settings.hero_subtitle     || 'Bắt Đầu Từ Đây'
  const lead         = settings.hero_lead         || 'Phòng khám nha khoa phong cách retro-vintage, chuyên sâu răng thẩm mỹ và phục hồi chức năng răng miệng toàn diện.'
  const statCases    = settings.stat_cases        || '15.000+'
  const statCasesL   = settings.stat_cases_label  || 'Khách hàng tin tưởng'
  const statDoctors  = settings.stat_doctors      || '8+'
  const statDoctorsL = settings.stat_doctors_label|| 'Bác sĩ chuyên khoa'
  const statYears    = settings.stat_years        || '16+'
  const statYearsL   = settings.stat_years_label  || 'Năm kinh nghiệm'

  return (
    <section className="nc-hero">
      {/* Strip 1: Main headline */}
      <div className="nc-strip nc-strip-1">
        <div className="wd-container nc-strip-inner">
          <div className="nc-hero-badge">
            <span>★</span> {badge}
          </div>
          <h1 className="nc-hero-h1">
            {title}
            <span>{titleSpan}</span>
          </h1>
          <p className="nc-hero-lead">{lead}</p>
        </div>
      </div>

      {/* Strip 2: Quote/tagline */}
      <div className="nc-strip nc-strip-2">
        <div className="wd-container nc-strip-inner">
          <p className="nc-strip-2-text">
            <span className="nc-dot">✦</span>
            Mọi nụ cười đẹp bắt đầu từ sự tận tâm và kỹ thuật của người bác sĩ
            <span className="nc-dot">✦</span>
            Răng đẹp — Tự tin — Hạnh phúc
          </p>
        </div>
      </div>

      {/* Strip 3: Stats + CTA */}
      <div className="nc-strip nc-strip-3">
        <div className="wd-container nc-strip-inner">
          <div className="nc-strip-3-row">
            <div className="nc-strip-3-stats">
              <div className="nc-strip-3-stat">
                <div className="nc-strip-3-num">{statCases}</div>
                <div className="nc-strip-3-label">{statCasesL}</div>
              </div>
              <div className="nc-strip-3-stat">
                <div className="nc-strip-3-num">{statDoctors}</div>
                <div className="nc-strip-3-label">{statDoctorsL}</div>
              </div>
              <div className="nc-strip-3-stat">
                <div className="nc-strip-3-num">{statYears}</div>
                <div className="nc-strip-3-label">{statYearsL}</div>
              </div>
            </div>
            <div className="nc-strip-3-actions">
              <Link to="/dat-lich" className="nc-btn">Đặt lịch khám</Link>
              <Link to="/dich-vu" className="nc-btn-dark-outline">Xem dịch vụ</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Strip 4: Marquee */}
      <div className="nc-strip nc-strip-4">
        <div className="nc-marquee" aria-hidden="true">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i}>
              {item} <span>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
