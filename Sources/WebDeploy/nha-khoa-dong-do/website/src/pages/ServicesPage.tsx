import { Link } from 'react-router-dom'
import Services from '../components/Services'

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <div className="dd-page-header">
        <div className="wd-container">
          <div className="dd-breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>Dịch vụ</span>
          </div>
          <h1 className="dd-page-title">Dịch vụ <em>nha khoa</em></h1>
          <p className="dd-page-sub">Toàn diện và chuyên sâu — từ thẩm mỹ đến phục hình phức tạp, mỗi liệu trình được lập kế hoạch cá nhân hóa.</p>
        </div>
      </div>

      {/* Grid dịch vụ */}
      <section className="dd-section">
        <div className="wd-container">
          <Services />
        </div>
      </section>

      {/* Strip: Quy trình */}
      <section className="dd-section dd-section-alt">
        <div className="wd-container">
          <div className="dd-sec-head">
            <div>
              <div className="dd-eyebrow" data-reveal>Quy trình điều trị</div>
              <h2 className="dd-sec-title" data-reveal="d1">Từng bước <em>tận tâm</em></h2>
            </div>
          </div>
          <div className="dd-strip" data-reveal>
            <div className="dd-strip-media">
              <img src="https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&q=78&auto=format&fit=crop" alt="Tư vấn khám nha khoa tại Đông Đô" loading="lazy" />
            </div>
            <div className="dd-strip-text">
              <div className="dd-strip-num">01</div>
              <h3>Thăm khám & tư vấn</h3>
              <p>Bác sĩ sẽ thăm khám toàn diện, chụp X-quang kỹ thuật số và trao đổi về mục tiêu điều trị. Không có áp lực, không có phán xét.</p>
              <p>Mỗi ca điều trị đều có kế hoạch chi tiết được thảo luận rõ ràng trước khi bắt đầu.</p>
              <ul className="dd-strip-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Khám tổng quát + X-quang miễn phí
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Lập kế hoạch điều trị cá nhân hóa
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Báo giá minh bạch, không phát sinh
                </li>
              </ul>
            </div>
          </div>
          <div className="dd-strip" data-reveal>
            <div className="dd-strip-media">
              <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&q=78&auto=format&fit=crop" alt="Điều trị nha khoa hiện đại" loading="lazy" />
            </div>
            <div className="dd-strip-text">
              <div className="dd-strip-num">02</div>
              <h3>Điều trị chuyên sâu</h3>
              <p>Thực hiện bởi bác sĩ chuyên khoa với thiết bị hiện đại. Gây tê an toàn, không đau — môi trường điều trị đạt chuẩn vô trùng tuyệt đối.</p>
              <ul className="dd-strip-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Công nghệ tiên tiến, trang thiết bị thế hệ mới
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Bác sĩ chuyên khoa được chứng nhận quốc tế
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Vật tư tiêu hao một lần, kiểm soát nhiễm khuẩn nghiêm ngặt
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dd-cta-band">
        <div className="wd-container">
          <div className="dd-eyebrow">Sẵn sàng bắt đầu?</div>
          <h2>Đặt lịch <em>tư vấn miễn phí</em> ngay hôm nay</h2>
          <p>Bước đầu tiên đến nụ cười hoàn hảo chỉ là một cuộc gặp gỡ.</p>
          <div className="dd-hero-actions">
            <Link to="/dat-lich" className="dd-btn dd-btn-fill">
              Đặt lịch tư vấn
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
