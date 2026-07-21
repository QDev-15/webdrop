import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import { useSite } from '../contexts/SiteContext'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TIMELINE = [
  { num: '01', title: 'Khám và chẩn đoán', text: 'Bác sĩ thăm khám, chụp X-quang, đánh giá tình trạng răng miệng toàn diện và tư vấn phương án điều trị phù hợp.', active: true },
  { num: '02', title: 'Tư vấn và lập kế hoạch', text: 'Giải thích rõ ràng phác đồ điều trị, thời gian, chi phí — không có chi phí ẩn. Bạn quyết định trước khi bắt đầu.' },
  { num: '03', title: 'Điều trị chuyên nghiệp', text: 'Bác sĩ thực hiện điều trị bằng thiết bị hiện đại, đảm bảo an toàn tiệt trùng. Cảm giác thoải mái, hạn chế đau đớn tối đa.' },
  { num: '04', title: 'Theo dõi & chăm sóc sau', text: 'Đặt lịch tái khám định kỳ, hướng dẫn chăm sóc răng miệng tại nhà. Sunrise đồng hành lâu dài cùng gia đình bạn.' },
]

export default function HomePage() {
  useDocumentMeta({
    title: 'Sunrise — Nha Khoa Gia Đình | Chăm sóc răng miệng cho cả nhà',
    description: 'Sunrise Nha Khoa Gia Đình — phòng khám nha khoa thân thiện, ấm áp, phù hợp mọi lứa tuổi từ trẻ em đến người lớn tuổi. Đặt lịch khám ngay hôm nay.',
  })

  const { settings } = useSite()

  const statYears    = settings.stat_years            || '10 năm'
  const statFamilies = settings.stat_families         || '1200+'
  const statStaff    = settings.stat_staff            || '12+'
  const statSat      = settings.stat_satisfaction     || '98%'
  const statYearsL   = settings.stat_years_label      || 'Kinh nghiệm'
  const statFamL     = settings.stat_families_label   || 'Gia đình tin tưởng'
  const statStaffL   = settings.stat_staff_label      || 'Bác sĩ & nhân viên'
  const statSatL     = settings.stat_satisfaction_label || 'Hài lòng'

  return (
    <>
      <HeroSlider />

      <About />

      {/* Stat Bar */}
      <div className="sr-stat-bar">
        <div className="wd-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { num: statYears, label: statYearsL },
              { num: statFamilies, label: statFamL },
              { num: statStaff, label: statStaffL },
              { num: statSat, label: statSatL },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
                {i > 0 && <div className="sr-stat-divider" />}
                <div className="sr-stat" style={{ flex: 1, padding: '0 32px' }} data-reveal>
                  <div className="sr-stat-num">{s.num}</div>
                  <div className="sr-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Services />

      {/* Timeline - Quy trình */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }} data-reveal>
            <div className="sr-eyebrow">Quy trình khám</div>
            <h2 className="sr-sec-title sr-center">Đơn giản, rõ ràng, <em>không lo lắng</em></h2>
          </div>
          <div className="sr-timeline">
            {TIMELINE.map((step, i) => (
              <div key={i} className={`sr-timeline-item${step.active ? ' is-active' : ''}`} data-reveal data-delay={String(i + 1)}>
                <div className="sr-timeline-dot">{step.num}</div>
                <div className="sr-timeline-content">
                  <div className="sr-timeline-title">{step.title}</div>
                  <div className="sr-timeline-text">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Team />
      <Testimonials />

      {/* CTA */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="sr-cta" data-reveal>
            <h2 className="sr-cta-title">Sẵn sàng chăm sóc răng miệng <em>cho cả nhà</em>?</h2>
            <p className="sr-cta-sub">Đặt lịch ngay hôm nay — chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút trong giờ làm việc.</p>
            <div className="sr-cta-actions">
              <Link to="/dat-lich" className="sr-btn sr-btn-white">Đặt lịch khám ngay</Link>
              <Link to="/lien-he" className="sr-btn sr-btn-outline-dark">Liên hệ tư vấn</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
