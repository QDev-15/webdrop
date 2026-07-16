import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

// Nav-5 Centered Logo + Links Below (3-row signage): strip thông báo → hàng logo căn giữa → hàng link + cart
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

  const siteName = settings.site_name || 'Vườn Xanh'
  const [namePart1, ...rest] = siteName.split(' ')
  const namePart2 = rest.join(' ') || 'Xanh'
  const announcement = settings.announcement_text || '🌿 Giao rau trong ngày nội thành · Freeship đơn hàng lớn'

  return (
    <>
      {/* Mobile nav */}
      <nav ref={mobNavRef} id="rx-nav-mob" role="navigation" aria-label="Menu di động" className={mobileOpen ? 'open' : ''}>
        <Link to="/" className="rx-logo">{namePart1} <span>{namePart2}</span></Link>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
        <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
        <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
        <NavLink to="/gio-hang" className="rx-btn rx-btn-primary">
          <i className="bi bi-basket2" /> Giỏ hàng ({count})
        </NavLink>
      </nav>

      <header id="rx-nav" role="banner">
        <div className="rx-nav-strip">
          <div className="rx-container">
            <span>{announcement}</span>
          </div>
        </div>
        <div className="rx-nav-body">
          <div className="rx-container">
            <div className="rx-nav-logo-row">
              <Link to="/" className="rx-logo">{namePart1} <span>{namePart2}</span></Link>
              <span className="rx-logo-tag">{settings.site_slogan || 'Nông sản sạch mỗi ngày'}</span>
            </div>
            <div className="rx-nav-links-row">
              <div className="rx-nav-left">
                <button
                  id="rx-burger"
                  className={mobileOpen ? 'open' : ''}
                  aria-label="Mở menu"
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen(o => !o)}
                >
                  <span /><span /><span />
                </button>
              </div>
              <nav className="rx-nav-links" role="navigation" aria-label="Menu chính">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
                <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
                <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
              </nav>
              <div className="rx-nav-right">
                <Link to="/gio-hang" className="rx-nav-cart" aria-label="Giỏ hàng">
                  <i className="bi bi-basket2" />
                  <span className="rx-cart-count">{count}</span>
                </Link>
                <Link to="/san-pham" className="rx-nav-cta">Đặt rau ngay</Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
