import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/ve-chu-dau-tu', label: 'Tổng quan dự án' },
  { to: '/bang-gia', label: 'Bảng giá & Mặt bằng' },
  { to: '/tien-ich', label: 'Tiện ích' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const hotline = settings.site_phone || '1900 6868'
  const hotlineHref = 'tel:' + hotline.replace(/\s/g, '')
  const siteName = settings.site_name || 'Green Valley Residence'
  const tagline = settings.site_tagline || 'Dự án căn hộ ven sông'

  function isActive(to: string) {
    return to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  }

  function handleNavClick() {
    setOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <nav id="nav">
        <div className="nav-inner wd-container">
          <Link to="/" className="logo">
            <span className="mark">GV</span>
            <span>{siteName}<span className="logo-sub">{tagline}</span></span>
          </Link>
          <div className="nav-links">
            {NAV_ITEMS.map(item => (
              <Link key={item.to} to={item.to} className={isActive(item.to) ? 'active' : ''}>{item.label}</Link>
            ))}
          </div>
          <a href={hotlineHref} className="nav-cta">Hotline {hotline}</a>
          <button
            className={'nav-hamburger' + (open ? ' open' : '')}
            id="navBurger"
            aria-label="Menu"
            onClick={() => {
              const next = !open
              setOpen(next)
              document.body.style.overflow = next ? 'hidden' : ''
            }}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className={'nav-mobile' + (open ? ' open' : '')} id="navMob">
        {NAV_ITEMS.map(item => (
          <Link key={item.to} to={item.to} className={isActive(item.to) ? 'active' : ''} onClick={handleNavClick}>{item.label}</Link>
        ))}
        <a href={hotlineHref} className="nm-phone">☎ {hotline}</a>
        <Link to="/lien-he" className="nm-cta" onClick={handleNavClick}>Đăng ký nhận bảng giá</Link>
      </div>
    </>
  )
}
