import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { settings } = useSite()
  const { count } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const mobNavRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [pathname])

  // `inert` chưa có trong JSX.IntrinsicElements typing của React 18 — set thủ công qua ref.
  useEffect(() => {
    mobNavRef.current?.toggleAttribute('inert', !mobileOpen)
  }, [mobileOpen])

  const siteName = settings.site_name || 'Lys Chic'
  const [namePart1, ...rest] = siteName.split(' ')
  const namePart2 = rest.join(' ') || 'Chic'

  return (
    <>
      {/* Nav-2 Always Solid Light — không transparent→scrolled, luôn nền trắng */}
      <nav ref={mobNavRef} id="qa-nav-mob" role="navigation" aria-label="Menu di động" className={mobileOpen ? 'open' : ''}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
        <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
        <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
        <NavLink to="/gio-hang" className={({ isActive }) => isActive ? 'active' : ''}><i className="bi bi-bag me-2" />Giỏ hàng ({count})</NavLink>
      </nav>

      <header id="qa-nav" role="banner">
        <div className="qa-container qa-nav-inner">
          <Link to="/" className="qa-logo">{namePart1}<span>.</span>{namePart2}</Link>
          <nav className="qa-nav-links" role="navigation" aria-label="Menu chính">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
            <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
          </nav>
          <div className="qa-nav-right">
            <button
              type="button"
              className="qa-nav-search-btn"
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(v => !v)}
            >
              <i className="bi bi-search" />
            </button>
            <Link to="/gio-hang" className="qa-nav-cart" aria-label="Giỏ hàng">
              <i className="bi bi-bag" />
              {count > 0 && <span className="qa-cart-count">{count}</span>}
            </Link>
            <Link to="/san-pham" className="qa-nav-cta">Mua ngay</Link>
            <button
              id="qa-burger"
              className={mobileOpen ? 'open' : ''}
              aria-label="Mở menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="qa-search-panel">
          <div className="qa-container">
            <form
              className="qa-search-panel-form"
              onSubmit={e => {
                e.preventDefault()
                const q = searchValue.trim()
                setSearchOpen(false)
                navigate(q ? `/san-pham?q=${encodeURIComponent(q)}` : '/san-pham')
              }}
            >
              <i className="bi bi-search" aria-hidden="true" />
              <input
                type="search"
                className="qa-search-panel-input"
                placeholder="Tìm sản phẩm..."
                aria-label="Tìm kiếm sản phẩm"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                autoFocus
              />
              <button type="submit" className="qa-search-panel-submit" aria-label="Tìm">Tìm</button>
              <button type="button" className="qa-search-panel-close" aria-label="Đóng" onClick={() => setSearchOpen(false)}>&times;</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
