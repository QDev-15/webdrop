import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  badge: string
  category_name: string
  category_id: number
}

interface MenuCategory {
  id: number
  name: string
  slug: string
  description: string
  items: MenuItem[]
}

const catLabels: Record<string, string> = {
  'sashimi': '刺身',
  'sushi-maki': '寿司・巻き',
  'ramen-udon': 'ラーメン・うどん',
  'teppanyaki': '鉄板焼き',
  'set-com': '定食',
  'trang-miem': 'デザート',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫'
}

export default function Menu() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<MenuCategory[]>('/public/menu').then(data => {
      setCategories(data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [categories, activeFilter])

  const filteredCats = activeFilter === 'all' ? categories : categories.filter(c => c.slug === activeFilter)

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-3)' }}>Đang tải thực đơn...</div>
  }

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        {/* Filter */}
        <div className="reveal mb-5">
          <div className="menu-filter">
            <button className={`mf-btn${activeFilter === 'all' ? ' active' : ''}`} onClick={() => setActiveFilter('all')}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} className={`mf-btn${activeFilter === c.slug ? ' active' : ''}`} onClick={() => setActiveFilter(c.slug)}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {filteredCats.map((cat, catIdx) => (
          <div key={cat.id} className="menu-section" data-cat={cat.slug}>
            <div className="cat-heading reveal" style={{ marginTop: catIdx === 0 ? 0 : undefined }}>
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-3)', width: '24px' }}>0{catIdx + 1}</span>
              <span style={{ fontSize: '20px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-1px' }}>{cat.name}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-3)', letterSpacing: '2px', marginLeft: '8px' }}>{catLabels[cat.slug] || ''}</span>
            </div>
            {cat.items.map((item, itemIdx) => (
              <div key={item.id} className={`menu-list-item reveal${itemIdx > 0 ? ` reveal-d${Math.min(itemIdx, 3) as 1 | 2 | 3}` : ''}`}>
                {item.image && (
                  <img src={item.image} alt={item.name} className="mli-img" />
                )}
                <div>
                  <div className="mli-cat">{item.category_name}</div>
                  <div className="mli-name-jp">{item.name}</div>
                  <p className="mli-desc">{item.description}</p>
                  {item.badge && <span className="mli-badge">{item.badge}</span>}
                </div>
                <div className="mli-price">
                  {item.price ? formatPrice(item.price) : 'Liên hệ'}
                </div>
              </div>
            ))}
          </div>
        ))}

        {categories.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '48px' }}>
            Thực đơn đang được cập nhật. Vui lòng liên hệ để biết thêm thông tin.
          </div>
        )}
      </div>
    </section>
  )
}
