import { NavLink } from 'react-router-dom'
import Booking from '../components/Booking'
import { useSite } from '../App'

export default function BookingPage() {
  const { settings } = useSite()

  return (
    <>
      <section className="lx-page-hero">
        <div className="wd-container lx-ph-inner">
          <div className="lx-ph-crumb">
            <NavLink to="/">Trang chủ</NavLink> / Đặt lịch
          </div>
          <div className="lx-ph-eyebrow">Tư vấn miễn phí</div>
          <h1 className="lx-ph-title">Đặt lịch<br /><em>Ngay hôm nay</em></h1>
          <p className="lx-ph-sub">
            Điền form bên dưới — bác sĩ sẽ liên hệ xác nhận trong vòng 15 phút và tư vấn phác đồ điều trị phù hợp nhất cho bạn.
          </p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row gy-5">
            <div className="col-lg-7" data-reveal>
              <div className="lx-eyebrow" style={{ marginBottom: 20 }}>Đặt lịch khám</div>
              <Booking />
            </div>

            {/* Sidebar info */}
            <div className="col-lg-5" data-reveal data-delay="1">
              <div className="lx-info-panel">
                <div className="lx-info-title">Thông tin<br /><em>Đặt lịch</em></div>
                <div className="lx-info-item">
                  <div className="lx-info-icon">📞</div>
                  <div className="lx-info-text">
                    <strong>Hotline đặt lịch</strong>
                    <a href={`tel:${settings.site_phone}`} style={{ color: 'rgba(255,255,255,.55)' }}>{settings.site_phone}</a>
                  </div>
                </div>
                <div className="lx-info-item">
                  <div className="lx-info-icon">🕐</div>
                  <div className="lx-info-text">
                    <strong>Giờ tiếp nhận</strong>
                    {settings.working_hours}
                  </div>
                </div>
                <div className="lx-info-item">
                  <div className="lx-info-icon">📍</div>
                  <div className="lx-info-text">
                    <strong>Địa chỉ</strong>
                    {settings.site_address}
                  </div>
                </div>

                <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.1)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', letterSpacing: .8, marginBottom: 16 }}>
                    Quy trình khám
                  </div>
                  {[
                    'Đặt lịch trực tuyến hoặc qua hotline',
                    'Nhận xác nhận lịch từ lễ tân',
                    'Khám & chụp X-quang miễn phí',
                    'Tư vấn phác đồ chi tiết',
                    'Lên lịch điều trị phù hợp',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 22, height: 22, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.6 }}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
