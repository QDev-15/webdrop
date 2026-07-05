import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',                label: 'Trang chủ',       end: true  },
  { to: '/dich-vu',         label: 'Dịch vụ',         end: false },
  { to: '/doi-ngu-bac-si',  label: 'Đội ngũ bác sĩ',  end: false },
  { to: '/cong-nghe',       label: 'Công nghệ',        end: false },
  { to: '/lien-he',         label: 'Liên hệ',          end: false },
]

export default function Header() {
  const { settings } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)

  const siteName = settings.site_name || 'Đông Đô'
  const tagline  = settings.site_tagline || 'Dental Clinic'

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
        <div className="dd-nav-inner">
          <Link to="/" className="dd-logo" onClick={close}>
            <span className="dd-logo-main">{siteName.split(' ')[0]} <em>{siteName.split(' ').slice(1).join(' ') || 'Đô'}</em></span>
            <span className="dd-logo-sub">{tagline}</span>
          </Link>

          <div className="dd-nav-links">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="dd-nav-right">
            <Link to="/dat-lich" className="dd-btn dd-btn-sm dd-btn-fill" onClick={close}>
              Đặt lịch
            </Link>
            <button
              className={`dd-burger${menuOpen ? ' open' : ''}`}
              id="navBurger"
              aria-label="Mở menu"
              aria-expanded={menuOpen}
              onClick={toggle}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`dd-nav-mob${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu di động">
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
        <Link to="/dat-lich" onClick={close}>Đặt lịch</Link>
      </div>
    </>
  )
}
