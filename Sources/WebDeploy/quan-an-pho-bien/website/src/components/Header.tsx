import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../App'

export default function Header() {
  const { settings } = useSite()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const navClass = isHome && !scrolled ? 'transparent' : ''

  return (
    <nav id="nav" className={navClass}>
      <div className="wd-container">
        <div className="nav-inner">
          <Link to="/" className="logo">
            {settings.site_logo ? (
              <img src={settings.site_logo} alt={settings.site_name || 'Logo'} style={{ height: 34, width: 'auto', objectFit: 'contain', borderRadius: 6 }} />
            ) : (
              <>🍜 <span>{settings.site_name || 'Phở Bình Dân'}</span></>
            )}
          </Link>

          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
            <NavLink to="/thuc-don" className={({ isActive }) => isActive ? 'active' : ''}>Thực đơn</NavLink>
            <NavLink to="/cua-hang" className={({ isActive }) => isActive ? 'active' : ''}>Cửa hàng</NavLink>
            <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
          </div>

          <a href={`tel:${(settings.site_phone || '0901234567').replace(/\s/g, '')}`} className="nav-cta">
            📞 {settings.site_phone || '0901 234 567'}
          </a>

          <button
            className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        <Link to="/">Trang chủ</Link>
        <Link to="/thuc-don">Thực đơn</Link>
        <Link to="/cua-hang">Cửa hàng</Link>
        <Link to="/lien-he">Liên hệ</Link>
        <a href={`tel:${(settings.site_phone || '0901234567').replace(/\s/g, '')}`} className="nm-cta">
          📞 Gọi ngay
        </a>
      </div>
    </nav>
  )
}
