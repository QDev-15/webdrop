import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Category {
  id: number
  name: string
  slug: string
}

interface MenuItemData {
  id: number
  category_id: number | null
  name: string
  description: string
  price: number | null
}

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return price.toLocaleString('vi-VN') + 'đ'
}

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItemData[]>([])
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/menu-categories'),
      api.get<MenuItemData[]>('/public/menu-items'),
    ]).then(([cats, its]) => {
      setCategories(cats)
      setItems(its)
      if (cats.length > 0) setActiveTab(cats[0].id)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (categories.length === 0) return null

  return (
    <>
      <div className="crx-menu-tabs" data-reveal>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`crx-mt-btn${activeTab === cat.id ? ' active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {categories.map(cat => (
        <div key={cat.id} className={`crx-menu-panel${activeTab === cat.id ? ' active' : ''}`} data-reveal data-reveal-d1>
          <div className="crx-menu-section-title">{cat.name}</div>
          {items.filter(it => it.category_id === cat.id).map(item => (
            <div className="crx-menu-item" key={item.id}>
              <div>
                <div className="crx-mi-name">{item.name}</div>
                {item.description && <div className="crx-mi-desc">{item.description}</div>}
              </div>
              <div className="crx-mi-price">{formatPrice(item.price)}</div>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
