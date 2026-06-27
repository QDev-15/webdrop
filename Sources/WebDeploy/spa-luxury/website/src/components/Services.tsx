import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  category_id: number | null
  name: string
  description: string
  duration_minutes: number | null
  price: number
  price_unit: string
  is_featured: number
  image: string | null
  sort_order: number
  category_name: string | null
}

interface ServiceCategory {
  id: number
  name: string
  slug: string
  sort_order: number
}

interface Props {
  page: 'home' | 'services'
}

function formatPrice(price: number, unit: string): string {
  if (unit === 'liên hệ' || price === 0 && unit === 'liên hệ') return 'Liên hệ'
  if (price === 0) return 'Miễn phí'
  return price.toLocaleString('vi-VN') + 'đ/' + unit
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return ''
  if (minutes < 60) return `${minutes} phút`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m}p` : `${h} tiếng`
}

function useRevealData(dep: unknown) {
  useEffect(() => {
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible')
              observer.unobserve(e.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
      )
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => observer.observe(el))
      return () => observer.disconnect()
    }, 80)
    return () => clearTimeout(t)
  }, [dep])
}

// ─── Signature strip (home page, 4 featured alternating) ──────
const SIG_FALLBACKS = [
  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=900&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&q=70&auto=format&fit=crop',
]

function SignatureStrips({ services }: { services: Service[] }) {
  const featured = services.filter(s => s.is_featured).slice(0, 4)

  return (
    <section className="sl-sig-bg sl-section">
      <div style={{ maxWidth: '100%' }}>
        <div className="sl-container" style={{ marginBottom: 48 }}>
          <div className="sl-sec-head" data-reveal>
            <p className="sl-eyebrow">Trải nghiệm đặc trưng</p>
            <h2 className="sl-sec-title">Liệu trình <em>thương hiệu</em></h2>
            <p className="sl-sec-sub">
              Những liệu trình được tinh tuyển, kết hợp kỹ thuật truyền thống và công nghệ hiện đại.
            </p>
          </div>
        </div>

        {featured.map((svc, i) => (
          <div
            key={svc.id}
            className={`sl-sig-item${i % 2 === 1 ? ' reverse' : ''}`}
            data-reveal
          >
            <div className="sl-sig-img">
              <img
                src={svc.image || SIG_FALLBACKS[i % SIG_FALLBACKS.length]}
                alt={svc.name}
                loading="lazy"
                onError={e => {
                  const img = e.currentTarget
                  img.src = SIG_FALLBACKS[i % SIG_FALLBACKS.length]
                }}
              />
              <div className="sl-sig-img-overlay" />
            </div>
            <div className="sl-sig-content">
              <p className="sl-sig-tag">{svc.category_name || 'Liệu trình'}</p>
              <h3 className="sl-sig-title">{svc.name}</h3>
              <p className="sl-sig-desc">{svc.description}</p>
              <div className="sl-sig-meta">
                {svc.duration_minutes && (
                  <span className="sl-sig-duration">
                    ⏱ {formatDuration(svc.duration_minutes)}
                  </span>
                )}
                <span className="sl-sig-price">
                  <strong>{formatPrice(svc.price, svc.price_unit)}</strong>
                </span>
              </div>
              <Link to="/dat-lich" className="sl-btn sl-btn-gold">
                Đặt gói này
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Package cards (home page) ────────────────────────────────
const PKG_FALLBACKS = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=70&auto=format&fit=crop',
]

function PackagesSection({ services }: { services: Service[] }) {
  // Packages = services with no category_id or price_unit = 'cặp'
  const packages = services.filter(s => s.category_id === null).slice(0, 6)

  return (
    <section className="sl-packages-bg sl-section">
      <div className="sl-container">
        <div className="sl-sec-head" data-reveal>
          <p className="sl-eyebrow">Gói nghỉ dưỡng</p>
          <h2 className="sl-sec-title">Lựa chọn <em>gói trải nghiệm</em></h2>
          <p className="sl-sec-sub">
            Từ gói thư giãn nửa ngày đến trọn gói nghỉ dưỡng — mỗi gói được thiết kế để mang lại giá trị tốt nhất.
          </p>
        </div>

        <div className="sl-pkg-grid">
          {packages.map((pkg, i) => (
            <div key={pkg.id} className="sl-pkg-card" data-reveal>
              <div className="sl-pkg-img">
                <img
                  src={pkg.image || PKG_FALLBACKS[i % PKG_FALLBACKS.length]}
                  alt={pkg.name}
                  loading="lazy"
                  onError={e => {
                    e.currentTarget.src = PKG_FALLBACKS[i % PKG_FALLBACKS.length]
                  }}
                />
                {pkg.is_featured ? (
                  <span className="sl-pkg-badge">Phổ biến</span>
                ) : pkg.price_unit === 'cặp' ? (
                  <span className="sl-pkg-badge">Cặp đôi</span>
                ) : null}
              </div>
              <div className="sl-pkg-body">
                <h3 className="sl-pkg-title">{pkg.name}</h3>
                <p className="sl-pkg-desc">{pkg.description}</p>
                <div className="sl-pkg-footer">
                  <div className="sl-pkg-price">
                    {pkg.price_unit === 'liên hệ' ? (
                      <span className="sl-pkg-price-contact">Liên hệ báo giá</span>
                    ) : (
                      <>
                        {pkg.price.toLocaleString('vi-VN')}đ
                        <span>/{pkg.price_unit}</span>
                      </>
                    )}
                  </div>
                  <Link to="/dat-lich" className="sl-btn sl-btn-outline sl-btn-sm">
                    Đặt ngay
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Gallery / Space Section ──────────────────────────────────
interface GalleryItem {
  id: number
  name: string
  description: string
  image: string
}

function SpaceSection() {
  const [items, setItems] = useState<GalleryItem[]>([])
  useRevealData(items)

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery')
      .then(setItems)
      .catch(() => {})
  }, [])

  if (!items.length) return null

  const visible = items.slice(0, 5)

  return (
    <section className="sl-space-bg sl-section">
      <div className="sl-container">
        <div className="sl-sec-head" data-reveal>
          <p className="sl-eyebrow">Không gian</p>
          <h2 className="sl-sec-title">Trải nghiệm <em>thiên đường</em></h2>
          <p className="sl-sec-sub">
            Không gian được thiết kế để đưa bạn rời xa nhịp sống hối hả — từng chi tiết đều toát lên sự sang trọng.
          </p>
        </div>

        <div className="sl-space-grid">
          {visible.map((item) => (
            <div key={item.id} className="sl-space-item" data-reveal>
              <img src={item.image} alt={item.name} loading="lazy" />
              <div className="sl-space-item-overlay" />
              <div className="sl-space-item-label">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Treatment List (all services, grouped) ───────────────────
function TreatmentList({ services, categories }: { services: Service[]; categories: ServiceCategory[] }) {
  // Group by category
  const categorizedServices = categories.map(cat => ({
    ...cat,
    services: services.filter(s => s.category_id === cat.id),
  })).filter(c => c.services.length > 0)

  const uncategorized = services.filter(s => s.category_id === null)

  return (
    <section className="sl-treat-bg sl-section">
      <div className="sl-container">
        <div className="sl-sec-head" data-reveal>
          <p className="sl-eyebrow">Danh mục liệu trình</p>
          <h2 className="sl-sec-title">Toàn bộ <em>dịch vụ</em></h2>
          <p className="sl-sec-sub">
            Mỗi liệu trình được thiết kế chi tiết cho từng nhu cầu — từ thư giãn đơn thuần đến phục hồi chuyên sâu.
          </p>
        </div>

        {categorizedServices.map(cat => (
          <div key={cat.id} className="sl-treat-group" data-reveal>
            <h3 className="sl-treat-group-title">{cat.name}</h3>
            <div className="sl-treat-list">
              {cat.services.map(svc => (
                <div key={svc.id} className="sl-treat-item">
                  <div className="sl-treat-main">
                    <p className="sl-treat-cat">{svc.category_name}</p>
                    <p className="sl-treat-name">{svc.name}</p>
                    <p className="sl-treat-desc">{svc.description}</p>
                  </div>
                  <div className="sl-treat-meta">
                    {svc.price_unit === 'liên hệ' ? (
                      <p className="sl-treat-price-contact">Liên hệ</p>
                    ) : svc.price === 0 ? (
                      <p className="sl-treat-price-free">Miễn phí</p>
                    ) : (
                      <p className="sl-treat-price">
                        {svc.price.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                    {svc.duration_minutes && (
                      <p className="sl-treat-duration">{formatDuration(svc.duration_minutes)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {uncategorized.length > 0 && (
          <div className="sl-treat-group" data-reveal>
            <h3 className="sl-treat-group-title">Gói nghỉ dưỡng</h3>
            <div className="sl-treat-list">
              {uncategorized.map(svc => (
                <div key={svc.id} className="sl-treat-item">
                  <div className="sl-treat-main">
                    <p className="sl-treat-name">{svc.name}</p>
                    <p className="sl-treat-desc">{svc.description}</p>
                  </div>
                  <div className="sl-treat-meta">
                    {svc.price_unit === 'liên hệ' ? (
                      <p className="sl-treat-price-contact">Liên hệ</p>
                    ) : (
                      <p className="sl-treat-price">
                        {svc.price.toLocaleString('vi-VN')}đ/{svc.price_unit}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 48 }} data-reveal>
          <Link to="/dat-lich" className="sl-btn sl-btn-gold sl-btn-lg">
            Đặt gói trải nghiệm
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Services page category filters ──────────────────────────
function ServicesCategoryView({ services, categories }: { services: Service[]; categories: ServiceCategory[] }) {
  const [activeId, setActiveId] = useState<number | null>(null)

  const allCategories = [
    ...categories,
    { id: -1, name: 'Gói nghỉ dưỡng', slug: 'goi', sort_order: 99 },
  ]

  const filtered = activeId === null
    ? services
    : activeId === -1
      ? services.filter(s => s.category_id === null)
      : services.filter(s => s.category_id === activeId)

  return (
    <>
      {/* Category filters */}
      <section className="sl-treat-bg" style={{ paddingBottom: 0 }}>
        <div className="sl-container">
          <div className="sl-cat-filters">
            <button
              className={`sl-cat-filter${activeId === null ? ' active' : ''}`}
              onClick={() => setActiveId(null)}
            >
              Tất cả
            </button>
            {allCategories.map(cat => (
              <button
                key={cat.id}
                className={`sl-cat-filter${activeId === cat.id ? ' active' : ''}`}
                onClick={() => setActiveId(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service list */}
      <section className="sl-treat-bg sl-section" style={{ paddingTop: 32 }}>
        <div className="sl-container">
          <div className="sl-treat-list">
            {filtered.map(svc => (
              <div key={svc.id} className="sl-treat-item" data-reveal>
                <div className="sl-treat-main">
                  {svc.category_name && (
                    <p className="sl-treat-cat">{svc.category_name}</p>
                  )}
                  <p className="sl-treat-name">{svc.name}</p>
                  <p className="sl-treat-desc">{svc.description}</p>
                </div>
                <div className="sl-treat-meta">
                  {svc.price_unit === 'liên hệ' ? (
                    <p className="sl-treat-price-contact">Liên hệ</p>
                  ) : svc.price === 0 ? (
                    <p className="sl-treat-price-free">Miễn phí</p>
                  ) : (
                    <p className="sl-treat-price">
                      {svc.price.toLocaleString('vi-VN')}đ/{svc.price_unit}
                    </p>
                  )}
                  {svc.duration_minutes && (
                    <p className="sl-treat-duration">{formatDuration(svc.duration_minutes)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

// ─── Main Export ──────────────────────────────────────────────
export default function Services({ page }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])

  useRevealData(services)

  useEffect(() => {
    Promise.all([
      api.get<Service[]>('/public/services'),
      api.get<ServiceCategory[]>('/public/service-categories'),
    ]).then(([svcs, cats]) => {
      setServices(svcs)
      setCategories(cats)
    }).catch(() => {})
  }, [])

  if (page === 'home') {
    return (
      <>
        <SignatureStrips services={services} />
        <PackagesSection services={services} />
        <SpaceSection />
        <TreatmentList services={services} categories={categories} />
      </>
    )
  }

  return (
    <>
      <ServicesCategoryView services={services} categories={categories} />
      <PackagesSection services={services} />
    </>
  )
}
