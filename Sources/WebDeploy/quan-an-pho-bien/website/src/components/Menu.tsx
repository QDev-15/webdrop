import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface MenuCategory {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  sort_order: number
}

interface MenuItem {
  id: number
  category_id: number
  name: string
  description: string
  price: number
  price_note: string
  image: string
  badge: string
  featured: number
}

interface GroupedMenu extends MenuCategory {
  items: MenuItem[]
}

type MenuMode = 'full' | 'preview' | 'daily'

interface Props {
  mode: MenuMode
}

const formatPrice = (p: number) => p >= 1000 ? p.toLocaleString('vi-VN') + 'đ' : p + '.000đ'

export default function Menu({ mode }: Props) {
  const [grouped, setGrouped] = useState<GroupedMenu[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    api.get<GroupedMenu[]>('/public/menu').then(d => {
      setGrouped(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)', fontSize: 14 }}>
        Đang tải thực đơn...
      </div>
    )
  }

  // ── Daily mode: horizontal scroll of featured/first 8 items ──
  if (mode === 'daily') {
    const daily = grouped.flatMap(g => g.items).filter(i => i.featured || true).slice(0, 8)
    return (
      <div className="daily-scroll">
        {daily.map(item => (
          <div key={item.id} className="daily-card">
            <img
              className="dc-img"
              src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=220&background=fcd34d&color=7c2d12&bold=true`}
              alt={item.name}
              loading="lazy"
            />
            <div className="dc-body">
              {item.badge && <div className="dc-badge">{item.badge}</div>}
              <div className="dc-name">{item.name}</div>
              <div className="dc-price">{formatPrice(item.price)}{item.price_note && <span style={{ fontWeight: 300, fontSize: 12, color: 'var(--text-3)', marginLeft: 4 }}>{item.price_note}</span>}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Preview mode: tabs showing 5 items per category ──
  if (mode === 'preview') {
    const tabs = grouped.slice(0, 3)
    if (!tabs.length) return null
    const currentGroup = tabs[activeTab] ?? tabs[0]
    return (
      <div>
        <div className="text-center reveal mb-4">
          <div className="eyebrow">Thực đơn</div>
          <h2 className="sec-title">Xem nhanh <em>thực đơn</em></h2>
        </div>
        <div className="d-flex justify-content-center mb-4 reveal">
          <div className="meal-tabs">
            {tabs.map((g, i) => (
              <button
                key={g.id}
                className={`meal-tab${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {g.icon && <span style={{ marginRight: 6 }}>{g.icon}</span>}
                {g.name}
              </button>
            ))}
          </div>
        </div>
        <div className="row justify-content-center reveal">
          <div className="col-lg-8">
            {(currentGroup?.items ?? []).slice(0, 6).map(item => (
              <div key={item.id} className="menu-row">
                <div className="mr-left">
                  <div className="mr-icon">{item.image ? '🍽' : (grouped.find(g => g.items.some(i => i.id === item.id))?.icon || '🍽')}</div>
                  <div className="mr-info">
                    <div className="mr-name">
                      {item.name}
                      {item.badge && <span className="mr-badge">{item.badge}</span>}
                    </div>
                    {item.description && <div className="mr-desc">{item.description}</div>}
                  </div>
                </div>
                <div>
                  <div className="mr-price">{formatPrice(item.price)}</div>
                  {item.price_note && <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'right' }}>{item.price_note}</div>}
                </div>
              </div>
            ))}
            <div className="text-center mt-4">
              <a href="/thuc-don" className="btn-accent" style={{ fontSize: 13 }}>Xem toàn bộ thực đơn →</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Full mode: all categories with all items ──
  return (
    <div>
      {grouped.map((group) => (
        <div key={group.id} className="mb-5 reveal">
          <h2 className="menu-section-title">
            {group.icon && <span>{group.icon}</span>}
            {group.name}
            {group.description && <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-3)', marginLeft: 'auto' }}>{group.description}</span>}
          </h2>
          <div style={{ borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--surface)', marginTop: 12 }}>
            {group.items.map((item, idx) => (
              <div key={item.id} className="menu-row" style={{ padding: '14px 20px', borderBottom: idx < group.items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                <div className="mr-left">
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} loading="lazy" />
                  ) : (
                    <div className="mr-icon">{group.icon || '🍽'}</div>
                  )}
                  <div className="mr-info">
                    <div className="mr-name">
                      {item.name}
                      {item.badge && <span className="mr-badge">{item.badge}</span>}
                      {item.featured === 1 && <span style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', padding: '1px 7px', borderRadius: 5, marginLeft: 6 }}>Bán chạy</span>}
                    </div>
                    {item.description && <div className="mr-desc">{item.description}</div>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="mr-price">{formatPrice(item.price)}</div>
                  {item.price_note && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.price_note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
