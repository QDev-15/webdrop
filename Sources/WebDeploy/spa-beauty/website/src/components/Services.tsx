import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite, Service } from '../contexts/SiteContext'

interface Props { featured?: boolean; categoryFilter?: string }

export default function Services({ featured = false, categoryFilter }: Props) {
  const { services } = useSite()

  // Re-observe after data loads — Rule 26
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [services])

  let displayed = services
  if (featured) displayed = services.filter(s => s.featured)
  if (categoryFilter) displayed = services.filter(s => s.category_name === categoryFilter)
  if (featured && displayed.length === 0) displayed = services.slice(0, 3)

  if (displayed.length === 0) return null

  return (
    <div className="row g-3">
      {displayed.map((svc: Service, i) => (
        <div key={svc.id} className="col-md-4">
          <div className="sb-svc-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
            {svc.image && (
              <div className="sb-svc-thumb">
                <img className="sb-svc-img" src={svc.image} alt={svc.name} loading="lazy" />
              </div>
            )}
            <div className="sb-svc-body">
              {svc.tag && <div className="sb-svc-tag">{svc.tag}</div>}
              <div className="sb-svc-name">{svc.name}</div>
              <div className="sb-svc-desc">{svc.description}</div>
              <div className="sb-svc-foot">
                <div>
                  <div className="sb-svc-price">{svc.price}</div>
                  {svc.duration && <div className="sb-svc-duration">{svc.duration}</div>}
                </div>
                <Link to="/dat-lich" className="sb-btn-accent" style={{ fontSize: 12, padding: '8px 16px' }}>Đặt ngay</Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Price-table view grouped by category (for Services page) */
export function ServicesTable() {
  const { services, serviceCategories } = useSite()

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [services])

  return (
    <>
      {serviceCategories.map(cat => {
        const catServices = services.filter(s => s.category_id === cat.id)
        if (catServices.length === 0) return null
        return (
          <div key={cat.id} className="row g-3" data-reveal style={{ marginBottom: 32 }}>
            <div className="col-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>{cat.icon}</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{cat.name}</h3>
              </div>
            </div>
            {catServices.map((svc) => (
              <div key={svc.id} className="col-md-4">
                <div className="sb-svc-card">
                  {svc.image && (
                    <div className="sb-svc-thumb">
                      <img className="sb-svc-img" src={svc.image} alt={svc.name} loading="lazy" />
                    </div>
                  )}
                  <div className="sb-svc-body">
                    {svc.tag && <div className="sb-svc-tag">{svc.tag}</div>}
                    <div className="sb-svc-name">{svc.name}</div>
                    <div className="sb-svc-desc">{svc.description}</div>
                    <div className="sb-svc-foot">
                      <div>
                        <div className="sb-svc-price">{svc.price}</div>
                        {svc.duration && <div className="sb-svc-duration">{svc.duration}</div>}
                      </div>
                      <Link to="/dat-lich" className="sb-btn-accent" style={{ fontSize: 12, padding: '8px 16px' }}>Đặt ngay</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}
