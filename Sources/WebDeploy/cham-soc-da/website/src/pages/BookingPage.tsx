import Booking from '../components/Booking'

export default function BookingPage() {
  return (
    <>
      <div className="csd-page-hero" style={{ paddingTop: 'calc(68px + clamp(40px,6vw,72px))' }}>
        <div className="wd-container">
          <div className="csd-ph-tag">Đặt lịch khám</div>
          <h1 className="csd-ph-title">Đặt lịch khám<br /><em>nhanh chóng & dễ dàng</em></h1>
          <p className="csd-ph-sub">Tư vấn đầu tiên miễn phí — bác sĩ phân tích da và lập phác đồ riêng cho bạn.</p>
        </div>
      </div>
      <section className="csd-sec">
        <div className="wd-container">
          <Booking />
        </div>
      </section>
    </>
  )
}
