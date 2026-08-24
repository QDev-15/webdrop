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
  const isHome = location.pathname === '/'
  const logoText = (settings.site_name || 'Đăng Photography').split(' ')[0].toUpperCase()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Nav trang chủ: transparent → solid khi scroll > 80 (giống template gốc).
  // Nav trang con: luôn solid (.nav-solid) vì page-hero nền sáng.
  useEffect(() => {
    if (!isHome) { setScrolled(false); return }
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

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

  return (
    <>
      <nav id="nav" className={!isHome ? 'scrolled nav-solid' : (scrolled ? 'scrolled' : '')} aria-label="Navigation chính">
        <div className="wd-container">
          <div className="pna-nav-inner">
            <Link to="/" className="pna-logo">{logoText}<span>.</span><span className="pna-logo-sub">Wedding Photography</span></Link>
            <ul className="pna-nav-links">
              {NAV_LINKS.map(l => (
                <li key={l.to}><Link to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link></li>
              ))}
            </ul>
            <Link to="/lien-he" className="pna-nav-cta">Đặt lịch tư vấn</Link>
            <button className={`pna-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Mở menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`pna-nav-mob${mobileOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="pna-mob-cta">Đặt lịch tư vấn</Link>
      </div>
    </>
  )
}
