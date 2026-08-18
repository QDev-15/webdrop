import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ServicesPage() {
  const { settings, services } = useSite()
  useDocumentMeta({
    title: `Dịch vụ — ${settings.site_name || 'Strategy & Co'}`,
    description: settings.services_hero_sub,
  })

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-label">{settings.services_hero_eyebrow || 'Các dịch vụ'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.services_hero_title || 'Giải pháp <em>Chiến lược</em> toàn diện' }} />
          <p className="ph-sub">{settings.services_hero_sub || ''}</p>
        </div>
      </section>

      <section className="sc-sec-pad">
        <div className="wd-container">
          <div className="sc-feature-grid">
            {services.map(s => (
              <div className="sc-feature-item" key={s.id}>
                <div className="sc-feature-icon">{s.icon}</div>
                <h3 className="sc-feature-title">{s.title}</h3>
                <p className="sc-feature-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sc-cta-section sc-sec-pad">
        <div className="wd-container">
          <h2 className="sc-cta-title">{settings.services_cta_title || ''}</h2>
          <p className="sc-cta-sub">{settings.services_cta_sub || ''}</p>
          <Link to="/lien-he" className="btn-sc">{settings.services_cta_button || 'Liên hệ'}</Link>
        </div>
      </section>
    </>
  )
}
