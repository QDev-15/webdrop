import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/dich-vu', label: 'Dịch vụ', end: false },
  { to: '/cam-nang-cha-me', label: 'Cẩm nang cha mẹ', end: false },
  { to: '/bac-si', label: 'Đội ngũ bác sĩ', end: false },
  { to: '/lien-he', label: 'Liên hệ', end: false },
]

export default function Header() {
  const [mobOpen, setMobOpen] = useState(false)
  const { pathname } = useLocation()

  // Close mobile nav on route change
  useEffect(() => { setMobOpen(false) }, [pathname])

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobOpen])

  return (
    <>
      <nav className="ks-nav" role="navigation" aria-label="Main navigation">
        <div className="ks-nav-inner">
          {/* Logo — centered above links */}
          <Link to="/" className="ks-logo" aria-label="Trang chủ KidSmile">
            <span className="ks-logo-mark" aria-hidden="true">🦷</span>
            <span>Kid<em>Smile</em></span>
          </Link>

          {/* Burger (mobile only) */}
          <button
            className={`ks-burger${mobOpen ? ' open' : ''}`}
            onClick={() => setMobOpen(o => !o)}
            aria-label={mobOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobOpen}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Desktop nav row */}
          <div className="ks-nav-row">
            <div className="ks-nav-row-inner">
              <div className="ks-nav-links">
                {NAV_LINKS.map(l => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
              <Link to="/dat-lich" className="ks-btn ks-btn-primary ks-nav-cta">
                Đặt lịch khám
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`ks-nav-mob${mobOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di động"
        aria-hidden={!mobOpen}
      >
        <button
          className="ks-nm-close"
          onClick={() => setMobOpen(false)}
          aria-label="Đóng menu"
        >
          ✕
        </button>
        {NAV_LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setMobOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/dat-lich" className="ks-btn ks-btn-primary" onClick={() => setMobOpen(false)}>
          Đặt lịch khám
        </Link>
      </div>
    </>
  )
}
