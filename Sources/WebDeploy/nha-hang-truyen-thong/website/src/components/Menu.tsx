import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number | null
  image: string
  badge: string
  featured: number
  category_id: number
  category_name: string
  category_slug: string
}

interface MenuData {
  categories: Category[]
  items: MenuItem[]
}

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return price.toLocaleString('vi-VN') + 'đ'
}

export default function Menu({ featured = false }: { featured?: boolean }) {
  const [data, setData] = useState<MenuData>({ categories: [], items: [] })
  const [activeFilter, setActiveFilter] = useState('all')
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<MenuData>('/public/menu').then(setData).catch(() => { })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = sectionRef.current?.querySelectorAll<Element>('[data-reveal]:not(.visible)') ?? []
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [data])

  const displayItems = featured
    ? data.items.filter(i => i.featured === 1).slice(0, 6)
    : activeFilter === 'all'
      ? data.items
      : data.items.filter(i => i.category_slug === activeFilter)

  if (featured) {
    return (

      <section className="sec-pad" style={{ background: 'var(--bg)' }} ref={sectionRef}>
        <div className="wd-container">
          <div className="row align-items-end mb-4">
            <div className="col-md-7">
              <div data-reveal className="reveal">
                <div className="eyebrow">Thực đơn nổi bật</div>
                <h2 className="sec-title" style={{ marginBottom: 6 }}>Những món <em>khách yêu thích</em></h2>
                <p className="sec-sub" style={{ margin: 0, textAlign: 'left' }}>
                  Hơn 70 món ăn chế biến mỗi ngày từ nguyên liệu tươi, không bột ngọt, không chất bảo quản.
                </p>
              </div>
            </div>
            <div className="col-md-5 mt-3 mt-md-0">
              <div className="menu-tab justify-content-md-end" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s, transform .7s' }}>
                <button className={`mt-btn${activeFilter === 'all' ? ' active' : ''}`} onClick={() => setActiveFilter('all')}>Tất cả</button>
                {data.categories.map(c => (
                  <button key={c.id} className={`mt-btn${activeFilter === c.slug ? ' active' : ''}`} onClick={() => setActiveFilter(c.slug)}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-3">
            {displayItems.map((item, i) => (
              <div key={item.id} className="col-md-4">
                <div className={`food-card reveal${i % 3 === 1 ? ' reveal-d1' : i % 3 === 2 ? ' reveal-d2' : ''}`} data-reveal>
                  {item.image && <img className="fc-img" src={item.image} alt={item.name} loading="lazy" />}
                  <div className="fc-body">
                    <div className="fc-cat">{item.category_name}</div>
                    <div className="fc-name">
                      {item.name}
                      {item.badge && <span className="fc-badge">{item.badge}</span>}
                    </div>
                    <div className="fc-desc">{item.description}</div>
                    {item.price != null && <div className="fc-price">{formatPrice(item.price)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s .2s, transform .7s .2s' }}>
            <Link to="/thuc-don" className="btn-ghost">Xem toàn bộ thực đơn →</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }} ref={sectionRef}>
      <div className="wd-container">
        {data.categories.map(cat => {
          const catItems = data.items.filter(i => i.category_id === cat.id)
          if (catItems.length === 0) return null
          return (
            <div key={cat.id} className="menu-section" id={cat.slug}>
              <div className="menu-category-title reveal" data-reveal><span>{cat.icon}</span> {cat.name}</div>
              <div className="row g-3">
                {catItems.map((item, i) => (
                  <div key={item.id} className="col-md-4">
                    <div className={`food-card reveal${i % 3 === 1 ? ' reveal-d1' : i % 3 === 2 ? ' reveal-d2' : ''}`} data-reveal>
                      {item.image && <img className="fc-img" src={item.image} alt={item.name} loading="lazy" />}
                      <div className="fc-body">
                        <div className="fc-cat">{item.category_name}</div>
                        <div className="fc-name">
                          {item.name}
                          {item.badge && <span className="fc-badge">{item.badge}</span>}
                        </div>
                        <div className="fc-desc">{item.description}</div>
                        {item.price != null && <div className="fc-price">{formatPrice(item.price)}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
