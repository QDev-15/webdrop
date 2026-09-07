import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/chuyen-muc', label: 'Chuyên mục' },
  { to: '/danh-gia-san-pham', label: 'Đánh giá sản phẩm' },
  { to: '/ve-toi', label: 'Về tôi' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) closeMobile()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen])

  function toggleMobile() {
    setMobileOpen(o => {
      const next = !o
      document.body.style.overflow = next ? 'hidden' : ''
      return next
    })
  }

  function closeMobile() {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }

  const brandName = settings.site_name || 'PIXEL.'

  return (
    <>
      <nav id="bcn-nav">
        <div className="bcn-container bcn-nav-inner">
          <Link to="/" className="bcn-logo">
            <span className="bcn-logo-mark"></span>
            {brandName.replace(/\.$/, '')}<span>.</span>
          </Link>
          <div className="bcn-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'bcn-active' : ''}>{l.label}</Link>
            ))}
          </div>
          <div className="bcn-nav-cta bcn-nav-cta-desktop">
            <Link to="/#bcn-newsletter" className="bcn-btn bcn-btn-accent bcn-btn-sm">Đăng ký nhận tin</Link>
          </div>
          <button className={`bcn-burger${mobileOpen ? ' bcn-open' : ''}`} onClick={toggleMobile} aria-label="Mở menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div className={`bcn-mob-overlay${mobileOpen ? ' bcn-open' : ''}`} onClick={closeMobile}></div>
      <div className={`bcn-mob-nav${mobileOpen ? ' bcn-open' : ''}`}>
        <ul>
          {NAV_LINKS.map(l => (
            <li key={l.to}><Link to={l.to} className={location.pathname === l.to ? 'bcn-active' : ''}>{l.label}</Link></li>
          ))}
        </ul>
        <div className="bcn-mob-actions">
          <Link to="/#bcn-newsletter" className="bcn-btn bcn-btn-accent bcn-btn-full">Đăng ký nhận tin</Link>
        </div>
      </div>
    </>
  )
}
