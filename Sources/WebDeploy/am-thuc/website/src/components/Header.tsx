import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location])

  function toggleMobile() {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const navClass = isHome && !scrolled ? 'transparent' : ''

  const links = [
    { to: '/', label: 'Trang chủ' },
    { to: '/thuc-don', label: 'Thực đơn' },
    { to: '/dat-ban', label: 'Đặt bàn' },
    { to: '/lien-he', label: 'Liên hệ' },
  ]

  const siteName = settings.site_name || 'Nhà Hàng Ẩm Thực'
  const nameParts = siteName.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ')
  const lastName = nameParts[nameParts.length - 1]

  return (
    <>
      <nav id="nav" className={navClass}>
        <div className="wd-container">
          <div className="nav-inner">
            <Link className="logo" to="/">
              🍜 {firstName} <span>{lastName}</span>
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
              onClick={toggleMobile}
              aria-label="Menu"
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
