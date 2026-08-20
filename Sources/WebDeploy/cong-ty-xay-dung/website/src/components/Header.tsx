import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 60)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const siteName = settings['site_name'] || 'CÔNG TY XÂY DỰNG'
  const phone = settings['site_phone'] || ''

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="xd-nav-inner">
            <Link to="/" className="xd-logo">
              <div className="xd-logo-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V9l9-6 9 6v12H3zM9 21V12h6v9"/></svg>
              </div>
              {siteName.split(' ').slice(0, -1).join(' ')} <span>{siteName.split(' ').slice(-1)}</span>
            </Link>

            <nav className="xd-nav-links">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Trang chủ</Link>
              <Link to="/dich-vu" className={location.pathname === '/dich-vu' ? 'active' : ''}>Dịch vụ</Link>
              <Link to="/du-an" className={location.pathname === '/du-an' ? 'active' : ''}>Dự án</Link>
              <Link to="/lien-he" className={location.pathname === '/lien-he' ? 'active' : ''}>Liên hệ</Link>
            </nav>

            {phone && (
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="xd-nav-cta">Báo giá miễn phí</a>
            )}

            <button
              className={`xd-burger${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Mở menu"
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`xd-nav-mob${mobileOpen ? ' open' : ''}`}>
        <Link to="/" onClick={() => setMobileOpen(false)}>Trang chủ</Link>
        <Link to="/dich-vu" onClick={() => setMobileOpen(false)}>Dịch vụ</Link>
        <Link to="/du-an" onClick={() => setMobileOpen(false)}>Dự án</Link>
        <Link to="/lien-he" onClick={() => setMobileOpen(false)}>Liên hệ</Link>
        <Link to="/lien-he" className="xd-nav-cta" onClick={() => setMobileOpen(false)}>Báo giá miễn phí</Link>
      </div>
    </>
  )
}
