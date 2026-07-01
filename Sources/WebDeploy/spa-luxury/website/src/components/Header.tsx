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

  useEffect(() => {
    api.get<Settings>('/public/settings')
      .then(setSettings)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const siteName = settings.site_name || 'Luxury Spa'

  return (
    <>
      <nav className={`sl-nav${scrolled ? ' sl-nav-scrolled' : ''}`}>
        <div className="sl-nav-inner">
          {/* Logo */}
          <Link to="/" className="sl-logo" onClick={() => setMenuOpen(false)}>
            <span className="sl-logo-mark">✦</span>
            <span>{siteName}</span>
          </Link>

          {/* Desktop nav links */}
          <div className="sl-nav-links">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <Link to="/dat-lich" className="sl-nav-cta">
            Đặt gói ngay
          </Link>

          {/* Hamburger */}
          <button
            className={`sl-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            <span />
            <span />
            <span />
          </button>
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
          className="sl-nav-cta"
          style={{ marginTop: 16 }}
          onClick={() => setMenuOpen(false)}
        >
          Đặt gói ngay
        </Link>
      </div>
    </>
  )
}
