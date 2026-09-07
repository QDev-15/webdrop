import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',            label: 'Trang chủ' },
  { to: '/menu',         label: 'Thực đơn' },
  { to: '/khong-gian',   label: 'Không gian' },
  { to: '/gioi-thieu',   label: 'Giới thiệu' },
  { to: '/lien-he',      label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const siteName = settings.site_name || 'Rosette Bakery & Cafe'
  const [logoMain, ...rest] = siteName.split(' ')
  const logoTagline = rest.join(' ') || 'Bakery & Cafe'

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
      <nav id="cbnNav">
        <div className="cbn-container">
          <div className="cbn-nav-inner">
            <Link className="cbn-logo" to="/">
              <span className="dot">🌸</span>
              <span>{logoMain}<small>{logoTagline}</small></span>
            </Link>
            <div className="cbn-nav-links">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
              ))}
            </div>
            <Link to="/lien-he" className="cbn-nav-cta">Đặt bánh ngay</Link>
            <button className={`cbn-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`cbn-nav-mobile${mobileOpen ? ' open' : ''}`} id="cbnNavMobile">
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="cbn-nm-cta">Đặt bánh ngay</Link>
      </div>
    </>
  )
}
