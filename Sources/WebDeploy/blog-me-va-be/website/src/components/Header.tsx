import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',           label: 'Trang chủ' },
  { to: '/chuyen-muc',  label: 'Chuyên mục' },
  { to: '/cam-nang',    label: 'Cẩm nang' },
  { to: '/ve-toi',      label: 'Về tôi' },
  { to: '/lien-he',     label: 'Liên hệ' },
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

  const siteName = settings.site_name || 'Cỏ Non Blog'
  const brandFirstWord = siteName.split(' ')[0] || 'Cỏ Non'

  return (
    <>
      <nav id="bmbNav">
        <div className="bmb-container">
          <div className="bmb-nav-inner">
            <Link className="bmb-logo" to="/"><span className="leaf">🌱</span>{brandFirstWord}<em>.blog</em></Link>
            <div className="bmb-nav-links">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
              ))}
            </div>
            <Link to="/#newsletter" className="bmb-nav-cta">Nhận bản tin 💌</Link>
            <button className={`bmb-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`bmb-nav-mobile${mobileOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/#newsletter" className="bmb-nm-cta">Nhận bản tin 💌</Link>
      </div>
    </>
  )
}
