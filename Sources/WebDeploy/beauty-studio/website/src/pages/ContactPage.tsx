import Contact from '../components/Contact'
import { Link } from 'react-router-dom'

export default function ContactPage() {
  return (
    <>
      <div style={{ paddingTop: 64, background: 'var(--dark2)', borderBottom: '1px solid var(--border-pink)', textAlign: 'center', padding: 'calc(64px + clamp(32px,5vw,60px)) 20px clamp(32px,5vw,56px)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 16 }}>Liên hệ</div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,56px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 12 }}>
          Luôn sẵn sàng — <em style={{ color: 'var(--accent)', fontStyle: 'normal', fontWeight: 300 }}>lắng nghe bạn</em>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-3)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
          Ghé thăm studio hoặc gửi tin nhắn — chúng tôi phản hồi trong vòng 24 giờ.
        </p>
      </div>

      <Contact />

      <div className="bst-cta-section">
        <div className="wd-container">
          <h2 className="bst-cta-title" style={{ fontSize: 'clamp(22px,3vw,36px)' }}>Muốn đặt lịch <em>ngay bây giờ?</em></h2>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <Link to="/dat-lich" className="bst-btn-primary">✨ Đặt lịch ngay</Link>
            <Link to="/dich-vu" className="bst-btn-ghost">Xem dịch vụ & giá</Link>
          </div>
        </div>
      </div>
    </>
  )
}
