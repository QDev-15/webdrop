import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
        document.body.style.overflow = ''
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mobileOpen])

  const toggleMobile = () => {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const closeMobile = () => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }

  const siteName = settings.site_name || 'Future Dental'

  return (
    <>
      <nav id="nav">
        <div className="wd-container">
          <div className="ft-nav-inner">
            <Link to="/" className="ft-logo" onClick={closeMobile}>
              <div className="ft-logo-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <path d="M12 3c-2.5 0-4.5 1.6-5.2 3.8C6 8.4 5.5 10 5.5 12c0 3 1 6.5 2.3 8.2.6.8 1.4.8 1.9-.1.4-.7.8-2.3 1-3.6.15-.9.7-1.5 1.3-1.5s1.15.6 1.3 1.5c.2 1.3.6 2.9 1 3.6.5.9 1.3.9 1.9.1C17.5 18.5 18.5 15 18.5 12c0-2-.5-3.6-1.3-5.2C16.5 4.6 14.5 3 12 3z"/>
                </svg>
              </div>
              <div className="ft-logo-text">
                <span className="ft-logo-name">{siteName}</span>
                <span className="ft-logo-sub">Implant 3D Clinic</span>
              </div>
            </Link>

            <nav className="ft-nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
              <NavLink to="/dich-vu-implant" className={({ isActive }) => isActive ? 'active' : ''}>Dịch vụ Implant</NavLink>
              <NavLink to="/cong-nghe-3d" className={({ isActive }) => isActive ? 'active' : ''}>Công nghệ 3D</NavLink>
              <NavLink to="/bac-si" className={({ isActive }) => isActive ? 'active' : ''}>Bác sĩ</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
            </nav>

            <div className="ft-nav-right">
              <Link to="/dat-lich" className="ft-btn ft-btn-neon ft-btn-sm ft-nav-cta">Đặt lịch tư vấn</Link>
              <button
                className={`ft-burger${mobileOpen ? ' open' : ''}`}
                onClick={toggleMobile}
                aria-label="Menu"
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`ft-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={closeMobile}>Trang chủ</NavLink>
        <NavLink to="/dich-vu-implant" onClick={closeMobile}>Dịch vụ Implant</NavLink>
        <NavLink to="/cong-nghe-3d" onClick={closeMobile}>Công nghệ 3D</NavLink>
        <NavLink to="/bac-si" onClick={closeMobile}>Bác sĩ</NavLink>
        <NavLink to="/lien-he" onClick={closeMobile}>Liên hệ</NavLink>
        <NavLink to="/dat-lich" className="ft-mob-cta" onClick={closeMobile}>Đặt lịch tư vấn</NavLink>
      </div>
    </>
  )
}
