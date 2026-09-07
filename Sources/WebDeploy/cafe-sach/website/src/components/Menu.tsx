import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface MenuCategory {
  id: number
  name: string
  slug: string
  item_count: number
}

interface MenuItem {
  id: number
  category_id: number
  category_name: string
  name: string
  description: string
  price: number | null
  price_sale: number | null
  image: string
  badge: string
  featured: number
}

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return price.toLocaleString('vi-VN') + 'đ'
}

export default function Menu({ preview = false }: { preview?: boolean }) {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCat, setActiveCat] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<MenuCategory[]>('/public/menu-categories'),
      api.get<MenuItem[]>('/public/menu-items'),
    ]).then(([cats, its]) => {
      setCategories(cats)
      setItems(its)
      if (cats.length > 0) setActiveCat(cats[0].id)
    }).catch(() => {/* dùng danh sách rỗng */})
  }, [])

  if (preview) {
    const featured = items.filter(i => i.featured === 1)
    return (
      <section className="sec-pad sec-surface">
        <div className="csa-container">
          <div className="row g-5">
            <div className="col-lg-4" data-reveal>
              <div className="csa-eyebrow">Thức uống nổi bật</div>
              <h2 className="csa-sec-title">Vị nhẹ, <em>để tâm trí ở lại</em></h2>
              <p className="csa-sec-sub mb-4">Chúng tôi hạn chế những thức uống quá đậm caffeine hay quá ngọt — để bạn có thể ngồi đọc trọn một buổi chiều mà không thấy bồn chồn.</p>
              <a href="/menu" className="csa-btn csa-btn-accent">Xem toàn bộ thực đơn</a>
            </div>
            <div className="col-lg-8" data-reveal data-reveal-d1>
              <ul className="csa-book-list">
                {featured.map(item => (
                  <li key={item.id}>
                    <div className="csa-bl-main">
                      <div className="csa-bl-name">
                        {item.name}
                        {item.badge && <span className="csa-bl-tag">{item.badge}</span>}
                      </div>
                      <div className="csa-bl-desc">{item.description}</div>
                    </div>
                    <div className="csa-bl-price">{formatPrice(item.price)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const activeItems = items.filter(i => i.category_id === activeCat)

  return (
    <section className="sec-pad sec-surface" style={{ paddingTop: 0 }}>
      <div className="csa-container">
        <div className="csa-menu-tabs" data-reveal>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`csa-mt-btn${cat.id === activeCat ? ' active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="csa-menu-panel active">
          <ul className="csa-book-list" data-reveal data-reveal-d1>
            {activeItems.map(item => (
              <li key={item.id}>
                <div className="csa-bl-main">
                  <div className="csa-bl-name">
                    {item.name}
                    {item.badge && <span className="csa-bl-tag">{item.badge}</span>}
                  </div>
                  <div className="csa-bl-desc">{item.description}</div>
                </div>
                <div className="csa-bl-price">{formatPrice(item.price)}</div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center mt-5" style={{ fontSize: 13.5, color: 'var(--text-3)' }} data-reveal>
          Giá đã bao gồm thuế · Đặt món tại quầy, chúng tôi sẽ mang đến tận bàn đọc của bạn.
        </p>
      </div>
    </section>
  )
}
