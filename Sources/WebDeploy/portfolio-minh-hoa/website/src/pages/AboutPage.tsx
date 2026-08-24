import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function renderText(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return <span key={i}>{part}</span>
  })
}

export default function AboutPage() {
  const { settings, testimonials } = useSite()

  useDocumentMeta({
    title: `Về tôi — ${settings.site_name || 'Lam Trúc Illustration'}`,
    description: settings.about_hero_sub || 'Lam Trúc — hành trình làm họa sĩ minh họa tự do, phong cách vẽ, công cụ sử dụng và những gì khách hàng nói.',
  })

  const timeline = [1, 2, 3, 4, 5, 6].map(i => ({
    year: settings[`timeline${i}_year`] || '',
    title: settings[`timeline${i}_title`] || '',
    text: settings[`timeline${i}_text`] || '',
  }))

  return (
    <>
      <section className="pmh-page-hero">
        <div className="pmh-container inner">
          <div className="pmh-crumb"><Link to="/">Trang chủ</Link> / Về tôi</div>
          <h1>{renderText(settings.about_hero_title || 'Xin chào, mình là *Lam Trúc*')}</h1>
          <p>{settings.about_hero_sub}</p>
        </div>
      </section>

      {/* Bio */}
      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-strip" data-reveal>
            <div className="pmh-strip-img">
              {settings.about_bio_image && <img src={settings.about_bio_image} alt="Lam Trúc đang phác thảo trong studio làm việc" loading="lazy" />}
            </div>
            <div className="pmh-strip-text">
              <div className="pmh-label">{settings.about_bio_label || 'Xin chào'}</div>
              <h3>{settings.about_bio_title}</h3>
              <p>{settings.about_bio_text1}</p>
              <p>{settings.about_bio_text2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pmh-sec-sm" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="pmh-container-sm">
          <div className="pmh-sec-head" data-reveal>
            <div className="pmh-label">{settings.timeline_label || 'Hành trình'}</div>
            <h2 className="pmh-sec-title">{renderText(settings.timeline_title || '8 năm *làm nghề*')}</h2>
          </div>
          <div className="pmh-timeline" data-reveal>
            {timeline.map((t, i) => (
              <div className="pmh-tl-item" key={i}>
                <div className="pmh-tl-year">{t.year}</div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phong cách + Công cụ */}
      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-strip rev" data-reveal>
            <div className="pmh-strip-img">
              {settings.style_image && <img src={settings.style_image} alt="Bảng màu pastel-earthy trong phong cách minh họa của Lam Trúc" loading="lazy" />}
            </div>
            <div className="pmh-strip-text">
              <div className="pmh-label">{settings.style_label || 'Phong cách'}</div>
              <h3>{settings.style_title}</h3>
              <p>{settings.style_text1}</p>
              <p>{settings.style_text2}</p>
            </div>
          </div>

          <div className="pmh-strip" data-reveal>
            <div className="pmh-strip-img">
              {settings.tools_image && <img src={settings.tools_image} alt="Công cụ vẽ digital Procreate trên iPad và bút chì phác thảo" loading="lazy" />}
            </div>
            <div className="pmh-strip-text">
              <div className="pmh-label">{settings.tools_label || 'Công cụ'}</div>
              <h3>{settings.tools_title}</h3>
              <p>{settings.tools_text1}</p>
              <p>{settings.tools_text2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials đầy đủ */}
      <section className="pmh-sec pmh-halftone" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)' }}>
        <div className="pmh-container">
          <div className="pmh-sec-head center" data-reveal>
            <div className="pmh-label">{settings.about_testi_label || 'Nhận xét'}</div>
            <h2 className="pmh-sec-title">{renderText(settings.about_testi_title || 'Khách hàng & đối tác *đã hợp tác*')}</h2>
          </div>
          <div className="pmh-featured-grid">
            {testimonials.map((t, i) => (
              <div className="pmh-quote-card" key={t.id} data-reveal={`d${(i % 4) + 1}`}>
                <div className="stars">{'★'.repeat(t.rating)}</div>
                <p>"{t.content}"</p>
                <div className="pmh-quote-who">
                  {t.author_avatar && <img src={t.author_avatar} alt={t.author_name} loading="lazy" />}
                  <div><strong>{t.author_name}</strong><span>{t.author_title}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pmh-sec-sm">
        <div className="pmh-container">
          <div className="pmh-cta-band" data-reveal>
            <div className="inner">
              <h2>{settings.about_cta_title}</h2>
              <p>{settings.about_cta_text}</p>
              <div className="pmh-cta-row">
                <Link to="/lien-he" className="pmh-btn pmh-btn-white">Liên hệ ngay</Link>
                <Link to="/du-an" className="pmh-btn pmh-btn-ghost-dark" style={{ borderColor: 'rgba(255,255,255,.6)' }}>Xem dự án</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
