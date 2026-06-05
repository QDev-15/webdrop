import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import RevealObserver from '../RevealObserver'
import { usePageTitle } from '../../hooks/usePageTitle'

const CATEGORIES = ['Tất cả', 'Brand Identity', 'Digital Design', 'Campaign', 'Social Media', 'Event Branding', 'Digital Marketing']

export default function ProjectsPage() {
  usePageTitle('Dự án')
  const { projects, settings } = useSite()
  const [activeFilter, setActiveFilter] = useState('Tất cả')

  const displayProjects = projects.length > 0 ? projects : [
    { id: 1, title: 'Rebranding Thương Hiệu F&B', category: 'Brand Identity', description: 'Xây dựng bộ nhận diện thương hiệu toàn diện cho chuỗi nhà hàng — logo, brand guideline, bộ ấn phẩm.', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop', client: 'Nhà hàng Phương Nam', tags: 'Logo,Brand Guide,Stationery', featured: 1, slug: '' },
    { id: 2, title: 'Website & App UI — FinTech', category: 'Digital Design', description: 'Thiết kế website và ứng dụng cho startup tài chính — UI/UX research, wireframe, prototype.', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop', client: 'PayViet', tags: 'UI/UX,Web Design,App', featured: 1, slug: '' },
    { id: 3, title: 'Campaign Tết 2025', category: 'Campaign', description: 'Chiến dịch truyền thông tích hợp mùa Tết 2025 — concept sáng tạo, key visual, social assets.', image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80&auto=format&fit=crop', client: 'Vinamilk', tags: 'Campaign,Creative,Print', featured: 1, slug: '' },
    { id: 4, title: 'Social Media — Beauty Brand', category: 'Social Media', description: 'Xây dựng content strategy và visual identity cho social media.', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop', client: 'Beauté Studio', tags: 'Social,Content,TikTok', featured: 0, slug: '' },
    { id: 5, title: 'Event Branding — Tech Summit', category: 'Event Branding', description: 'Thiết kế toàn bộ branding cho sự kiện Tech Summit — backdrop, standee, stage design.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop', client: 'VietTech', tags: 'Event,Print,Stage', featured: 0, slug: '' },
    { id: 6, title: 'Full Brand Identity — SaaS', category: 'Brand Identity', description: 'Tái định vị và rebrand toàn diện cho startup SaaS.', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop', client: 'CloudStack VN', tags: 'Rebranding,Strategy,Identity', featured: 1, slug: '' },
    { id: 7, title: 'Digital Marketing — E-commerce', category: 'Digital Marketing', description: 'Triển khai chiến lược marketing tổng thể — SEO, paid ads, content marketing.', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop', client: 'ShopNow.vn', tags: 'SEO,Ads,Analytics', featured: 0, slug: '' },
  ]

  const filtered = activeFilter === 'Tất cả'
    ? displayProjects
    : displayProjects.filter(p => p.category === activeFilter)

  const statsProjects = settings.stats_projects || '120+'
  const statsClients = settings.stats_clients || '80+'
  const statsAwards = settings.stats_awards || '15'
  const statsYears = settings.stats_years || '8'

  return (
    <>
      <RevealObserver />

      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <div className="ag-ph-label" data-reveal>Portfolio / Dự án</div>
          <h1 className="ag-ph-title" data-reveal>
            <span className="outline">OUR</span><br />WORK
          </h1>
          <p className="ag-ph-sub" data-reveal>
            Hơn {statsProjects} dự án sáng tạo được thực hiện cho các thương hiệu tại Việt Nam và quốc tế. Mỗi dự án là một câu chuyện riêng.
          </p>
        </div>
      </section>

      {/* STAT BAR */}
      <div className="ag-stat-bar">
        <div className="wd-container">
          <div className="ag-stat-bar-inner">
            {[
              { num: statsProjects, label: 'Dự án hoàn thành' },
              { num: statsClients, label: 'Khách hàng' },
              { num: statsAwards, label: 'Giải thưởng' },
              { num: statsYears, label: 'Năm kinh nghiệm' },
            ].map((stat, i) => (
              <div key={i} className="ag-stat-item" data-reveal>
                <div className="ag-stat-number">{stat.num}</div>
                <div className="ag-stat-name">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER + GRID */}
      <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="d-flex flex-wrap gap-3 mb-5" role="tablist" data-reveal>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`ag-tag-pill${activeFilter === cat ? ' active-filter' : ''}`}
                style={activeFilter === cat ? { background: 'var(--text)', color: '#fff', borderColor: 'var(--text)' } : {}}
                onClick={() => setActiveFilter(cat)}
                aria-selected={activeFilter === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {filtered.map((project, idx) => (
              <div key={project.id} className={`col-lg-${idx < 2 ? '6' : '4'}`} data-reveal>
                <article className="ag-project-card">
                  <div style={{ overflow: 'hidden' }}>
                    <img
                      className="ag-project-thumb"
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="ag-project-body">
                    <div className="ag-project-cat">{project.category}</div>
                    <h2 className="ag-project-title">{project.title}</h2>
                    <p className="ag-project-desc">{project.description}</p>
                    <div className="ag-project-tags">
                      {project.tags.split(',').map((tag, i) => (
                        <span key={i} className="ag-project-tag">{tag.trim()}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{ background: 'var(--dark2)', padding: 'clamp(56px, 7vw, 80px) 0' }}>
        <div className="wd-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-4" data-reveal>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Bắt đầu ngay hôm nay</div>
              <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '-2px', margin: 0, lineHeight: .95 }}>
                Dự án tiếp theo của bạn<br />xứng đáng được làm tốt nhất
              </h2>
            </div>
            <Link to="/lien-he" className="ag-btn-accent">Liên hệ ngay &rarr;</Link>
          </div>
        </div>
      </section>
    </>
  )
}
