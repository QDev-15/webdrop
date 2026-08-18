import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function AboutPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Về chúng tôi — ${settings.site_name || 'Digital Innovation'}`,
    description: settings.about_hero_sub,
  })

  const whyUs = [1, 2, 3].map(i => ({
    title: settings[`why_us_${i}_title`] || '',
    desc: settings[`why_us_${i}_desc`] || '',
  }))

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">{settings.about_hero_eyebrow || 'Câu chuyện'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.about_hero_title || 'Về <em>Digital Innovation</em>' }} />
          <p className="ph-sub">{settings.about_hero_sub || ''}</p>
        </div>
      </section>

      <section className="di-sec-pad">
        <div className="wd-container">
          <h2 className="di-mission-title">Sứ mệnh</h2>
          <p className="di-mission-text">{settings.about_mission_text || ''}</p>

          <h2 className="di-mission-title">Tại sao chọn chúng tôi</h2>
          <div className="di-feature-grid">
            {whyUs.map((w, i) => (
              <div className="di-feature-card" key={i}>
                <h3 className="di-feature-title">{w.title}</h3>
                <p className="di-feature-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="di-sec-pad" style={{ background: 'linear-gradient(135deg, rgba(192, 38, 211, .08), rgba(255, 0, 110, .06))' }}>
        <div className="wd-container">
          <div className="di-cta-section">
            <h2 className="di-cta-title">{settings.about_cta_title || ''}</h2>
            <p className="di-cta-sub">{settings.about_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-di-light">{settings.about_cta_button || 'Yêu cầu tư vấn'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
