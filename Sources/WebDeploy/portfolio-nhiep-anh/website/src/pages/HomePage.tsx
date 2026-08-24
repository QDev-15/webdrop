import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { api } from '../api/client'
import HeroSlider from '../components/HeroSlider'

interface Project {
  id: number
  title: string
  slug: string
  category: string
  description: string
  image: string
}

function renderEm(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => (part.startsWith('*') && part.endsWith('*')) ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>)
}

export default function HomePage() {
  const { settings, testimonials } = useSite()
  const [featured, setFeatured] = useState<Project[]>([])

  useDocumentMeta({
    title: `${settings.site_name || 'Đăng Photography'} — ${settings.site_tagline || 'Nhiếp ảnh gia cưới tự do'} | Đà Lạt`,
    description: settings.site_description,
  })

  useEffect(() => {
    api.get<Project[]>('/public/featured-projects').then(setFeatured).catch(() => {})
  }, [])

  useCounterAnimation([settings])

  const teaser = testimonials[0]

  return (
    <main>
      <HeroSlider />

      {/* INTRO + FEATURE-ICON-ROW */}
      <section className="sec-pad pna-intro">
        <div className="wd-container">
          <div className="pna-intro-row">
            <div data-reveal>
              <div className="pna-eyebrow">Giới thiệu</div>
              <h2 className="pna-sec-title">Chào, tôi là <em>{settings.home_intro_name || 'Đăng'}</em></h2>
            </div>
            <div data-reveal data-reveal-d1>
              <p className="pna-intro-lead">{renderEm(settings.home_intro_lead || '')}</p>
              <div className="pna-feature-row">
                {[1, 2, 3].map(i => (
                  <div className="pna-feature-item" key={i}>
                    <div className="pna-feature-num">0{i}</div>
                    <div className="pna-feature-title">{settings[`feature${i}_title`]}</div>
                    <div className="pna-feature-text">{settings[`feature${i}_text`]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featured.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="pna-sec-head-row" data-reveal>
              <div>
                <div className="pna-eyebrow">Dự án nổi bật</div>
                <h2 className="pna-sec-title pna-mb-0">Những câu chuyện <em>đã kể</em></h2>
              </div>
              <Link to="/du-an" className="pna-btn pna-btn-ghost">Xem tất cả dự án</Link>
            </div>
            <div className="pna-card-grid">
              {featured.map((p, i) => (
                <Link to={`/du-an/${p.slug}`} className="pna-card" key={p.id} data-reveal data-reveal-d1={i === 1 ? true : undefined} data-reveal-d2={i === 2 ? true : undefined} data-reveal-d3={i === 3 ? true : undefined}>
                  <div className="pna-card-thumb"><img src={p.image} alt={p.title} loading="lazy" /></div>
                  <div className="pna-card-body">
                    <div className="pna-card-cat">{p.category}</div>
                    <h3 className="pna-card-title">{p.title}</h3>
                    <p className="pna-card-desc">{p.description}</p>
                    <span className="pna-card-link">Xem dự án &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STAT-BAR */}
      <section className="pna-stat-bar">
        <div className="wd-container">
          <div className="pna-stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} data-reveal>
                <div className="pna-stat-num" data-counter={settings[`stat${i}_number`] || '0'} data-suffix={settings[`stat${i}_suffix`] || ''}>0</div>
                <div className="pna-stat-label">{settings[`stat${i}_label`]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALTERNATING-STRIP — Dịch vụ teaser */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="pna-strip" data-reveal>
            {settings.home_strip_image && (
              <div className="pna-strip-media"><img src={settings.home_strip_image} alt="Dịch vụ chụp ảnh cưới" loading="lazy" /></div>
            )}
            <div>
              <div className="pna-strip-label">{settings.home_strip_label}</div>
              <h2 className="pna-strip-title">{settings.home_strip_title}</h2>
              <p className="pna-strip-text">{settings.home_strip_text}</p>
              <Link to="/dich-vu" className="pna-btn pna-btn-accent">Xem bảng giá dịch vụ</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL TEASER */}
      {teaser && (
        <section className="sec-pad pna-testi-teaser">
          <div className="wd-container pna-center" data-reveal>
            <div className="pna-eyebrow" style={{ justifyContent: 'center' }}>Khách hàng nói gì</div>
            <p className="pna-testi-quote">&quot;{teaser.content}&quot;</p>
            <div className="pna-testi-source">
              {teaser.author_avatar && <img className="pna-testi-avatar" src={teaser.author_avatar} alt={teaser.author_name} />}
              <div style={{ textAlign: 'left' }}>
                <div className="pna-testi-name">{teaser.author_name}</div>
                <div className="pna-testi-role">{teaser.author_title}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FULL-BLEED CTA */}
      <section className="pna-full-bleed" style={{ backgroundImage: `url('${settings.home_fb_image || ''}')` }}>
        <div className="wd-container" data-reveal>
          <h2 className="pna-fb-title" dangerouslySetInnerHTML={{ __html: (settings.home_fb_title || '').replace(/\*([^*]+)\*/g, '<em>$1</em>') }} />
          <p className="pna-fb-sub">{settings.home_fb_sub}</p>
          <Link to="/lien-he" className="pna-btn pna-btn-accent">Đặt lịch tư vấn miễn phí</Link>
        </div>
      </section>
    </main>
  )
}
