import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',            label: 'Trang chủ' },
  { to: '/thuc-don',    label: 'Thực đơn' },
  { to: '/khong-gian',  label: 'Không gian' },
  { to: '/gioi-thieu',  label: 'Giới thiệu' },
  { to: '/lien-he',     label: 'Liên hệ' },
]

export default function Header() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="cdm-container">
          <div className="nav-inner">
            <Link className="logo" to="/"><span className="logo-dot"></span>NOX <span>COFFEE</span></Link>
            <div className="nav-links">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
              ))}
            </div>
            <Link to="/lien-he" className="nav-cta">Đặt bàn đêm</Link>
            <button className={`nav-hamburger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Mở menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="nm-cta">Đặt bàn đêm</Link>
      </div>
    </>
  )
}
