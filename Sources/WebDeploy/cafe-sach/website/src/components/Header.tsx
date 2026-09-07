import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../App'

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 80) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  function toggleMobile() {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const siteName = settings['site_name'] || 'Lặng Trang'

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/menu', label: 'Thực đơn' },
    { to: '/khong-gian', label: 'Không gian' },
    { to: '/gioi-thieu', label: 'Giới thiệu' },
    { to: '/lien-he', label: 'Liên hệ' },
  ]

  return (
    <>
      <nav id="csa-nav" className={scrolled ? 'scrolled' : ''}>
        <div className="csa-container csa-nav-inner">
          <NavLink to="/" className="csa-logo">
            {siteName}<span>Cà Phê Sách</span>
          </NavLink>
          <div className="csa-nav-links">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <NavLink to="/lien-he" className="csa-nav-cta">Đặt chỗ đọc</NavLink>
          <button className={`csa-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Mở menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div className={`csa-mobile${mobileOpen ? ' open' : ''}`}>
        {navLinks.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}>{l.label}</NavLink>
        ))}
      </div>
    </>
  )
}
