import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Category {
  id: number
  name: string
  icon: string
  description: string
  image: string
  slug: string
}

interface Service {
  id: number
  category_id: number | null
  name: string
  description: string
  price: string
  image: string
  badge: string
  is_featured: number
}

export default function Services() {
  const [cats, setCats]     = useState<Category[]>([])
  const [services, setSvc]  = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/service-categories'),
      api.get<Service[]>('/public/services?featured=1'),
    ]).then(([c, s]) => { setCats(c); setSvc(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Re-observe after async data renders (AppShell fires before data loads on SPA navigation)
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

  if (loading) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--bg-soft)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="bst-eyebrow">Dịch vụ của chúng tôi</div>
          <h2 className="bst-title">Mỗi dịch vụ — <em>một tác phẩm</em></h2>
          <p className="bst-sub mx-auto">Tóc · Nail · Makeup · Skincare — đội ngũ chuyên gia được đào tạo bài bản phục vụ bạn.</p>
        </div>

        {/* Category cards */}
        <div className="row g-3 mb-5">
          {cats.map((cat, i) => (
            <div key={cat.id} className="col-lg-3 col-md-6" data-reveal data-delay={String(i + 1)}>
              <div className="bst-sg-card">
                {cat.image && (
                  <div style={{ overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img src={cat.image} alt={cat.name} className="bst-sg-thumb" />
                  </div>
                )}
                <div className="bst-sg-body">
                  <span className="bst-sg-tag">{cat.icon} {cat.name}</span>
                  <div className="bst-sg-title">{cat.name}</div>
                  <div className="bst-sg-desc">{cat.description}</div>
                  <Link to={`/dich-vu#${cat.slug}`} className="bst-sg-link">
                    Xem bảng giá
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured services */}
        {services.length > 0 && (
          <>
            <div className="bst-pink-line my-5" />
            <div className="text-center mb-4" data-reveal>
              <div className="bst-eyebrow">Nổi bật</div>
              <h3 className="bst-title" style={{ fontSize: 'clamp(22px,3vw,36px)' }}>Dịch vụ <em>được yêu thích</em></h3>
            </div>
            <div className="row g-3">
              {services.slice(0, 6).map((s, i) => (
                <div key={s.id} className="col-md-4 col-sm-6" data-reveal data-delay={String((i % 3) + 1)}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', height: '100%', transition: 'border-color .3s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-pink)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    {s.image && <img src={s.image} alt={s.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />}
                    <div style={{ padding: '16px 18px' }}>
                      {s.badge && <span className="bst-badge" style={{ marginBottom: 8, display: 'inline-block' }}>{s.badge}</span>}
                      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>{s.name}</div>
                      {s.description && <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.6 }}>{s.description}</div>}
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{s.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-5" data-reveal>
          <Link to="/dich-vu" className="bst-btn-primary">Xem đầy đủ bảng giá →</Link>
        </div>
      </div>
    </section>
  )
}
