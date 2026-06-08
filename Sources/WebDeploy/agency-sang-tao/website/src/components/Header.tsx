import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 20)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); document.body.style.overflow = '' }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const siteName = settings.site_name || 'Agency'
  const sitePhone = settings.site_phone || ''

  const toggleMobile = () => {
    setMobileOpen(o => {
      document.body.style.overflow = o ? '' : 'hidden'
      return !o
    })
  }

  const closeMobile = () => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''} aria-label="Navigation chính">
        <div className="wd-container">
          <div className="ag-nav-inner">
            <Link to="/" className="ag-logo">
              {siteName}<span>.</span>
            </Link>
            <ul className="ag-nav-links">
              <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink></li>
              <li><NavLink to="/du-an" className={({ isActive }) => isActive ? 'active' : ''}>Dự án</NavLink></li>
              <li><NavLink to="/dich-vu" className={({ isActive }) => isActive ? 'active' : ''}>Dịch vụ</NavLink></li>
              <li><NavLink to="/ve-chung-toi" className={({ isActive }) => isActive ? 'active' : ''}>Về chúng tôi</NavLink></li>
              <li><NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink></li>
            </ul>
            {sitePhone && (
              <a href={`tel:${sitePhone.replace(/\s/g, '')}`} className="ag-nav-cta">
                {sitePhone}
              </a>
            )}
            {!sitePhone && (
              <Link to="/lien-he" className="ag-nav-cta">Bắt đầu dự án</Link>
            )}
            <button
              className={`ag-burger ${mobileOpen ? 'open' : ''}`}
              id="navBurger"
              aria-label="Mở menu"
              onClick={toggleMobile}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`ag-nav-mob ${mobileOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <Link to="/" onClick={closeMobile}>Trang chủ</Link>
        <Link to="/du-an" onClick={closeMobile}>Dự án</Link>
        <Link to="/dich-vu" onClick={closeMobile}>Dịch vụ</Link>
        <Link to="/ve-chung-toi" onClick={closeMobile}>Về chúng tôi</Link>
        <Link to="/lien-he" onClick={closeMobile}>Liên hệ</Link>
        <Link to="/lien-he" className="mob-cta" onClick={closeMobile}>Bắt đầu dự án</Link>
      </div>
    </>
  )
}
