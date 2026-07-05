import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../App'

const LINKS = [
  { to: '/', label: 'Trang chủ', exact: true },
  { to: '/dich-vu', label: 'Dịch vụ' },
  { to: '/truoc-sau', label: 'Trước & Sau' },
  { to: '/bac-si', label: 'Bác sĩ' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname])

  // Prevent scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav id="nav">
        <div className="wd-container">
          <div className="lx-nav-inner">
            {/* Logo */}
            <NavLink to="/" className="lx-logo" style={{ textDecoration: 'none' }}>
              <div className="lx-logo-mark">L</div>
              <div className="lx-logo-text">
                <span className="lx-logo-name">{settings.site_name}</span>
                <span className="lx-logo-sub">{settings.site_tagline}</span>
              </div>
            </NavLink>

            {/* Desktop links */}
            <div className="lx-nav-links">
              {LINKS.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* CTA */}
            <NavLink to="/dat-lich" className="lx-nav-cta">
              Đặt lịch ngay
            </NavLink>

            {/* Burger */}
            <button
              className={`lx-burger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lx-mobile-menu${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        {LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <NavLink to="/dat-lich" className="lx-btn lx-btn-accent lx-mob-cta" onClick={() => setMenuOpen(false)}>
          Đặt lịch ngay
        </NavLink>
      </div>
    </>
  )
}
