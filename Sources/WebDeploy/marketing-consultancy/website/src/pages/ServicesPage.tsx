import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ServicesPage() {
  const { settings, services } = useSite()
  useDocumentMeta({
    title: `Dịch vụ — ${settings.site_name || 'Markco'}`,
    description: settings.services_hero_sub,
  })

  const packages = [1, 2, 3].map(i => ({
    name: settings[`pricing_pkg${i}_name`] || '',
    badge: settings[`pricing_pkg${i}_badge`] || '',
    price: settings[`pricing_pkg${i}_price`] || '',
    desc: settings[`pricing_pkg${i}_desc`] || '',
    features: (settings[`pricing_pkg${i}_features`] || '').split('\n').filter(Boolean),
  }))

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">{settings.services_hero_eyebrow || 'Các dịch vụ chính'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.services_hero_title || 'Giải pháp Marketing <em>Toàn Diện</em>' }} />
          <p className="ph-sub">{settings.services_hero_sub || ''}</p>
        </div>
      </section>

      {/* SERVICES — alternating detail list */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          {services.map((s, i) => (
            <div className="mc-project-item" key={s.id}>
              <div className="mc-project-content">
                <div className="mc-label">Dịch vụ {i + 1}</div>
                <h3>{s.title}</h3>
                <p className="mc-project-desc">{s.long_desc || s.short_desc}</p>
              </div>
              <div className="mc-project-image" style={{ background: i % 2 === 0 ? 'linear-gradient(135deg, var(--accent-light), var(--mint-light))' : 'linear-gradient(135deg, var(--mint-light), var(--accent-light))' }}>
                {s.image ? <img src={s.image} alt={s.title} /> : <span>{s.icon} {s.title}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PACKAGES */}
      <section className="mc-sec-pad" style={{ background: 'linear-gradient(135deg, rgba(155, 126, 240, .05), rgba(52, 201, 142, .05))' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="mc-eyebrow">{settings.pricing_eyebrow || 'Gói dịch vụ'}</div>
            <h2 className="mc-title" dangerouslySetInnerHTML={{ __html: settings.pricing_title || 'Chọn gói phù hợp <em>cho doanh nghiệp</em> của bạn' }} />
          </div>

          <div className="mc-feature-grid">
            {packages.map((pkg, i) => (
              <div className={`mc-feature-card mc-pricing-card${i === 1 ? ' featured' : ''}`} key={i}>
                {pkg.badge && <div className="mc-pricing-badge">{pkg.badge}</div>}
                <h3 className="mc-feature-title">{pkg.name}</h3>
                <div className="mc-pricing-price">{pkg.price}</div>
                <p className="mc-feature-desc mc-pricing-desc">{pkg.desc}</p>
                <ul className="mc-pricing-features">
                  {pkg.features.map((f, fi) => <li key={fi}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          <div className="mc-cta-section">
            <h2 className="mc-cta-title">{settings.services_cta_title || ''}</h2>
            <p className="mc-cta-sub">{settings.services_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-mc-light">{settings.services_cta_button || 'Yêu cầu tư vấn'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
