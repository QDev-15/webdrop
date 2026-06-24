import { useSite } from '../contexts/SiteContext'
import { Link } from 'react-router-dom'

export default function HeroSlider() {
  const { settings, slides } = useSite()

  const siteName = settings.site_name || 'Tam Thu Massage'
  const heroTitle = settings.hero_title || 'Phục hồi cơ thể — Tĩnh tâm trí não.'
  const heroDesc = settings.hero_description || 'Chúng tôi mang đến liệu trình massage trị liệu chuyên sâu — kết hợp kỹ thuật Thái, đá nóng và bấm huyệt truyền thống để phục hồi thể chất và tinh thần toàn diện.'
  const heroImage = (slides[0]?.image) || settings.hero_image || 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1000&q=75&auto=format&fit=crop'
  const stat1Num = settings.hero_stat1_num || '1.200'
  const stat1Label = settings.hero_stat1_label || 'Khách hàng tin tưởng'
  const stat2Num = settings.hero_stat2_num || '8'
  const stat2Label = settings.hero_stat2_label || 'Năm kinh nghiệm'
  const stat3Num = settings.hero_stat3_num || '12'
  const stat3Label = settings.hero_stat3_label || 'Chuyên viên trị liệu'

  return (
    <section className="mrt-hero">
      <div className="mrt-hero-geo" />
      <div className="mrt-hero-img">
        <img
          src={heroImage}
          alt={`${siteName} — không gian thư giãn`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72 }}
        />
      </div>

      <div className="wd-container w-100 position-relative" style={{ zIndex: 3 }}>
        <div className="row">
          <div className="col-lg-6 col-xl-5">
            <div className="mrt-hero-content" data-reveal>
              <div className="mrt-hero-chip">
                <span className="mrt-hero-chip-dot" />
                Trung tâm massage trị liệu
              </div>
              <h1
                className="mrt-hero-title"
                dangerouslySetInnerHTML={{ __html: heroTitle }}
              />
              <p className="mrt-hero-desc">{heroDesc}</p>
              <div className="mrt-hero-actions">
                <Link to="/dat-lich" className="mrt-btn-primary">Đặt lịch trải nghiệm &rarr;</Link>
                <Link to="/dich-vu" className="mrt-btn-outline">Xem dịch vụ &amp; giá</Link>
              </div>
              <div className="mrt-hero-stats">
                <div className="mrt-stat-item">
                  <div className="mrt-stat-num">{stat1Num}<span>+</span></div>
                  <div className="mrt-stat-label">{stat1Label}</div>
                </div>
                <div className="mrt-stat-item">
                  <div className="mrt-stat-num">{stat2Num}<span>+</span></div>
                  <div className="mrt-stat-label">{stat2Label}</div>
                </div>
                <div className="mrt-stat-item">
                  <div className="mrt-stat-num">{stat3Num}</div>
                  <div className="mrt-stat-label">{stat3Label}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
