import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

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

export default function ProjectsPage() {
  const { settings } = useSite()
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useDocumentMeta({
    title: `Dự án — ${settings.site_name || 'Đăng Photography'}`,
    description: settings.projects_hero_sub,
  })

  useEffect(() => {
    api.get<Project[]>('/public/projects').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <section className="pna-page-hero">
        <div className="wd-container">
          <div className="pna-ph-tag" data-reveal>Dự án</div>
          <h1 className="pna-ph-title" data-reveal>{renderEm(settings.projects_hero_title || 'Những câu chuyện tôi đã kể')}</h1>
          <p className="pna-ph-sub" data-reveal>{settings.projects_hero_sub}</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</p>
          ) : items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có dự án nào.</p>
          ) : (
            <div className="pna-card-grid">
              {items.map((p, i) => (
                <Link to={`/du-an/${p.slug}`} className="pna-card" key={p.id} data-reveal data-reveal-d1={i % 3 === 1 ? true : undefined} data-reveal-d2={i % 3 === 2 ? true : undefined}>
                  <div className="pna-card-thumb"><img src={p.image} alt={p.title} loading="lazy" /></div>
                  <div className="pna-card-body">
                    <div className="pna-card-cat">{p.category}</div>
                    <h2 className="pna-card-title">{p.title}</h2>
                    <p className="pna-card-desc">{p.description}</p>
                    <span className="pna-card-link">Xem case study &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pna-full-bleed" style={{ backgroundImage: `url('${settings.projects_fb_image || ''}')` }}>
        <div className="wd-container" data-reveal>
          <h2 className="pna-fb-title" dangerouslySetInnerHTML={{ __html: (settings.projects_fb_title || '').replace(/\*([^*]+)\*/g, '<em>$1</em>') }} />
          <p className="pna-fb-sub">{settings.projects_fb_sub}</p>
          <Link to="/lien-he" className="pna-btn pna-btn-accent">Đặt lịch tư vấn miễn phí</Link>
        </div>
      </section>
    </main>
  )
}
