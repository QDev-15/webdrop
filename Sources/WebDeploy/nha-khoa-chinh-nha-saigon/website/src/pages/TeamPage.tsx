import { Link } from 'react-router-dom'
import Team from '../components/Team'

export default function TeamPage() {
  return (
    <>
      <section className="cn-page-hero">
        <div className="cn-page-hero-shape" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-ph-inner" data-reveal>
            <div className="cn-breadcrumb">
              <Link to="/">Trang chủ</Link> / <span>Đội ngũ bác sĩ</span>
            </div>
            <h1 className="cn-ph-title">Đội ngũ <em>chuyên gia chỉnh nha</em></h1>
            <p className="cn-ph-sub">Mỗi bác sĩ đều có chuyên môn sâu về Chỉnh nha và thường xuyên cập nhật kỹ thuật mới nhất từ các hội nghị quốc tế.</p>
          </div>
        </div>
      </section>

      <section className="cn-services sec-pad">
        <div className="wd-container">
          <Team />
        </div>
      </section>

      {/* CTA */}
      <section className="cn-cta sec-pad">
        <div className="cn-cta-shape" aria-hidden="true" />
        <div className="cn-cta-shape b" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-cta-inner" data-reveal>
            <div>
              <h2 className="cn-cta-title">Gặp trực tiếp <em>đội ngũ bác sĩ</em></h2>
              <p className="cn-cta-sub">Đặt lịch tư vấn miễn phí — bác sĩ sẽ thăm khám và tư vấn phương pháp điều trị phù hợp nhất cho bạn.</p>
            </div>
            <div className="cn-cta-actions">
              <Link to="/dat-lich" className="cn-btn cn-btn-primary">Đặt lịch tư vấn</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
