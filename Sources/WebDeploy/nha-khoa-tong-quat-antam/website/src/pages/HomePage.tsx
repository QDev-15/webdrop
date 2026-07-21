import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  useDocumentMeta({ title: 'Nha Khoa An Tâm — Nha Khoa Tổng Quát, Không Gian Yên Tĩnh', description: 'Phòng khám nha khoa tổng quát với không gian yên tĩnh, tối giản — nơi mọi lo âu được lắng nghe trước khi điều trị.' })
  return (
    <>
      {/* Hero */}
      <HeroSlider />

      {/* About / USP / Calm quote */}
      <About />

      {/* Featured services */}
      <section className="at-sec-pad" aria-labelledby="svc-heading">
        <div className="wd-container">
          <div className="at-eyebrow">
            <span className="at-eyebrow-line" aria-hidden="true" />
            Dịch vụ nổi bật
          </div>
          <h2 id="svc-heading" className="at-title">
            Chăm sóc toàn diện,<br />
            <em>nhẹ nhàng từng bước</em>
          </h2>
          <p className="at-sub" style={{ marginBottom: 48 }}>
            Từ khám tổng quát đến thẩm mỹ răng — chúng tôi đồng hành cùng bạn trong toàn bộ hành trình chăm sóc răng miệng.
          </p>
          <Services featured />
        </div>
      </section>

      {/* Team preview */}
      <section className="at-sec-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} aria-labelledby="team-heading">
        <div className="wd-container">
          <div className="at-eyebrow">
            <span className="at-eyebrow-line" aria-hidden="true" />
            Đội ngũ bác sĩ
          </div>
          <h2 id="team-heading" className="at-title">
            Bác sĩ tận tâm,<br />
            <em>chuyên môn cao</em>
          </h2>
          <Team layout="strips" limit={2} />
          <div style={{ marginTop: 48 }}>
            <Link to="/bac-si" className="at-btn at-btn-accent">
              Xem toàn bộ đội ngũ
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="at-sec-pad" aria-labelledby="rv-heading">
        <div className="wd-container">
          <div className="at-eyebrow">
            <span className="at-eyebrow-line" aria-hidden="true" />
            Cảm nhận của bệnh nhân
          </div>
          <h2 id="rv-heading" className="at-title" style={{ marginBottom: 48 }}>
            Họ đã <em>an tâm</em> hơn
          </h2>
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="at-cta-sec at-sec-pad-sm">
        <div className="wd-container">
          <h2 className="at-cta-title">
            Sẵn sàng để<br />
            <em>an tâm</em> hơn?
          </h2>
          <p className="at-cta-sub">
            Đặt lịch khám ngay hôm nay và cảm nhận sự khác biệt của không gian nha khoa thực sự yên tĩnh.
          </p>
          <div className="at-cta-actions">
            <Link to="/dat-lich" className="at-btn at-btn-accent at-btn-lg">
              Đặt lịch khám
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/lien-he" className="at-btn at-btn-lg">
              Liên hệ tư vấn
            </Link>
          </div>
          <div className="at-cta-info">
            <div className="at-cta-info-item">
              <span className="at-cta-info-dot" aria-hidden="true" />
              Không mất phí tư vấn
            </div>
            <div className="at-cta-info-item">
              <span className="at-cta-info-dot" aria-hidden="true" />
              Xác nhận trong 2 giờ
            </div>
            <div className="at-cta-info-item">
              <span className="at-cta-info-dot" aria-hidden="true" />
              Thứ 2 – Chủ nhật · 8:00 – 20:00
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
