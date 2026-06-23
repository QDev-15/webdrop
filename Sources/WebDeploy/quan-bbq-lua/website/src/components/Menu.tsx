import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface MenuCategory {
  id: number
  name: string
  slug: string
  description: string
  item_count: number
}

interface MenuItem {
  id: number
  category_id: number
  name: string
  description: string
  price: number | null
  price_sale: number | null
  price_unit: string
  badge: string
  featured: number
  status: string
}

const CAT_ICONS: Record<string, string> = {
  'thit-bo': '🥩',
  'thit-heo-ga': '🐷',
  'hai-san-tuoi': '🦐',
  'rau-nam-do-phu': '🥦',
  'combo-set': '🎁',
}

function formatPrice(price: number | null, unit: string): string {
  if (price == null) return unit || '—'
  return price.toLocaleString('vi-VN') + 'đ' + (unit ? unit : '')
}

function getBadgeEl(badge: string) {
  if (!badge) return null
  const b = badge.toUpperCase()
  if (b === 'HOT') return <span className="menu-badge-hot">HOT</span>
  if (b === 'NEW') return <span className="menu-badge-new">NEW</span>
  if (b === 'PREMIUM') return <span className="menu-badge-premium">PREMIUM</span>
  if (b.includes('VIP')) return <span className="menu-badge-vip">VIP</span>
  if (b.includes('BEST')) return <span className="menu-badge-bestseller">BEST SELLER</span>
  return <span className="menu-badge-hot">{badge}</span>
}

export default function Menu() {
  const { settings } = useSite()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([
      api.get<MenuCategory[]>('/public/menu-categories'),
      api.get<MenuItem[]>('/public/menu-items'),
    ])
      .then(([cats, its]) => { setCategories(cats); setItems(its) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const els = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      if (!els?.length) return
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [categories, items])

  const hours = settings.working_hours || 'T2–T6: 17:00–23:00 | T7: 11:00–23:00 | CN: 11:00–22:00'

  return (
    <div ref={ref}>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Thực đơn</div>
          <h1 className="ph-title">Thực Đơn <em>BBQ Đầy Đủ</em></h1>
          <p className="ph-sub">Hơn 60 loại thịt và hải sản tươi — gọi theo kg, gọi theo combo, ăn no không giới hạn.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-8">
              {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-2)' }}>Đang tải thực đơn...</div>}
              {!loading && categories.map(cat => {
                const catItems = items.filter(i => i.category_id === cat.id)
                const icon = CAT_ICONS[cat.slug] || '🍽'
                return (
                  <div key={cat.id} className="menu-section" data-reveal>
                    <div className="ms-header">
                      <span className="ms-icon">{icon}</span>
                      <span className="ms-title">{cat.name}</span>
                    </div>
                    {catItems.map(item => (
                      <div key={item.id} className="menu-row">
                        <div className="menu-row-info">
                          <div className="menu-row-name">
                            {item.name}
                            {item.badge && getBadgeEl(item.badge)}
                          </div>
                          {item.description && <div className="menu-row-desc">{item.description}</div>}
                        </div>
                        <div className="menu-row-price">
                          {formatPrice(item.price, item.price_unit)}
                        </div>
                      </div>
                    ))}
                    {catItems.length === 0 && <div style={{ color: 'var(--text-3)', fontSize: 13 }}>Đang cập nhật...</div>}
                  </div>
                )
              })}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div style={{ position: 'sticky', top: 84 }}>
                <div className="booking-card" data-reveal style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Đặt bàn nhanh</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Điền số điện thoại, chúng tôi gọi lại trong 5 phút</div>
                  <Link to="/dat-ban" className="btn-accent" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Đặt bàn ngay →</Link>
                </div>

                <div className="booking-card" data-reveal>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>🕐 Giờ mở cửa</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8 }}>
                    {hours.split('|').map((h, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                        <span>{h.split(':')[0].trim()}</span>
                        <span style={{ fontWeight: 500, color: 'var(--text)' }}>{h.split(':').slice(1).join(':').trim()}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, padding: 12, background: 'var(--accent-light)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>Lưu ý</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6 }}>Cuối tuần và ngày lễ đặt trước ít nhất 1 ngày để đảm bảo có bàn.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="wd-container" data-reveal>
          <h2 className="cta-title">Đã chọn được món ưng ý?</h2>
          <p className="cta-sub">Đặt bàn ngay — đảm bảo có chỗ, thịt tươi đặt sẵn cho bạn.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/dat-ban" className="btn-white">Đặt bàn ngay →</Link>
            <Link to="/lien-he" style={{ fontSize: 14, background: 'transparent', color: 'rgba(255,255,255,.7)', padding: '12px 26px', borderRadius: 9, border: '1px solid rgba(255,255,255,.3)', display: 'inline-block' }}>Liên hệ tư vấn</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
