import Booking from '../components/Booking'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BookingPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Đăng ký lớp học — ${settings.site_name}`,
    description: 'Đăng ký buổi học thử pilates ngay hôm nay — chúng tôi sẽ liên hệ xác nhận lịch trong vòng 2 giờ.',
  })

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
