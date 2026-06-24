import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [navigate])

  const siteName = settings.site_name || 'Tam Thu Massage'

  return (
    <>
      <nav id="mrt-nav" className={scrolled ? 'elevated' : ''}>
        <div className="wd-container">
          <div className="mrt-nav-inner">
            <Link to="/" className="mrt-logo">
              <div className="mrt-logo-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3c-1 3-4 5-4 9a4 4 0 008 0c0-4-3-6-4-9z" />
                  <path d="M8 17s0 3 4 3 4-3 4-3" />
                </svg>
              </div>
              <div>
                <span className="mrt-logo-text">{siteName}</span>
                <span className="mrt-logo-sub">Massage &amp; Tri Lieu</span>
              </div>
            </Link>

            <div className="mrt-nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
              <NavLink to="/dich-vu" className={({ isActive }) => isActive ? 'active' : ''}>Dịch vụ &amp; Giá</NavLink>
              <NavLink to="/dat-lich" className={({ isActive }) => isActive ? 'active' : ''}>Đặt lịch</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
            </div>

            <Link to="/dat-lich" className="mrt-nav-cta">Đặt lịch ngay</Link>

            <button
              className={`mrt-burger${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Mở menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mrt-mobile-nav${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)}>
        <Link to="/" onClick={() => setMobileOpen(false)}>Trang chủ</Link>
        <Link to="/dich-vu" onClick={() => setMobileOpen(false)}>Dịch vụ &amp; Giá</Link>
        <Link to="/dat-lich" onClick={() => setMobileOpen(false)}>Đặt lịch</Link>
        <Link to="/lien-he" onClick={() => setMobileOpen(false)}>Liên hệ</Link>
        <Link to="/dat-lich" className="mob-cta" onClick={() => setMobileOpen(false)}>Đặt lịch ngay</Link>
      </div>
    </>
  )
}
