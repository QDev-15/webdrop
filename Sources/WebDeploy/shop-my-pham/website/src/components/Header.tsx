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
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const topbarItems = [settings.topbar_text_1, settings.topbar_text_2, settings.topbar_text_3].filter(Boolean)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        <div className="mp-topbar" role="banner">
          <div className="mp-topbar-inner">
            {topbarItems.map((t, i) => (
              <Fragment key={i}>
                <span>{t}</span>
                {i < topbarItems.length - 1 && <span className="mp-topbar-dot" aria-hidden="true">·</span>}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      <nav id="mp-nav" className={scrolled ? 'mp-scrolled' : ''} role="navigation" aria-label="Navigation chính">
        <div className="wd-container">
          <div className="mp-nav-inner">
            <NavLink to="/" className="mp-logo" aria-label="LUMIÈRE Beauty — Trang chủ" onClick={() => setMenuOpen(false)}>
              <em>L</em>UMIÈRE
            </NavLink>
            <ul className="mp-nav-links" role="menubar">
              {NAV_LINKS.map(link => (
                <li key={link.to} role="none">
                  <NavLink to={link.to} end={link.end} role="menuitem" className={({ isActive }) => isActive ? 'active' : ''}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mp-nav-actions">
              <button className="mp-nav-search-btn" aria-label="Mở tìm kiếm" aria-expanded={searchOpen} onClick={() => setSearchOpen(o => !o)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              </button>
              <NavLink to="/gio-hang" className="mp-nav-cart-btn" aria-label="Giỏ hàng">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                <span className={'mp-cart-count' + (count > 0 ? ' has-items' : '')} aria-live="polite">{count}</span>
              </NavLink>
              <button
                className={'mp-hamburger' + (menuOpen ? ' open' : '')}
                aria-label="Mở menu"
                aria-expanded={menuOpen}
                aria-controls="mpMobMenu"
                onClick={() => setMenuOpen(o => !o)}
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>

        <div className={'mp-search-panel' + (searchOpen ? ' open' : '')} role="search">
          <div className="wd-container">
            <form className="mp-search-form" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                placeholder="Tìm sản phẩm mỹ phẩm..."
                autoComplete="off"
                aria-label="Từ khóa tìm kiếm"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <button type="submit" aria-label="Tìm kiếm">Tìm</button>
            </form>
          </div>
        </div>

        <div className={'mp-mob-menu' + (menuOpen ? ' open' : '')} id="mpMobMenu" role="dialog" aria-label="Menu điều hướng" aria-modal="true">
          <ul>
            {NAV_LINKS.map(link => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}
