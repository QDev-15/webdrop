import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const mobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 20)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const siteName = (settings.site_name || 'VietFinance').split(' ')[0]

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/dich-vu', label: 'Dịch vụ' },
    { to: '/doi-ngu', label: 'Đội ngũ' },
    { to: '/lien-he', label: 'Liên hệ' },
  ]

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="tc-nav-inner">
            <Link to="/" className="tc-logo">
              <div className="tc-logo-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
                </svg>
              </div>
              <span>{siteName} <span className="tc-logo-blue">Finance</span></span>
            </Link>

            <ul className="tc-nav-links">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className={location.pathname === link.to ? 'active' : ''}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link to="/lien-he" className="tc-nav-cta">Tư vấn miễn phí</Link>

            <button
              className={`tc-nav-burger${mobileOpen ? ' open' : ''}`}
              aria-label="Mở menu"
              onClick={() => setMobileOpen(o => !o)}
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      <div ref={mobRef} className={`tc-nav-mob${mobileOpen ? ' open' : ''}`}>
        {navLinks.map(link => (
          <Link key={link.to} to={link.to}>{link.label}</Link>
        ))}
        <Link to="/lien-he" className="tc-nav-cta">Tư vấn miễn phí</Link>
      </div>
    </>
  )
}
