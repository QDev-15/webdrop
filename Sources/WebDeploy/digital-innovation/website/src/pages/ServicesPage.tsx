import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ServicesPage() {
  const { settings, services } = useSite()
  useDocumentMeta({
    title: `Dịch vụ — ${settings.site_name || 'Digital Innovation'}`,
    description: settings.services_hero_sub,
  })

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">{settings.services_hero_eyebrow || 'Các dịch vụ'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.services_hero_title || 'Giải pháp <em>Công nghệ</em> toàn diện' }} />
          <p className="ph-sub">{settings.services_hero_sub || ''}</p>
        </div>
      </section>

      <section className="di-sec-pad">
        <div className="wd-container">
          <div className="di-feature-grid">
            {services.map(s => (
              <div className="di-feature-card" key={s.id}>
                <div className="di-feature-icon">{s.icon}</div>
                <h3 className="di-feature-title">{s.title}</h3>
                <p className="di-feature-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="di-sec-pad">
        <div className="wd-container">
          <div className="di-cta-section">
            <h2 className="di-cta-title">{settings.services_cta_title || ''}</h2>
            <p className="di-cta-sub">{settings.services_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-di-light">{settings.services_cta_button || 'Yêu cầu demo'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
