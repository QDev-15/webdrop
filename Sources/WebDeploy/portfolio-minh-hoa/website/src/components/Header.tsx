import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',        label: 'Trang chủ' },
  { to: '/du-an',   label: 'Dự án' },
  { to: '/dich-vu', label: 'Dịch vụ' },
  { to: '/ve-toi',  label: 'Về tôi' },
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

  // Logo hiển thị 2 từ đầu của tên website (vd "Lam Trúc Illustration" -> "LAM TRÚC")
  const brandName = (settings.site_name || 'Lam Trúc Illustration').split(' ').slice(0, 2).join(' ').toUpperCase()

  return (
    <>
      <nav id="pmhNav">
        <div className="pmh-nav-inner">
          <Link to="/" className="pmh-logo">
            <span className="dot"></span>{brandName || 'LAM TRÚC'}
            <small>Illustration Studio</small>
          </Link>
          <div className="pmh-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
            ))}
          </div>
          <div className="pmh-nav-cta">
            <Link to="/lien-he" className="pmh-btn pmh-btn-primary pmh-btn-sm">Nhận dự án mới</Link>
          </div>
          <div className={`pmh-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} role="button" aria-label="Mở menu" tabIndex={0}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </nav>
      <div className={`pmh-nav-mobile${mobileOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="pmh-btn pmh-btn-primary">Nhận dự án mới</Link>
      </div>
    </>
  )
}
