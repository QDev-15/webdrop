import ContactSection from '../components/Contact'
import BookingCTA from '../components/Booking'

export default function ContactPage() {
  return (
    <>
      {/* Page hero */}
      <section className="ns-page-hero">
        <div className="wd-container">
          <div data-reveal>
            <div className="ns-ph-tag">Liên hệ</div>
            <h1 className="ns-ph-title">Chúng tôi ở <strong>đây cho bạn</strong></h1>
            <p className="ns-ph-sub">Hãy liên hệ để được tư vấn miễn phí hoặc đặt lịch ngay hôm nay.</p>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <ContactSection />
        </div>
      </section>

      <BookingCTA />
    </>
  )
}
