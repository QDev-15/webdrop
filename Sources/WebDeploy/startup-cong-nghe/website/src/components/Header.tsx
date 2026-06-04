import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [mobOpen, setMobOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => { setMobOpen(false); document.body.style.overflow = '' }, [location])

  function toggleMob() {
    const next = !mobOpen
    setMobOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const navLinks = [
    { to: '/',          label: 'Trang chủ' },
    { to: '/san-pham',  label: 'Sản phẩm' },
    { to: '/bang-gia',  label: 'Bảng giá' },
    { to: '/lien-he',   label: 'Liên hệ' },
  ]

  return (
    <>
      <nav id="nav" role="navigation" aria-label="Điều hướng chính">
        <div className="st-nav-inner">
          <Link to="/" className="st-logo">
            <span className="logo-dot" aria-hidden="true"></span>
            {settings.site_name}
          </Link>
          <ul className="st-nav-links">
            {navLinks.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''} end={l.to === '/'}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="st-nav-right">
            <Link to="/lien-he" className="st-nav-login">Đăng nhập</Link>
            <Link to="/bang-gia" className="st-nav-cta">Dùng thử miễn phí</Link>
          </div>
          <button
            className={`st-burger${mobOpen ? ' open' : ''}`}
            id="navBurger"
            aria-label="Mở menu"
            aria-expanded={mobOpen}
            onClick={toggleMob}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className={`st-mob${mobOpen ? ' open' : ''}`} id="navMob" role="dialog" aria-label="Menu di động">
        {navLinks.map(l => (
          <Link key={l.to} to={l.to}>{l.label}</Link>
        ))}
        <Link to="/bang-gia" className="mob-cta">Dùng thử miễn phí</Link>
      </div>
    </>
  )
}
