import { Link } from 'react-router-dom'
import Booking from '../components/Booking'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BookingPage() {
  useDocumentMeta({
    title: 'Đặt lịch tư vấn — Nha Khoa Đông Đô',
    description: 'Đặt lịch tư vấn nha khoa tại Nha Khoa Đông Đô — điền thông tin, đội ngũ sẽ liên hệ xác nhận lịch hẹn trong vòng 2 giờ làm việc.',
  })

  return (
    <>
      <div className="dd-page-header">
        <div className="wd-container">
          <div className="dd-breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>Đặt lịch</span>
          </div>
          <h1 className="dd-page-title">Đặt lịch <em>tư vấn</em></h1>
          <p className="dd-page-sub">Điền thông tin bên dưới — đội ngũ sẽ liên hệ xác nhận lịch hẹn trong vòng 2 giờ làm việc.</p>
        </div>
      </div>

      <section className="dd-section">
        <div className="wd-container">
          <div className="dd-booking-wrap">
            <div className="dd-booking-form">
              <Booking />
            </div>
            <div className="dd-booking-aside">
              <div className="dd-aside-block">
                <h4>Quy trình đặt lịch</h4>
                <ol className="dd-aside-steps">
                  <li>
                    <span>1</span>
                    <div>
                      <strong>Gửi yêu cầu</strong>
                      <p>Điền form với thông tin cơ bản và dịch vụ quan tâm.</p>
                    </div>
                  </li>
                  <li>
                    <span>2</span>
                    <div>
                      <strong>Xác nhận lịch</strong>
                      <p>Chuyên gia sẽ gọi điện xác nhận trong 2 giờ làm việc.</p>
                    </div>
                  </li>
                  <li>
                    <span>3</span>
                    <div>
                      <strong>Thăm khám</strong>
                      <p>Đến đúng giờ hẹn, tận hưởng trải nghiệm dịch vụ cao cấp.</p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="dd-aside-block">
                <h4>Hotline</h4>
                <p style={{ fontSize: '22px', fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: 'var(--accent-bright)', marginTop: '8px' }}>
                  1900 6868
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px' }}>Thứ 2 – Chủ nhật: 08:00 – 20:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
