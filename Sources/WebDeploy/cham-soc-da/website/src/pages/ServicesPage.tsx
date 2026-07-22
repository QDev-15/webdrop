import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ServiceCategory {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface Service {
  id: number
  name: string
  slug: string
  image: string
  category_id: number
  category_label: string
  description: string
  price: string
  duration: string
  is_active: number
}

export default function ServicesPage() {
  useDocumentMeta({
    title: 'Bảng giá dịch vụ — DermaCare Clinic',
    description: 'Danh mục dịch vụ điều trị da chuyên sâu: mụn, nám, lão hóa, sẹo rỗ — công nghệ Laser, IPL, Microneedling, phác đồ cá nhân hóa theo từng loại da.',
  })
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<ServiceCategory[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
    ])
      .then(([cats, svcs]) => {
        setCategories(cats)
        setServices(svcs.filter(s => s.is_active))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Rule 26: Re-observe after async data renders
  useEffect(() => {
    if (services.length === 0) return
    const t = setTimeout(() => {
      const els = document.querySelectorAll('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [services])

  const filtered = activeCategory === null
    ? services
    : services.filter(s => s.category_id === activeCategory)

  return (
    <>
      {/* Page hero */}
      <div className="csd-page-hero" style={{ paddingTop: 'calc(68px + clamp(40px,6vw,72px))' }}>
        <div className="wd-container">
          <div className="csd-ph-tag">Dịch vụ điều trị</div>
          <h1 className="csd-ph-title">Dịch vụ chăm sóc da<br /><em>chuyên sâu toàn diện</em></h1>
          <p className="csd-ph-sub">Công nghệ tiên tiến, phác đồ cá nhân hóa — kết quả rõ ràng, an toàn và bền vững.</p>
        </div>
      </div>

      <section className="csd-sec">
        <div className="wd-container">
          {loading ? (
            <div className="text-center" style={{ color: 'var(--text-3)', fontWeight: 300 }}>Đang tải dịch vụ...</div>
          ) : (
            <>
              {/* Category tabs */}
              {categories.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-5" data-reveal>
                  <button
                    className={activeCategory === null ? 'csd-btn-accent' : 'csd-btn-ghost'}
                    onClick={() => setActiveCategory(null)}
                    style={{ fontSize: 13, padding: '8px 18px' }}
                  >
                    Tất cả
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={activeCategory === cat.id ? 'csd-btn-accent' : 'csd-btn-ghost'}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{ fontSize: 13, padding: '8px 18px' }}
                    >
                      {cat.icon && <span style={{ marginRight: 6 }}>{cat.icon}</span>}{cat.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="row g-4">
                {filtered.map((svc, i) => (
                  <div key={svc.id} className="col-12 col-md-6 col-lg-4" data-reveal data-delay={String(i % 3)}>
                    <div className="csd-svc-card h-100">
                      <div style={{ overflow: 'hidden' }}>
                        <img
                          src={svc.image || `https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80&auto=format&fit=crop&sig=${svc.id}`}
                          alt={svc.name}
                          className="csd-svc-img"
                          loading="lazy"
                        />
                      </div>
                      <div className="csd-svc-body">
                        {svc.category_label && <div className="csd-svc-category">{svc.category_label}</div>}
                        <div className="csd-svc-title">{svc.name}</div>
                        <div className="csd-svc-desc">{svc.description}</div>
                        <div className="csd-svc-meta">
                          <span className="csd-svc-price">
                            {svc.price || 'Liên hệ'}
                          </span>
                          {svc.duration && <span className="csd-svc-duration">{svc.duration}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-5" style={{ color: 'var(--text-3)', fontWeight: 300 }}>
                  Không có dịch vụ nào trong danh mục này.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="csd-cta">
        <div className="wd-container" data-reveal>
          <h2 className="csd-cta-title">Chưa biết chọn liệu trình nào?</h2>
          <p className="csd-cta-sub">Đặt lịch tư vấn miễn phí — bác sĩ phân tích da và đề xuất phác đồ phù hợp nhất.</p>
          <Link to="/dat-lich" className="csd-btn-white">Đặt lịch tư vấn miễn phí →</Link>
        </div>
      </section>
    </>
  )
}
