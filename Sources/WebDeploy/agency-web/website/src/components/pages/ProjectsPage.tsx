import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

interface Project {
  id: number; title: string; description: string; image: string; category: string; client: string; featured: number; tags: string; link: string
}

export default function ProjectsPage() {
  const { settings } = useSite()
  usePageTitle('Dự án', `Dự án tiêu biểu đã thực hiện bởi ${settings.site_name || 'chúng tôi'}.`)
  const [projects, setProjects] = useState<Project[]>([])
  const [active, setActive] = useState('all')

  useEffect(() => {
    api.get<Project[]>('/public/projects').then(setProjects).catch(console.error)
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
  }, [projects, active])

  const filters = ['all', 'web', 'app', 'brand']
  const filterLabels: Record<string, string> = { all: 'Tất cả', web: 'Website', app: 'App', brand: 'Thương hiệu' }

  const filtered = active === 'all' ? projects : projects.filter(p => p.category === active)

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Portfolio</div>
          <h1 className="ph-title">120+ dự án <em>thực tế</em></h1>
          <p className="ph-sub">Từ startup đến doanh nghiệp lớn — mỗi dự án là một câu chuyện thành công chúng tôi tự hào kể lại.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4" data-reveal>
            <h2 className="sec-title mb-0">Dự án <em>nổi bật</em></h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filters.map(f => (
                <button key={f} onClick={() => setActive(f)} style={{ fontSize: '12.5px', padding: '7px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: active === f ? 'var(--text)' : 'var(--surface)', color: active === f ? '#fff' : 'var(--text-2)', cursor: 'pointer', transition: 'all .15s', fontFamily: 'var(--sans)' }}>
                  {filterLabels[f]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center" style={{ padding: '48px', color: 'var(--text-3)' }}>
              {projects.length === 0 ? 'Đang tải dự án...' : 'Không có dự án nào trong danh mục này.'}
            </div>
          ) : (
            <div className="row g-3">
              {filtered.map((p, i) => (
                <div key={p.id} className={`col-md-${i === 0 || i === 4 ? '6' : '4'}`}>
                  <div className={`reveal${i % 3 === 1 ? ' reveal-d1' : i % 3 === 2 ? ' reveal-d2' : ''}`} data-reveal style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', transition: 'transform .28s cubic-bezier(.16,1,.3,1),box-shadow .28s', cursor: 'pointer' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 52px rgba(0,0,0,.1)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}>
                    <img src={p.image} alt={p.title} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} loading="lazy" />
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: '6px', background: 'var(--accent-light)', color: 'var(--accent)' }}>{filterLabels[p.category] || p.category}</span>
                        {p.client && <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: 'var(--warm)', color: 'var(--text-3)' }}>{p.client}</span>}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-.3px', marginBottom: '6px' }}>{p.title}</div>
                      <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.65 }}>{p.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="row g-4 text-center">
            {[
              { num: '120+', label: 'Dự án hoàn thành' },
              { num: '15+',  label: 'Ngành nghề khác nhau' },
              { num: '40%',  label: 'Tăng trưởng conversion trung bình' },
              { num: '90%',  label: 'Khách hàng tái ký hợp đồng' },
            ].map((s, i) => (
              <div key={i} className={`col-6 col-md-3 reveal${i > 0 ? ` reveal-d${i}` : ''}`} data-reveal>
                <div className="stat-num" style={{ color: '#fff' }}>{s.num}</div>
                <div className="stat-label" style={{ color: 'rgba(255,255,255,.35)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="wd-container" data-reveal>
          <h2 className="cta-title">Dự án tiếp theo là của bạn</h2>
          <p className="cta-sub">Hãy chia sẻ ý tưởng — chúng tôi sẽ biến nó thành hiện thực.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Tư vấn miễn phí →</Link>
            <Link to="/dich-vu" className="btn-outline-white">Xem dịch vụ</Link>
          </div>
        </div>
      </section>
    </>
  )
}
