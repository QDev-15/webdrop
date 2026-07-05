import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',           label: 'Trang chủ',  end: true  },
  { to: '/dich-vu',    label: 'Dịch vụ',    end: false },
  { to: '/cau-chuyen', label: 'Câu chuyện', end: false },
  { to: '/bac-si',     label: 'Bác sĩ',     end: false },
  { to: '/dat-lich',   label: 'Đặt lịch',   end: false },
  { to: '/lien-he',    label: 'Liên hệ',    end: false },
]

export default function Header() {
  const { settings } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)

  const siteName = settings.site_name || 'Nụ Cười Xưa'

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
        <div className="wd-container">
          <div className="nc-nav-top">
            <button
              className={`nc-hamburger${menuOpen ? ' open' : ''}`}
              onClick={toggle}
              aria-label="Mở menu"
            >
              <span /><span /><span />
            </button>

            <Link to="/" className="nc-logo" onClick={close}>
              {siteName}
            </Link>

            <Link to="/dat-lich" className="nc-nav-cta" onClick={close}>
              Đặt lịch khám
            </Link>
          </div>

          <ul className="nc-nav-links">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={({ isActive }) => isActive ? 'active' : ''}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className={`nc-nav-mob${menuOpen ? ' open' : ''}`}>
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
        <Link to="/dat-lich" className="nc-btn nc-mob-cta" onClick={close}>
          Đặt lịch khám
        </Link>
      </div>
    </>
  )
}
