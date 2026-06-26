import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV = [
  { to: '/',         label: 'Trang chủ',         exact: true },
  { to: '/dich-vu',  label: 'Dịch vụ & Bảng giá' },
  { to: '/dat-lich', label: 'Đặt lịch' },
  { to: '/lien-he',  label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const [elevated, setElevated] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)
  const location = useLocation()
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (prevPath.current !== location.pathname) { setMobOpen(false); prevPath.current = location.pathname }
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const siteName = settings.site_name || 'Nail Salon'
  const zaloNumber = settings.zalo_number || ''

  return (
    <>
      <nav id="nav" className={elevated ? 'elevated' : ''}>
        <div className="wd-container">
          <div className="ns-nav-inner">
            <Link to="/" className="ns-logo">
              {siteName.split(' ').slice(0, -1).join(' ')} <strong>{siteName.split(' ').slice(-1)[0]}</strong>
              <span className="ns-logo-dot" />
            </Link>

            <div className="ns-nav-links">
              {NAV.map(n => (
                <NavLink key={n.to} to={n.to} end={n.exact} className={({ isActive }) => isActive ? 'active' : ''}>
                  {n.label}
                </NavLink>
              ))}
            </div>

            <Link to="/dat-lich" className="ns-nav-cta">Đặt lịch ngay</Link>

            <button className={`ns-nav-burger${mobOpen ? ' open' : ''}`} onClick={() => setMobOpen(v => !v)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`ns-nav-mob${mobOpen ? ' open' : ''}`}>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.exact} onClick={() => setMobOpen(false)}>{n.label}</NavLink>
        ))}
        <Link to="/dat-lich" className="ns-mob-cta" onClick={() => setMobOpen(false)}>Đặt lịch ngay</Link>
        {zaloNumber && (
          <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#0068FF' }}>
            Zalo: {zaloNumber}
          </a>
        )}
      </div>
    </>
  )
}
