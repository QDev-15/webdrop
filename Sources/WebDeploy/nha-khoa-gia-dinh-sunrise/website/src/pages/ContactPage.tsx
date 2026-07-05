import { Link } from 'react-router-dom'
import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      <div className="sr-page-header">
        <div className="wd-container">
          <div className="sr-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span>Liên hệ</span>
          </div>
          <h1 className="sr-page-header-title">Liên hệ <em>với chúng tôi</em></h1>
          <p className="sr-page-header-sub">
            Có câu hỏi hoặc cần tư vấn? Đội ngũ Sunrise luôn sẵn sàng hỗ trợ bạn — vui lòng liên hệ
            qua các kênh dưới đây hoặc gửi tin nhắn trực tiếp.
          </p>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          <Contact />
        </div>
      </section>
    </>
  )
}
