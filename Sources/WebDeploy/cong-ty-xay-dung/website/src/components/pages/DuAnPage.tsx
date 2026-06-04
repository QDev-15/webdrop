import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project {
  id: number
  title: string
  category: string
  category_name: string
  category_slug: string
  location: string
  area: string
  floors: string
  year: string
  image: string
  featured: number
}

interface Category {
  id: number
  name: string
  slug: string
}

function useReveal() {
  useEffect(() => {
    const ro = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el))
    return () => ro.disconnect()
  })
}

export default function DuAnPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [active, setActive] = useState('all')
  const [visibleCount, setVisibleCount] = useState(9)
  useReveal()

  useEffect(() => {
    api.get<Project[]>('/public/projects?limit=50').then(setProjects).catch(() => {})
    api.get<Category[]>('/public/project-categories').then(setCategories).catch(() => {})
    window.scrollTo(0, 0)
  }, [])

  const filtered = active === 'all'
    ? projects
    : projects.filter(p => p.category === active || p.category_slug === active)

  const featured = projects.find(p => p.featured)

  return (
    <main>
      <section className="xd-page-hero" aria-label="Dự án & Công trình">
        <div className="xd-page-hero-bg" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop" alt="" loading="eager" />
        </div>
        <div className="wd-container xd-page-hero-content">
          <div className="xd-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="xd-breadcrumb-sep" aria-hidden="true">/</span>
            <span className="xd-breadcrumb-current">Dự án</span>
          </div>
          <div className="xd-ph-eyebrow">Portfolio</div>
          <h1 className="xd-ph-title">Dự án &<br /><span style={{ color: 'var(--accent)' }}>Công trình</span></h1>
          <p className="xd-ph-sub">Hơn 350 công trình hoàn thành trên khắp 24 tỉnh thành, từ nhà ở dân dụng đến khu công nghiệp quy mô lớn.</p>
        </div>
      </section>

      {/* Danh mục */}
      <section className="sec-pad" aria-labelledby="project-list-title">
        <div className="wd-container">
          <div className="row align-items-center mb-5">
            <div className="col-md-6" data-reveal>
              <div className="xd-eyebrow">Danh mục công trình</div>
              <h2 className="xd-sec-title" id="project-list-title">Tất cả <span className="xd-accent">dự án</span></h2>
            </div>
            <div className="col-md-6" data-reveal data-delay="1">
              <div className="xd-filter-bar justify-content-md-end">
                <button
                  className={`xd-filter-btn${active === 'all' ? ' active' : ''}`}
                  onClick={() => { setActive('all'); setVisibleCount(9) }}
                >Tất cả</button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`xd-filter-btn${active === cat.slug ? ' active' : ''}`}
                    onClick={() => { setActive(cat.slug); setVisibleCount(9) }}
                  >{cat.name}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-4">
            {filtered.slice(0, visibleCount).map((p, i) => (
              <div className="col-12 col-md-6 col-lg-4" data-reveal data-delay={String(i % 3)} key={p.id}>
                <div className="xd-project-card-full">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <div className="xd-project-card-overlay">
                    <div className="xd-proj-tag">{p.category_name || p.category}</div>
                    <div className="xd-proj-title-card">{p.title}</div>
                    <div className="xd-proj-meta">
                      {p.location}{p.year ? ` · ${p.year}` : ''}{p.floors ? ` · ${p.floors}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="text-center mt-5" data-reveal>
              <button className="xd-btn-solid" onClick={() => setVisibleCount(c => c + 6)}>
                Xem thêm công trình
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured project */}
      {featured && (
        <section className="sec-pad" style={{ background: 'var(--warm)' }} aria-labelledby="feat-proj-title">
          <div className="wd-container">
            <div className="text-center mb-5">
              <div className="xd-eyebrow" data-reveal>Công trình nổi bật</div>
              <h2 className="xd-sec-title" id="feat-proj-title" data-reveal data-delay="1">
                Điểm nhấn <span className="xd-accent">tiêu biểu</span>
              </h2>
            </div>

            <div className="row g-5 align-items-center">
              <div className="col-md-7" data-reveal>
                <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                  <img src={featured.image} alt={featured.title} style={{ width: '100%', height: 460, objectFit: 'cover' }} loading="lazy" />
                  <div style={{ position: 'absolute', top: 20, left: 20 }}>
                    <span className="xd-tag-inline">Công trình tiêu biểu</span>
                  </div>
                </div>
              </div>
              <div className="col-md-5" data-reveal data-delay="1">
                <div className="xd-eyebrow">Case Study</div>
                <h3 className="xd-sec-title">{featured.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 24 }}>
                  {featured.location && <><strong>Địa điểm:</strong> {featured.location}<br /></>}
                  {featured.area && <><strong>Diện tích:</strong> {featured.area}<br /></>}
                  {featured.floors && <><strong>Quy mô:</strong> {featured.floors}<br /></>}
                  {featured.year && <><strong>Năm hoàn thành:</strong> {featured.year}</>}
                </p>
                <Link to="/lien-he" className="xd-btn-solid">Yêu cầu tư vấn tương tự</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--accent)', padding: '56px 0' }}>
        <div className="wd-container">
          <div className="row align-items-center gy-4">
            <div className="col-md-8" data-reveal>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Sẵn sàng bắt đầu?</div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
                Hãy để chúng tôi xây dựng<br />công trình mơ ước của bạn.
              </h2>
            </div>
            <div className="col-md-4 text-md-end" data-reveal data-delay="1">
              <Link to="/lien-he" style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', padding: '15px 36px', borderRadius: 2, fontSize: 12, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                Nhận báo giá miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
