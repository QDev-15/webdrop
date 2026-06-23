import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [transparent, setTransparent] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) { setTransparent(false); return }
    const onScroll = () => setTransparent(window.scrollY < 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const navClass = isHome && transparent ? 'transparent' : ''

  const links = [
    { to: '/', label: 'Trang chủ' },
    { to: '/thuc-don', label: 'Thực đơn' },
    { to: '/khong-gian', label: 'Không gian' },
    { to: '/dat-ban', label: 'Đặt bàn' },
    { to: '/lien-he', label: 'Liên hệ' },
  ]

  const siteName = settings.site_name || 'BBQ Lửa Hồng'

  return (
    <>
      <nav id="nav" className={navClass}>
        <div className="wd-container">
          <div className="nav-inner">
            <Link className="logo" to="/">
              🔥 {siteName.replace(' BBQ', '')} <span>BBQ</span>
            </Link>
            <div className="nav-links">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={location.pathname === l.to ? 'active' : ''}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <Link to="/dat-ban" className="nav-cta">Đặt bàn ngay</Link>
            <button
              className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
              aria-label="Mở menu"
              onClick={() => setMobileOpen(o => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        {links.map(l => (
          <Link key={l.to} to={l.to}>{l.label}</Link>
        ))}
        <Link to="/dat-ban" className="nm-cta">Đặt bàn ngay</Link>
      </div>
    </>
  )
}
