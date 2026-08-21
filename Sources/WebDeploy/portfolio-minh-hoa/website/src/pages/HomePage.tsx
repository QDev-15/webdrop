import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'

interface Project {
  id: number
  title: string
  slug: string
  category: string
  image: string
  year: string
}

function renderText(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return <span key={i}>{part}</span>
  })
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let cur = 0
    const step = Math.ceil(target / 60)
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setVal(cur)
      if (cur >= target) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [target])
  return <>{val}{suffix}</>
}

export default function HomePage() {
  const { settings, testimonials } = useSite()
  const [featured, setFeatured] = useState<Project[]>([])

  useDocumentMeta({
    title: settings.meta_title || 'Lam Trúc Illustration',
    description: settings.meta_description,
  })

  useEffect(() => {
    api.get<Project[]>('/public/featured-projects').then(setFeatured).catch(() => {})
  }, [])

  const stats = [1, 2, 3, 4].map(i => ({
    number: Number(settings[`stat${i}_number`] || 0),
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  }))

  return (
    <>
      <HeroSlider />

      {/* INTRO */}
      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-sec-head" data-reveal>
            <div className="pmh-label">{settings.home_intro_label || 'Xin chào'}</div>
            <h2 className="pmh-sec-title">{renderText(settings.home_intro_title || '')}</h2>
            <p className="pmh-sec-sub">{settings.home_intro_text}</p>
          </div>
          <div className="pmh-feature-row">
            {[1, 2, 3].map(i => (
              <div className="pmh-feature-item" key={i} data-reveal={`d${i}`}>
                <div className="pmh-feature-icon">{settings[`feature${i}_icon`] || '✎'}</div>
                <h3>{settings[`feature${i}_title`]}</h3>
                <p>{settings[`feature${i}_text`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DỰ ÁN NỔI BẬT */}
      <section className="pmh-sec pmh-halftone" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="pmh-container">
          <div className="pmh-sec-head split" data-reveal>
            <div>
              <div className="pmh-label">Portfolio</div>
              <h2 className="pmh-sec-title">Dự án <em>nổi bật</em></h2>
            </div>
            <Link to="/du-an" className="pmh-btn pmh-btn-outline pmh-btn-sm">Xem tất cả dự án</Link>
          </div>
          <div className="pmh-featured-grid">
            {featured.map((p, i) => (
              <Link to={`/du-an/${p.slug}`} className="pmh-pcard" key={p.id} data-reveal={`d${i + 1}`}>
                <div className="pmh-pcard-img">
                  <span className="pmh-pcard-tag">{p.category}</span>
                  <img src={p.image} alt={p.title} loading="lazy" />
                </div>
                <div className="pmh-pcard-body"><h3>{p.title}</h3><span>{p.category} · {p.year}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <section className="pmh-stat-bar">
        <div className="pmh-container">
          <div className="pmh-stats-grid">
            {stats.map((s, i) => (
              <div className="pmh-stat-item" key={i} data-reveal={`d${i + 1}`}>
                <div className="num"><Counter target={s.number} suffix={s.suffix} /></div>
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL TEASER */}
      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-sec-head" data-reveal>
            <div className="pmh-label">{settings.home_testi_label || 'Khách hàng nói gì'}</div>
            <h2 className="pmh-sec-title">{renderText(settings.home_testi_title || '')}</h2>
          </div>
        </div>
        <div className="pmh-container">
          <div className="pmh-hscroll" data-reveal>
            {testimonials.slice(0, 3).map(t => (
              <div className="pmh-quote-card" key={t.id}>
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

      {/* CTA */}
      <section className="pmh-sec-sm">
        <div className="pmh-container">
          <div className="pmh-cta-band" data-reveal>
            <div className="inner">
              <h2>{settings.home_cta_title}</h2>
              <p>{settings.home_cta_text}</p>
              <div className="row">
                <Link to="/lien-he" className="pmh-btn pmh-btn-white">Bắt đầu dự án</Link>
                <Link to="/dich-vu" className="pmh-btn pmh-btn-ghost-dark" style={{ borderColor: 'rgba(255,255,255,.6)' }}>Xem bảng giá</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
