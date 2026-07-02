import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',        label: 'Trang chủ', end: true  },
  { to: '/dich-vu', label: 'Dịch vụ',  end: false },
  { to: '/bac-si',  label: 'Bác sĩ',   end: false },
  { to: '/tu-van',  label: 'Tư vấn',   end: false },
  { to: '/lien-he', label: 'Liên hệ',  end: false },
]

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const siteName = settings.site_name    || 'Thẩm Mỹ Viện'
  const tagline  = settings.site_tagline || 'Medical Aesthetics'

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
        <div className="wd-container">
          <div className="tmv-nav-inner">
            <Link to="/" className="tmv-logo" onClick={close}>
              <div className="tmv-logo-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--accent)' }}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8M12 8v8" strokeLinecap="round" />
                </svg>
              </div>
              <div className="tmv-logo-text">
                <span className="tmv-logo-name">{siteName}</span>
                <span className="tmv-logo-sub">{tagline}</span>
              </div>
            </Link>

            <nav className="tmv-nav-links">
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

            <Link to="/tu-van" className="tmv-nav-cta" onClick={close}>
              Đặt lịch tư vấn
            </Link>

            <button
              className={`tmv-burger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`tmv-mobile-menu${menuOpen ? ' open' : ''}`}>
        <button
          onClick={close}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--text-2)' }}
        >✕</button>
        {NAV_LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
            {l.label}
          </NavLink>
        ))}
        <Link to="/tu-van" className="tmv-mob-cta" onClick={close}>
          Đặt lịch tư vấn
        </Link>
      </div>
    </>
  )
}
