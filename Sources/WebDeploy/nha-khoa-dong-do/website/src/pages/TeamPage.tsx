import { Link } from 'react-router-dom'
import Team from '../components/Team'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TeamPage() {
  useDocumentMeta({
    title: 'Đội ngũ bác sĩ — Nha Khoa Đông Đô',
    description: 'Đội ngũ bác sĩ chuyên khoa hàng đầu tại Nha Khoa Đông Đô — đào tạo chuyên sâu trong nước và quốc tế, không ngừng cập nhật kỹ thuật điều trị mới nhất.',
  })

  return (
    <>
      <div className="dd-page-header">
        <div className="wd-container">
          <div className="dd-breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>Đội ngũ bác sĩ</span>
          </div>
          <h1 className="dd-page-title">Đội ngũ <em>chuyên gia</em></h1>
          <p className="dd-page-sub">Mỗi bác sĩ là một chuyên gia hàng đầu trong lĩnh vực của mình — được đào tạo chuyên sâu trong nước và quốc tế.</p>
        </div>
      </div>

      <section className="dd-section">
        <div className="wd-container">
          <Team />
        </div>
      </section>

      <section className="dd-section dd-section-alt">
        <div className="wd-container">
          <div className="dd-strip" data-reveal>
            <div className="dd-strip-media">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=78&auto=format&fit=crop" alt="Đội ngũ Nha Khoa Đông Đô" loading="lazy" />
            </div>
            <div className="dd-strip-text">
              <div className="dd-strip-num">Cam kết đào tạo</div>
              <h3>Không ngừng <em>nâng cao</em> chuyên môn</h3>
              <p>Đội ngũ bác sĩ Đông Đô tham gia các hội nghị, khóa đào tạo chuyên sâu trong và ngoài nước mỗi năm — đảm bảo luôn áp dụng kỹ thuật tiên tiến nhất vào điều trị.</p>
              <ul className="dd-strip-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Chứng chỉ hành nghề đúng chuẩn Bộ Y tế
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Cập nhật kỹ thuật mới hàng năm
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Hội viên các hiệp hội nha khoa uy tín
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="dd-cta-band">
        <div className="wd-container">
          <div className="dd-eyebrow">Gặp gỡ chuyên gia</div>
          <h2>Đặt lịch <em>tư vấn trực tiếp</em> với bác sĩ</h2>
          <p>Lắng nghe, phân tích và đồng hành — bác sĩ của bạn luôn ở đây.</p>
          <div className="dd-hero-actions">
            <Link to="/dat-lich" className="dd-btn dd-btn-fill">
              Đặt lịch ngay
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
