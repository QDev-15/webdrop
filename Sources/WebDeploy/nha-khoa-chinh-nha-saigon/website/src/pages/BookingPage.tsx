import { Link } from 'react-router-dom'
import Booking from '../components/Booking'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BookingPage() {
  useDocumentMeta({
    title: 'Đặt lịch tư vấn — Nha Khoa Chỉnh Nha Sài Gòn',
    description: 'Đặt lịch tư vấn niềng răng miễn phí — đội ngũ Nha Khoa Chỉnh Nha Sài Gòn liên hệ xác nhận lịch hẹn trong vòng 30 phút trong giờ làm việc.',
  })

  return (
    <>
      <section className="cn-page-hero">
        <div className="cn-page-hero-shape" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-ph-inner" data-reveal>
            <div className="cn-breadcrumb">
              <Link to="/">Trang chủ</Link> / <span>Đặt lịch tư vấn</span>
            </div>
            <h1 className="cn-ph-title">Đặt lịch <em>tư vấn miễn phí</em></h1>
            <p className="cn-ph-sub">Điền thông tin bên dưới, chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 30 phút trong giờ làm việc.</p>
          </div>
        </div>
      </section>

      <section className="cn-services sec-pad">
        <div className="wd-container">
          <Booking showSideInfo />
        </div>
      </section>
    </>
  )
}
