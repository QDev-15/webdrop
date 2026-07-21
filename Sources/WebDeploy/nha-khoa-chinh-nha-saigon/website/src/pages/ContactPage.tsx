import { Link } from 'react-router-dom'
import Contact from '../components/Contact'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  useDocumentMeta({
    title: 'Liên hệ — Nha Khoa Chỉnh Nha Sài Gòn',
    description: 'Liên hệ Nha Khoa Chỉnh Nha Sài Gòn để được tư vấn niềng răng. Xem giờ làm việc, địa chỉ và thông tin liên hệ nhanh chóng.',
  })

  return (
    <>
      <section className="cn-page-hero">
        <div className="cn-page-hero-shape" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-ph-inner" data-reveal>
            <div className="cn-breadcrumb">
              <Link to="/">Trang chủ</Link> / <span>Liên hệ</span>
            </div>
            <h1 className="cn-ph-title">Liên hệ với <em>chúng tôi</em></h1>
            <p className="cn-ph-sub">Có câu hỏi hoặc cần tư vấn? Đội ngũ chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
          </div>
        </div>
      </section>

      <section className="cn-services sec-pad">
        <div className="wd-container">
          <Contact />
        </div>
      </section>

      {/* Working hours */}
      <section className="cn-services sec-pad" style={{ background: 'var(--bg-2)', paddingTop: 0 }}>
        <div className="wd-container" style={{ maxWidth: '600px' }}>
          <div className="cn-text-center" data-reveal style={{ marginBottom: '32px' }}>
            <div className="cn-eyebrow" style={{ justifyContent: 'center' }}>Giờ hoạt động</div>
            <h2 className="cn-title">Lịch làm việc <em>hàng tuần</em></h2>
          </div>
          <ul className="cn-hours-list" data-reveal>
            <li><span className="cn-hours-day">Thứ 2 – Thứ 6</span><span className="cn-hours-time">08:00 – 20:00</span></li>
            <li><span className="cn-hours-day">Thứ 7</span><span className="cn-hours-time">08:00 – 18:00</span></li>
            <li><span className="cn-hours-day">Chủ nhật</span><span className="cn-hours-time">08:00 – 12:00</span></li>
          </ul>
        </div>
      </section>
    </>
  )
}
