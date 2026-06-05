import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  featured: number
}

interface MenuCategory {
  id: number
  name: string
  slug: string
  icon: string
  items: MenuItem[]
}

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<MenuCategory[]>('/public/menu')
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
        const ro = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
        }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
        els.forEach(el => ro.observe(el))
        return () => ro.disconnect()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [loading])

  const gridCategories = ['espresso-based', 'banh-ngot-an-nhe']
  const listCategories = ['cold-brew-pour-over', 'tra-nuoc-ep', 'ca-phe-hat']

  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Thực đơn</div>
          <h1 className="ph-title">Menu <em>đầy đủ</em></h1>
          <p className="ph-sub">Cà phê rang xay, trà, nước ép và bánh ngọt — tất cả làm từ nguyên liệu chọn lọc.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {loading && <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>Đang tải thực đơn...</div>}

          {categories.map(cat => {
            const isGrid = gridCategories.includes(cat.slug)
            const isList = listCategories.includes(cat.slug)
            return (
              <div className="mb-5 reveal" key={cat.id}>
                <div className="menu-section-title">{cat.icon} {cat.name}</div>
                {isGrid ? (
                  <div className="row g-3">
                    {cat.items.map(item => (
                      <div className="col-sm-6 col-lg-3" key={item.id}>
                        <div className="menu-grid-card">
                          {item.image && <img className="mgc-img" src={item.image} alt={item.name} loading="lazy" />}
                          <div className="mgc-body">
                            <div className="mgc-name">{item.name}</div>
                            <div className="mgc-desc">{item.description}</div>
                            <div className="mgc-price">{item.price.toLocaleString('vi-VN')}đ</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isList ? (
                  <div className="row g-0">
                    <div className="col-12">
                      {cat.items.map(item => (
                        <div className="menu-list-item" key={item.id}>
                          <div>
                            <div className="mli-name">{item.name}</div>
                            <div className="mli-desc">{item.description}</div>
                          </div>
                          <div className="mli-price">{item.price.toLocaleString('vi-VN')}đ</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="row g-3">
                    {cat.items.map(item => (
                      <div className="col-sm-6 col-lg-4" key={item.id}>
                        <div className="menu-grid-card">
                          {item.image && <img className="mgc-img" src={item.image} alt={item.name} loading="lazy" />}
                          <div className="mgc-body">
                            <div className="mgc-name">{item.name}</div>
                            <div className="mgc-desc">{item.description}</div>
                            <div className="mgc-price">{item.price.toLocaleString('vi-VN')}đ</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <div className="text-center mt-5 reveal">
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '16px' }}>Giá đã bao gồm VAT. Menu thay đổi theo mùa.</p>
            <Link to="/lien-he" className="btn-accent">Đặt chỗ ngay</Link>
          </div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="wd-container position-relative">
          <div className="cta-title">Một tách cà phê đang chờ bạn</div>
          <div className="cta-sub">Ghé thăm mỗi ngày 7:00 – 22:00. Đặt chỗ trước để có bàn đẹp.</div>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/lien-he" className="btn-white">Đặt chỗ trước</Link>
            <Link to="/khong-gian" className="btn-accent" style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', color: '#fff' }}>Xem không gian</Link>
          </div>
        </div>
      </section>
    </>
  )
}
