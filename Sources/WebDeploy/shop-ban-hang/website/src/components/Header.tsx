import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [mobOpen, setMobOpen] = useState(false)
  const siteName = settings['site_name'] || 'Shop Hữu Cơ'

  const toggle = () => setMobOpen(v => !v)
  const close = () => setMobOpen(false)

  return (
    <>
      <nav id="sb-nav">
        <div className="sb-nav-inner">
          <Link to="/" className="sb-logo" onClick={close}>
            {siteName.split(' ').slice(0, -1).join(' ')} <span>{siteName.split(' ')[siteName.split(' ').length - 1]}</span>
          </Link>

          <div className="sb-nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
            <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
          </div>

          <div className="sb-nav-right">
            <Link to="/gio-hang" className="sb-nav-cart" aria-label="Giỏ hàng">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            <Link to="/san-pham" className="sb-nav-cta">Mua ngay</Link>
            <button id="sb-burger" className={mobOpen ? 'open' : ''} onClick={toggle} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div id="sb-nav-mob" className={mobOpen ? 'open' : ''}>
        <Link to="/" onClick={close}>Trang chủ</Link>
        <Link to="/san-pham" onClick={close}>Sản phẩm</Link>
        <Link to="/gio-hang" onClick={close}>Giỏ hàng</Link>
        <Link to="/lien-he" onClick={close}>Liên hệ</Link>
      </div>
    </>
  )
}
