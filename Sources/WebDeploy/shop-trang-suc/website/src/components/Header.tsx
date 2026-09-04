import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/san-pham', label: 'Sản phẩm' },
  { to: '/bo-suu-tap', label: 'Bộ sưu tập' },
  { to: '/ve-chung-toi', label: 'Giới thiệu' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { count } = useCart()
  const { settings } = useSite()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    navigate('/san-pham' + (q ? `?q=${encodeURIComponent(q)}` : ''))
    setSearchOpen(false)
  }

  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))

  return (
    <>
      <nav id="tr-nav" className={scrolled ? 'scrolled' : ''} aria-label="Menu chính">
        <div className="tr-container">
          <div className="tr-nav-inner">
            <Link to="/" className="tr-logo" aria-label="VIOLETTE - Trang chủ">
              <span className="tr-logo-mark">V</span>
              <span className="tr-logo-text">VIOLETTE</span>
            </Link>
            <ul className="tr-nav-links">
              {NAV_LINKS.map(l => (
                <li key={l.to}><Link to={l.to} className={isActive(l.to) ? 'active' : undefined}>{l.label}</Link></li>
              ))}
            </ul>
            <div className="tr-nav-actions">
              <button className="tr-nav-icon-btn" aria-label="Tìm kiếm" aria-expanded={searchOpen} aria-controls="tr-search-panel" onClick={() => setSearchOpen(o => !o)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
              <Link to="/gio-hang" className="tr-nav-icon-btn" aria-label="Giỏ hàng">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                <span className="tr-cart-count" aria-live="polite">{count}</span>
              </Link>
              <button id="navBurger" className={'tr-nav-icon-btn d-lg-none' + (mobileOpen ? ' open' : '')} aria-label="Mở menu" aria-expanded={mobileOpen} aria-controls="navMob" onClick={() => setMobileOpen(o => !o)}>
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
          <div className={'tr-search-panel' + (searchOpen ? ' open' : '')} id="tr-search-panel">
            <form className="tr-search-form" onSubmit={submitSearch}>
              <input ref={searchInputRef} type="search" placeholder="Tìm nhẫn, dây chuyền, bông tai..." aria-label="Từ khóa tìm kiếm" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
              <button type="submit" aria-label="Tìm kiếm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className={'tr-mob-nav' + (mobileOpen ? ' open' : '')} id="navMob" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
        <button className="tr-mob-close" aria-label="Đóng menu" onClick={() => setMobileOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <ul className="tr-mob-links">
          {NAV_LINKS.map(l => (
            <li key={l.to}><Link to={l.to} className={isActive(l.to) ? 'active' : undefined} onClick={() => setMobileOpen(false)}>{l.label}</Link></li>
          ))}
        </ul>
        <div className="tr-mob-actions">
          <Link to="/gio-hang" onClick={() => setMobileOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>
            Giỏ hàng của tôi
          </Link>
          {settings.site_phone && (
            <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" /></svg>
              {settings.site_phone}
            </a>
          )}
        </div>
      </div>
    </>
  )
}
