import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

interface Project {
  id: number
  title: string
  category: string
  description: string
  image: string
  tags: string
  client_name: string
}

const CATEGORIES = ['Tất cả', 'Brand Identity', 'Digital Design', 'Campaign', 'Social Media', 'Event Branding', 'Digital Marketing']

export default function ProjectsPage() {
  useDocumentMeta({
    title: 'Dự án — Agency Sáng Tạo',
    description: 'Khám phá các dự án branding, digital design và campaign nổi bật đã thực hiện bởi Agency Sáng Tạo.',
  })
  const { settings } = useSite()
  const [projects, setProjects]     = useState<Project[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeFilter, setActiveFilter] = useState('Tất cả')

  useEffect(() => {
    api.get<Project[]>('/public/projects')
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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

  const filtered = activeFilter === 'Tất cả' ? projects : projects.filter(p => p.category === activeFilter)

  return (
    <main>
      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <div className="ag-ph-label" data-reveal>Portfolio / Dự án</div>
          <h1 className="ag-ph-title" data-reveal>
            <span className="outline">OUR</span><br/>WORK
          </h1>
          <p className="ag-ph-sub" data-reveal>Hơn {settings.stat_projects || '120'} dự án sáng tạo được thực hiện cho các thương hiệu tại Việt Nam và quốc tế. Mỗi dự án là một câu chuyện riêng.</p>
        </div>
      </section>

      {/* STAT BAR */}
      <div className="ag-stat-bar">
        <div className="wd-container">
          <div className="ag-stat-bar-inner">
            <div className="ag-stat-item"><div className="ag-stat-number">{settings.stat_projects || '120+'}</div><div className="ag-stat-name">Dự án hoàn thành</div></div>
            <div className="ag-stat-item"><div className="ag-stat-number">{settings.stat_clients || '80+'}</div><div className="ag-stat-name">Khách hàng</div></div>
            <div className="ag-stat-item"><div className="ag-stat-number">{settings.stat_awards || '15'}</div><div className="ag-stat-name">Giải thưởng</div></div>
            <div className="ag-stat-item"><div className="ag-stat-number">{settings.stat_years || '8'}</div><div className="ag-stat-name">Năm kinh nghiệm</div></div>
          </div>
        </div>
      </div>

      {/* FILTER + GRID */}
      <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="d-flex flex-wrap gap-3 mb-5" role="tablist" data-reveal>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className="ag-tag-pill"
                style={activeFilter === cat ? { background: 'var(--text)', color: '#fff', borderColor: 'var(--text)' } : {}}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>Đang tải...</div>
          ) : (
            <div className="row g-4">
              {filtered.map((proj) => (
                <div key={proj.id} className="col-lg-6 col-md-6" data-reveal>
                  <article className="ag-project-card">
                    {proj.image && (
                      <div style={{ overflow: 'hidden' }}>
                        <img className="ag-project-thumb" src={proj.image} alt={proj.title} loading="lazy" />
                      </div>
                    )}
                    <div className="ag-project-body">
                      <div className="ag-project-cat">{proj.category}</div>
                      <h2 className="ag-project-title">{proj.title}</h2>
                      <p className="ag-project-desc">{proj.description}</p>
                      {proj.tags && (
                        <div className="ag-project-tags">
                          {proj.tags.split(',').map((tag, i) => (
                            <span key={i} className="ag-project-tag">{tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-12" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>
                  Không có dự án nào trong danh mục này.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Strip */}
      <section style={{ background: 'var(--dark2)', padding: 'clamp(56px, 7vw, 80px) 0' }}>
        <div className="wd-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-4" data-reveal>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Bắt đầu ngay hôm nay</div>
              <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '-2px', margin: 0, lineHeight: '.95' }}>
                Dự án tiếp theo của bạn<br/>xứng đáng được làm tốt nhất
              </h2>
            </div>
            <Link to="/lien-he" className="ag-btn-accent">Liên hệ ngay &rarr;</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
