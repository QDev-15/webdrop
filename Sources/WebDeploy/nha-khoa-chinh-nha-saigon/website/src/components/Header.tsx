import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',                  label: 'Trang chủ',     end: true  },
  { to: '/dich-vu',           label: 'Dịch vụ',       end: false },
  { to: '/quy-trinh-nieng',   label: 'Quy trình niềng',end: false },
  { to: '/bac-si',            label: 'Bác sĩ',        end: false },
  { to: '/lien-he',           label: 'Liên hệ',       end: false },
]

export default function Header() {
  const { settings } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)

  const siteName = settings.site_name    || 'Chỉnh Nha Sài Gòn'
  const tagline  = settings.site_tagline || 'Orthodontic Center'
  const phone    = settings.site_phone   || '028 3822 XXXX'

  const close = () => { setMenuOpen(false); document.body.style.overflow = '' }
  const toggle = () => {
    setMenuOpen(o => {
      document.body.style.overflow = !o ? 'hidden' : ''
      return !o
    })
  }

  return (
    <>
      <nav id="nav">
        <div className="wd-container cn-nav-inner">
          <Link to="/" className="cn-logo" onClick={close}>
            <span className="cn-logo-mark" aria-hidden="true" />
            <span className="cn-logo-text">
              {siteName}
              <span>{tagline}</span>
            </span>
          </Link>

          <ul className="cn-nav-links">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="cn-nav-cta">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="cn-nav-phone">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {phone}
            </a>
            <Link to="/dat-lich" className="cn-btn cn-btn-primary cn-btn-sm" onClick={close}>
              Đặt lịch tư vấn
            </Link>
          </div>

          <button
            className={`cn-burger${menuOpen ? ' open' : ''}`}
            onClick={toggle}
            aria-label="Mở menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`cn-mob${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
            {l.label}
          </NavLink>
        ))}
        <Link to="/dat-lich" className="cn-btn cn-btn-primary cn-mob-cta" onClick={close}>
          Đặt lịch tư vấn
        </Link>
      </div>
    </>
  )
}
