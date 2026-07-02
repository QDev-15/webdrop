import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobOpen ? 'hidden' : ''
  }, [mobOpen])

  const siteName = settings.site_name || 'Tiệm Tóc Barber'

  const links = [
    { to: '/', label: 'Trang chủ' },
    { to: '/dich-vu', label: 'Dịch vụ' },
    { to: '/dat-lich', label: 'Đặt lịch' },
    { to: '/lien-he', label: 'Liên hệ' },
  ]

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="tb-nav-inner">
            <Link className="tb-logo" to="/">
              <span className="tb-logo-mark">B</span>
              {siteName}
            </Link>
            <ul className="tb-nav-links">
              {links.map(l => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link to="/dat-lich" className="tb-nav-cta">Đặt lịch ngay</Link>
            <button className={`tb-hamburger${mobOpen ? ' open' : ''}`} aria-label="Menu" onClick={() => setMobOpen(o => !o)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`tb-nav-mob${mobOpen ? ' open' : ''}`}>
        {links.map(l => (
          <Link key={l.to} to={l.to} onClick={() => setMobOpen(false)}>{l.label}</Link>
        ))}
        <Link to="/dat-lich" className="tb-mob-cta" onClick={() => setMobOpen(false)}>Đặt lịch ngay</Link>
      </div>
    </>
  )
}
