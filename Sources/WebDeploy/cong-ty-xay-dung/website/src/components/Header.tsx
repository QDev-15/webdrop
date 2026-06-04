import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 60)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const siteName = settings.site_name || 'CÔNG TY'
  const isActive = (path: string) => location.pathname === path ? 'active' : ''

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="xd-nav-inner">
            <Link to="/" className="xd-logo">
              <div className="xd-logo-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 21V9l9-6 9 6v12H3zM9 21V12h6v9" />
                </svg>
              </div>
              {siteName} <span>XÂY DỰNG</span>
            </Link>
            <nav className="xd-nav-links" aria-label="Menu chính">
              <Link to="/" className={isActive('/')}>Trang chủ</Link>
              <Link to="/dich-vu" className={isActive('/dich-vu')}>Dịch vụ</Link>
              <Link to="/du-an" className={isActive('/du-an')}>Dự án</Link>
              <Link to="/lien-he" className={isActive('/lien-he')}>Liên hệ</Link>
            </nav>
            <Link to="/lien-he" className="xd-nav-cta">Báo giá miễn phí</Link>
            <button
              className={`xd-burger${menuOpen ? ' open' : ''}`}
              id="navBurger"
              aria-label="Mở menu"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`xd-nav-mob${menuOpen ? ' open' : ''}`} role="dialog" aria-label="Menu di động">
        <Link to="/">Trang chủ</Link>
        <Link to="/dich-vu">Dịch vụ</Link>
        <Link to="/du-an">Dự án</Link>
        <Link to="/lien-he">Liên hệ</Link>
        <Link to="/lien-he" className="xd-nav-cta">Báo giá miễn phí</Link>
      </div>
    </>
  )
}
