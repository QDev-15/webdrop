import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/bo-suu-tap', label: 'Bộ sưu tập', end: false },
  { to: '/khuyen-mai', label: 'Khuyến mãi', end: false },
  { to: '/dich-vu', label: 'Dịch vụ', end: false },
  { to: '/lien-he', label: 'Liên hệ', end: false },
]

export default function Header() {
  const { settings } = useSite()
  const { count } = useCart()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [mobOpen, setMobOpen] = useState(false)

  const submitSearch = () => {
    const q = searchValue.trim()
    if (q) {
      navigate('/?q=' + encodeURIComponent(q))
      setSearchOpen(false)
    }
  }

  const phone = settings.site_phone || ''
  const zalo = settings.zalo_number || ''

  return (
    <>
      {/* Topbar */}
      <div className="vp-topbar" role="status">
        <div className="vp-container">
          {settings.topbar_text_1 && <span className="vp-topbar-item">{settings.topbar_text_1}</span>}
          {settings.topbar_text_2 && <><span className="vp-topbar-sep">·</span><span className="vp-topbar-item">{settings.topbar_text_2}</span></>}
          {settings.topbar_text_3 && <><span className="vp-topbar-sep">·</span><span className="vp-topbar-item">{settings.topbar_text_3}</span></>}
        </div>
      </div>

      {/* Navigation */}
      <nav id="vp-nav" aria-label="Menu chính">
        <div className="vp-container">
          <div className="vp-nav-inner">
            <Link to="/" className="vp-logo" aria-label={`${settings.site_name || 'OFFICEHUB'} - Trang chủ`}>
              <span className="vp-logo-mark">OH</span>
              <span className="vp-logo-text">OFFICE<span>HUB</span></span>
            </Link>

            <ul className="vp-nav-links d-none d-lg-flex">
              {NAV_LINKS.map(l => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end} className={({ isActive }) => isActive ? 'active' : ''}>{l.label}</NavLink>
                </li>
              ))}
            </ul>

            <div className="vp-nav-actions">
              <button
                id="vp-search-btn"
                className="vp-nav-action-btn"
                aria-label="Tìm kiếm"
                aria-expanded={searchOpen}
                aria-controls="vp-search-panel"
                onClick={() => setSearchOpen(o => !o)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
              <Link to="/gio-hang" className="vp-cart-link" aria-label="Giỏ hàng">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                {count > 0 && <span className="vp-cart-count" aria-live="polite">{count}</span>}
              </Link>
              <button
                id="navBurger"
                className={'d-lg-none' + (mobOpen ? ' open' : '')}
                aria-label="Mở menu"
                aria-expanded={mobOpen}
                aria-controls="navMob"
                onClick={() => setMobOpen(o => !o)}
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="vp-search-panel" id="vp-search-panel">
              <div className="vp-search-form">
                <input
                  type="search"
                  id="navSearchInput"
                  placeholder="Tìm bút viết, sổ tay, balo..."
                  aria-label="Từ khóa tìm kiếm"
                  autoFocus
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitSearch() }}
                />
                <button id="navSearchSubmit" type="button" onClick={submitSearch}>Tìm kiếm</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile nav */}
      <div className={'vp-mob-nav' + (mobOpen ? ' open' : '')} id="navMob" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
        <button className="vp-mob-close" id="navMobClose" aria-label="Đóng menu" onClick={() => setMobOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <ul className="vp-mob-links">
          {NAV_LINKS.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} onClick={() => setMobOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>{l.label}</NavLink>
            </li>
          ))}
        </ul>
        <div className="vp-mob-actions">
          <Link to="/gio-hang" onClick={() => setMobOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="18" height="18"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>
            Giỏ hàng của tôi
          </Link>
          {phone && (
            <a href={`tel:${phone.replace(/\s/g, '')}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="18" height="18"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
              {phone}
            </a>
          )}
        </div>
      </div>

      {/* Zalo float */}
      {zalo && (
        <div className="vp-zalo-float">
          <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
            <svg viewBox="0 0 48 48" width="28" height="28"><text y="36" fontSize="32" fill="#fff">Z</text></svg>
          </a>
        </div>
      )}
    </>
  )
}
