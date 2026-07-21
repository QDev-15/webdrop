import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
}

interface Service {
  id: number
  category_id: number
  number: string
  name: string
  description: string
  price: string
  price_unit: string
  is_featured: number
  category_name: string
}

export default function ServicesPage() {
  useDocumentMeta({ title: 'Dịch vụ — Nha Khoa An Tâm', description: 'Các dịch vụ nha khoa tổng quát tại Nha Khoa An Tâm.' })
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
    ])
      .then(([cats, svcs]) => { setCategories(cats); setServices(svcs) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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

  return (
    <>
      {/* Page hero */}
      <header className="at-page-hero">
        <div className="wd-container">
          <div className="at-ph-eyebrow">
            <span className="at-ph-line" aria-hidden="true" />
            Dịch vụ
          </div>
          <h1 className="at-ph-title">
            Toàn bộ dịch vụ<br />
            <em>nha khoa</em>
          </h1>
          <p className="at-ph-sub">
            Từ khám tổng quát, điều trị, đến thẩm mỹ — chúng tôi cung cấp đầy đủ dịch vụ nha khoa với giá cả minh bạch.
          </p>
        </div>
      </header>

      {/* Services by category */}
      <section className="at-sec-pad">
        <div className="wd-container" ref={ref}>
          {loading ? (
            <div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ padding: '30px 0', borderBottom: '1px solid var(--border)' }}>
                  <div className="at-skeleton" style={{ height: 28, width: '45%', marginBottom: 10 }} />
                  <div className="at-skeleton" style={{ height: 14, width: '65%' }} />
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            categories.map(cat => {
              const catServices = services.filter(s => s.category_name === cat.name)
              if (catServices.length === 0) return null
              return (
                <div key={cat.id}>
                  <div className="at-cat-label">{cat.name}</div>
                  <div className="at-svc-list">
                    {catServices.map((svc, i) => (
                      <div key={svc.id} className={`at-svc-row at-reveal at-reveal-d${Math.min(i + 1, 4)}`}>
                        <div className="at-svc-num">{svc.number || String(i + 1).padStart(2, '0')}</div>
                        <div className="at-svc-body">
                          <div className="at-svc-name">{svc.name}</div>
                          {svc.description && <p className="at-svc-desc">{svc.description}</p>}
                        </div>
                        <div className="at-svc-price-col">
                          {svc.price && <div className="at-svc-price">{svc.price}</div>}
                          {svc.price_unit && <div className="at-svc-per">{svc.price_unit}</div>}
                          <span className="at-svc-arrow" aria-hidden="true">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-3)' }}>
              Đang cập nhật bảng dịch vụ...
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 64, textAlign: 'center', paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <div className="at-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="at-eyebrow-line" />
              Bạn cần tư vấn?
            </div>
            <p className="at-sub" style={{ textAlign: 'center', margin: '0 auto 32px' }}>
              Đặt lịch tư vấn miễn phí — bác sĩ sẽ giải thích chi tiết và đề xuất phác đồ phù hợp nhất.
            </p>
            <Link to="/dat-lich" className="at-btn at-btn-accent at-btn-lg">
              Đặt lịch khám ngay
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
