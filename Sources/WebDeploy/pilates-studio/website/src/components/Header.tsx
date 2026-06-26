import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [elevated, setElevated] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const siteName = settings.site_name || 'Balance'
  const logoText = siteName.split(' ')[0].toUpperCase()

  return (
    <>
      <nav id="nav" className={elevated ? 'elevated' : ''}>
        <div className="wd-container">
          <div className="ps-nav-inner">
            <Link className="ps-logo" to="/">
              {logoText}<span className="ps-logo-dot"></span>
            </Link>

            <div className="ps-nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
              <NavLink to="/dich-vu" className={({ isActive }) => isActive ? 'active' : ''}>Lớp học</NavLink>
              <NavLink to="/dat-lich" className={({ isActive }) => isActive ? 'active' : ''}>Đăng ký</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
            </div>

            <Link to="/dat-lich" className="ps-nav-cta">Đăng ký ngay</Link>

            <button
              className={`ps-hamburger${mobileOpen ? ' open' : ''}`}
              aria-label="Menu"
              onClick={() => setMobileOpen(o => !o)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className={`ps-mob-nav${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={() => setMobileOpen(false)}>Trang chủ</NavLink>
        <NavLink to="/dich-vu" onClick={() => setMobileOpen(false)}>Lớp học</NavLink>
        <NavLink to="/dat-lich" onClick={() => setMobileOpen(false)}>Đăng ký</NavLink>
        <NavLink to="/lien-he" onClick={() => setMobileOpen(false)}>Liên hệ</NavLink>
        <Link to="/dat-lich" className="ps-mob-cta" onClick={() => setMobileOpen(false)}>Đăng ký ngay</Link>
      </div>

      {/* Zalo float */}
      <div className="ps-zalo">
        <div className="ps-zalo-tip">Tư vấn qua Zalo</div>
        <a
          href={settings.social_zalo ? `https://zalo.me/${settings.social_zalo}` : '#'}
          className="ps-zalo-btn"
          aria-label="Chat Zalo"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
        >
          💬
        </a>
      </div>
    </>
  )
}
