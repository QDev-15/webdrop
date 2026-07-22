import ContactSection from '../components/Contact'
import BookingCTA from '../components/Booking'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'NAIL Studio'}`,
    description: 'Liên hệ với chúng tôi để được tư vấn miễn phí hoặc đặt lịch hẹn nail ngay hôm nay.',
  })

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
