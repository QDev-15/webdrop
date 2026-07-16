import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

// Nav-8 Underline-Active only — 1 hàng: logo | links | cart icon + CTA + burger
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

  useEffect(() => {
    mobNavRef.current?.toggleAttribute('inert', !mobileOpen)
  }, [mobileOpen])

  const siteName = settings.site_name || 'Tươi Mỗi Ngày'

  return (
    <>
      <nav ref={mobNavRef} id="tp-nav-mob" className={`tp-mob-nav${mobileOpen ? ' open' : ''}`} role="navigation" aria-label="Menu di động">
        <ul>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'tp-active' : ''}><i className="bi bi-house" /> Trang chủ</NavLink></li>
          <li><NavLink to="/san-pham" className={({ isActive }) => isActive ? 'tp-active' : ''}><i className="bi bi-basket2" /> Sản phẩm</NavLink></li>
          <li><NavLink to="/lien-he" className={({ isActive }) => isActive ? 'tp-active' : ''}><i className="bi bi-envelope" /> Liên hệ</NavLink></li>
          <li><NavLink to="/gio-hang" className={({ isActive }) => isActive ? 'tp-active' : ''}><i className="bi bi-bag" /> Giỏ hàng</NavLink></li>
        </ul>
        <div className="tp-mob-actions">
          <Link to="/san-pham" className="tp-btn tp-btn-primary">Mua ngay</Link>
        </div>
      </nav>

      <header id="tp-nav" className="tp-nav" role="banner">
        <div className="tp-container tp-nav-inner">
          <Link to="/" className="tp-logo"><span className="tp-logo-dot" />{siteName}</Link>
          <nav className="tp-nav-links" role="navigation" aria-label="Menu chính">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'tp-active' : ''}>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'tp-active' : ''}>Sản phẩm</NavLink>
            <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'tp-active' : ''}>Liên hệ</NavLink>
          </nav>
          <div className="tp-nav-actions">
            <Link to="/gio-hang" className="tp-nav-icon" aria-label="Giỏ hàng">
              <i className="bi bi-bag" />
              {count > 0 && <span className="tp-cart-badge">{count}</span>}
            </Link>
            <Link to="/san-pham" className="tp-btn tp-btn-primary tp-btn-sm">Mua ngay</Link>
            <button
              id="tp-burger"
              className={`tp-burger${mobileOpen ? ' open' : ''}`}
              aria-label="Mở menu"
              aria-expanded={mobileOpen}
              aria-controls="tp-nav-mob"
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
