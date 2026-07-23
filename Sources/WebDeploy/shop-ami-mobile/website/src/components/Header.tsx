import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/san-pham', label: 'Sản phẩm' },
  { to: '/khuyen-mai', label: 'Khuyến mãi' },
  { to: '/ve-chung-toi', label: 'Giới thiệu' },
  { to: '/lien-he', label: 'Liên hệ' },
]

// Logo "AMI Mobile" hiển thị dạng "AMI" thường + "MOBILE" nhấn mạnh (CSS .mb-logo em) —
// tách theo khoảng trắng đầu tiên của site_name để vẫn quản lý được qua Cài đặt.
function splitLogo(siteName: string): [string, string] {
  const parts = siteName.trim().split(/\s+/)
  if (parts.length < 2) return [siteName || 'AMI', 'MOBILE']
  return [parts[0], parts.slice(1).join(' ')]
}

export default function Header() {
  const { settings } = useSite()
  const { count } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const [logoPre, logoEm] = splitLogo(settings.site_name || 'AMI Mobile')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    setSearchOpen(false)
    navigate(q ? `/san-pham?q=${encodeURIComponent(q)}` : '/san-pham')
  }

  return (
    <header id="mb-nav">
      <div className="mb-nav-inner mb-container">
        <NavLink to="/" className="mb-logo" onClick={() => setMenuOpen(false)}>
          <span className="mb-logo-dot"></span>
          {logoPre}<em>{logoEm}</em>
        </NavLink>
        <nav className="mb-nav-links">
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => isActive ? 'active' : ''}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mb-nav-actions">
          <button className="mb-icon-btn" aria-label="Tìm kiếm" onClick={() => setSearchOpen(o => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </button>
          <div className="mb-cart-wrap">
            <NavLink to="/gio-hang" className="mb-icon-btn" aria-label="Giỏ hàng">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            </NavLink>
            <span className="mb-cart-badge">{count}</span>
          </div>
          <button className={'mb-burger' + (menuOpen ? ' open' : '')} aria-label="Menu" onClick={() => setMenuOpen(o => !o)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div className={'mb-search-panel' + (searchOpen ? ' open' : '')}>
        <div className="mb-container">
          <form className="mb-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="mb-search-input"
              placeholder="Tìm iPhone, Samsung, tai nghe, sạc..."
              autoComplete="off"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            <button type="submit" className="mb-search-btn">Tìm</button>
          </form>
        </div>
      </div>

      <div className={'mb-mob-menu' + (menuOpen ? ' open' : '')}>
        <nav className="mb-mob-nav">
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mb-mob-actions">
          <NavLink to="/gio-hang" className="mb-btn mb-btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            Giỏ hàng
          </NavLink>
        </div>
      </div>
    </header>
  )
}
