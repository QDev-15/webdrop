import { NavLink } from 'react-router-dom'
import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      <section className="lx-page-hero">
        <div className="wd-container lx-ph-inner">
          <div className="lx-ph-crumb">
            <NavLink to="/">Trang chủ</NavLink> / Liên hệ
          </div>
          <div className="lx-ph-eyebrow">Kết nối với chúng tôi</div>
          <h1 className="lx-ph-title">Liên hệ<br /><em>LuxDental</em></h1>
          <p className="lx-ph-sub">
            Có câu hỏi về dịch vụ hay muốn đặt lịch? Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.
          </p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <Contact />
        </div>
      </section>
    </>
  )
}
