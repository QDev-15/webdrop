import { NavLink } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import { useSite } from '../App'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({ title: settings.meta_title || settings.site_name || 'LuxDental', description: settings.meta_description })

  return (
    <>
      <HeroSlider />

      {/* Stats bar */}
      <div className="lx-stat-bar">
        <div className="wd-container">
          <div className="row gy-3">
            {[
              { num: settings.stat_cases || '8.500+', label: 'Ca thực hiện' },
              { num: settings.stat_doctors || '12', label: 'Bác sĩ chuyên khoa' },
              { num: settings.stat_years || '10', label: 'Năm kinh nghiệm' },
              { num: settings.stat_satisfaction || '99%', label: 'Khách hài lòng' },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="lx-stat">
                  <div className="lx-stat-num">{s.num}</div>
                  <div className="lx-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About / USP */}
      <About />

      {/* Services bento */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="row align-items-end mb-4 gy-3">
            <div className="col-lg-7" data-reveal>
              <div className="lx-eyebrow">Dịch vụ của chúng tôi</div>
              <h2 className="lx-title">Thẩm mỹ<br /><em>Nha khoa</em><br />Toàn diện</h2>
            </div>
            <div className="col-lg-5 text-lg-end" data-reveal data-delay="2">
              <NavLink to="/dich-vu" className="lx-btn lx-btn-outline">
                Xem tất cả dịch vụ
              </NavLink>
            </div>
          </div>
          <div data-reveal data-delay="1">
            <Services mode="bento" />
          </div>
        </div>
      </section>

      {/* Team preview */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="lx-eyebrow" style={{ justifyContent: 'center' }}>Đội ngũ chuyên gia</div>
            <h2 className="lx-title">Bác sĩ <em>Hàng đầu</em></h2>
            <p className="lx-sub center" style={{ marginTop: 12 }}>
              Mỗi bác sĩ LuxDental là chuyên gia được đào tạo bài bản, kinh nghiệm thực chiến với hàng nghìn ca thẩm mỹ.
            </p>
          </div>
          <Team limit={4} showCta />
        </div>
      </section>

      {/* Testimonials */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="row align-items-end mb-4 gy-3">
            <div className="col-lg-7" data-reveal>
              <div className="lx-eyebrow">Khách hàng nói gì</div>
              <h2 className="lx-title"><em>Cảm nhận</em><br />Thực tế</h2>
            </div>
            <div className="col-lg-5 text-lg-end" data-reveal data-delay="2">
              <NavLink to="/truoc-sau" className="lx-btn lx-btn-outline">
                Xem kết quả thực tế
              </NavLink>
            </div>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="lx-cta">
        <div className="wd-container lx-cta-inner">
          <div className="text-center">
            <div className="lx-eyebrow" style={{ justifyContent: 'center', color: 'var(--accent-mid)' }}>
              Bắt đầu hành trình
            </div>
            <h2 className="lx-cta-title">
              Nụ cười mơ ước<br />
              <em>Chỉ một bước</em>
            </h2>
            <p className="lx-cta-sub">
              Tư vấn miễn phí với bác sĩ chuyên khoa. Thiết kế nụ cười cá nhân hóa ngay trong buổi gặp đầu tiên.
            </p>
            <NavLink to="/dat-lich" className="lx-btn lx-btn-accent">
              Đặt lịch tư vấn miễn phí
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </NavLink>
            <div className="lx-cta-badges">
              {['Tư vấn miễn phí', 'Không ràng buộc', 'Bác sĩ chuyên khoa', 'Chuẩn quốc tế'].map(b => (
                <div key={b} className="lx-cta-badge"><span />{b}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
