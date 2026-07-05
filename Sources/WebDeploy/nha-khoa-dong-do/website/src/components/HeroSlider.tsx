import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { settings, slides } = useSite()

  const heroTitle = settings.hero_title_main || 'Nụ cười đẳng cấp, trọn vẹn niềm tin'
  const heroSub   = settings.hero_subtitle || 'Nha Khoa Đông Đô kiến tạo trải nghiệm nha khoa cao cấp trọn gói — nơi hội tụ đội ngũ chuyên gia hàng đầu và công nghệ hiện đại bậc nhất, dành riêng cho khách hàng thành đạt.'
  const statYears = settings.stat_years || '15'
  const statCases = settings.stat_cases || '12000'
  const statSat   = settings.stat_satisfaction || '98'

  const heroImage = slides[0]?.image
    || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=78&auto=format&fit=crop'

  const casesDisplay = parseInt(statCases) >= 1000
    ? (parseInt(statCases) / 1000).toFixed(0) + 'K+'
    : statCases + '+'

  return (
    <section className="dd-hero">
      <div className="dd-hero-left" data-reveal>
        <div className="dd-eyebrow">Nha khoa cao cấp</div>
        <h1 className="dd-hero-title">
          {heroTitle.includes(',')
            ? <>
                {heroTitle.split(',')[0]},<br />
                <em>{heroTitle.split(',').slice(1).join(',').trim()}</em>
              </>
            : <em>{heroTitle}</em>
          }
        </h1>
        <p className="dd-hero-sub">{heroSub}</p>
        <div className="dd-hero-actions">
          <Link to="/dat-lich" className="dd-btn dd-btn-fill">
            Đặt lịch tư vấn
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link to="/dich-vu" className="dd-btn">Khám phá dịch vụ</Link>
        </div>
        <div className="dd-hero-meta">
          <div>
            <div className="dd-hero-meta-num">{statYears}+</div>
            <div className="dd-hero-meta-label">Năm kinh nghiệm</div>
          </div>
          <div>
            <div className="dd-hero-meta-num">{casesDisplay}</div>
            <div className="dd-hero-meta-label">Ca điều trị</div>
          </div>
          <div>
            <div className="dd-hero-meta-num">{statSat}%</div>
            <div className="dd-hero-meta-label">Hài lòng</div>
          </div>
        </div>
      </div>
      <div className="dd-hero-right">
        <img
          src={heroImage}
          alt="Phòng khám Nha Khoa Đông Đô — không gian điều trị hiện đại, sang trọng"
          loading="eager"
        />
      </div>
    </section>
  )
}
