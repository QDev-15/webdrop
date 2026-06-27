import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import HeroSlider from '../components/HeroSlider'
import Services from '../components/Services'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Team from '../components/Team'

export default function HomePage() {
  const { settings: s } = useSite()

  const stats = [
    { val: s.stat_customers || '500+', label: 'Khách hàng hài lòng' },
    { val: s.stat_years     || '5',    label: 'Năm kinh nghiệm' },
    { val: s.stat_services  || '20+',  label: 'Dịch vụ chuyên nghiệp' },
    { val: s.stat_rating    || '4.9',  label: 'Điểm đánh giá trung bình' },
  ]

  return (
    <main>
      <HeroSlider />

      {/* Stats bar */}
      <section className="sb-stats-bar">
        <div className="wd-container">
          <div className="sb-stats-grid">
            {stats.map((st, i) => (
              <div key={i} className="sb-stat-item">
                <div className="sb-stat-val">{st.val}</div>
                <div className="sb-stat-lbl">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div>
              <div className="sb-eyebrow">Dịch vụ của chúng tôi</div>
              <h2 className="sb-title">Trải nghiệm <em>đỉnh cao</em><br />thư giãn &amp; làm đẹp</h2>
            </div>
            <Link to="/dich-vu" className="sb-btn-ghost">Xem tất cả →</Link>
          </div>
          <Services featured />
        </div>
      </section>

      {/* About */}
      <About />

      {/* CTA */}
      <section className="sb-cta-section" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container" style={{ textAlign: 'center' }}>
          <div data-reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#4ade80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>
              <span style={{ width: 24, height: 1, background: '#4ade80', display: 'inline-block' }} />
              Ưu đãi đặc biệt
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 600, color: '#fff', marginBottom: 16, lineHeight: 1.25 }}>
              Giảm <em style={{ color: '#4ade80', fontStyle: 'normal' }}>20%</em> cho lần trải nghiệm đầu tiên
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', fontWeight: 300, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.8 }}>
              Đặt lịch ngay hôm nay và nhận ưu đãi chào mừng khách hàng mới. Số lượng có hạn.
            </p>
            <Link to="/dat-lich" className="sb-btn-accent" style={{ padding: '14px 36px', fontSize: 15 }}>
              Đặt lịch ngay →
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="sb-eyebrow">Đội ngũ chuyên viên</div>
            <h2 className="sb-title">Những đôi bàn tay <em>tận tâm</em></h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', fontWeight: 300, maxWidth: 500, margin: '0 auto' }}>
              Chuyên viên được đào tạo bài bản, nhiều năm kinh nghiệm và luôn đặt khách hàng lên hàng đầu.
            </p>
          </div>
          <Team />
        </div>
      </section>

      {/* Reviews */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="sb-eyebrow">Khách hàng nói gì</div>
            <h2 className="sb-title">Cảm nhận thực từ <em>khách hàng</em></h2>
          </div>
          <Testimonials />
        </div>
      </section>
    </main>
  )
}
