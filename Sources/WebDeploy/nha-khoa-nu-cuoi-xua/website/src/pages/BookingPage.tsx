import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import Booking from '../components/Booking'

export default function BookingPage() {
  const { settings } = useSite()
  const phone = settings.site_phone || '0901 234 567'

  return (
    <>
      {/* Page hero */}
      <div className="nc-page-hero">
        <div className="wd-container nc-strip-inner">
          <div className="nc-ph-crumb">
            <Link to="/">Trang chủ</Link> / Đặt lịch
          </div>
          <h1 className="nc-ph-title">Đặt <span>lịch khám</span></h1>
          <p className="nc-ph-sub">Chọn thời gian phù hợp — chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút trong giờ làm việc.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg-2)' }}>
        <div className="wd-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'start' }}>
            {/* Form */}
            <div style={{ gridColumn: 'span 2' }} data-reveal>
              <Booking />
            </div>

            {/* Info sidebar */}
            <div data-reveal data-delay="2">
              <div className="nc-info-panel">
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--mustard)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '18px' }}>
                  Lưu ý khi đặt lịch
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    'Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút (trong giờ làm việc)',
                    'Vui lòng đến trước 10 phút để hoàn thành thủ tục',
                    'Mang theo CMND/CCCD lần đầu đến khám',
                    'Hủy lịch vui lòng báo trước ít nhất 2 giờ',
                    `Các trường hợp cấp cứu, vui lòng gọi trực tiếp: ${phone}`,
                  ].map((note, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'rgba(245,239,221,.75)', lineHeight: 1.65 }}>
                      <span style={{ color: 'var(--mustard)', flexShrink: 0 }}>✦</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '24px', background: 'var(--surface)', border: '2px dashed var(--text)', boxShadow: '5px 5px 0 var(--accent)', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>
                  Giờ làm việc
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    { day: 'Thứ 2 — Thứ 6', time: '8:00 — 20:00' },
                    { day: 'Thứ 7', time: '8:00 — 18:00' },
                    { day: 'Chủ nhật', time: '8:00 — 12:00' },
                  ].map(h => (
                    <li key={h.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', padding: '8px 0', borderBottom: '1px dashed var(--border-light)', color: 'var(--text-2)' }}>
                      <span>{h.day}</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
