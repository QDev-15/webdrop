import { useState, useMemo, useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'
import { formatVND } from '../utils/text'

const CATEGORY_ICONS: Record<string, string> = {
  espresso: '☕',
  coldbrew: '🧊',
  tra: '🍵',
  an: '🥪',
}

export default function Menu() {
  const { menuCategories, menuItems, settings } = useSite()
  const [activeTab, setActiveTab] = useState<string>('')

  const categories = useMemo(
    () => [...menuCategories].filter(c => c.status === 'published').sort((a, b) => a.sort_order - b.sort_order),
    [menuCategories]
  )

  useEffect(() => {
    if (!activeTab && categories.length > 0) setActiveTab(categories[0].slug)
  }, [categories, activeTab])

  const itemsByCategory = useMemo(() => {
    const map: Record<number, typeof menuItems> = {}
    menuItems.filter(i => i.status === 'published').forEach(i => {
      const key = i.category_id ?? 0
      if (!map[key]) map[key] = []
      map[key].push(i)
    })
    Object.values(map).forEach(arr => arr.sort((a, b) => a.sort_order - b.sort_order))
    return map
  }, [menuItems])

  if (categories.length === 0) return null

  return (
    <>
      {settings.menu_section_note && (
        <div className="menu-section-note reveal">{settings.menu_section_note}</div>
      )}

      <div className="menu-tabs reveal" id="menuTabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`mt-btn${activeTab === cat.slug ? ' active' : ''}`}
            onClick={() => setActiveTab(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {categories.map(cat => {
        const items = itemsByCategory[cat.id] ?? []
        const isActive = activeTab === cat.slug
        const half = Math.ceil(items.length / 2)
        const colA = items.slice(0, half)
        const colB = items.slice(half)
        return (
          <div className={`menu-tab-panel${isActive ? ' active' : ''} reveal reveal-d1`} key={cat.id}>
            <div className="menu-section-title">{CATEGORY_ICONS[cat.slug] || '☕'} {cat.name}</div>
            <div className="row">
              <div className="col-md-6">
                {colA.map(item => (
                  <div className="menu-list-item" key={item.id}>
                    <div>
                      <div className="mli-name">{item.name}</div>
                      <div className="mli-desc">{item.description}</div>
                    </div>
                    <div className="mli-price">{formatVND(item.price)}</div>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                {colB.map(item => (
                  <div className="menu-list-item" key={item.id}>
                    <div>
                      <div className="mli-name">{item.name}</div>
                      <div className="mli-desc">{item.description}</div>
                    </div>
                    <div className="mli-price">{formatVND(item.price)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
