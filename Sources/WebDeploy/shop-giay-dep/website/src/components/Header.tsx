import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { settings } = useSite()
  const { count } = useCart()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobNavRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  // `inert` chưa có trong JSX.IntrinsicElements typing của React 18 — set thủ công qua ref.
  useEffect(() => {
    mobNavRef.current?.toggleAttribute('inert', !mobileOpen)
  }, [mobileOpen])

  const siteName = settings.site_name || 'Volt Kicks'
  const [namePart1, ...rest] = siteName.split(' ')
  const namePart2 = rest.join(' ') || 'Kicks'

  return (
    <>
      {/* Nav-3 Dark Floating Pill — nav luôn tối, dạng pill nổi */}
      <nav ref={mobNavRef} id="gd-nav-mob" role="navigation" aria-label="Menu di động" className={mobileOpen ? 'open' : ''}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
        <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
        <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
        <NavLink to="/gio-hang" className={({ isActive }) => isActive ? 'active' : ''}><i className="bi bi-bag me-2" />Giỏ hàng ({count})</NavLink>
      </nav>

      <header id="gd-nav" role="banner">
        <div className="gd-nav-inner">
          <Link to="/" className="gd-logo">{namePart1}<span>.</span>{namePart2}</Link>
          <nav className="gd-nav-links" role="navigation" aria-label="Menu chính">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
            <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
          </nav>
          <div className="gd-nav-right">
            <Link to="/gio-hang" className="gd-nav-cart" aria-label="Giỏ hàng">
              <i className="bi bi-bag" />
              <span className="gd-cart-count">{count}</span>
            </Link>
            <Link to="/san-pham" className="gd-nav-cta">Mua ngay</Link>
            <button
              id="gd-burger"
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
    </>
  )
}
