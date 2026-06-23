import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Category { id: number; name: string; icon: string; description: string; slug: string }
interface Service  { id: number; category_id: number | null; name: string; price: string; description: string; badge: string }

interface PromoCombos { id: number; title: string; description: string; price_new: string; price_old: string; services_included: string }

export default function ServicesPage() {
  const [cats, setCats]   = useState<Category[]>([])
  const [svcs, setSvcs]   = useState<Service[]>([])
  const [combos, setCombos] = useState<PromoCombos[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
      api.get<PromoCombos[]>('/public/promo-combos'),
    ]).then(([c, s, combo]) => { setCats(c); setSvcs(s); setCombos(combo) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Re-observe reveal elements after async data renders (AppShell fires before data loads)
  useEffect(() => {
    if (cats.length === 0) return
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
  }, [cats])

  function servicesForCat(catId: number) { return svcs.filter(s => s.category_id === catId) }

  return (
    <>
      {/* Page hero */}
      <div className="bst-page-hero">
        <div className="wd-container">
          <div className="bst-ph-eyebrow">Dịch vụ & Bảng giá</div>
          <h1 className="bst-ph-title">Tất cả dịch vụ — <em>một địa điểm</em></h1>
          <p className="bst-ph-sub">Tóc, Nail, Makeup, Skincare — đội ngũ chuyên gia với kỹ thuật đẳng cấp và sản phẩm cao cấp.</p>
        </div>
      </div>

      {/* Services */}
      <section className="sec-pad">
        <div className="wd-container">
          {loading ? (
            <div className="text-center" style={{ padding: 80, color: 'var(--text-3)' }}>Đang tải...</div>
          ) : (
            cats.map(cat => (
              <div key={cat.id} id={cat.slug || `cat-${cat.id}`} className="bst-svc-panel mb-4" data-reveal>
                <div className="bst-svc-panel-head">
                  <div className="bst-svc-icon">{cat.icon}</div>
                  <div>
                    <div className="bst-svc-panel-name">{cat.name}</div>
                    {cat.description && <div className="bst-svc-panel-sub">{cat.description}</div>}
                  </div>
                </div>
                <div className="bst-svc-panel-body">
                  <table className="bst-price-table">
                    <thead>
                      <tr>
                        <th>Dịch vụ</th>
                        <th>Mô tả</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicesForCat(cat.id).map(s => (
                        <tr key={s.id}>
                          <td>
                            {s.name}
                            {s.badge && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-pink)' }}>{s.badge}</span>}
                          </td>
                          <td style={{ color: 'var(--text-3)', fontSize: 13 }}>{s.description}</td>
                          <td>{s.price}</td>
                        </tr>
                      ))}
                      {servicesForCat(cat.id).length === 0 && (
                        <tr><td colSpan={3} style={{ color: 'var(--text-3)', padding: '20px 0' }}>Đang cập nhật...</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}

          {/* Combos */}
          {combos.length > 0 && (
            <>
              <div className="bst-pink-line my-5" />
              <div className="text-center mb-4" data-reveal>
                <div className="bst-eyebrow">Combo ưu đãi</div>
                <h2 className="bst-title" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>Tiết kiệm hơn với <em>Combo</em></h2>
              </div>
              <div className="row g-3">
                {combos.map((c, i) => (
                  <div key={c.id} className="col-md-4" data-reveal data-delay={String((i % 3) + 1)}>
                    <div className="bst-promo-card">
                      <span className="bst-promo-tag">Combo</span>
                      <div className="bst-promo-title">{c.title}</div>
                      <div className="bst-promo-desc">{c.description}</div>
                      {c.services_included && <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14, lineHeight: 1.6 }}>{c.services_included}</div>}
                      <div className="bst-promo-price">
                        <span className="bst-promo-new">{c.price_new}</span>
                        {c.price_old && <span className="bst-promo-old">{c.price_old}</span>}
                      </div>
                      <Link to="/dat-lich" className="bst-btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>Đặt lịch ngay</Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="bst-cta-section">
        <div className="wd-container">
          <h2 className="bst-cta-title">Sẵn sàng cho một <em>diện mạo mới?</em></h2>
          <p className="bst-cta-sub">Đặt lịch ngay hôm nay — nhận xác nhận trong vòng 1 giờ.</p>
          <Link to="/dat-lich" className="bst-btn-primary">✨ Đặt lịch ngay</Link>
        </div>
      </div>
    </>
  )
}
