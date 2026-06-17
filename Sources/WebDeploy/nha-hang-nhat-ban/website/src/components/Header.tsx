import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../App'

export default function Header() {
  const { settings } = useSite()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const siteName = settings.site_name || 'Nhà Hàng Nhật Bản'
  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/thuc-don', label: 'Thực đơn' },
    { href: '/sushi-bar', label: 'Sushi Bar' },
    { href: '/dat-ban', label: 'Đặt bàn' },
    { href: '/lien-he', label: 'Liên hệ' },
  ]

  const toggleMobile = () => {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  return (
    <>
      <nav id="nav">
        <div className="wd-container">
          <div className="nav-inner">
            <Link className="logo" to="/">
              鮨 {siteName} <span className="logo-jp">日本料理</span>
            </Link>
            <div className="nav-links">
              {navLinks.map(l => (
                <Link key={l.href} to={l.href} className={location.pathname === l.href ? 'active' : ''}>
                  {l.label}
                </Link>
              ))}
            </div>
            <Link to="/dat-ban" className="nav-cta">Đặt bàn</Link>
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
        {navLinks.map(l => (
          <Link key={l.href} to={l.href}>{l.label}</Link>
        ))}
        <Link to="/dat-ban" className="nm-cta">Đặt bàn ngay</Link>
      </div>

      {/* Zalo float */}
      <div className="zf">
        <div className="zf-tip">Liên hệ Zalo</div>
        <a
          href={`https://zalo.me/${settings.social_zalo || '0'}`}
          className="zf-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
        >
          💬
        </a>
      </div>
    </>
  )
}
