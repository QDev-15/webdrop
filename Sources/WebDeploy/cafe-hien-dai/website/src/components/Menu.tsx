import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Category { id: number; name: string; slug: string }
interface MenuItemRow { id: number; category_id: number; name: string; description: string; price: number | null }

const ICON_CYCLE = ['☕', '🫗', '🧊', '🍵', '🥐']

function formatPrice(price: number | null): string {
  if (price == null) return '—'
  return price.toLocaleString('vi-VN') + 'đ'
}

export default function Menu() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `${settings.menu_page_title || 'Thực đơn'} — ${settings.site_name || 'MONO Coffee'}`,
    description: settings.menu_page_sub,
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItemRow[]>([])
  const [activeTab, setActiveTab] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/menu-categories'),
      api.get<MenuItemRow[]>('/public/menu-items'),
    ]).then(([cats, its]) => {
      setCategories(cats)
      setItems(its)
      if (cats.length > 0) setActiveTab(cats[0].id)
    }).catch(() => {})
  }, [])

  return (
    <>
      <header className="chd-page-hero">
        <div className="chd-container">
          <div className="chd-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Thực đơn</span></div>
          <h1 className="chd-page-title">{settings.menu_page_title || 'Thực đơn'}</h1>
          <p className="chd-page-sub">{settings.menu_page_sub}</p>
        </div>
      </header>

      <section className="chd-sec">
        <div className="chd-container">

          <div className="chd-menu-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`chd-menu-tab${activeTab === cat.id ? ' chd-active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {categories.map((cat, i) => (
            <div key={cat.id} className={`chd-menu-panel${activeTab === cat.id ? ' chd-active' : ''}`}>
              <div className="chd-menu-section-title">{ICON_CYCLE[i % ICON_CYCLE.length]} {cat.name}</div>
              {items.filter(i => i.category_id === cat.id).map(item => (
                <div className="chd-menu-list-item" key={item.id}>
                  <div>
                    <div className="chd-mli-name">{item.name}</div>
                    <div className="chd-mli-desc">{item.description}</div>
                  </div>
                  <div className="chd-mli-price">{formatPrice(item.price)}</div>
                </div>
              ))}
            </div>
          ))}

          <div className="chd-beans-banner">
            {settings.menu_beans_image && <img src={settings.menu_beans_image} alt="Hạt cà phê rang mới đóng gói mang về" loading="lazy" />}
            <div>
              <span className="chd-drink-tag">{settings.menu_beans_tag}</span>
              <h3>{settings.menu_beans_title}</h3>
              <p>{settings.menu_beans_text}</p>
              <Link to="/lien-he" className="chd-btn chd-btn-accent">Đặt hạt cà phê ngay</Link>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
