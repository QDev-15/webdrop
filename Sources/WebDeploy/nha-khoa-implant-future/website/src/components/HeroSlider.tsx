import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { settings } = useSite()
  const title = settings.hero_title_main || 'Cấy ghép Implant chuẩn 3D'
  const subtitle = settings.hero_subtitle || 'Future Dental ứng dụng công nghệ scan 3D, thiết kế CAD-CAM và định vị phẫu thuật kỹ thuật số — mang lại kết quả phục hình chính xác đến từng milimet.'
  const statCases = settings.stat_cases || '12.000+'
  const statSatisfaction = settings.stat_satisfaction || '99.2%'
  const statYears = settings.stat_years || '10+'

  return (
    <section className="ft-hero">
      <img
        className="ft-hero-img"
        src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1600&q=80&auto=format&fit=crop"
        alt="Công nghệ cấy ghép Implant 3D tại Future Dental"
        loading="eager"
      />
      <div className="ft-hero-grid"></div>
      <div className="wd-container">
        <div className="ft-hero-inner">
          <div className="ft-hero-badge">
            <span className="ft-hero-dot"></span>
            Chuyên Khoa Implant Công Nghệ Cao
          </div>
          <h1 className="ft-hero-title">
            {title}<br />
            <em>chính xác tuyệt đối</em>
          </h1>
          <p className="ft-hero-sub">{subtitle}</p>
          <div className="ft-hero-ctas">
            <Link to="/dat-lich" className="ft-btn ft-btn-neon">Đặt lịch tư vấn miễn phí →</Link>
            <Link to="/cong-nghe-3d" className="ft-btn ft-btn-ghost">Khám phá công nghệ 3D</Link>
          </div>
          <div className="ft-hero-stats">
            <div className="ft-hs">
              <span className="ft-hs-num">{statCases}</span>
              <span className="ft-hs-label">Ca Implant thành công</span>
            </div>
            <div className="ft-hs-div"></div>
            <div className="ft-hs">
              <span className="ft-hs-num">{statSatisfaction}%</span>
              <span className="ft-hs-label">Tỷ lệ tích hợp xương</span>
            </div>
            <div className="ft-hs-div"></div>
            <div className="ft-hs">
              <span className="ft-hs-num">{statYears}+</span>
              <span className="ft-hs-label">Năm chuyên sâu Implant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
