import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderEmphasis } from '../utils/renderEmphasis'

const STRIP_SECTIONS = ['start', 'philosophy', 'life'] as const

export default function About() {
  const { settings, testimonials } = useSite()

  useDocumentMeta({
    title: `Về tôi — Hạ Vy, người viết ${settings.site_name || 'Cỏ Non Blog'}`,
    description: 'Hạ Vy — mẹ của Kem và Sữa, người viết Cỏ Non Blog từ năm 2021. Câu chuyện, triết lý nuôi con và những cột mốc của blog.',
  })

  const stats = [1, 2, 3, 4].map(i => ({
    number: settings[`about_stat${i}_number`] || '',
    suffix: settings[`about_stat${i}_suffix`] || '',
    label: settings[`about_stat${i}_label`] || '',
  }))

  const milestones = [1, 2, 3, 4, 5]
    .map(i => ({
      year: settings[`milestone${i}_year`] || '',
      title: settings[`milestone${i}_title`] || '',
      text: settings[`milestone${i}_text`] || '',
    }))
    .filter(m => m.year || m.title)

  const feats = [1, 2, 3, 4].map(i => ({
    icon: settings[`about_feat${i}_icon`] || '',
    title: settings[`about_feat${i}_title`] || '',
    text: settings[`about_feat${i}_text`] || '',
  }))

  return (
    <main>
      <section className="bmb-sec bmb-center" style={{ paddingTop: 130, paddingBottom: 20 }}>
        <div className="bmb-container">
          <div className="bmb-eyebrow" data-reveal style={{ display: 'flex', justifyContent: 'center' }}>👋 Về tôi</div>
          <h1 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.about_hero_title || 'Xin chào, mình là *Hạ Vy*')}</h1>
          <p className="bmb-sec-sub" data-reveal>{settings.about_hero_sub || ''}</p>
        </div>
      </section>

      {/* ALTERNATING-STRIPS */}
      <section className="bmb-sec" style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 80 }}>
        {STRIP_SECTIONS.map((sec, i) => (
          <div className="bmb-container" key={sec}>
            <div className={`bmb-strip-row${i % 2 === 1 ? ' reverse' : ''}`} data-reveal>
              <div className="bmb-strip-img">
                <img src={settings[`about_${sec}_image`] || ''} alt={settings[`about_${sec}_title`] || ''} loading="lazy" />
              </div>
              <div className="bmb-strip-text">
                <div className="bmb-eyebrow">{settings[`about_${sec}_eyebrow`] || ''}</div>
                <h2 className="bmb-sec-title" style={{ fontSize: 28 }}>{renderEmphasis(settings[`about_${sec}_title`] || '')}</h2>
                <p className="bmb-sec-sub" style={{ maxWidth: 'none' }}>{settings[`about_${sec}_text`] || ''}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* STAT-BAR */}
      <section className="bmb-statbar">
        <div className="bmb-container">
          <div className="bmb-stats-grid">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="bmb-stat-num">{s.number}{s.suffix}</div>
                <div className="bmb-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bmb-sec">
        <div className="bmb-container">
          <div className="bmb-eyebrow" data-reveal>{settings.milestone_label || '🗓 Cột mốc'}</div>
          <h2 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.milestone_title || 'Những cột mốc của *Cỏ Non*')}</h2>
          <div style={{ height: 32 }}></div>
          <div className="bmb-timeline" data-reveal>
            {milestones.map((m, i) => (
              <div className="bmb-tl-item" key={i}>
                <span className="bmb-tl-dot"></span>
                <div className="bmb-tl-stage">{m.year}</div>
                <h3 className="bmb-tl-title">{m.title}</h3>
                <p className="bmb-tl-text">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE-ICON-ROW */}
      <section className="bmb-sec bmb-sec-tint">
        <div className="bmb-container">
          <div className="bmb-eyebrow bmb-center" data-reveal style={{ display: 'flex', justifyContent: 'center' }}>{settings.about_feat_label || '💫 Giá trị cốt lõi'}</div>
          <h2 className="bmb-sec-title bmb-center" data-reveal>{renderEmphasis(settings.about_feat_title || 'Những điều mình *luôn giữ*')}</h2>
          <div style={{ height: 40 }}></div>
          <div className="bmb-feature-row">
            {feats.map((f, i) => (
              <div className="bmb-feature-item" data-reveal data-reveal-d1={i > 0 ? true : undefined} key={i}>
                <div className="bmb-feature-icon">{f.icon}</div>
                <div className="bmb-feature-title">{f.title}</div>
                <div className="bmb-feature-text">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bmb-sec">
        <div className="bmb-container">
          <div className="bmb-eyebrow bmb-center" data-reveal style={{ display: 'flex', justifyContent: 'center' }}>{settings.about_testi_label || '💬 Độc giả nói gì'}</div>
          <h2 className="bmb-sec-title bmb-center" data-reveal>{renderEmphasis(settings.about_testi_title || 'Cỏ Non trong mắt *độc giả*')}</h2>
          <div style={{ height: 36 }}></div>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div className="col-md-4" data-reveal data-reveal-d1={i > 0 ? true : undefined} key={t.id}>
                <div className="bmb-contact-card" style={{ flexDirection: 'column', textAlign: 'center', gap: 14 }}>
                  {t.author_avatar && <img src={t.author_avatar} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} alt={`Ảnh đại diện độc giả ${t.author_name}`} />}
                  <p style={{ fontStyle: 'italic' }}>"{t.content}"</p>
                  <h4 style={{ margin: 0 }}>{t.author_name}</h4>
                  <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{t.author_meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
