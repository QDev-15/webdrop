import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'

export default function HomePage() {
  return (
    <>
      {/* Hero — H6 Asymmetric Offset */}
      <HeroSlider />

      {/* USP + Stat bar + Gallery */}
      <About />

      {/* Services preview */}
      <section className="ks-svc-bg ks-sec-pad" aria-label="Dịch vụ nổi bật">
        <div className="wd-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
            <div data-reveal>
              <span className="ks-eyebrow is-lilac">Dịch vụ nổi bật</span>
              <h2 className="ks-title">Chăm sóc răng miệng <strong>toàn diện</strong><br />cho từng độ tuổi</h2>
            </div>
            <div data-reveal data-delay="1">
              <Link to="/dich-vu" className="ks-btn ks-btn-ghost">Xem tất cả dịch vụ →</Link>
            </div>
          </div>
          <Services limit={6} showHeader={false} />
        </div>
      </section>

      {/* Team preview — alternating strips */}
      <section className="ks-team-bg ks-sec-pad" aria-label="Đội ngũ bác sĩ">
        <div className="wd-container">
          <div className="ks-text-center" style={{ marginBottom: 48 }} data-reveal>
            <span className="ks-eyebrow is-lilac">Đội ngũ bác sĩ</span>
            <h2 className="ks-title">Bác sĩ <strong>chuyên khoa Nhi</strong><br />tận tâm với từng nụ cười</h2>
          </div>
          <Team mode="strips" limit={2} showViewAll />
        </div>
      </section>

      {/* Testimonials */}
      <section className="ks-rv-bg ks-sec-pad" aria-label="Đánh giá phụ huynh">
        <div className="wd-container">
          <div className="ks-text-center" data-reveal style={{ marginBottom: 8 }}>
            <span className="ks-eyebrow is-lilac">Phụ huynh nói gì</span>
            <h2 className="ks-title">Niềm tin từ <strong>hàng ngàn</strong><br />phụ huynh</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="ks-sec-pad-sm" aria-label="Đặt lịch khám">
        <div className="ks-cta-sec" data-reveal>
          <div className="ks-cta-blob ks-cta-blob-1" aria-hidden="true" />
          <div className="ks-cta-blob ks-cta-blob-2" aria-hidden="true" />
          <span className="ks-cta-eyebrow">Đặt lịch hôm nay</span>
          <h2 className="ks-cta-title">Cho bé một nụ cười <strong style={{ color: '#fff', fontWeight: 600 }}>khỏe mạnh</strong></h2>
          <p className="ks-cta-sub">Đặt lịch khám ngay để bé được trải nghiệm dịch vụ nha khoa vui vẻ, an toàn tại KidSmile.</p>
          <div className="ks-cta-actions">
            <Link to="/dat-lich" className="ks-btn-cta-white">Đặt lịch khám ngay →</Link>
            <Link to="/lien-he" className="ks-btn ks-btn-outline-light ks-btn-lg">Liên hệ tư vấn</Link>
          </div>
        </div>
      </section>
    </>
  )
}
