import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function AboutPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Về chúng tôi — ${settings.site_name || 'Strategy & Co'}`,
    description: settings.about_hero_sub,
  })

  const whyUs = [1, 2, 3].map(i => ({
    icon: settings[`why_us_${i}_icon`] || '',
    title: settings[`why_us_${i}_title`] || '',
    desc: settings[`why_us_${i}_desc`] || '',
  }))

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-label">{settings.about_hero_eyebrow || 'Câu chuyện'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.about_hero_title || 'Về <em>Strategy &amp; Co</em>' }} />
          <p className="ph-sub">{settings.about_hero_sub || ''}</p>
        </div>
      </section>

      <section className="sc-sec-pad">
        <div className="wd-container">
          <h2 className="sc-mission-title">Sứ mệnh</h2>
          <p className="sc-mission-text">{settings.about_mission_text || ''}</p>

          <h2 className="sc-mission-title">Tại sao chọn chúng tôi</h2>
          <div className="sc-feature-grid">
            {whyUs.map((w, i) => (
              <div className="sc-feature-item" key={i}>
                {w.icon && <div className="sc-feature-icon">{w.icon}</div>}
                <h3 className="sc-feature-title">{w.title}</h3>
                <p className="sc-feature-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sc-cta-section sc-sec-pad">
        <div className="wd-container">
          <h2 className="sc-cta-title">{settings.about_cta_title || ''}</h2>
          <p className="sc-cta-sub">{settings.about_cta_sub || ''}</p>
          <Link to="/lien-he" className="btn-sc">{settings.about_cta_button || 'Yêu cầu tư vấn'}</Link>
        </div>
      </section>
    </>
  )
}
