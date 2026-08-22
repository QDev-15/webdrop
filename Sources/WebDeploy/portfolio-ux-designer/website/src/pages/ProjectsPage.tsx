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
  image: string
  short_desc: string
  has_case_study: number
}

export default function ProjectsPage() {
  const { settings } = useSite()
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useDocumentMeta({
    title: `Dự án — ${settings.site_name || 'Đỗ Khánh Linh'} | Product Designer`,
    description: settings.projects_hero_sub,
  })

  useEffect(() => {
    api.get<Project[]>('/public/projects').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <section className="pux-page-hero">
        <span className="blob blob-a"></span>
        <span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="pux-crumb"><Link to="/">Trang chủ</Link> / Dự án</div>
          <div className="eyebrow eyebrow-light" data-reveal>{settings.projects_hero_eyebrow || 'Portfolio'}</div>
          <h1 className="sec-title on-dark" style={{ maxWidth: 640 }} data-reveal>{renderTitle(settings.projects_hero_title || 'Dự án UX/UI cho *mobile app & sản phẩm SaaS.*')}</h1>
          <p className="sec-sub on-dark" data-reveal data-reveal-d1>{settings.projects_hero_sub}</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</p>
          ) : items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có dự án nào.</p>
          ) : (
            <div className="row g-4">
              {items.map((p, i) => (
                <div className="col-md-6 col-lg-4" data-reveal data-reveal-d1={i % 3 === 1 ? true : undefined} data-reveal-d2={i % 3 === 2 ? true : undefined} key={p.id}>
                  <Link to={p.has_case_study ? `/du-an/${p.slug}` : '#'} className="pux-card pux-proj-card" onClick={e => { if (!p.has_case_study) e.preventDefault() }}>
                    <div className="pux-proj-thumb">
                      <span className="tag">{p.category}</span>
                      {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
                    </div>
                    <div className="pux-proj-body">
                      <div className="pux-proj-cat">{p.category}</div>
                      <div className="pux-proj-name">{p.title}</div>
                      {p.short_desc && <div className="pux-proj-desc">{p.short_desc}</div>}
                      {!!p.has_case_study && <div className="pux-proj-more">Xem case study →</div>}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
