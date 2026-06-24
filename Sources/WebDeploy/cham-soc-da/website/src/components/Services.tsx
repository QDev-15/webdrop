import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  slug: string
  image: string
  category_label: string
  description: string
  price: string
  duration: string
  is_active: number
}

interface ServicesProps {
  limit?: number
  showHeader?: boolean
}

export default function Services({ limit, showHeader = true }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(data => setServices(data.filter(s => s.is_active)))
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

  const displayed = limit ? services.slice(0, limit) : services

  if (loading) return (
    <section className="csd-sec">
      <div className="wd-container text-center" style={{ color: 'var(--text-3)', fontWeight: 300 }}>Đang tải dịch vụ...</div>
    </section>
  )

  return (
    <section className="csd-sec" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        {showHeader && (
          <div className="text-center mb-5" data-reveal>
            <div className="csd-eyebrow">Dịch vụ điều trị</div>
            <h2 className="csd-title">Công nghệ tiên tiến —<br /><em>kết quả rõ ràng, an toàn</em></h2>
            <p className="csd-sub centered mt-3">Mỗi liệu trình được thiết kế riêng, kết hợp nhiều phương pháp để đạt hiệu quả tối ưu cho làn da của bạn.</p>
          </div>
        )}

        <div className="row g-4">
          {displayed.map((svc, i) => (
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

        {limit && services.length > limit && (
          <div className="text-center mt-5" data-reveal>
            <Link to="/dich-vu" className="csd-btn-accent">Xem tất cả dịch vụ →</Link>
          </div>
        )}
      </div>
    </section>
  )
}
