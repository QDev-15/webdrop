import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  featured: number
  category_name: string
}

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<MenuItem[]>('/public/featured-menu')
      .then(setItems)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [items])

  const formatPrice = (p: number) => p?.toLocaleString('vi-VN') + 'đ'

  const displayItems = items.length > 0 ? items : [
    { id: 1, name: 'Phở Bò Đặc Biệt', description: 'Nước dùng ninh 12 giờ, thịt bò tươi, bánh phở mềm. Hương vị đậm đà không thể quên.', price: 85000, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80&auto=format&fit=crop', featured: 1, category_name: 'Món chính' },
    { id: 2, name: 'Bún Bò Huế', description: 'Sả, mắm ruốc thơm nồng, chả lụa và thịt bò bắp hầm mềm. Chuẩn vị Huế.', price: 75000, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80&auto=format&fit=crop', featured: 0, category_name: 'Món chính' },
    { id: 3, name: 'Chả Giò Sài Gòn', description: 'Vỏ giòn tan, nhân thịt heo, miến, mộc nhĩ thơm ngon. Chấm tương ớt đặc biệt.', price: 65000, image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&q=80&auto=format&fit=crop', featured: 1, category_name: 'Khai vị' },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }} ref={revealRef}>
      <div className="wd-container">
        <div className="text-center reveal mb-5" data-reveal>
          <div className="eyebrow">Thực đơn nổi bật</div>
          <h2 className="sec-title">Những món <em>khách yêu thích</em></h2>
          <p className="sec-sub">Hơn 60 món ăn được chế biến mỗi ngày từ nguyên liệu tươi sạch, nhập trực tiếp từ các vùng nguyên liệu uy tín.</p>
        </div>
        <div className="row g-3">
          {displayItems.slice(0, 3).map((item, i) => (
            <div key={item.id} className="col-md-4">
              <div className={`menu-card reveal reveal-d${i + 1}`} data-reveal>
                <img
                  className="mc-img"
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
                <div className="mc-body">
                  <div className="mc-cat">{item.category_name}</div>
                  <div className="mc-name">
                    {item.name}
                    {item.featured ? <span className="mc-badge">HOT</span> : null}
                  </div>
                  <div className="mc-desc">{item.description}</div>
                  <div className="mc-price">{formatPrice(item.price)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5 reveal" data-reveal>
          <Link to="/thuc-don" className="btn-ghost">Xem toàn bộ thực đơn →</Link>
        </div>
      </div>
    </section>
  )
}
