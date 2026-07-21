import Booking from '../components/Booking'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BookingPage() {
  useDocumentMeta({
    title: 'Đặt lịch khám — SmileTech Nha Khoa Công Nghệ Cao',
    description: 'Đặt lịch khám trực tuyến tại SmileTech — hệ thống đặt lịch thời gian thực, xác nhận trong vòng 15 phút qua SMS hoặc Zalo.',
  })

  return (
    <>
      <header className="st-page-header">
        <div className="wd-container">
          <div className="st-eyebrow st-center" data-reveal>Đặt lịch</div>
          <h1 className="st-sec-title st-center" data-reveal>
            Đặt lịch khám <span className="st-grad-text">trực tuyến</span>
          </h1>
          <p className="st-sec-sub st-center" data-reveal data-reveal-delay="1">
            Chọn dịch vụ và khung giờ phù hợp — hệ thống đặt lịch thời gian thực, xác nhận trong vòng 15 phút qua SMS hoặc Zalo.
          </p>
          <div className="st-breadcrumb">
            <a href="/">Trang chủ</a> / <span>Đặt lịch</span>
          </div>
        </div>
      </header>
      <section className="st-sec-pad" style={{ paddingTop: 0 }}>
        <Booking />
      </section>
    </>
  )
}
