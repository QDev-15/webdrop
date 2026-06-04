import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 20)
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        document.body.style.overflow = ''
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const isActive = (path: string) =>
    location.pathname === path ? 'active' : ''

  const siteName = settings.site_name || 'NOVA.'

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''} aria-label="Navigation chính">
        <div className="wd-container">
          <div className="ag-nav-inner">
            <Link to="/" className="ag-logo">
              {siteName.replace('.', '')}<span>.</span>
            </Link>
            <ul className="ag-nav-links">
              <li><Link to="/" className={isActive('/')}>Trang chủ</Link></li>
              <li><Link to="/du-an" className={isActive('/du-an')}>Dự án</Link></li>
              <li><Link to="/dich-vu" className={isActive('/dich-vu')}>Dịch vụ</Link></li>
              <li><Link to="/ve-chung-toi" className={isActive('/ve-chung-toi')}>Về chúng tôi</Link></li>
              <li><Link to="/lien-he" className={isActive('/lien-he')}>Liên hệ</Link></li>
            </ul>
            <Link to="/lien-he" className="ag-nav-cta">Bắt đầu dự án</Link>
            <button
              className={`ag-burger${menuOpen ? ' open' : ''}`}
              id="navBurger"
              aria-label="Mở menu"
              onClick={toggleMenu}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`ag-nav-mob${menuOpen ? ' open' : ''}`} id="navMob" role="dialog" aria-modal="true">
        <Link to="/">Trang chủ</Link>
        <Link to="/du-an">Dự án</Link>
        <Link to="/dich-vu">Dịch vụ</Link>
        <Link to="/ve-chung-toi">Về chúng tôi</Link>
        <Link to="/lien-he">Liên hệ</Link>
        <Link to="/lien-he" className="mob-cta">Bắt đầu dự án</Link>
      </div>
    </>
  )
}
