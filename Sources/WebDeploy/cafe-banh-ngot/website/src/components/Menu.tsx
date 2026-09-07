import { useEffect, useState } from 'react'
import { api } from '../api/client'

export interface MenuItemData {
  id: number
  category_id: number | null
  name: string
  description: string
  price: number | null
  price_sale: number | null
  image: string
  badge: string
  featured: number
  sort_order: number
}

export interface MenuCategoryData {
  id: number
  name: string
  slug: string
  description: string
  image: string
  sort_order: number
  items: MenuItemData[]
}

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return price.toLocaleString('vi-VN') + 'đ'
}

// Trang chủ — gộp 6 danh mục thành 3 nhóm tab đúng theo template gốc (Menu hôm nay)
const HOME_TAB_GROUPS = [
  { key: 'banh',    label: 'Bánh kem & Tart',        slugs: ['banh-kem', 'tart-banh-manh'] },
  { key: 'banhnho', label: 'Bánh nhỏ & Croissant',    slugs: ['banh-quy-macaron', 'croissant-banh-mi-ngot'] },
  { key: 'douong',  label: 'Cà phê & Trà',            slugs: ['ca-phe', 'tra-do-uong-khac'] },
]

interface MenuProps {
  variant: 'home' | 'full'
}

export default function Menu({ variant }: MenuProps) {
  const [categories, setCategories] = useState<MenuCategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    api.get<MenuCategoryData[]>('/public/menu')
      .then(cats => {
        setCategories(cats)
        if (variant === 'home') setActiveTab(HOME_TAB_GROUPS[0].key)
        else if (cats.length) setActiveTab(cats[0].slug)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  if (loading) return null

  if (variant === 'home') {
    const activeGroup = HOME_TAB_GROUPS.find(g => g.key === activeTab) ?? HOME_TAB_GROUPS[0]
    const items = categories
      .filter(c => activeGroup.slugs.includes(c.slug))
      .flatMap(c => c.items)
      .sort((a, b) => a.sort_order - b.sort_order)
      .slice(0, 5)

    return (
      <div>
        <div className="cbn-menu-tabs" id="cbnMenuTabs">
          {HOME_TAB_GROUPS.map(g => (
            <button key={g.key} className={`cbn-mt-btn${activeTab === g.key ? ' active' : ''}`} onClick={() => setActiveTab(g.key)}>
              {g.label}
            </button>
          ))}
        </div>
        <div className="cbn-menu-tab-panel active">
          {items.map(item => (
            <div className="cbn-menu-list-item" key={item.id}>
              <div>
                <div className="cbn-mli-name">{item.name}</div>
                {item.description && <div className="cbn-mli-desc">{item.description}</div>}
              </div>
              <div className="cbn-mli-price">{formatPrice(item.price)}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // variant === 'full' — trang Thực đơn đầy đủ, 6 tab theo danh mục, grid card
  return (
    <div>
      <div className="cbn-menu-tabs" id="cbnMenuTabs">
        {categories.map(c => (
          <button key={c.slug} className={`cbn-mt-btn${activeTab === c.slug ? ' active' : ''}`} onClick={() => setActiveTab(c.slug)}>
            {c.name}
          </button>
        ))}
      </div>
      {categories.map(c => (
        <div className={`cbn-menu-tab-panel${activeTab === c.slug ? ' active' : ''}`} key={c.slug} id={`tab-${c.slug}`}>
          <div className="cbn-menu-section-title">{c.name}</div>
          <div className="row g-4">
            {c.items.map(item => (
              <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                <div className="cbn-menu-grid-card">
                  {item.image && <img className="cbn-mgc-img" src={item.image} alt={item.name} loading="lazy" />}
                  <div className="cbn-mgc-body">
                    <div className="cbn-mgc-name">{item.name}</div>
                    {item.description && <div className="cbn-mgc-desc">{item.description}</div>}
                    <div className="cbn-mgc-price">{formatPrice(item.price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
