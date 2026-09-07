import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',            label: 'Trang chủ' },
  { to: '/thuc-don',    label: 'Thực đơn' },
  { to: '/khong-gian',  label: 'Không gian' },
  { to: '/gioi-thieu',  label: 'Giới thiệu' },
  { to: '/lien-he',     label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Port đúng hành vi main.js gốc: toggle .scrolled khi scrollY > 60 (mọi trang, không phân biệt trang chủ/trang con)
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
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && mobileOpen) toggleMobile() }
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

  const brandName = settings.site_name || 'Mộc Rang'

  return (
    <>
      <nav id="crxNav" className={scrolled ? 'scrolled' : ''}>
        <div className="crx-container">
          <div className="crx-nav-inner">
            <Link className="crx-logo" to="/">🔥 <span>{brandName} <span className="crx-logo-mark">Roastery</span></span></Link>
            <div className="crx-nav-links">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
              ))}
            </div>
            <Link to="/lien-he" className="crx-nav-cta">Đặt hạt rang</Link>
            <button className={`crx-burger${mobileOpen ? ' open' : ''}`} onClick={toggleMobile} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`crx-nav-mob${mobileOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="crx-mob-cta">Đặt hạt rang</Link>
      </div>
    </>
  )
}
