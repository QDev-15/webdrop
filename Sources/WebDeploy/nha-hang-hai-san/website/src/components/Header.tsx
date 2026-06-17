import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'

interface Props {
  settings: Record<string, string>
}

export default function Header({ settings }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 80)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const siteName = settings.site_name || 'Vị Biển Hải Sản'

  return (
    <>
      <nav id="nav" className={scrolled ? '' : 'transparent'}>
        <div className="wd-container">
          <div className="nav-inner">
            <Link to="/" className="logo">🦞 {siteName} <span>Hải Sản</span></Link>
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
              <NavLink to="/thuc-don" className={({ isActive }) => isActive ? 'active' : ''}>Thực đơn</NavLink>
              <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''}>Gallery</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
            </div>
            <Link to="/dat-ban" className="nav-cta">Đặt bàn ngay</Link>
            <button className={`nav-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
        <Link to="/thuc-don" onClick={() => setMenuOpen(false)}>Thực đơn</Link>
        <Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
        <Link to="/lien-he" onClick={() => setMenuOpen(false)}>Liên hệ</Link>
        <Link to="/dat-ban" className="nm-cta" onClick={() => setMenuOpen(false)}>Đặt bàn ngay</Link>
      </div>
    </>
  )
}
