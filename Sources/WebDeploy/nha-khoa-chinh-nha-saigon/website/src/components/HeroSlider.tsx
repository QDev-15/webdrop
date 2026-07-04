import { useSite } from '../contexts/SiteContext'
import { Link } from 'react-router-dom'

// Static hero — geometric split (not a slider, this identity uses H10 layout)
const CELLS: ('on' | 'mid' | '')[] = [
  '', 'mid', '', '',
  '', 'on', 'on', 'mid',
  'mid', 'on', 'on', '',
  '', '', 'mid', '',
]

export default function HeroSlider() {
  const { settings } = useSite()

  const badge    = settings.hero_badge    || 'Chỉnh nha kỹ thuật số chính xác'
  const title1   = settings.hero_title_1  || 'Nụ cười thẳng đều,'
  const titleEm  = settings.hero_title_em || 'đo lường bằng dữ liệu'
  const subtitle = settings.hero_subtitle || 'Nha Khoa Chỉnh Nha Sài Gòn ứng dụng scan 3D và lập kế hoạch điều trị kỹ thuật số — theo dõi từng milimet dịch chuyển răng, rút ngắn thời gian niềng, kết quả dự đoán được ngay từ buổi tư vấn đầu tiên.'
  const statCases = settings.stat_cases   || '4.500+'
  const statYears = settings.stat_years   || '12 năm'
  const statSat   = settings.stat_satisfaction || '98%'

  return (
    <section className="cn-hero">
      <div className="cn-hero-dark" />
      <div className="wd-container">
        <div className="cn-hero-inner">
          <div className="cn-hero-text" data-reveal>
            <div className="cn-hero-badge">
              <span aria-hidden="true" />
              {badge}
            </div>
            <h1 className="cn-hero-heading">
              {title1} <em>{titleEm}</em>
            </h1>
            <p className="cn-hero-sub">{subtitle}</p>
            <div className="cn-hero-ctas">
              <Link to="/dat-lich" className="cn-btn cn-btn-primary">Đặt lịch tư vấn miễn phí</Link>
              <Link to="/quy-trinh-nieng" className="cn-btn cn-btn-outline-lt">Xem quy trình niềng →</Link>
            </div>
            <div className="cn-hero-stats">
              <div>
                <div className="cn-hero-stat-num">{statCases}</div>
                <div className="cn-hero-stat-lbl">Ca chỉnh nha thành công</div>
              </div>
              <div>
                <div className="cn-hero-stat-num">{statYears}</div>
                <div className="cn-hero-stat-lbl">Kinh nghiệm chuyên khoa</div>
              </div>
              <div>
                <div className="cn-hero-stat-num">{statSat}</div>
                <div className="cn-hero-stat-lbl">Khách hàng hài lòng</div>
              </div>
            </div>
          </div>

          <div className="cn-hero-visual" data-reveal data-delay="2">
            <div className="cn-hero-frame" aria-hidden="true" />
            <div className="cn-hero-grid" aria-hidden="true">
              {CELLS.map((cls, i) => (
                <div key={i} className={`cn-hero-cell${cls ? ` ${cls}` : ''}`} />
              ))}
            </div>
            <div className="cn-hero-tag">
              <div className="cn-hero-tag-num">0.1mm</div>
              <div className="cn-hero-tag-text">Độ chính xác<br />đo lường dịch chuyển</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
