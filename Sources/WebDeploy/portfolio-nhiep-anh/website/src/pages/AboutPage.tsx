import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function renderEm(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => (part.startsWith('*') && part.endsWith('*')) ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>)
}

export default function AboutPage() {
  const { settings, testimonials } = useSite()

  useDocumentMeta({
    title: `Về tôi — ${settings.site_name || 'Đăng Photography'}`,
    description: settings.about_hero_sub,
  })

  const timeline = [1, 2, 3, 4, 5, 6].map(i => ({
    year: settings[`timeline${i}_year`], title: settings[`timeline${i}_title`], text: settings[`timeline${i}_text`],
  })).filter(t => t.year || t.title)

  const equipment = [1, 2, 3, 4, 5, 6].map(i => ({
    name: settings[`equipment${i}_name`], meta: settings[`equipment${i}_meta`],
  })).filter(e => e.name)

  return (
    <main>
      <section className="pna-page-hero">
        <div className="wd-container">
          <div className="pna-ph-tag" data-reveal>Về tôi</div>
          <h1 className="pna-ph-title" data-reveal>{renderEm(settings.about_hero_title || 'Nhiếp ảnh gia cưới')}</h1>
          <p className="pna-ph-sub" data-reveal>{settings.about_hero_sub}</p>
        </div>
      </section>

      {/* BIO STRIP */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="pna-strip" data-reveal>
            {settings.about_bio_image && (
              <div className="pna-strip-media">
                <img src={settings.about_bio_image} alt="Chân dung nhiếp ảnh gia đang tác nghiệp" loading="lazy" />
              </div>
            )}
            <div>
              <div className="pna-strip-label">{settings.about_bio_label}</div>
              <h2 className="pna-strip-title">{settings.about_bio_title}</h2>
              <p className="pna-strip-text">{settings.about_bio_text1}</p>
              <p className="pna-strip-text">{settings.about_bio_text2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      {timeline.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="pna-center" style={{ marginBottom: 56 }} data-reveal>
              <div className="pna-eyebrow" style={{ justifyContent: 'center' }}>Hành trình</div>
              <h2 className="pna-sec-title">9 năm <em>làm nghề</em></h2>
            </div>
            <div className="pna-timeline">
              {timeline.map((t, i) => (
                <div className="pna-tl-item" key={i} data-reveal>
                  <div className="pna-tl-dot"></div>
                  <div className="pna-tl-year">{t.year}</div>
                  <div className="pna-tl-title">{t.title}</div>
                  <div className="pna-tl-text">{t.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EQUIPMENT & SKILLS */}
      {equipment.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="row g-5">
              <div className="col-lg-5" data-reveal>
                <div className="pna-eyebrow">Thiết bị &amp; kỹ năng</div>
                <h2 className="pna-sec-title">Công cụ cho <em>từng khoảnh khắc</em></h2>
                <p className="pna-sec-sub">Đầu tư thiết bị không phải để khoe — mà để đảm bảo không bỏ lỡ bất kỳ khoảnh khắc nào, dù trong điều kiện ánh sáng khó nhất.</p>
              </div>
              <div className="col-lg-7" data-reveal data-reveal-d1>
                <div className="pna-list-elegant">
                  {equipment.map((e, i) => (
                    <div className="pna-list-row" key={i}>
                      <div className="pna-list-name">{e.name}</div>
                      <div className="pna-list-meta">{e.meta}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS đầy đủ */}
      {testimonials.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="pna-center" style={{ marginBottom: 48 }} data-reveal>
              <div className="pna-eyebrow" style={{ justifyContent: 'center' }}>Khách hàng nói gì</div>
              <h2 className="pna-sec-title">Những lời <em>chân thành</em></h2>
            </div>
            <div className="row g-4">
              {testimonials.map((t, i) => (
                <div className="col-md-4" key={t.id} data-reveal data-reveal-d1={i === 1 ? true : undefined} data-reveal-d2={i === 2 ? true : undefined}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-card)', padding: 28, height: '100%' }}>
                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.7, marginBottom: 20 }}>&quot;{t.content}&quot;</p>
                    <div className="pna-testi-source" style={{ justifyContent: 'flex-start' }}>
                      {t.author_avatar && <img className="pna-testi-avatar" src={t.author_avatar} alt={t.author_name} />}
                      <div><div className="pna-testi-name">{t.author_name}</div><div className="pna-testi-role">{t.author_title}</div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pna-full-bleed" style={{ backgroundImage: `url('${settings.about_fb_image || ''}')` }}>
        <div className="wd-container" data-reveal>
          <h2 className="pna-fb-title" dangerouslySetInnerHTML={{ __html: (settings.about_fb_title || '').replace(/\*([^*]+)\*/g, '<em>$1</em>') }} />
          <p className="pna-fb-sub">{settings.about_fb_sub}</p>
          <Link to="/lien-he" className="pna-btn pna-btn-accent">Đặt lịch tư vấn miễn phí</Link>
        </div>
      </section>
    </main>
  )
}
