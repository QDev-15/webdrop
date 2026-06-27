import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV = [
  { to: '/',         label: 'Trang chủ', exact: true },
  { to: '/dich-vu',  label: 'Dịch vụ' },
  { to: '/dat-lich', label: 'Đặt lịch' },
  { to: '/lien-he',  label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)
  const location = useLocation()
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (prevPath.current !== location.pathname) { setMobOpen(false); prevPath.current = location.pathname }
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const siteName = settings.site_name || 'Bella Spa'
  const zaloNumber = settings.zalo_number || ''

  const nameParts = siteName.split(' ')
  const nameFirst = nameParts.slice(0, -1).join(' ')
  const nameLast = nameParts.slice(-1)[0]

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="sb-nav-inner">
            <Link to="/" className="sb-logo">
              <em>{nameFirst}</em> <span>{nameLast}</span>
            </Link>

            <div className="sb-nav-links">
              {NAV.map(n => (
                <NavLink key={n.to} to={n.to} end={n.exact} className={({ isActive }) => isActive ? 'active' : ''}>
                  {n.label}
                </NavLink>
              ))}
            </div>

            <Link to="/dat-lich" className="sb-nav-cta">Đặt lịch ngay</Link>

            <button
              className={`sb-nav-burger${mobOpen ? ' open' : ''}`}
              onClick={() => setMobOpen(v => !v)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`sb-nav-mob${mobOpen ? ' open' : ''}`}>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.exact} onClick={() => setMobOpen(false)}>{n.label}</NavLink>
        ))}
        <Link to="/dat-lich" className="sb-mob-cta" onClick={() => setMobOpen(false)}>Đặt lịch ngay</Link>
        {zaloNumber && (
          <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#0068FF' }}>
            Zalo: {zaloNumber}
          </a>
        )}
      </div>

      {/* Zalo float */}
      {zaloNumber && (
        <div className="sb-zalo-float">
          <div className="sb-zalo-tip">Đặt lịch qua Zalo</div>
          <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer" className="sb-zalo-btn">💬</a>
        </div>
      )}
    </>
  )
}
