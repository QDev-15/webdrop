import { Link } from 'react-router-dom'
import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      <div className="dd-page-header">
        <div className="wd-container">
          <div className="dd-breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>Liên hệ</span>
          </div>
          <h1 className="dd-page-title">Liên hệ <em>với chúng tôi</em></h1>
          <p className="dd-page-sub">Chúng tôi lắng nghe mọi câu hỏi, phản hồi và yêu cầu hợp tác. Thời gian phản hồi thông thường: trong vòng 24 giờ làm việc.</p>
        </div>
      </div>

      <section className="dd-section">
        <div className="wd-container">
          <Contact />
        </div>
      </section>

      <section className="dd-section dd-section-alt">
        <div className="wd-container">
          <div className="dd-map-wrap" data-reveal>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096!2d105.8412!3d21.0278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAxJzQwLjEiTiAxMDXCsDUwJzI4LjMiRQ!5e0!3m2!1svi!2svn!4v1234567890"
              width="100%"
              height="420"
              style={{ border: 0, borderRadius: '12px', display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí Nha Khoa Đông Đô trên Google Maps"
            />
          </div>
        </div>
      </section>
    </>
  )
}
