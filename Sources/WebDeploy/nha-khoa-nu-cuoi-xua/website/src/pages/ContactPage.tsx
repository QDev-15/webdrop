import { Link } from 'react-router-dom'
import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      {/* Page hero */}
      <div className="nc-page-hero">
        <div className="wd-container nc-strip-inner">
          <div className="nc-ph-crumb">
            <Link to="/">Trang chủ</Link> / Liên hệ
          </div>
          <h1 className="nc-ph-title">Liên hệ <span>với chúng tôi</span></h1>
          <p className="nc-ph-sub">Chúng tôi sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc — từ tư vấn dịch vụ đến đặt lịch khám.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Contact />
        </div>
      </section>
    </>
  )
}
