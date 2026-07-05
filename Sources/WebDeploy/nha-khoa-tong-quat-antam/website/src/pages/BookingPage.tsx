import Booking from '../components/Booking'

export default function BookingPage() {
  return (
    <>
      <header className="at-page-hero">
        <div className="wd-container">
          <div className="at-ph-eyebrow">
            <span className="at-ph-line" aria-hidden="true" />
            Đặt lịch
          </div>
          <h1 className="at-ph-title">
            Đặt lịch<br />
            <em>khám răng</em>
          </h1>
          <p className="at-ph-sub">
            Chọn thời gian phù hợp và bác sĩ bạn muốn — chúng tôi sẽ xác nhận lịch hẹn trong vòng 2 giờ làm việc.
          </p>
        </div>
      </header>

      <section className="at-sec-pad">
        <div className="wd-container" style={{ maxWidth: 780 }}>
          <Booking />

          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { icon: '🕒', title: 'Giờ làm việc', desc: 'Thứ 2 – Chủ nhật\n8:00 – 20:00' },
              { icon: '📞', title: 'Gọi ngay', desc: 'Tư vấn miễn phí\n028 1234 5678' },
              { icon: '💬', title: 'Zalo', desc: 'Nhắn Zalo để được\nhỗ trợ nhanh nhất' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '24px 20px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }} aria-hidden="true">{item.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
