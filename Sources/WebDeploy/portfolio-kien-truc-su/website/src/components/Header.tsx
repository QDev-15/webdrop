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
  const [scrolled, setScrolled] = useState(false)

  const logoMain = (settings.site_name || 'Tuấn Đặng Studio').replace(/\s*Studio$/i, '')
  const logoTagline = settings.site_tagline || 'Architecture Studio'

  // Nav luôn trong suốt → solid khi scrollY > 80 (đúng hành vi gốc template, áp dụng mọi trang).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      <nav id="pkt-nav" className={scrolled ? 'scrolled' : ''}>
        <div className="pkt-container pkt-nav-inner">
          <Link to="/" className="pkt-logo">{logoMain}<span>{logoTagline}</span></Link>
          <div className="pkt-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
            ))}
          </div>
          <Link to="/lien-he" className="pkt-nav-cta">Đặt lịch tư vấn</Link>
          <button className={`pkt-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Mở menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div className={`pkt-mobile${mobileOpen ? ' open' : ''}`} id="pktMobile">
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to}>{l.label}</Link>
        ))}
      </div>
    </>
  )
}
