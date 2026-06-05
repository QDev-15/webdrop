import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); document.body.style.overflow = '' }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const toggle = () => {
    const next = !open
    setOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const close = () => { setOpen(false); document.body.style.overflow = '' }

  const siteName = settings.site_name || 'Cà Phê Thời Gian'

  return (
    <>
      <nav id="nav">
        <div className="wd-container">
          <div className="nav-inner">
            <Link className="logo" to="/">
              ☕ {siteName} <span>Cafe</span>
            </Link>
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
              <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Thực đơn</NavLink>
              <NavLink to="/khong-gian" className={({ isActive }) => isActive ? 'active' : ''}>Không gian</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
            </div>
            <Link to="/lien-he" className="nav-cta">Đặt chỗ trước</Link>
            <button
              className={`nav-hamburger${open ? ' open' : ''}`}
              id="navHamburger"
              aria-label="Menu"
              onClick={toggle}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-mobile${open ? ' open' : ''}`} id="navMobile">
        <NavLink to="/" end onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
        <NavLink to="/menu" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>Thực đơn</NavLink>
        <NavLink to="/khong-gian" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>Không gian</NavLink>
        <NavLink to="/lien-he" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
        <Link to="/lien-he" className="nm-cta" onClick={close}>Đặt chỗ trước</Link>
      </div>
    </>
  )
}
