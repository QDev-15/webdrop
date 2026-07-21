import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import Services from '../components/Services'
import About from '../components/About'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  useDocumentMeta({
    title: 'Nha Khoa Đông Đô — Nha Khoa Cao Cấp, Dịch Vụ Trọn Gói',
    description: 'Nha Khoa Đông Đô — phòng khám nha khoa cao cấp dành cho khách hàng thành đạt. Trồng răng Implant, bọc sứ thẩm mỹ, chỉnh nha Invisalign cùng đội ngũ chuyên gia hàng đầu.',
  })

  return (
    <>
      <HeroSlider />

      {/* Dịch vụ nổi bật */}
      <section className="dd-section">
        <div className="wd-container">
          <div className="dd-sec-head">
            <div>
              <div className="dd-eyebrow" data-reveal>Dịch vụ nha khoa</div>
              <h2 className="dd-sec-title" data-reveal="d1">Toàn diện — <em>chuyên sâu</em></h2>
              <p className="dd-sec-sub" data-reveal="d2">Từ thẩm mỹ đến phục hình phức tạp, mỗi liệu trình được lập kế hoạch cá nhân hóa bởi chuyên gia.</p>
            </div>
            <Link to="/dich-vu" className="dd-btn">
              Xem tất cả dịch vụ
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <Services featuredOnly={true} />
        </div>
      </section>

      {/* Stats + USP */}
      <About />

      {/* Đội ngũ bác sĩ */}
      <section className="dd-section dd-section-alt">
        <div className="wd-container">
          <div className="dd-sec-head">
            <div>
              <div className="dd-eyebrow" data-reveal>Đội ngũ chuyên gia</div>
              <h2 className="dd-sec-title" data-reveal="d1">Bác sĩ <em>hàng đầu</em></h2>
              <p className="dd-sec-sub" data-reveal="d2">Được đào tạo chuyên sâu tại các cơ sở uy tín quốc tế, mỗi bác sĩ là chuyên gia trong lĩnh vực riêng.</p>
            </div>
            <Link to="/doi-ngu-bac-si" className="dd-btn">
              Xem tất cả bác sĩ
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <Team limit={3} />
        </div>
      </section>

      {/* CTA band */}
      <section className="dd-cta-band">
        <div className="wd-container">
          <div className="dd-eyebrow">Đặt lịch ngay hôm nay</div>
          <h2>Bắt đầu hành trình <em>nụ cười hoàn hảo</em> của bạn</h2>
          <p>Tư vấn miễn phí, cam kết kết quả. Đội ngũ chuyên gia sẵn sàng đồng hành cùng bạn.</p>
          <div className="dd-hero-actions">
            <Link to="/dat-lich" className="dd-btn dd-btn-fill">
              Đặt lịch tư vấn
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link to="/lien-he" className="dd-btn">Liên hệ chúng tôi</Link>
          </div>
        </div>
      </section>

      {/* Đánh giá khách hàng */}
      <section className="dd-section">
        <div className="wd-container">
          <div className="dd-sec-head">
            <div>
              <div className="dd-eyebrow" data-reveal>Khách hàng nói gì</div>
              <h2 className="dd-sec-title" data-reveal="d1">Trải nghiệm <em>thực tế</em></h2>
            </div>
          </div>
          <Testimonials />
        </div>
      </section>
    </>
  )
}
