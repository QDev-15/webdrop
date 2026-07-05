import { Link } from 'react-router-dom'
import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <div className="ks-page-head">
        <div className="wd-container">
          <div className="ks-crumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            Liên hệ
          </div>
          <h1 className="ks-title" style={{ fontSize: 'clamp(30px,4.5vw,50px)' }}>
            Liên hệ <strong>với chúng tôi</strong>
          </h1>
          <p className="ks-sub ks-mx-auto" style={{ textAlign: 'center', marginTop: 12 }}>
            Có câu hỏi hay cần tư vấn? KidSmile luôn sẵn sàng lắng nghe và hỗ trợ bạn.
          </p>
        </div>
      </div>

      <section className="ks-sec-pad" aria-label="Thông tin liên hệ">
        <div className="wd-container">
          <Contact />
        </div>
      </section>
    </>
  )
}
