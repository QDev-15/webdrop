import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/dich-vu', label: 'Dịch vụ' },
  { to: '/bac-si', label: 'Bác sĩ' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => { setMobOpen(false) }, [])

  return (
    <>
      <nav className={`at-nav${scrolled ? ' at-nav-scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="wd-container">
          <div className="at-nav-inner">
            {/* Logo */}
            <Link to="/" className="at-logo" aria-label="Trang chủ Nha Khoa An Tâm">
              <span className="at-logo-dot" aria-hidden="true" />
              Nha Khoa <em>An Tâm</em>
            </Link>

            {/* Desktop links */}
            <div className="at-nav-links">
              {NAV_LINKS.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            {/* CTA */}
            <Link to="/dat-lich" className="at-nav-cta">Đặt lịch</Link>

            {/* Burger */}
            <button
              className={`at-burger${mobOpen ? ' open' : ''}`}
              onClick={() => setMobOpen(o => !o)}
              aria-label={mobOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`at-nav-mob${mobOpen ? ' open' : ''}`} aria-hidden={!mobOpen}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} onClick={() => setMobOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link to="/dat-lich" className="at-nm-cta" onClick={() => setMobOpen(false)}>
          Đặt lịch ngay
        </Link>
      </div>
    </>
  )
}
