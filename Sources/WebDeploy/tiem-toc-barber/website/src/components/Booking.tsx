import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Booking() {
  const { settings } = useSite()
  const phone = settings.site_phone || '0901 234 567'
  const phoneHref = (settings.zalo_number || phone).replace(/\s+/g, '')

  return (
    <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border-gold)', borderBottom: '1px solid var(--border-gold)', padding: 'clamp(56px,8vw,88px) 0' }}>
      <div className="wd-container">
        <div className="row align-items-center g-4">
          <div className="col-lg-8" data-reveal>
            <div className="tb-eyebrow">Đặt lịch ngay</div>
            <h2 className="tb-title mb-2">Phong cách bắt đầu từ<br /><em>một cuộc hẹn.</em></h2>
            <p className="tb-sub">{settings.booking_confirm_note || 'Chúng tôi xác nhận lịch hẹn qua Zalo trong vòng 15 phút. Hủy lịch miễn phí trước 2 tiếng.'}</p>
          </div>
          <div className="col-lg-4 text-lg-end" data-reveal data-delay="1">
            <Link to="/dat-lich" className="tb-btn-gold d-inline-block mb-3">Đặt lịch online →</Link>
            <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 300 }}>
              hoặc gọi <a href={`tel:${phoneHref}`} style={{ color: 'var(--accent-bright)', textDecoration: 'none' }}>{phone}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
