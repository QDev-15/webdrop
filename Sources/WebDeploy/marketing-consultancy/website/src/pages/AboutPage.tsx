import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function AboutPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Về chúng tôi — ${settings.site_name || 'Markco'}`,
    description: settings.about_hero_sub,
  })

  const stories = [1, 2].map(i => ({
    label: settings[`about_story${i}_label`] || '',
    title: settings[`about_story${i}_title`] || '',
    desc: settings[`about_story${i}_desc`] || '',
    image: settings[`about_story${i}_image`] || '',
  }))

  const values = [1, 2, 3, 4].map(i => ({
    icon: settings[`value${i}_icon`] || '',
    title: settings[`value${i}_title`] || '',
    desc: settings[`value${i}_desc`] || '',
  }))

  const stats = [1, 2, 3, 4].map(i => ({
    number: settings[`stat${i}_number`] || '',
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  }))

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">{settings.about_hero_eyebrow || 'Câu chuyện của chúng tôi'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.about_hero_title || 'Về <em>Markco</em>' }} />
          <p className="ph-sub">{settings.about_hero_sub || ''}</p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          {stories.map((s, i) => (
            <div className="mc-project-item" key={i}>
              <div className="mc-project-content">
                <div className="mc-label">{s.label}</div>
                <h3>{s.title}</h3>
                {s.desc.split('\n\n').map((para, pi) => (
                  <p className="mc-project-desc" key={pi}>{para}</p>
                ))}
              </div>
              <div className="mc-project-image">
                {s.image ? <img src={s.image} alt={s.title} /> : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="mc-sec-pad mc-sec-dark" style={{ background: 'linear-gradient(135deg, #2a2635, #1a1820)', color: '#fff' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="mc-eyebrow">{settings.about_values_eyebrow || 'Giá trị cốt lõi'}</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#fff', marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: settings.about_values_title || 'Những giá trị <em>dẫn dắt</em> chúng tôi' }} />
          </div>

          <div className="mc-feature-grid">
            {values.map((v, i) => (
              <div className="mc-feature-card" style={{ background: 'rgba(255,255,255,.05)', borderColor: 'rgba(255,255,255,.1)' }} key={i}>
                <div className="mc-feature-icon" style={{ background: i % 2 === 0 ? 'rgba(155, 126, 240, .2)' : 'rgba(52, 201, 142, .2)', color: i % 2 === 0 ? 'var(--accent-mid)' : 'var(--mint)' }}>{v.icon}</div>
                <h3 className="mc-feature-title" style={{ color: '#fff' }}>{v.title}</h3>
                <p className="mc-feature-desc" style={{ color: 'rgba(255,255,255,.7)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mc-stats">
        <div className="wd-container">
          <div className="mc-stats-grid">
            {stats.map((s, i) => (
              <div className="mc-stat-item" key={i}>
                <div className="mc-stat-number">{s.number}{s.suffix}</div>
                <div className="mc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          <div className="mc-cta-section">
            <h2 className="mc-cta-title">{settings.about_cta_title || ''}</h2>
            <p className="mc-cta-sub">{settings.about_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-mc-light">{settings.about_cta_button || 'Bắt đầu hôm nay'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
