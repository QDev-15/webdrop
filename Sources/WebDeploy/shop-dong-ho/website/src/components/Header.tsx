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

  const zaloNumber = settings.zalo_number || ''

  return (
    <>
      <nav id="dh-nav" className={scrolled ? 'scrolled' : ''} aria-label="Menu chính">
        <div className="dh-nav-inner">
          <Link to="/" className="dh-logo" aria-label="MERIDIAN — Trang chủ"><span className="dh-logo-mark">M</span>MERIDIAN</Link>
          <ul className="dh-nav-links d-none d-lg-flex">
            {NAV_LINKS.map(l => {
              // "Sản phẩm" vẫn active ở trang chi tiết sản phẩm (/san-pham/:slug) — khớp
              // chi-tiet-san-pham.html gốc (class="active" luôn gắn sẵn ở mục Sản phẩm).
              const isActive = l.to === '/'
                ? location.pathname === '/'
                : location.pathname === l.to || location.pathname.startsWith(l.to + '/')
              return <li key={l.to}><Link to={l.to} className={isActive ? 'active' : undefined}>{l.label}</Link></li>
            })}
          </ul>
          <div className="dh-nav-actions">
            <button className="dh-nav-icon-btn" aria-label="Tìm kiếm" aria-expanded={searchOpen} aria-controls="dhSearchPanel" onClick={() => setSearchOpen(o => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </button>
            <Link to="/gio-hang" className="dh-nav-icon-btn" aria-label="Giỏ hàng">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              <span className="dh-cart-count">{count}</span>
            </Link>
            <Link to="/san-pham" className="dh-nav-cta d-none d-md-inline-flex">Khám phá ngay</Link>
            <button id="dh-burger" className={'d-lg-none' + (mobileOpen ? ' open' : '')} aria-label="Mở menu" aria-expanded={mobileOpen} aria-controls="dh-nav-mob" onClick={() => setMobileOpen(true)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        <div className={'dh-search-panel' + (searchOpen ? ' open' : '')} id="dhSearchPanel">
          <form onSubmit={submitSearch}>
            <input ref={searchInputRef} type="search" placeholder="Tìm theo tên, thương hiệu (CASIO, SEIKO...)..." aria-label="Từ khóa tìm kiếm" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
            <button type="submit">Tìm kiếm</button>
          </form>
        </div>
      </nav>

      <div id="dh-nav-mob" className={mobileOpen ? 'open' : ''} role="dialog" aria-modal="true" aria-label="Menu điều hướng">
        <button className="dh-mob-close" aria-label="Đóng menu" onClick={() => setMobileOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link>
        ))}
        <Link to="/gio-hang" style={{ marginTop: 16 }} onClick={() => setMobileOpen(false)}>Giỏ hàng của tôi</Link>
      </div>

      {zaloNumber && (
        <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer" className="dh-zalo-float" aria-label="Chat Zalo">
          <svg viewBox="0 0 48 48" fill="#fff"><path d="M24 4C12.95 4 4 12.06 4 22c0 5.66 2.95 10.7 7.56 13.98L10 44l8.53-4.16c1.75.44 3.6.68 5.47.68 11.05 0 20-8.06 20-18S35.05 4 24 4z" /></svg>
        </a>
      )}
    </>
  )
}
