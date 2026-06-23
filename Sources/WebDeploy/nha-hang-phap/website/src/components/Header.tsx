import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../App'

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [transparent, setTransparent] = useState(location.pathname === '/')
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) { setTransparent(false); return }
    setTransparent(window.scrollY < 80)
    function onScroll() { setTransparent(window.scrollY < 80) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  function toggleMobile() {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const siteName = settings['site_name'] || 'Le Bistro'

  return (
    <>
      <nav id="nav" className={isHome && transparent ? 'transparent' : ''}>
        <div className="wd-container">
          <div className="nav-inner">
            <NavLink className="logo" to="/">
              {siteName} <span>Bistro</span>
            </NavLink>
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Accueil</NavLink>
              <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Notre Carte</NavLink>
              <NavLink to="/reservation" className={({ isActive }) => isActive ? 'active' : ''}>Réservation</NavLink>
              <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
            </div>
            <NavLink to="/reservation" className="nav-cta">Réserver</NavLink>
            <button
              className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
              onClick={toggleMobile}
              aria-label="Mở menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" end>Trang chủ</NavLink>
        <NavLink to="/menu">Notre Carte</NavLink>
        <NavLink to="/reservation">Réservation</NavLink>
        <NavLink to="/lien-he">Contact</NavLink>
        <NavLink to="/reservation" className="nm-cta">Réserver</NavLink>
      </div>
    </>
  )
}
