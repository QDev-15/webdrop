import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/menu', label: 'Thực đơn' },
  { to: '/khong-gian', label: 'Không gian' },
  { to: '/gioi-thieu', label: 'Giới thiệu' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const siteName = settings.site_name || 'MONO Coffee'
  const nameParts = siteName.trim().split(' ')
  const nameLast = nameParts.length > 1 ? nameParts.pop() : ''
  const nameRest = nameParts.join(' ')

  return (
    <>
      <nav id="chd-nav">
        <div className="chd-container chd-nav-inner">
          <Link to="/" className="chd-logo"><span className="chd-logo-dot"></span>{nameRest} {nameLast && <span>{nameLast}</span>}</Link>
          <div className="chd-nav-links">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} className={location.pathname === link.to ? 'chd-active' : ''}>{link.label}</Link>
            ))}
          </div>
          <Link to="/lien-he" className="chd-btn chd-btn-accent chd-nav-cta chd-nav-cta-desktop">Đặt chỗ nhóm</Link>
          <button className={`chd-burger${mobileOpen ? ' chd-open' : ''}`} onClick={() => setMobileOpen(o => !o)} aria-label="Mở menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className={`chd-mob-nav${mobileOpen ? ' chd-open' : ''}`}>
        <ul>
          {NAV_LINKS.map(link => (
            <li key={link.to}><Link to={link.to} className={location.pathname === link.to ? 'chd-active' : ''}>{link.label}</Link></li>
          ))}
        </ul>
        <div className="chd-mob-actions">
          <Link to="/lien-he" className="chd-btn chd-btn-accent chd-btn-full">Đặt chỗ nhóm</Link>
        </div>
      </div>
    </>
  )
}
