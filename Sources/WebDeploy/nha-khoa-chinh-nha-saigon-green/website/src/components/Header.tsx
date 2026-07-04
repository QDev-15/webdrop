import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',                label: 'Trang chủ',     end: true  },
  { to: '/dich-vu',         label: 'Dịch vụ',       end: false },
  { to: '/quy-trinh-nieng', label: 'Quy trình niềng', end: false },
  { to: '/bac-si',          label: 'Bác sĩ',        end: false },
  { to: '/lien-he',         label: 'Liên hệ',       end: false },
]

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  const siteName = settings.site_name    || 'Chỉnh Nha Sài Gòn'
  const tagline  = settings.site_tagline || 'Orthodontic Center'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav id="nav" className={scrolled ? 'nav-elevated' : ''}>
        <div className="wd-container cn-nav-inner">
          <Link to="/" className="cn-logo" onClick={close}>
            <div className="cn-logo-mark" aria-hidden="true" />
            <div className="cn-logo-text">
              <span>{siteName}</span>
              <span>{tagline}</span>
            </div>
          </Link>

          <nav className="cn-nav-links">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={close}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="cn-nav-cta">
            <Link to="/dat-lich" className="cn-nav-btn cn-btn-primary" onClick={close}>
              Đặt lịch tư vấn
            </Link>
          </div>

          <button
            className={`cn-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`cn-mobile-menu${menuOpen ? ' open' : ''}`}>
        <button
          onClick={close}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--text-2)' }}
        >✕</button>
        {NAV_LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={close}
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/dat-lich" className="cn-mob-cta" onClick={close}>
          Đặt lịch tư vấn
        </Link>
      </div>
    </>
  )
}
