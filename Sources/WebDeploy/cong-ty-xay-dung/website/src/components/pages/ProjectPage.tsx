import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import type { Project } from '../../contexts/SiteContext'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

const FILTERS = [
  { value: '', label: 'Tất cả' },
  { value: 'dan-dung', label: 'Dân dụng' },
  { value: 'cong-nghiep', label: 'Công nghiệp' },
  { value: 'thuong-mai', label: 'Thương mại' },
  { value: 'biet-thu', label: 'Biệt thự' },
]

export default function ProjectPage() {
  const { settings, projects } = useSite()
  const [activeFilter, setActiveFilter] = useState('')

  useDocumentMeta({
    title: 'Dự án — Công Ty Xây Dựng Hoàng Gia',
    description: 'Các công trình tiêu biểu đã hoàn thành của Công Ty Xây Dựng Hoàng Gia: nhà ở, biệt thự, nhà xưởng công nghiệp, trung tâm thương mại.',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [projects, activeFilter])

  const filtered: Project[] = activeFilter
    ? projects.filter(p => p.category === activeFilter)
    : projects

  return (
    <>
      <div className="xd-page-hero">
        <div className="xd-page-hero-bg">
          <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop" alt="" />
        </div>
        <div className="wd-container">
          <div className="xd-page-hero-content">
            <div className="xd-breadcrumb">
              <Link to="/" style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Trang chủ</Link>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', margin: '0 6px' }}>/</span>
              <span style={{ fontSize: 12, color: 'var(--accent)' }}>Dự án</span>
            </div>
            <div className="xd-ph-eyebrow">Công trình tiêu biểu</div>
            <h1 className="xd-ph-title">Dự án <span style={{ color: 'var(--accent)' }}>đã thực hiện</span></h1>
            <p className="xd-ph-sub">Hơn {settings['stat_projects'] || '350'}+ công trình hoàn thành trên toàn quốc.</p>
          </div>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="xd-filter-bar" data-reveal>
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`xd-filter-btn${activeFilter === f.value ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
              Chưa có dự án nào trong hạng mục này.
            </div>
          ) : (
            <div className="row g-4">
              {filtered.map((p, i) => (
                <div key={p.id} className="col-12 col-md-6 col-lg-4" data-reveal data-delay={(i % 3).toString()}>
                  <Link to={`/du-an/${p.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div className="xd-project-card-full">
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <div className="xd-project-card-overlay">
                        <div className="xd-proj-tag">{CATEGORY_LABELS[p.category] || p.category}</div>
                        <div className="xd-proj-title-card">{p.name}</div>
                        <div className="xd-proj-meta">{p.location} · {p.year_completed}</div>
                      </div>
                    </div>
                    <div style={{ padding: '12px 4px' }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.description?.substring(0, 100)}...</div>
                      {p.area && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>Diện tích: {p.area} · Thời gian: {p.duration}</div>}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {settings['social_zalo'] && (
        <a href={`https://zalo.me/${settings['social_zalo']}`} className="zalo-float" target="_blank" rel="noopener noreferrer">
          <div className="zalo-float-pulse" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" width="30" height="30" />
        </a>
      )}
    </>
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  'dan-dung': 'Dân dụng',
  'cong-nghiep': 'Công nghiệp',
  'thuong-mai': 'Thương mại',
  'biet-thu': 'Biệt thự',
}
