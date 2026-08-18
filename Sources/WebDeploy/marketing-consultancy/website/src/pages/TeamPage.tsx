import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TeamPage() {
  const { settings, team } = useSite()
  useDocumentMeta({
    title: `Đội ngũ — ${settings.site_name || 'Markco'}`,
    description: settings.team_hero_sub,
  })

  const leadership = team.filter(m => m.tier === 'leadership')
  const consultants = team.filter(m => m.tier !== 'leadership')

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">{settings.team_hero_eyebrow || 'Gặp đội ngũ'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.team_hero_title || 'Chuyên gia Marketing <em>Hàng đầu</em>' }} />
          <p className="ph-sub">{settings.team_hero_sub || ''}</p>
        </div>
      </section>

      {/* BAN LÃNH ĐẠO */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="mc-eyebrow">{settings.team_leadership_eyebrow || 'Lãnh đạo công ty'}</div>
            <h2 className="mc-title" dangerouslySetInnerHTML={{ __html: settings.team_leadership_title || 'Ban <em>Lãnh đạo</em>' }} />
          </div>

          <div className="mc-team-grid" style={{ maxWidth: 800, margin: '0 auto' }}>
            {leadership.map(m => (
              <div className="mc-team-card" key={m.id}>
                <div className="mc-team-image">
                  {m.avatar && m.avatar.startsWith('http') ? <img src={m.avatar} alt={m.name} /> : (m.avatar || '👤')}
                </div>
                <h3 className="mc-team-name">{m.name}</h3>
                <div className="mc-team-role">{m.position}</div>
                <p className="mc-team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ĐỘI TƯ VẤN */}
      <section className="mc-sec-pad" style={{ background: 'linear-gradient(135deg, rgba(155, 126, 240, .05), rgba(52, 201, 142, .05))' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="mc-eyebrow">{settings.team_consultants_eyebrow || 'Đội tư vấn'}</div>
            <h2 className="mc-title" dangerouslySetInnerHTML={{ __html: settings.team_consultants_title || 'Chuyên gia <em>Tư vấn</em>' }} />
          </div>

          <div className="row">
            {consultants.map(m => (
              <div className="col-md-6 col-lg-4 mb-4" key={m.id}>
                <div className="mc-team-card">
                  <div className="mc-team-image">
                    {m.avatar && m.avatar.startsWith('http') ? <img src={m.avatar} alt={m.name} /> : (m.avatar || '👤')}
                  </div>
                  <h3 className="mc-team-name">{m.name}</h3>
                  <div className="mc-team-role">{m.position}</div>
                  <p className="mc-team-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          <div className="mc-cta-section">
            <h2 className="mc-cta-title">{settings.team_cta_title || ''}</h2>
            <p className="mc-cta-sub">{settings.team_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-mc-light">{settings.team_cta_button || 'Bắt đầu hôm nay'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
