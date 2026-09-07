import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderTitle } from '../utils/text'
import Contact from '../components/Contact'

export default function ContactPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Liên Hệ — Rosette Bakery & Cafe',
    description: 'Liên hệ Rosette Bakery & Cafe để đặt bánh sinh nhật, đặt chỗ trước hoặc đặt tiệc trà nhóm. Địa chỉ, số điện thoại, giờ mở cửa và bản đồ chỉ đường.',
  })

  return (
    <>
      <section className="cbn-page-hero">
        <div className="cbn-container">
          <div className="cbn-ph-eyebrow">Liên hệ</div>
          <h1 className="cbn-ph-title">{renderTitle(settings.contact_hero_title)}</h1>
          <p className="cbn-ph-sub">{settings.contact_hero_desc}</p>
        </div>
      </section>

      <section className="cbn-sec-pad" style={{ background: 'var(--bg)', paddingTop: 'clamp(48px,7vw,80px)' }}>
        <div className="cbn-container">
          <div className="row g-4 mb-5">
            <div className="col-6 col-md-3">
              <div className="cbn-contact-block cbn-reveal cbn-reveal-d1">
                <div className="cbn-cb-icon">📍</div>
                <div className="cbn-cb-label">Địa chỉ</div>
                <div className="cbn-cb-val">{settings.site_address}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="cbn-contact-block cbn-reveal cbn-reveal-d2">
                <div className="cbn-cb-icon">📱</div>
                <div className="cbn-cb-label">Điện thoại</div>
                <div className="cbn-cb-val">{settings.site_phone}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="cbn-contact-block cbn-reveal cbn-reveal-d3">
                <div className="cbn-cb-icon">✉️</div>
                <div className="cbn-cb-label">Email</div>
                <div className="cbn-cb-val">{settings.site_email}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="cbn-contact-block cbn-reveal" style={{ transitionDelay: '.32s' }}>
                <div className="cbn-cb-icon">🕐</div>
                <div className="cbn-cb-label">Giờ mở cửa</div>
                <div className="cbn-cb-val">{settings.working_hours}</div>
              </div>
            </div>
          </div>

          <Contact />
        </div>
      </section>
    </>
  )
}
