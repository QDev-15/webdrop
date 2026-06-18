import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  function toggleMobile() {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const links = [
    { to: '/', label: 'Trang chủ', exact: true },
    { to: '/thuc-don', label: 'Thực đơn' },
    { to: '/dat-ban', label: 'Đặt bàn' },
    { to: '/lien-he', label: 'Liên hệ' },
  ]

  const transparent = isHome && !scrolled
  const siteName = settings.site_name || 'Nhà Hàng'

  return (
    <>
      <nav id="nav" ref={navRef} className={transparent ? 'transparent' : ''}>
        <div className="wd-container">
          <div className="nav-inner">
            <Link className="logo" to="/">
              🍲 {siteName.split(' ')[0]} <span>{siteName.split(' ').slice(1).join(' ') || 'Ẩm Thực'}</span>
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
              aria-label="Mở menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        {links.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/dat-ban" className="nm-cta">Đặt bàn ngay</Link>
      </div>

      {settings.social_zalo && (
        <div className="zf">
          <div className="zf-tip">Đặt bàn qua Zalo</div>
          <a href={settings.social_zalo} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
        </div>
      )}
    </>
  )
}
