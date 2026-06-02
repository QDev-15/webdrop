import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings, navPages } = useSite()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobile]   = useState(false)
  const { pathname }              = useLocation()
  const isHome                    = pathname === '/'

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 60)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  // Đóng mobile menu khi chuyển trang
  useEffect(() => { setMobile(false) }, [pathname])

  const solid = !isHome || scrolled
  const siteName = settings.site_name || 'Website'

  return (
    <>
      <header className={`site-header ${solid ? 'solid' : 'transparent'}`}>
        <div className="site-container">
          <div className="header-inner">
            <Link to="/" className="site-logo">
              {siteName.includes(' ')
                ? <>{siteName.split(' ')[0]}<span> {siteName.split(' ').slice(1).join(' ')}</span></>
                : siteName
              }
            </Link>

            <nav className="header-nav">
              <NavLink to="/" end className="nav-link">Trang chủ</NavLink>
              <NavLink to="/blog" className="nav-link">Tin tức</NavLink>
              {navPages.slice(0, 4).map(p => (
                <NavLink key={p.id} to={`/${p.slug}`} className="nav-link">{p.title}</NavLink>
              ))}
            </nav>

            <Link to="/lien-he" className="header-cta">Liên hệ</Link>

            <button
              className="hamburger"
              aria-label="Menu"
              onClick={() => setMobile(m => !m)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} style={{ position: 'fixed', top: 62, left: 0, right: 0, zIndex: 499 }}>
        <NavLink to="/" end className="nav-link">Trang chủ</NavLink>
        <NavLink to="/blog" className="nav-link">Tin tức</NavLink>
        {navPages.slice(0, 4).map(p => (
          <NavLink key={p.id} to={`/${p.slug}`} className="nav-link">{p.title}</NavLink>
        ))}
        <NavLink to="/lien-he" className="nav-link">Liên hệ</NavLink>
      </div>
    </>
  )
}
