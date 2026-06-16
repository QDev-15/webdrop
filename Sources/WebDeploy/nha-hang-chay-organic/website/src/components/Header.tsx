import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [mobileOpen, setMobileOpen] = useState(false)

  function toggleMobile() {
    setMobileOpen(o => {
      document.body.style.overflow = !o ? 'hidden' : ''
      return !o
    })
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        document.body.style.overflow = ''
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const siteName = (settings.site_name) || 'Lá Xanh Chay'

  return (
    <>
      <nav id="nav">
        <div className="wd-container">
          <div className="nav-inner">
            <Link to="/" className="logo">
              <span className="logo-dot" />
              🌿 {siteName.replace(' Chay', '')} <span>Chay</span>
            </Link>
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
              <NavLink to="/thuc-don" className={({ isActive }) => isActive ? 'active' : ''}>Thực đơn</NavLink>
              <NavLink to="/ve-chung-toi" className={({ isActive }) => isActive ? 'active' : ''}>Về chúng tôi</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
            </div>
            <Link to="/lien-he" className="nav-cta">Đặt bàn</Link>
            <button
              className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
              id="navHamburger"
              aria-label="Mở menu"
              onClick={toggleMobile}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`} id="navMobile">
        <Link to="/" onClick={toggleMobile}>Trang chủ</Link>
        <Link to="/thuc-don" onClick={toggleMobile}>Thực đơn</Link>
        <Link to="/ve-chung-toi" onClick={toggleMobile}>Về chúng tôi</Link>
        <Link to="/lien-he" onClick={toggleMobile}>Liên hệ</Link>
        <Link to="/lien-he" className="nm-cta" onClick={toggleMobile}>Đặt bàn</Link>
      </div>
    </>
  )
}
