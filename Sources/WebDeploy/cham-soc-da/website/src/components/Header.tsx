import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav id="nav" className={scrolled ? 'elevated' : ''}>
        <div className="wd-container">
          <div className="csd-nav-inner">
            <Link to="/" className="csd-logo">
              <div className="csd-logo-mark">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.134 2 5 5.134 5 9c0 2.32 1.06 4.384 2.72 5.76C9.1 15.84 10.5 18.2 10.5 21h3c0-2.8 1.4-5.16 2.78-6.24C17.94 13.384 19 11.32 19 9c0-3.866-3.134-7-7-7z"/></svg>
              </div>
              <span className="csd-logo-name">Derma<span>Care</span></span>
            </Link>

            <div className="csd-nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Trang chủ</NavLink>
              <NavLink to="/dich-vu" className={({ isActive }) => isActive ? 'active' : undefined}>Dịch vụ</NavLink>
              <NavLink to="/dat-lich" className={({ isActive }) => isActive ? 'active' : undefined}>Đặt lịch</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : undefined}>Liên hệ</NavLink>
            </div>

            <Link to="/dat-lich" className="csd-nav-cta">Đặt lịch ngay</Link>

            <button
              className={`csd-burger${mobOpen ? ' open' : ''}`}
              onClick={() => setMobOpen(v => !v)}
              aria-label="Mở menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`csd-mob-menu${mobOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={() => setMobOpen(false)}>Trang chủ</NavLink>
        <NavLink to="/dich-vu" onClick={() => setMobOpen(false)}>Dịch vụ</NavLink>
        <NavLink to="/dat-lich" onClick={() => setMobOpen(false)}>Đặt lịch</NavLink>
        <NavLink to="/lien-he" onClick={() => setMobOpen(false)}>Liên hệ</NavLink>
        <Link to="/dat-lich" className="csd-mob-cta" onClick={() => setMobOpen(false)}>Đặt lịch ngay →</Link>
      </div>
    </>
  )
}
