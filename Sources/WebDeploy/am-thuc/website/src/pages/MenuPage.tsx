import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface MenuCategory {
  id: number
  name: string
  slug: string
  items: MenuItem[]
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  featured: number
}

export default function MenuPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Thực đơn — ${settings.site_name || 'Nhà Hàng Ẩm Thực'}`,
    description: 'Thực đơn hơn 60 món ẩm thực Việt Nam — từ khai vị đến tráng miệng, nấu mới mỗi ngày từ nguyên liệu tươi sạch.',
  })

  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<MenuCategory[]>('/public/menu')
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [categories, activeFilter])

  const fmtPrice = (p: number) => p?.toLocaleString('vi-VN') + 'đ'

  const filtered = activeFilter === 'all'
    ? categories
    : categories.filter(c => c.slug === activeFilter)

  return (
    <>
      <Header />

      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Thực đơn</div>
          <h1 className="ph-title">60+ món <em>ẩm thực Việt</em></h1>
          <p className="ph-sub">Từ khai vị đến tráng miệng — tất cả được nấu mới mỗi ngày từ nguyên liệu tươi sạch.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-5 reveal">
            <h2 className="sec-title mb-0">Toàn bộ <em>thực đơn</em></h2>
            <div className="menu-filter">
              <button className={`mf-btn${activeFilter === 'all' ? ' active' : ''}`} onClick={() => setActiveFilter('all')}>Tất cả</button>
              {categories.map(cat => (
                <button key={cat.slug} className={`mf-btn${activeFilter === cat.slug ? ' active' : ''}`} onClick={() => setActiveFilter(cat.slug)}>{cat.name}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>Đang tải thực đơn...</div>
          ) : (
            <div id="menuGrid">
              {filtered.map(cat => (
                <div key={cat.id} className="mb-5 reveal">
                  <span className="menu-section-title">{cat.name}</span>
                  {cat.items.map(item => (
                    <div key={item.id} className="menu-row">
                      {item.image && (
                        <img className="mr-img" src={item.image} alt={item.name} loading="lazy" />
                      )}
                      <div style={{ flex: 1 }}>
                        <div className="mr-name">
                          {item.name}
                          {item.featured ? <span className="mr-badge">HOT</span> : null}
                        </div>
                        <div className="mr-desc">{item.description}</div>
                      </div>
                      <div className="mr-price">{fmtPrice(item.price)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="text-center reveal" style={{ padding: 24, background: 'var(--warm)', borderRadius: 14, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 14, fontWeight: 300 }}>Muốn xem thực đơn đầy đủ hoặc cần tư vấn đặt tiệc?</div>
            <Link to="/dat-ban" className="btn-accent" style={{ marginRight: 10 }}>Đặt bàn ngay</Link>
            <Link to="/lien-he" className="btn-ghost">Liên hệ tư vấn</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
