import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',                  label: 'Trang chủ' },
  { to: '/chuyen-muc',        label: 'Chuyên mục' },
  { to: '/cam-nang-du-lich',  label: 'Cẩm nang du lịch' },
  { to: '/ve-toi',            label: 'Về tôi' },
  { to: '/lien-he',           label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  function toggleMobile() {
    setMobileOpen(o => {
      const next = !o
      document.body.style.overflow = next ? 'hidden' : ''
      return next
    })
  }

  const siteName = settings.site_name || 'Xê Dịch'
  const brandShort = siteName.split(' ')[0] || 'Xê Dịch'

  return (
    <>
      <nav id="bdlNav" className={scrolled ? 'scrolled' : ''}>
        <div className="bdl-container bdl-nav-inner">
          <Link to="/" className="bdl-logo">
            <span className="bdl-logo-mark">✈</span>
            <span>{brandShort}<span className="bdl-logo-sub">Travel Journal</span></span>
          </Link>
          <div className="bdl-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
            ))}
          </div>
          <div className="bdl-nav-right">
            <Link to="/lien-he" className="bdl-nav-cta">Hợp tác cùng tôi</Link>
            <button className={`bdl-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Mở menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`bdl-nav-mob${mobileOpen ? ' open' : ''}`} id="bdlNavMob">
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="bdl-mob-cta">Hợp tác cùng tôi</Link>
      </div>
    </>
  )
}
