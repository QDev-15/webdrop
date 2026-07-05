import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  number: string
  name: string
  description: string
  price: string
  price_unit: string
  is_featured: number
  category_name: string
}

interface Props {
  /** If true, show only featured services (homepage mode) */
  featured?: boolean
  /** If provided, filter by category_name */
  categoryFilter?: string
}

export default function Services({ featured = false, categoryFilter }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(data => {
        let list = data
        if (featured) list = data.filter(s => s.is_featured)
        if (categoryFilter) list = data.filter(s => s.category_name === categoryFilter)
        setServices(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [featured, categoryFilter])

  useEffect(() => {
    const el = ref.current
    if (!el || loading) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.05 }
    )
    el.querySelectorAll('.at-reveal').forEach(el2 => obs.observe(el2))
    return () => obs.disconnect()
  }, [loading, services])

  if (loading) return (
    <div ref={ref}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ padding: '30px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="at-skeleton" style={{ height: 28, width: '40%', marginBottom: 10 }} />
          <div className="at-skeleton" style={{ height: 14, width: '60%' }} />
        </div>
      ))}
    </div>
  )

  return (
    <div ref={ref}>
      <div className="at-svc-list">
        {services.map((svc, i) => (
          <div key={svc.id} className={`at-svc-row at-reveal at-reveal-d${Math.min(i + 1, 4)}`}>
            <div className="at-svc-num">{svc.number || String(i + 1).padStart(2, '0')}</div>
            <div className="at-svc-body">
              <div className="at-svc-name">{svc.name}</div>
              {svc.description && <p className="at-svc-desc">{svc.description}</p>}
            </div>
            <div className="at-svc-price-col">
              {svc.price && <div className="at-svc-price">{svc.price}</div>}
              {svc.price_unit && <div className="at-svc-per">{svc.price_unit}</div>}
              <span className="at-svc-arrow">→</span>
            </div>
          </div>
        ))}
      </div>

      {featured && (
        <div style={{ marginTop: 44, textAlign: 'center' }}>
          <Link to="/dich-vu" className="at-btn at-btn-accent">
            Xem tất cả dịch vụ
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  )
}
