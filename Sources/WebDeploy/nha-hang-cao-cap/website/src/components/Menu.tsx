import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface MenuCategory {
  id: number
  name: string
  slug: string
  sort_order: number
}

interface MenuItem {
  id: number
  category_id: number
  category_name: string
  name: string
  description: string
  price: number | null
  price_sale: number | null
  badge: string
  featured: number
  status: string
}

const TASTING_MENU = [
  { course: 'Amuse-Bouche', name: 'Bộ tứ khai vị', desc: 'Bốn tác phẩm miniature — Foie gras mousse, Blinis caviar, Gazpacho gel, Bánh mì nướng truffle', price: null },
  { course: 'Entrée', name: 'Sashimi hồi Na Uy', desc: 'Cá hồi Atlantique cắt lát mỏng, ponzu cam yuzu, trứng cá hồi, microgreen', price: 285000 },
  { course: 'Poisson', name: 'Cá vược biển Địa Trung Hải', desc: 'Fillet cá hấp sous vide, beurre blanc nghệ tây, khoai tây nghiền truffled', price: 520000 },
  { course: 'Viande', name: 'Wagyu A5 — Bít tết Kobe', desc: 'Beef Wagyu đẳng cấp A5 chính gốc Nhật Bản, sous vide 48h, jus bò đỏ, măng tây nướng', price: 1250000 },
  { course: 'Fromage', name: 'Bảng phô mai cao cấp', desc: 'Brie de Meaux, Comté 24 tháng, Roquefort AOP — kèm mật ong rừng và quả sung sấy', price: 320000 },
  { course: 'Dessert', name: 'Chocolate Valrhona 72%', desc: 'Fondant chocolate đắng Valrhona, kem vanilla Madagascar, quả mâm xôi tươi, lá bạc hà', price: 195000 },
]

export default function Menu() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<number | null>(null)

  useEffect(() => {
    api.get<{ categories: MenuCategory[]; items: MenuItem[] }>('/public/menu')
      .then(d => {
        setCategories(d.categories || [])
        setItems(d.items || [])
        if (d.categories && d.categories.length > 0) {
          setActiveTab(d.categories[0].id)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal-menu]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [items, activeTab])

  const filteredItems = activeTab
    ? items.filter(i => i.category_id === activeTab && i.status === 'published')
    : items.filter(i => i.status === 'published')

  const formatPrice = (p: number | null) => {
    if (!p) return '—'
    return new Intl.NumberFormat('vi-VN').format(p) + '₫'
  }

  return (
    <section id="thuc-don" style={{ background: 'var(--dark2)', padding: 'clamp(72px, 10vw, 128px) 0' }}>
      <div className="wd-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <div className="sec-dark" style={{ display: 'inline-block', width: '100%' }}>
            <div className="eyebrow" data-reveal>Thực đơn</div>
            <h2 className="sec-title" style={{ marginBottom: 14 }} data-reveal>
              Hành trình <em>vị giác</em> đỉnh cao
            </h2>
          </div>
          <p className="sec-sub" style={{ color: 'rgba(255,255,255,.38)', margin: '0 auto' }} data-reveal>
            Mỗi món ăn là tác phẩm nghệ thuật được đầu bếp chính tâm huyết chế tác từ những nguyên liệu thượng hạng nhập khẩu trực tiếp.
          </p>
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: activeTab === cat.id ? 'var(--accent-mid)' : 'rgba(255,255,255,.12)',
                  background: activeTab === cat.id ? 'rgba(184,147,74,.15)' : 'transparent',
                  color: activeTab === cat.id ? 'var(--accent-mid)' : 'rgba(255,255,255,.4)',
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'var(--sans)',
                  cursor: 'pointer',
                  transition: 'all .2s',
                  letterSpacing: .5,
                  textTransform: 'uppercase',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Menu items or tasting menu fallback */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', padding: 40 }}>Đang tải thực đơn...</div>
        ) : filteredItems.length > 0 ? (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="chef-item reveal reveal-d1"
                data-reveal-menu
              >
                <div className="ci-course">{item.category_name}</div>
                <div className="ci-info">
                  <div className="ci-name">
                    {item.name}
                    {item.badge && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--accent-mid)',
                        border: '1px solid rgba(184,147,74,.4)',
                        padding: '2px 8px',
                        borderRadius: 3,
                        marginLeft: 10,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && <div className="ci-desc">{item.description}</div>}
                </div>
                <div className="ci-price">
                  {item.price_sale ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,.25)', fontSize: 12, marginRight: 6 }}>
                        {formatPrice(item.price)}
                      </span>
                      {formatPrice(item.price_sale)}
                    </>
                  ) : formatPrice(item.price)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback: static tasting menu */
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {TASTING_MENU.map((item, i) => (
              <div key={i} className="chef-item">
                <div className="ci-course">{item.course}</div>
                <div className="ci-info">
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-desc">{item.desc}</div>
                </div>
                <div className="ci-price">{item.price ? formatPrice(item.price) : '—'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tasting packages */}
        <div style={{ marginTop: 'clamp(48px, 6vw, 80px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="eyebrow sec-dark" style={{ justifyContent: 'center' }}>Thực đơn Tasting</div>
            <h3 className="sec-title sec-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}>
              Chọn hành trình <em>của bạn</em>
            </h3>
          </div>
          <div className="row g-3">
            {[
              {
                badge: 'Cổ Điển',
                name: 'Menu 5 Món',
                sub: '120 phút trải nghiệm',
                price: '2.800.000',
                per: '/ người',
                featured: false,
                items: ['Amuse-bouche', 'Entrée theo mùa', 'Poisson hoặc Viande', 'Plateau Fromage', 'Dessert du Chef'],
              },
              {
                badge: 'Signature',
                name: 'Menu 8 Món',
                sub: '180 phút trải nghiệm',
                price: '4.500.000',
                per: '/ người',
                featured: true,
                items: ['Amuse-bouche ×4', 'Entrée ×2', 'Poisson', 'Viande Wagyu A5', 'Pre-dessert', 'Grand Dessert', 'Mignardise', 'Wine pairing tuỳ chọn'],
              },
              {
                badge: 'Prestige',
                name: 'Menu Omakase',
                sub: 'Theo sáng tạo đầu bếp',
                price: 'Liên hệ',
                per: '/ bàn',
                featured: false,
                items: ['10–14 món theo mùa', 'Nguyên liệu quý hiếm', 'Truffle, Caviar, Wagyu A5', 'Pairing rượu vang cao cấp', 'Trải nghiệm bếp mở', 'Phục vụ riêng'],
              },
            ].map(tier => (
              <div key={tier.badge} className="col-md-4">
                <div className={`tier-card${tier.featured ? ' featured' : ''}`}>
                  <div className="tc-badge">{tier.badge}</div>
                  <div className="tc-name">{tier.name}</div>
                  <div className="tc-sub">{tier.sub}</div>
                  <div className="tc-price">{tier.price}</div>
                  <div className="tc-per">{tier.per} (chưa thuế & phí dịch vụ)</div>
                  <hr className="tc-divider" />
                  <ul className="tc-list">
                    {tier.items.map(it => <li key={it}>{it}</li>)}
                  </ul>
                  <div style={{ marginTop: 28 }}>
                    <a href="#dat-ban" className={tier.featured ? 'btn-accent' : 'btn-outline-dark'} style={{ display: 'block', textAlign: 'center' }}>
                      Đặt bàn ngay
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
