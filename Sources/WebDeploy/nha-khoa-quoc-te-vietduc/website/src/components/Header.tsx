import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',                label: 'Trang chủ',       end: true  },
  { to: '/dich-vu',         label: 'Dịch vụ',         end: false },
  { to: '/co-so-vat-chat',  label: 'Cơ sở vật chất', end: false },
  { to: '/bac-si',          label: 'Bác sĩ',          end: false },
  { to: '/lien-he',         label: 'Liên hệ',         end: false },
]

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const siteName = settings.site_name || 'Viet Duc'
  const phone    = settings.site_phone || '1900 1234'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
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
        <div className="wd-container">
          <div className="vd-nav-inner">
            {/* Logo */}
            <Link to="/" className="vd-logo" onClick={close}>
              <div className="vd-logo-mark">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </div>
              <div className="vd-logo-text">
                <span className="vd-logo-name">{siteName}</span>
                <span className="vd-logo-sub">Nha Khoa Quốc Tế</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <ul className="vd-nav-links">
              {NAV_LINKS.map(l => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end} className={({ isActive }) => isActive ? 'active' : ''}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right: phone + CTA */}
            <div className="vd-nav-right">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="vd-nav-phone">
                <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                {phone}
              </a>
              <Link to="/dat-lich" className="vd-nav-cta" onClick={close}>
                Đặt Lịch Khám
              </Link>
            </div>

            {/* Burger */}
            <button
              className={`vd-burger${menuOpen ? ' open' : ''}`}
              onClick={toggle}
              aria-label="Mở menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`vd-mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={close}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/dat-lich" className="vd-nav-cta" onClick={close}>Đặt Lịch Khám</Link>
      </div>
    </>
  )
}
