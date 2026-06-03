import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
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
  }, [location.pathname])

  const transparent = isHome && !scrolled

  const toggleMobile = () => {
    const open = !mobileOpen
    setMobileOpen(open)
    document.body.style.overflow = open ? 'hidden' : ''
  }

  const siteName = settings.site_name || 'Agency'
  const nameParts = siteName.split(' ')
  const firstName = nameParts[0]
  const restName  = nameParts.slice(1).join(' ') || 'WEB'

  const navLinks = [
    { to: '/',             label: 'Trang chủ' },
    { to: '/dich-vu',      label: 'Dịch vụ' },
    { to: '/du-an',        label: 'Dự án' },
    { to: '/ve-chung-toi', label: 'Về chúng tôi' },
  ]

  return (
    <>
      <nav id="nav" ref={navRef} className={transparent ? 'transparent' : ''}>
        <div className="wd-container">
          <div className="nav-inner">
            <Link className="logo" to="/">{firstName}<span>{restName}</span></Link>
            <div className="nav-links">
              {navLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={location.pathname === l.to ? 'active' : ''}
                >{l.label}</Link>
              ))}
            </div>
            <Link to="/lien-he" className="nav-cta">Liên hệ ngay</Link>
            <button
              className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
              onClick={toggleMobile}
              aria-label="Mở menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        {navLinks.map(l => (
          <Link key={l.to} to={l.to}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="nm-cta">Liên hệ ngay</Link>
      </div>
    </>
  )
}
