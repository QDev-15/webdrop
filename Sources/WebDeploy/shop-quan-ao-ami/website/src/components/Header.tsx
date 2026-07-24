import { Fragment, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/san-pham', label: 'Sản phẩm' },
  { to: '/bo-suu-tap', label: 'Bộ sưu tập' },
  { to: '/ve-chung-toi', label: 'Giới thiệu' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const { count } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const topbarItems = [settings.topbar_text_1, settings.topbar_text_2, settings.topbar_text_3].filter(Boolean)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false) }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    setSearchOpen(false)
    navigate(q ? `/san-pham?q=${encodeURIComponent(q)}` : '/san-pham')
  }

  return (
    <>
      {topbarItems.length > 0 && (
        <div className="am-topbar" role="banner">
          {topbarItems.map((t, i) => (
            <Fragment key={i}>
              <span>{t}</span>
              {i < topbarItems.length - 1 && <span className="am-topbar-dot">·</span>}
            </Fragment>
          ))}
        </div>
      )}

      <nav id="am-nav" role="navigation" aria-label="Điều hướng chính">
        <div className="am-nav-inner">
          <NavLink to="/" className="am-logo" aria-label="AMI Fashion — Trang chủ" onClick={() => setMenuOpen(false)}>AMI</NavLink>

          <ul className="am-nav-links" role="list">
            {NAV_LINKS.map(link => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={({ isActive }) => isActive ? 'active' : ''}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="am-nav-actions">
            <button className="am-nav-icon-btn" aria-label="Tìm kiếm" aria-expanded={searchOpen} onClick={() => setSearchOpen(o => !o)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <NavLink to="/gio-hang" className="am-nav-icon-btn am-cart-badge" aria-label="Giỏ hàng">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              <span>{count}</span>
            </NavLink>
            <button
              className={'am-hamburger' + (menuOpen ? ' open' : '')}
              aria-label="Mở menu"
              aria-expanded={menuOpen}
              aria-controls="navMob"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={'am-search-panel' + (searchOpen ? ' open' : '')} role="search">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Tìm sản phẩm AMI..."
            autoComplete="off"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <button type="submit">Tìm</button>
        </form>
      </div>

      <div className={'am-nav-mob' + (menuOpen ? ' open' : '')} id="navMob" aria-hidden={!menuOpen}>
        <ul role="list">
          {NAV_LINKS.map(link => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} onClick={() => setMenuOpen(false)}>{link.label}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
