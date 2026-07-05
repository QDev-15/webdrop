import { Link } from 'react-router-dom'
import Booking from '../components/Booking'

export default function BookingPage() {
  return (
    <>
      {/* Page header */}
      <div className="ks-page-head">
        <div className="wd-container">
          <div className="ks-crumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            Đặt lịch khám
          </div>
          <h1 className="ks-title" style={{ fontSize: 'clamp(30px,4.5vw,50px)' }}>
            Đặt lịch <strong>khám răng cho bé</strong>
          </h1>
          <p className="ks-sub ks-mx-auto" style={{ textAlign: 'center', marginTop: 12 }}>
            Chọn ngày giờ phù hợp, chúng tôi sẽ xác nhận lịch hẹn trong vòng 30 phút.
          </p>
        </div>
      </div>

      <section className="ks-sec-pad" aria-label="Form đặt lịch khám">
        <div className="wd-container">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <Booking />
          </div>
        </div>
      </section>
    </>
  )
}
