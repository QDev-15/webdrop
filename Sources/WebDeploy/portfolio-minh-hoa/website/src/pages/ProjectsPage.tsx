import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Project {
  id: number
  title: string
  slug: string
  category: string
  image: string
  year: string
  sort_order: number
}

// Pattern bento lặp lại đúng nhịp template gốc: big, wide, tall, reg, reg, wide, reg, tall, reg, wide, reg, reg
const BENTO_PATTERN = ['b-big', 'b-wide', 'b-tall', 'b-reg', 'b-reg', 'b-wide', 'b-reg', 'b-tall', 'b-reg', 'b-wide', 'b-reg', 'b-reg']

export default function ProjectsPage() {
  const { settings } = useSite()
  const [items, setItems] = useState<Project[]>([])

  useDocumentMeta({
    title: `Dự án — ${settings.site_name || 'Lam Trúc Illustration'}`,
    description: settings.projects_hero_sub || 'Toàn bộ dự án character design, minh họa sách thiếu nhi và editorial illustration của Lam Trúc.',
  })

  useEffect(() => {
    api.get<Project[]>('/public/projects').then(setItems).catch(() => {})
  }, [])

  return (
    <>
      <section className="pmh-page-hero">
        <div className="pmh-container inner">
          <div className="pmh-crumb"><Link to="/">Trang chủ</Link> / Dự án</div>
          <h1>{settings.projects_hero_title ? renderTitleFallback(settings.projects_hero_title) : <>Dự án đã <em>thực hiện</em></>}</h1>
          <p>{settings.projects_hero_sub}</p>
        </div>
      </section>

      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-bento">
            {items.map((p, i) => (
              <Link to={`/du-an/${p.slug}`} className={`pmh-pcard ${BENTO_PATTERN[i % BENTO_PATTERN.length]}`} key={p.id} data-reveal={`d${(i % 4) + 1}`}>
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

      <section className="pmh-sec-sm">
        <div className="pmh-container">
          <div className="pmh-cta-band" data-reveal>
            <div className="inner">
              <h2>{settings.projects_cta_title}</h2>
              <p>{settings.projects_cta_text}</p>
              <div className="pmh-cta-row">
                <Link to="/lien-he" className="pmh-btn pmh-btn-white">Liên hệ trao đổi</Link>
                <Link to="/dich-vu" className="pmh-btn pmh-btn-ghost-dark" style={{ borderColor: 'rgba(255,255,255,.6)' }}>Xem dịch vụ</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function renderTitleFallback(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return <span key={i}>{part}</span>
  })
}
