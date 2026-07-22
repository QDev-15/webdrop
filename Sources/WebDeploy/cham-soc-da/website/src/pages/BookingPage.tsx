import Booking from '../components/Booking'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BookingPage() {
  useDocumentMeta({
    title: 'Đặt lịch khám — DermaCare Clinic',
    description: 'Đặt lịch tư vấn da liễu miễn phí — bác sĩ khám, phân tích da bằng máy Visia và lập phác đồ điều trị riêng cho bạn.',
  })

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
