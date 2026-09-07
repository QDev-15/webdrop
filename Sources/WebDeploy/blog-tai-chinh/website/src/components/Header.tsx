import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',                   label: 'Trang chủ' },
  { to: '/chuyen-muc',         label: 'Chuyên mục' },
  { to: '/cong-cu-tinh-toan',  label: 'Công cụ tính toán' },
  { to: '/ve-toi',             label: 'Về tôi' },
  { to: '/lien-he',            label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const prefix = settings.nav_logo_prefix || 'La Bàn'
  const accent = settings.nav_logo_accent || 'Tài Chính'

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileOpen) toggleMobile()
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

  return (
    <>
      <nav id="nav">
        <div className="wd-container btc-nav-inner">
          <Link to="/" className="btc-logo">
            <span className="btc-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/></svg>
            </span>
            {prefix} <span>{accent}</span>
          </Link>
          <div className="btc-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
            ))}
          </div>
          <div className="btc-nav-cta">
            <button className="btc-nav-search-btn" aria-label="Tìm kiếm bài viết">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <Link to="/lien-he" className="btc-btn btc-btn-primary btc-btn-sm">Nhận bản tin</Link>
            <button className={`btc-nav-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Mở menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`btc-nav-mob${mobileOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="btc-btn btc-btn-primary btc-btn-block">Nhận bản tin miễn phí</Link>
      </div>
    </>
  )
}
