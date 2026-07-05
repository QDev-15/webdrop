import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface ServiceCategory {
  id: number
  name: string
  slug: string
}

interface Service {
  id: number
  name: string
  description: string
  icon: string
  tags: string
  price: string
  price_unit: string
  is_featured: number
  category_id: number
  category_name?: string
  sort_order: number
}

interface Props {
  limit?: number
  showHeader?: boolean
  showViewAll?: boolean
}

export default function Services({ limit, showHeader = true, showViewAll = false }: Props) {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [activecat, setActivecat] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<ServiceCategory[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
    ]).then(([cats, svcs]) => {
      setCategories(cats)
      setServices(svcs)
      if (cats.length > 0) setActivecat(null)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = activecat
    ? services.filter(s => s.category_id === activecat)
    : services

  const display = limit ? filtered.slice(0, limit) : filtered

  const getTags = (tags: string) => tags ? tags.split('|').filter(Boolean) : []

  if (loading) return <div className="ks-loading">Đang tải dịch vụ...</div>

  return (
    <>
      {showHeader && (
        <div className="ks-text-center mb-4" data-reveal>
          <span className="ks-eyebrow is-lilac">Dịch vụ chuyên biệt</span>
          <h2 className="ks-title">Chăm sóc răng miệng <strong>toàn diện</strong><br />cho từng độ tuổi</h2>
          <p className="ks-sub ks-mx-auto">
            Từ khám định kỳ đến điều trị chuyên sâu — tất cả được thực hiện nhẹ nhàng, an toàn, phù hợp với trẻ nhỏ.
          </p>
        </div>
      )}

      {/* Category filter tabs */}
      {categories.length > 0 && !limit && (
        <div className="ks-cat-tabs" role="tablist" aria-label="Lọc theo nhóm dịch vụ">
          <button
            className={`ks-cat-tab${activecat === null ? ' active' : ''}`}
            onClick={() => setActivecat(null)}
            role="tab"
            aria-selected={activecat === null}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`ks-cat-tab${activecat === cat.id ? ' active' : ''}`}
              onClick={() => setActivecat(cat.id)}
              role="tab"
              aria-selected={activecat === cat.id}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="ks-svc-grid">
        {display.map((svc, i) => (
          <div className="ks-card" key={svc.id} data-reveal data-delay={i % 3 > 0 ? String(i % 3) : undefined}>
            <div className="ks-svc-icon" aria-hidden="true">{svc.icon || '🦷'}</div>
            <div className="ks-svc-name">{svc.name}</div>
            <div className="ks-svc-desc">{svc.description}</div>
            {getTags(svc.tags).length > 0 && (
              <div className="ks-svc-tags">
                {getTags(svc.tags).map((tag, j) => (
                  <span key={j} className="ks-svc-tag">{tag}</span>
                ))}
              </div>
            )}
            {svc.price && (
              <div className="ks-svc-price">
                {svc.price}{svc.price_unit ? ` ${svc.price_unit}` : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {showViewAll && (
        <div className="ks-text-center" style={{ marginTop: 36 }} data-reveal>
          <Link to="/dich-vu" className="ks-btn ks-btn-ghost">Xem tất cả dịch vụ →</Link>
        </div>
      )}
    </>
  )
}
