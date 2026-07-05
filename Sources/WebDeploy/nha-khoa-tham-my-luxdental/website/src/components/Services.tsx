import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSite } from '../App'

interface ServiceCategory {
  id: number
  name: string
  slug: string
}

interface Service {
  id: number
  name: string
  slug: string
  description: string
  image: string
  price: string
  price_unit: string
  tag: string
  is_featured: number
  category_id: number
  category_name?: string
}

interface Props {
  mode?: 'bento' | 'full'
  categoryId?: number
}

// Bento grid (homepage) or full grid (dich-vu page)
export default function Services({ mode = 'bento', categoryId }: Props) {
  const { apiBase } = useSite()
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (categoryId) params.set('category_id', String(categoryId))
    Promise.all([
      fetch(`${apiBase}/public/service-categories`).then(r => r.ok ? r.json() : { data: [] }),
      fetch(`${apiBase}/public/services?${params}`).then(r => r.ok ? r.json() : { data: [] }),
    ]).then(([catRes, svcRes]) => {
      setCategories(Array.isArray(catRes.data) ? catRes.data : [])
      setServices(Array.isArray(svcRes.data) ? svcRes.data : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [apiBase, categoryId])

  if (loading) return <div className="lx-loading">Đang tải dịch vụ...</div>

  const filtered = activeCategory
    ? services.filter(s => s.category_id === activeCategory)
    : services

  if (mode === 'bento') {
    const featured = services.filter(s => s.is_featured).slice(0, 6)
    const display = featured.length >= 3 ? featured : services.slice(0, 6)
    const layouts = ['lx-b-big', '', '', '', 'lx-b-wide', '']
    return (
      <div className="lx-bento">
        {display.map((s, i) => (
          <div key={s.id} className={`lx-bento-item${layouts[i] ? ' ' + layouts[i] : ''}`}>
            {s.image
              ? <img src={s.image} alt={s.name} loading="lazy" />
              : <div style={{ position: 'absolute', inset: 0, background: `hsl(${(i * 40 + 200) % 360},30%,15%)` }} />
            }
            <div className="lx-bento-content">
              {s.tag && <div className="lx-bento-tag">{s.tag}</div>}
              <div className="lx-bento-name">{s.name}</div>
              {s.price && <div className="lx-bento-price">Từ {s.price} {s.price_unit}</div>}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Full mode (dich-vu page)
  return (
    <div>
      {categories.length > 0 && (
        <div className="lx-tag-strip" style={{ marginBottom: 32 }}>
          <button
            className={`lx-tag${activeCategory === null ? ' active' : ''}`}
            style={activeCategory === null ? { background: 'var(--text)', color: '#fff', borderColor: 'var(--text)' } : {}}
            onClick={() => setActiveCategory(null)}
          >
            Tất cả
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              className="lx-tag"
              style={activeCategory === c.id ? { background: 'var(--text)', color: '#fff', borderColor: 'var(--text)' } : {}}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="row gy-4">
        {filtered.map((s, i) => (
          <div key={s.id} className="col-md-6 col-lg-4" data-reveal data-delay={String((i % 3) + 1)}>
            <div className="lx-card" style={{ height: '100%' }}>
              {s.image && (
                <div className="lx-card-img">
                  <img src={s.image} alt={s.name} loading="lazy" />
                </div>
              )}
              {s.tag && <div className="lx-card-tag">{s.tag}</div>}
              <div className="lx-card-title">{s.name}</div>
              {s.description && <div className="lx-card-desc">{s.description}</div>}
              {s.price && (
                <div className="lx-card-price">
                  Từ {s.price} <span>{s.price_unit}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-12" style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-3)' }}>
            Chưa có dịch vụ trong danh mục này.
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 48 }} data-reveal>
        <NavLink to="/dat-lich" className="lx-btn lx-btn-accent">
          Đặt lịch tư vấn miễn phí
        </NavLink>
      </div>
    </div>
  )
}
