import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',         label: 'Trang chủ',   end: true  },
  { to: '/dich-vu',  label: 'Dịch vụ',     end: false },
  { to: '/bac-si',   label: 'Bác sĩ',      end: false },
  { to: '/dat-lich', label: 'Đặt lịch',    end: false },
  { to: '/lien-he',  label: 'Liên hệ',     end: false },
]

export default function Header() {
  const { settings } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const siteName = settings.site_name    || 'Sunrise Nha Khoa'
  const tagline  = settings.site_tagline || 'Gia Đình — Family Dental'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => { setMenuOpen(false); document.body.style.overflow = '' }
  const toggle = () => {
    setMenuOpen(o => {
      document.body.style.overflow = !o ? 'hidden' : ''
      return !o
    })
  }

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container sr-nav-inner">
          <Link to="/" className="sr-logo" onClick={close}>
            <span className="sr-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.8">
                <circle cx="10" cy="10" r="4.5" />
                <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.5 4.5l1.8 1.8M13.7 13.7l1.8 1.8M4.5 15.5l1.8-1.8M13.7 6.3l1.8-1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="sr-logo-text">
              <span className="sr-logo-name">{siteName}</span>
              <span className="sr-logo-sub">{tagline}</span>
            </span>
          </Link>

          <ul className="sr-nav-links">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={({ isActive }) => isActive ? 'active' : ''}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link to="/dat-lich" className="sr-nav-cta" onClick={close}>
            Đặt lịch khám
          </Link>

          <button className={`sr-burger${menuOpen ? ' open' : ''}`} onClick={toggle} aria-label="Mở menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`sr-mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={close}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/dat-lich" className="sr-btn sr-btn-primary sr-mob-cta" onClick={close}>
          Đặt lịch khám
        </Link>
      </div>
    </>
  )
}
