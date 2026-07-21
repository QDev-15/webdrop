import { Link } from 'react-router-dom'
import Booking from '../components/Booking'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BookingPage() {
  useDocumentMeta({
    title: 'Đặt lịch khám — Sunrise Nha Khoa Gia Đình',
    description: 'Đặt lịch khám nha khoa nhanh chóng tại Sunrise — điền form, chúng tôi liên hệ xác nhận trong vòng 30 phút, hoàn toàn miễn phí.',
  })

  return (
    <>
      <div className="sr-page-header">
        <div className="wd-container">
          <div className="sr-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span>Đặt lịch khám</span>
          </div>
          <h1 className="sr-page-header-title">Đặt lịch khám <em>nhanh chóng</em></h1>
          <p className="sr-page-header-sub">
            Điền form dưới đây — chúng tôi sẽ liên hệ xác nhận lịch khám trong vòng 30 phút trong giờ làm việc.
            Hoàn toàn miễn phí, không cam kết.
          </p>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          <Booking />
        </div>
      </section>
    </>
  )
}
