import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle } from '../utils/text'

interface Project {
  id: number
  title: string
  slug: string
  category: string
  location: string
  year: string
  image: string
  has_case_study: number
}

export default function ProjectsPage() {
  const { settings } = useSite()
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useDocumentMeta({
    title: `Dự án — ${settings.site_name || 'Tuấn Đặng Studio'}`,
    description: settings.projects_hero_sub,
  })

  useEffect(() => {
    api.get<Project[]>('/public/projects').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <section className="pkt-page-hero sec-light">
        <div className="pkt-container">
          <div className="pkt-eyebrow" data-reveal>Dự án</div>
          <h1 data-reveal>{renderTitle(settings.projects_hero_title || 'Những công trình *chúng tôi tự hào*')}</h1>
          <p data-reveal data-reveal-d1>{settings.projects_hero_sub}</p>
        </div>
      </section>

      <section className="sec-pad sec-surface" style={{ paddingTop: 0 }}>
        <div className="pkt-container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</p>
          ) : items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có dự án nào.</p>
          ) : (
            <div className="pkt-project-grid">
              {items.map((p, i) => (
                <Link
                  key={p.id}
                  to={p.has_case_study ? `/du-an/${p.slug}` : '/du-an'}
                  className="pkt-project-card"
                  data-reveal
                  data-reveal-d1={i % 3 === 1 ? true : undefined}
                  data-reveal-d2={i % 3 === 2 ? true : undefined}
                >
                  <img className="pkt-project-thumb" src={p.image} alt={`${p.title} — ${p.location}`} loading="lazy" />
                  <div className="pkt-project-cat">{p.category}</div>
                  <div className="pkt-project-name">{p.title}</div>
                  <div className="pkt-project-loc">{p.location} · {p.year}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pkt-cta-band sec-light">
        <div className="pkt-container-narrow" data-reveal>
          <div className="pkt-eyebrow center">{settings.cta_projects_eyebrow || 'Dự án tiếp theo, có thể là của bạn'}</div>
          <h2>{renderTitle(settings.cta_projects_title || 'Kể cho chúng tôi nghe *về ngôi nhà bạn đang nghĩ tới*')}</h2>
          <Link to="/lien-he" className="pkt-btn pkt-btn-accent">
            Đặt lịch tư vấn miễn phí
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
