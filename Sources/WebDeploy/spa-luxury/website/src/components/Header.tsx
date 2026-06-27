import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { api } from '../api/client'

interface Settings {
  site_name?: string
  [key: string]: string | undefined
}

const NAV_LINKS = [
  { to: '/',         label: 'Trang chủ' },
  { to: '/dich-vu',  label: 'Trải nghiệm' },
  { to: '/dat-lich', label: 'Đặt gói' },
  { to: '/lien-he',  label: 'Liên hệ' },
]

export default function Header() {
  const [settings, setSettings] = useState<Settings>({})
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Fetch settings for site name
  useEffect(() => {
    api.get<Settings>('/public/settings')
      .then(setSettings)
      .catch(() => {})
  }, [])

  // Scroll handler
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const siteName = settings.site_name || 'Luxury Spa'

  return (
    <>
      <nav className={`sl-nav${scrolled ? ' sl-nav-scrolled' : ''}`}>
        <div className="sl-container">
          <div className="sl-nav-inner">
            {/* Logo */}
            <Link to="/" className="sl-nav-logo" onClick={() => setMenuOpen(false)}>
              <span className="sl-nav-logo-dot" />
              {siteName}
            </Link>

            {/* Desktop nav pill */}
            <div className="sl-nav-pill">
              <ul className="sl-nav-links">
                {NAV_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) => isActive ? 'active' : ''}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="sl-nav-actions">
                <Link to="/dat-lich" className="sl-btn sl-btn-gold sl-btn-sm">
                  Đặt lịch ngay
                </Link>
              </div>
            </div>

            {/* Hamburger */}
            <button
              className={`sl-hamburger${menuOpen ? ' open' : ''}`}
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
      <div className={`sl-mobile-menu${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        <button
          className="sl-mobile-menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Đóng menu"
        >
          ✕
        </button>
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <Link
          to="/dat-lich"
          className="sl-btn sl-btn-gold"
          style={{ marginTop: 12 }}
          onClick={() => setMenuOpen(false)}
        >
          Đặt lịch ngay
        </Link>
      </div>
    </>
  )
}
