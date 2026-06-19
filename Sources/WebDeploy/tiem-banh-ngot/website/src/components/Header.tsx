import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../App'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function handleOrder() {
    setMenuOpen(false)
    navigate('/dat-hang')
  }

  const siteName = settings.site_name ?? 'La Douceur'

  return (
    <>
      <nav id="nav" style={scrolled ? { boxShadow: '0 2px 20px rgba(219,39,119,.06)' } : undefined}>
        <div className="wd-container">
          <div className="nav-inner">
            <NavLink to="/" className="logo" onClick={() => setMenuOpen(false)}>
              {settings.site_logo
                ? <img src={settings.site_logo} alt={siteName} style={{ height: 36, width: 'auto' }} />
                : <><span>✦</span> {siteName}</>
              }
            </NavLink>

            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
              <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
              <NavLink to="/dat-hang" className={({ isActive }) => isActive ? 'active' : ''}>Đặt bánh</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
            </div>

            <button className="nav-cta" onClick={handleOrder}>Đặt bánh ngay</button>

            <button
              className={`nav-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Trang chủ</NavLink>
        <NavLink to="/san-pham" onClick={() => setMenuOpen(false)}>Sản phẩm</NavLink>
        <NavLink to="/dat-hang" onClick={() => setMenuOpen(false)}>Đặt bánh</NavLink>
        <NavLink to="/lien-he" onClick={() => setMenuOpen(false)}>Liên hệ</NavLink>
        <button className="nm-cta btn-accent" onClick={handleOrder}>Đặt bánh ngay</button>
      </div>
    </>
  )
}
