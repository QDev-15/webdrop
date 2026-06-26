import Booking from '../components/Booking'

export default function BookingPage() {
  return (
    <>
      <section className="ps-page-hero">
        <div className="wd-container">
          <div className="reveal">
            <div className="ps-page-hero-label">Đăng ký</div>
            <h1 className="ps-page-hero-title">Bắt đầu hành trình<br />pilates của bạn.</h1>
            <p className="ps-page-hero-sub">Điền thông tin bên dưới — chúng tôi sẽ liên hệ trong vòng 2 giờ để xác nhận lịch.</p>
          </div>
        </div>
      </section>
      <Booking />
    </>
  )
}
