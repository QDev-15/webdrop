import Booking from '../components/Booking'

export default function BookingPage() {
  return (
    <main>
      {/* Page hero */}
      <section style={{ background: 'var(--dark2)', padding: 'clamp(40px,6vw,80px) 0', textAlign: 'center' }}>
        <div className="wd-container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#4ade80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            <span style={{ width: 24, height: 1, background: '#4ade80', display: 'inline-block' }} />
            Đặt lịch trực tuyến
          </div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 600, color: '#fff', marginBottom: 12, lineHeight: 1.25 }}>
            Đặt lịch <em style={{ color: '#4ade80', fontStyle: 'italic' }}>dễ dàng</em> — chỉ vài bước
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', fontWeight: 300, maxWidth: 440, margin: '0 auto', lineHeight: 1.8 }}>
            Chọn dịch vụ, ngày giờ và thông tin liên hệ. Chúng tôi xác nhận trong 15 phút.
          </p>
        </div>
      </section>

      {/* Booking form */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Booking />
        </div>
      </section>
    </main>
  )
}
