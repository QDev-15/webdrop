import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const navLinks = [
  { to: '/', label: 'Trang chủ', exact: true },
  { to: '/dich-vu', label: 'Dịch vụ' },
  { to: '/cong-nghe', label: 'Công nghệ' },
  { to: '/bac-si', label: 'Bác sĩ' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [mobOpen, setMobOpen] = useState(false)

  const siteName = settings.site_name || 'SmileTech'
  const zaloUrl = settings.zalo || settings.zalo_url || 'https://zalo.me/0901234567'

  // Close mobile menu on route change
  useEffect(() => { setMobOpen(false) }, [location.pathname])

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <>
      <nav id="st-nav">
        <div className="st-nav-inner">
          <Link to="/" className="st-logo">
            <span className="st-logo-dot" />
            {siteName}
            <span>&nbsp;·&nbsp;Công nghệ</span>
          </Link>

          <div className="st-nav-links">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={isActive(l.to, l.exact) ? 'active' : ''}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="st-nav-cta">
            <Link to="/dat-lich" className="st-btn st-btn-primary st-btn-nav">
              Đặt lịch ngay
            </Link>
            <button
              className={`st-burger${mobOpen ? ' open' : ''}`}
              onClick={() => setMobOpen(v => !v)}
              aria-label="Mở menu"
              aria-expanded={mobOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div id="st-nav-mob" className={mobOpen ? 'open' : ''}>
        {navLinks.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={isActive(l.to, l.exact) ? 'active' : ''}
          >
            {l.label}
          </Link>
        ))}
        <Link to="/dat-lich" className="st-btn st-btn-primary">Đặt lịch ngay</Link>
      </div>

      {/* Zalo float */}
      <a
        href={zaloUrl}
        className="st-zalo-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Zalo"
      >
        <svg width="28" height="28" viewBox="0 0 48 48" fill="#fff">
          <path d="M24 4C13 4 4 13 4 24c0 4.8 1.7 9.2 4.5 12.7L6 42l5.6-2.4C14.8 41.6 19.3 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-4.2 0-8.1-1.5-11.2-4l-4 1.7 1.8-3.8A15.9 15.9 0 0 1 8 24c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16z"/>
          <path d="M17 21h-2v6h2v-6zm7 0h-2v6h2v-6zm7 0h-2v6h2v-6z"/>
        </svg>
      </a>
    </>
  )
}
