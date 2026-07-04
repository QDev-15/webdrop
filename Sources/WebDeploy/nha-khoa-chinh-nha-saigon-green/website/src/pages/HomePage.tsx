import HeroSlider from '../components/HeroSlider'
import Services from '../components/Services'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Booking from '../components/Booking'
import { useSite } from '../contexts/SiteContext'
import { Link } from 'react-router-dom'

const USP_ITEMS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 7h-9M14 17H5M17 3v8M7 13v8"/>
        <circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/>
      </svg>
    ),
    title: 'Scan 3D không đau',
    text: 'Thay thế lấy dấu truyền thống, cho kết quả tức thì, chính xác tuyệt đối.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z"/>
        <path d="M12 22V12M21 6.5L12 12 3 6.5"/>
      </svg>
    ),
    title: 'Kế hoạch điều trị 3D',
    text: 'Mô phỏng lộ trình dịch chuyển răng trước khi bắt đầu, xem trước kết quả cuối.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Bác sĩ chuyên khoa',
    text: 'Đội ngũ tốt nghiệp chuyên khoa Chỉnh nha, cập nhật kỹ thuật quốc tế.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="1"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    title: 'Tái khám đúng hẹn',
    text: 'Lịch chỉnh lực định kỳ, nhắc lịch tự động, theo sát tiến độ điều trị.',
  },
]

export default function HomePage() {
  const { settings } = useSite()
  const cases    = settings.stat_cases    || '4.500'
  const doctors  = settings.stat_doctors  || '6'
  const years    = settings.stat_years    || '12'
  const satisfy  = settings.stat_satisfaction || '98'

  return (
    <>
      {/* Hero */}
      <HeroSlider />

      {/* USP Row */}
      <section className="cn-usp sec-pad-sm">
        <div className="wd-container">
          <div className="cn-usp-row">
            {USP_ITEMS.map((item, i) => (
              <div className="cn-usp-item" key={i} data-reveal data-delay={String(i)}>
                <div className="cn-usp-icon" aria-hidden="true">{item.icon}</div>
                <div className="cn-usp-title">{item.title}</div>
                <div className="cn-usp-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <Services />

      {/* Process preview */}
      <About />

      {/* Stats */}
      <section className="cn-stats">
        <div className="wd-container">
          <div className="cn-stats-row">
            <div className="cn-stat" data-reveal>
              <div className="cn-stat-num">{cases}+</div>
              <div className="cn-stat-lbl">Ca chỉnh nha thành công</div>
            </div>
            <div className="cn-stat" data-reveal data-delay="1">
              <div className="cn-stat-num">{years}</div>
              <div className="cn-stat-lbl">Năm kinh nghiệm</div>
            </div>
            <div className="cn-stat" data-reveal data-delay="2">
              <div className="cn-stat-num">{satisfy}%</div>
              <div className="cn-stat-lbl">Khách hàng hài lòng</div>
            </div>
            <div className="cn-stat" data-reveal data-delay="3">
              <div className="cn-stat-num">{doctors}</div>
              <div className="cn-stat-lbl">Bác sĩ chuyên khoa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="cn-cta">
        <div className="wd-container">
          <div className="cn-cta-inner" data-reveal>
            <div className="cn-eyebrow" style={{ justifyContent: 'center' }}>Bắt đầu ngay hôm nay</div>
            <h2 className="cn-title" style={{ color: '#fff' }}>Tư vấn & Scan 3D <em>miễn phí</em></h2>
            <p className="cn-sub" style={{ color: 'rgba(255,255,255,.45)', margin: '0 auto 36px' }}>
              Đặt lịch ngay để được bác sĩ chuyên khoa thăm khám, scan 3D và nhận kế hoạch điều trị cá nhân hóa — hoàn toàn miễn phí, không ràng buộc.
            </p>
            <div className="cn-cta-btns">
              <Link to="/dat-lich" className="cn-btn cn-btn-primary">Đặt lịch tư vấn miễn phí</Link>
              <Link to="/dich-vu" className="cn-btn cn-btn-outline-lt">Khám phá dịch vụ →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <Booking />
    </>
  )
}
