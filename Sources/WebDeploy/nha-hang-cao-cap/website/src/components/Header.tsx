import { useState, useEffect } from 'react'
import { useSite } from '../App'

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#trang-chu', label: 'Trang chủ' },
    { href: '#thuc-don', label: 'Thực đơn' },
    { href: '#su-kien', label: 'Sự kiện' },
    { href: '#dat-ban', label: 'Đặt bàn' },
    { href: '#lien-he', label: 'Liên hệ' },
  ]

  const siteName = settings.site_name || 'La Maison'

  return (
    <>
      <nav id="nav" className={scrolled ? '' : 'transparent'}>
        <div className="wd-container">
          <div className="nav-inner">
            <a href="#trang-chu" className="logo">
              {siteName} <span>Fine Dining</span>
            </a>
            <div className="nav-links">
              {navLinks.map(link => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </div>
            <a href="#dat-ban" className="nav-cta">Đặt bàn</a>
            <button
              className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a href="#dat-ban" className="nm-cta" onClick={() => setMobileOpen(false)}>
          Đặt bàn ngay
        </a>
      </div>
    </>
  )
}
