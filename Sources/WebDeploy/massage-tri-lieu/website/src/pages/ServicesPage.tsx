import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ServiceCategory {
  id: number
  name: string
  description: string
  active: number
}

interface Service {
  id: number
  category_id: number
  name: string
  tag: string
  description: string
  image: string
  price_from: number
  duration: string
  active: number
}

interface ServicePackage {
  id: number
  name: string
  tagline: string
  price: number
  price_original: number
  items: string
  featured: number
  active: number
}

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'k'
}

export default function ServicesPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Bảng giá dịch vụ — ${settings.site_name || 'Tâm Thư Massage'}`,
    description: 'Danh sách dịch vụ massage trị liệu: Massage Thái, Đá Nóng, Bấm Huyệt cùng các gói liệu trình ưu đãi tại Tâm Thư Massage.',
  })

  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<ServiceCategory[]>('/public/service-categories').catch(() => [] as ServiceCategory[]),
      api.get<Service[]>('/public/services').catch(() => [] as Service[]),
      api.get<ServicePackage[]>('/public/service-packages').catch(() => [] as ServicePackage[]),
    ]).then(([cats, svcs, pkgs]) => {
      setCategories(cats.filter(c => c.active))
      setServices(svcs.filter(s => s.active))
      setPackages(pkgs.filter(p => p.active))
    }).finally(() => setLoading(false))
  }, [])

  // Re-observe after async data renders (Rule 26)
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

  return (
    <>
      {/* Page hero */}
      <div className="mrt-page-hero">
        <div className="wd-container">
          <div className="mrt-ph-label">Dịch vụ &amp; Bảng giá</div>
          <h1 className="mrt-ph-title">Các liệu trình <em>massage</em><br />chuyên sâu</h1>
          <p className="mrt-ph-sub">
            Từ massage Thái cổ truyền đến liệu pháp đá nóng hiện đại — mỗi liệu trình được thiết kế cẩn thận cho nhu cầu phục hồi của bạn.
          </p>
        </div>
      </div>

      {/* Services by category */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {loading ? (
            <div className="text-center" style={{ color: 'var(--text-3)', padding: '40px 0' }}>Đang tải...</div>
          ) : (
            <>
              {categories.length > 0 ? (
                categories.map(cat => {
                  const catServices = services.filter(s => s.category_id === cat.id)
                  if (catServices.length === 0) return null
                  return (
                    <div key={cat.id} style={{ marginBottom: 56 }}>
                      <div className="mrt-price-section-head" data-reveal>
                        <div className="mrt-price-section-title">{cat.name}</div>
                        {cat.description && <div className="mrt-price-section-sub">{cat.description}</div>}
                      </div>
                      {catServices.map(svc => (
                        <div key={svc.id} className="mrt-price-row" data-reveal>
                          <div>
                            <div className="mrt-price-name">{svc.name}</div>
                            <div className="mrt-price-detail">{svc.duration} | {svc.description}</div>
                          </div>
                          <div className="mrt-price-amount">Từ {formatPrice(svc.price_from)}</div>
                        </div>
                      ))}
                    </div>
                  )
                })
              ) : (
                <div className="row g-4">
                  {services.map((svc, i) => (
                    <div key={svc.id} className="col-md-6 col-lg-4" data-reveal>
                      <div className="mrt-svc-card">
                        <div className="mrt-svc-thumb-wrap">
                          <img
                            className="mrt-svc-thumb"
                            src={svc.image || 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=75&auto=format&fit=crop'}
                            alt={svc.name}
                            loading={i < 3 ? 'eager' : 'lazy'}
                          />
                        </div>
                        <div className="mrt-svc-body">
                          {svc.tag && <span className="mrt-svc-tag">{svc.tag}</span>}
                          <div className="mrt-svc-name">{svc.name}</div>
                          <p className="mrt-svc-desc">{svc.description}</p>
                          <div className="mrt-svc-footer">
                            <span className="mrt-svc-price">Từ {formatPrice(svc.price_from)}</span>
                            <span className="mrt-svc-duration">{svc.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Packages */}
      {packages.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--warm)' }}>
          <div className="wd-container">
            <div className="text-center mb-5" data-reveal>
              <div className="mrt-label">
                <span className="mrt-label-line" />
                Gói combo
                <span className="mrt-label-line" />
              </div>
              <h2 className="mrt-heading">Tiết kiệm <em>hơn</em> với gói combo</h2>
            </div>
            <div className="row g-4 justify-content-center">
              {packages.map(pkg => {
                const pkgItems = pkg.items ? pkg.items.split('\n').filter(Boolean) : []
                return (
                  <div key={pkg.id} className="col-md-6 col-lg-4" data-reveal>
                    <div className={`mrt-combo-card${pkg.featured ? ' featured' : ''}`}>
                      {pkg.featured ? <div className="mrt-combo-badge">Phổ biến nhất</div> : null}
                      <div className="mrt-combo-name">{pkg.name}</div>
                      <div className="mrt-combo-tagline">{pkg.tagline}</div>
                      <div className="mrt-combo-price-wrap">
                        <div className="mrt-combo-price">{formatPrice(pkg.price)}<small>/goi</small></div>
                        {pkg.price_original > pkg.price && (
                          <div className="mrt-combo-original">Giá gốc: {formatPrice(pkg.price_original)}</div>
                        )}
                      </div>
                      {pkgItems.length > 0 && (
                        <ul className="mrt-combo-items">
                          {pkgItems.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      )}
                      <Link to="/dat-lich" className="mrt-btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                        Đặt gói ngay
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mrt-cta-sec">
        <div className="wd-container">
          <h2 className="mrt-cta-title" data-reveal>Chọn liệu trình phù hợp<br />và đặt lịch ngay hôm nay.</h2>
          <p className="mrt-cta-sub" data-reveal>Có mặt 7 ngày trong tuần từ 8:00 đến 22:00.</p>
          <div className="mrt-cta-actions" data-reveal>
            <Link to="/dat-lich" className="mrt-btn-white">Đặt lịch ngay &rarr;</Link>
          </div>
        </div>
      </section>
    </>
  )
}
