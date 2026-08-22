import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',         label: 'Trang chủ' },
  { to: '/du-an',    label: 'Dự án' },
  { to: '/dich-vu',  label: 'Dịch vụ' },
  { to: '/ve-toi',   label: 'Về tôi' },
  { to: '/lien-he',  label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const logoName = settings.nav_logo_name || 'KHOA'

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
    <nav id="nav">
      <div className="ptk-container ptk-nav-inner">
        <Link to="/" className="ptk-logo">{logoName}<span>.</span></Link>
        <div className="ptk-nav-links">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
          ))}
        </div>
        <Link to="/lien-he" className="ptk-nav-cta">Nhận báo giá</Link>
        <button className={`ptk-nav-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Mở menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div className={`ptk-nav-mobile${mobileOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="nm-cta">Nhận báo giá</Link>
      </div>
    </nav>
  )
}
