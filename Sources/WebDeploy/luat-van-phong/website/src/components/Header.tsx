import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const navLinks = [
  { to: '/',        label: 'Trang Chủ' },
  { to: '/dich-vu', label: 'Lĩnh Vực' },
  { to: '/luat-su', label: 'Luật Sư' },
  { to: '/du-an',   label: 'Vụ Việc' },
  { to: '/lien-he', label: 'Liên Hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)

  const siteName = settings.site_name || 'Văn Phòng Luật Sư'
  const zalo     = settings.social_zalo || '#'

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <nav id="nav">
        <div className="wd-container">
          <div className="lv-nav-inner">
            <Link to="/" className="lv-logo">
              {siteName} <em>&amp; Đồng Nghiệp</em>
            </Link>
            <ul className="lv-nav-links">
              {navLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className={isActive(l.to) ? 'active' : ''}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/lien-he" className="lv-nav-cta">Tư Vấn Miễn Phí</Link>
            <button
              ref={burgerRef}
              className={`lv-burger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Mở menu"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`lv-mob-nav${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        {navLinks.map(l => (
          <Link key={l.to} to={l.to} className={isActive(l.to) ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
        <Link to="/lien-he" className="lv-mob-cta">Tư Vấn Miễn Phí</Link>
      </div>
    </>
  )
}
