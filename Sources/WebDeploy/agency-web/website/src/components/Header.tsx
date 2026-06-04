import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 80)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const toggleMobile = () => {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const navClass = isHome && !scrolled ? 'transparent' : ''

  const siteName = settings.site_name || 'Agency Web'
  const nameParts = siteName.split(' ')
  const first = nameParts.slice(0, -1).join(' ') || siteName
  const last  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

  return (
    <>
      <nav id="nav" ref={navRef} className={navClass}>
        <div className="wd-container">
          <div className="nav-inner">
            <Link className="logo" to="/">
              {first}{last && <span>{last}</span>}
            </Link>
            <div className="nav-links">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Trang chủ</Link>
              <Link to="/dich-vu" className={location.pathname === '/dich-vu' ? 'active' : ''}>Dịch vụ</Link>
              <Link to="/du-an" className={location.pathname === '/du-an' ? 'active' : ''}>Dự án</Link>
              <Link to="/ve-chung-toi" className={location.pathname === '/ve-chung-toi' ? 'active' : ''}>Về chúng tôi</Link>
            </div>
            <Link to="/lien-he" className="nav-cta">Liên hệ ngay</Link>
            <button
              className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
              onClick={toggleMobile}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        <Link to="/">Trang chủ</Link>
        <Link to="/dich-vu">Dịch vụ</Link>
        <Link to="/du-an">Dự án</Link>
        <Link to="/ve-chung-toi">Về chúng tôi</Link>
        <Link to="/lien-he" className="nm-cta">Liên hệ ngay</Link>
      </div>
    </>
  )
}
