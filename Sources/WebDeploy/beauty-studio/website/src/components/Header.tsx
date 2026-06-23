import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled]   = useState(false)
  const [mobOpen, setMobOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobOpen])

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="bst-nav-inner">
            <Link to="/" className="bst-logo" onClick={() => setMobOpen(false)}>
              <span className="bst-logo-dot" />
              {settings.site_name || 'Beauty Studio'}
              <span>&nbsp;Studio</span>
            </Link>

            <ul className="bst-nav-links">
              <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink></li>
              <li><NavLink to="/dich-vu" className={({ isActive }) => isActive ? 'active' : ''}>Dịch vụ &amp; Giá</NavLink></li>
              <li><NavLink to="/dat-lich" className={({ isActive }) => isActive ? 'active' : ''}>Đặt lịch</NavLink></li>
              <li><NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink></li>
            </ul>

            <Link to="/dat-lich" className="bst-nav-cta">✨ Đặt lịch ngay</Link>

            <button
              className={`bst-hamburger${mobOpen ? ' open' : ''}`}
              onClick={() => setMobOpen(p => !p)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`bst-nav-mob${mobOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={() => setMobOpen(false)}>Trang chủ</NavLink>
        <NavLink to="/dich-vu" onClick={() => setMobOpen(false)}>Dịch vụ &amp; Giá</NavLink>
        <NavLink to="/dat-lich" onClick={() => setMobOpen(false)}>Đặt lịch</NavLink>
        <NavLink to="/lien-he" onClick={() => setMobOpen(false)}>Liên hệ</NavLink>
        <Link to="/dat-lich" className="mob-cta" onClick={() => setMobOpen(false)}>✨ Đặt lịch ngay</Link>
      </div>

      {/* Zalo float */}
      {settings.zalo && (
        <a href={`https://zalo.me/${settings.zalo}`} target="_blank" rel="noopener" className="bst-zalo-float" aria-label="Zalo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4C12.95 4 4 12.95 4 24C4 28.56 5.48 32.78 8 36.16L5 43L12.22 40.08C15.44 42.02 19.1 43.1 23.04 43.1C34.09 43.1 43 34.14 43 23.09C43 12.04 34.05 4 24 4Z" fill="white"/>
            <path d="M16 19H26L16 28H26" stroke="#0068FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 19V28" stroke="#0068FF" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M34 19V23.5C34 26 32.5 28 30 28" stroke="#0068FF" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </a>
      )}
    </>
  )
}
