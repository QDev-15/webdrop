import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface MenuCategory {
  id: number
  name: string
  slug: string
  items: MenuItem[]
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
  image: string
  status: string
}

interface Props {
  fullPage?: boolean
}

const FALLBACK: MenuCategory[] = [
  { id: 1, name: 'Tôm & Cua', slug: 'tom-cua', items: [
    { id: 1, category_id: 1, category_name: 'Tôm & Cua', name: 'Tôm Sú & Tôm Thẻ', description: 'Hấp sả, nướng muối ớt, hay chiên bơ tỏi.', price: 280000, price_sale: null, badge: 'Tươi Sống', image: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=600&q=80', status: 'published' },
    { id: 2, category_id: 1, category_name: 'Tôm & Cua', name: 'Cua Biển', description: 'Hấp bia, rang me hay xốt tamarind. Cân trước khi chế biến.', price: 450000, price_sale: null, badge: 'Tươi Sống', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80', status: 'published' },
  ]},
  { id: 2, name: 'Mực & Bạch Tuộc', slug: 'muc-bach-tuoc', items: [
    { id: 3, category_id: 2, category_name: 'Mực & Bạch Tuộc', name: 'Mực Ống & Mực Lá', description: 'Nướng mực một nắng, chiên giòn hay nhúng lẩu.', price: 180000, price_sale: null, badge: 'Tươi Sống', image: 'https://images.unsplash.com/photo-1513557234616-d3c6874e36d7?w=600&q=80', status: 'published' },
    { id: 4, category_id: 2, category_name: 'Mực & Bạch Tuộc', name: 'Bạch Tuộc', description: 'Bạch tuộc baby xào bơ tỏi hay nướng sa tế.', price: 200000, price_sale: null, badge: 'Tươi Sống', image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=80', status: 'published' },
  ]},
  { id: 3, name: 'Cá Biển', slug: 'ca-bien', items: [
    { id: 5, category_id: 3, category_name: 'Cá Biển', name: 'Ghẹ Xanh & Ghẹ Đỏ', description: 'Hấp nước dừa hoặc nướng muối sả ớt.', price: 220000, price_sale: null, badge: 'Tươi Sống', image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&q=80', status: 'published' },
    { id: 6, category_id: 3, category_name: 'Cá Biển', name: 'Cá Biển Tươi', description: 'Cá mú, cá chẽm, cá hồng đỏ — tùy theo mùa.', price: null, price_sale: null, badge: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80', status: 'published' },
  ]},
]

export default function Menu({ fullPage = false }: Props) {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<MenuCategory[]>('/public/menu')
      .then(data => {
        if (data && data.length > 0) {
          setCategories(data)
          setActiveTab(data[0].id)
        } else {
          setCategories(FALLBACK)
          setActiveTab(FALLBACK[0].id)
        }
      })
      .catch(() => {
        setCategories(FALLBACK)
        setActiveTab(FALLBACK[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal-menu]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.05 })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [categories, activeTab])

  const formatPrice = (p: number | null) => {
    if (!p) return 'Theo loại'
    return new Intl.NumberFormat('vi-VN').format(p) + 'đ'
  }

  const activeCategory = categories.find(c => c.id === activeTab)
  const displayItems = fullPage
    ? (activeCategory?.items || []).filter(i => i.status === 'published')
    : categories.flatMap(c => c.items.filter(i => i.status === 'published')).slice(0, 6)

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>Đang tải thực đơn...</div>
  }

  return (
    <>
      {fullPage && categories.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)} style={{
              padding: '7px 18px', borderRadius: 20, border: '1px solid',
              borderColor: activeTab === cat.id ? 'var(--accent)' : 'var(--border)',
              background: activeTab === cat.id ? 'var(--accent-light)' : 'transparent',
              color: activeTab === cat.id ? 'var(--accent)' : 'var(--text-2)',
              fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all .2s',
            }}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="row g-4">
        {displayItems.map((item, idx) => (
          <div key={item.id} className={`col-sm-6 col-lg-4`}>
            <div className={`seafood-card reveal reveal-d${(idx % 3) + 1}`} data-reveal-menu>
              {item.image && (
                <img className="sfc-img" src={item.image} alt={item.name} loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              )}
              <div className="sfc-body">
                <div className="sfc-header">
                  <div className="sfc-name">{item.name}</div>
                  {item.badge && <span className="sfc-badge badge-fresh">{item.badge}</span>}
                </div>
                {item.description && <div className="sfc-desc">{item.description}</div>}
                <div className="sfc-price">
                  {item.price_sale ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-3)', fontSize: 13, marginRight: 6 }}>{formatPrice(item.price)}</span>
                      {formatPrice(item.price_sale)}<span className="sfc-unit">/kg</span>
                    </>
                  ) : (
                    <>{formatPrice(item.price)}{item.price ? <span className="sfc-unit">/kg</span> : <span className="sfc-unit"> (hỏi nhân viên)</span>}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
