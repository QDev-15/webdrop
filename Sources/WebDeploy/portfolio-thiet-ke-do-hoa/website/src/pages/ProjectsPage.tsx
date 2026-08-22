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
  has_case_study: number
}

export default function ProjectsPage() {
  const { settings } = useSite()
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useDocumentMeta({
    title: `Dự án — KHOA Design Studio`,
    description: settings.projects_hero_sub,
  })

  useEffect(() => {
    api.get<Project[]>('/public/projects').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <section className="ptk-page-hero">
        <div className="ptk-container">
          <div className="ptk-crumb"><Link to="/">Trang chủ</Link> / Dự án</div>
          <h1 className="ptk-page-title">{renderTitle(settings.projects_hero_title)}</h1>
          <p className="ptk-page-sub">{settings.projects_hero_sub}</p>
        </div>
      </section>

      <section className="ptk-sec">
        <div className="ptk-container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</p>
          ) : items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có dự án nào.</p>
          ) : (
            <div className="ptk-proj-grid" data-reveal>
              {items.map(p => (
                <Link key={p.id} to={p.has_case_study ? `/du-an/${p.slug}` : '/du-an'} className="ptk-proj-card">
                  {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
                  <div className="ptk-proj-arrow">→</div>
                  <div className="ptk-proj-info"><span className="ptk-proj-cat">{p.category}</span><span className="ptk-proj-name">{p.title}</span></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="ptk-cta-band">
        <div className="ptk-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }} data-reveal>
          <h2 className="ptk-cta-h">{renderTitle(settings.cta_projects_title)}</h2>
          <Link to="/lien-he" className="ptk-btn ptk-btn-white" style={{ borderColor: '#fff' }}>{settings.cta_projects_button || 'Nhận báo giá miễn phí'}</Link>
        </div>
      </section>
    </main>
  )
}
