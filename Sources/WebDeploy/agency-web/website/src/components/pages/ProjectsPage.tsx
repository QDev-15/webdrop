import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import RevealObserver from '../RevealObserver'

interface Project {
  id: number; title: string; category: string; industry: string
  description: string; image: string; client: string; url: string
}

const FILTERS = [
  { key: 'all',   label: 'Tất cả' },
  { key: 'web',   label: 'Website' },
  { key: 'app',   label: 'App' },
  { key: 'brand', label: 'Thương hiệu' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [active, setActive]     = useState('all')

  useEffect(() => {
    api.get<Project[]>('/public/projects').then(setProjects).catch(() => {})
  }, [])

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
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 reveal">
            <h2 className="sec-title mb-0">Dự án <em>nổi bật</em></h2>
            <div className="filter-bar">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`filter-btn${active === f.key ? ' active' : ''}`}
                  onClick={() => setActive(f.key)}
                >{f.label}</button>
              ))}
            </div>
          </div>

          <div className="row g-3">
            {filtered.map((p, i) => (
              <div key={p.id} className={i < 2 ? 'col-md-6' : 'col-md-4'}>
                <div className={`pf-card-full reveal${i % 3 === 1 ? ' reveal-d1' : i % 3 === 2 ? ' reveal-d2' : ''}`}>
                  {p.image && <img className="pf-img" src={p.image} alt={p.title} loading="lazy" />}
                  <div className="pf-body">
                    <div className="pf-tags">
                      <span className="pf-tag">{p.category === 'web' ? 'Website' : p.category === 'app' ? 'Mobile App' : 'Thương hiệu'}</span>
                      {p.industry && <span className="pf-tag grey">{p.industry}</span>}
                    </div>
                    <div className="pf-title">{p.title}</div>
                    <div className="pf-desc">{p.description}</div>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noreferrer" className="svc-link">Xem →</a>
                    ) : (
                      <span className="svc-link" style={{ cursor: 'default' }}>Xem →</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="text-center sec-dark reveal mb-5">
            <div className="eyebrow">Con số</div>
            <h2 className="sec-title">Kết quả <em>thực tế</em></h2>
          </div>
          <div className="row g-4 text-center">
            {[
              { num: '120+', label: 'Dự án hoàn thành' },
              { num: '15+',  label: 'Ngành nghề khác nhau' },
              { num: '40%',  label: 'Tăng trưởng conversion trung bình' },
              { num: '90%',  label: 'Khách hàng tái ký hợp đồng' },
            ].map((s, i) => (
              <div key={i} className={`col-md-3 col-6 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                <div className="stat-num" style={{ color: '#fff' }}>{s.num}</div>
                <div className="stat-label" style={{ color: 'rgba(255,255,255,.35)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="wd-container reveal">
          <h2 className="cta-title">Dự án tiếp theo là của bạn</h2>
          <p className="cta-sub">Hãy chia sẻ ý tưởng — chúng tôi sẽ biến nó thành hiện thực.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Tư vấn miễn phí →</Link>
            <Link to="/dich-vu" className="btn-outline-white">Xem dịch vụ</Link>
          </div>
        </div>
      </section>

      <RevealObserver />
    </>
  )
}
