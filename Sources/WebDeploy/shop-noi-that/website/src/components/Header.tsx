import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'

// ⚠️ Fix bug template gốc (2026-08-24): #nt-nav (fixed, top:var(--topbar-h)) và
// .nt-toolbar-wrap (sticky, top:calc(topbar-h + nav-h)) đều cần bớt đúng phần --topbar-h khi
// đã cuộn qua khỏi topbar — bản tĩnh dùng JS toggle class `.scrolled` trên <body> khi
// window.scrollY > 0. Port sang React bằng useState + useEffect scroll listener (thay cho
// DOM class toggle thuần) — khớp convention Header.tsx đã dùng ở các site WebDeploy khác.
function useBodyScrolledClass() {
  useEffect(() => {
    const sync = () => document.body.classList.toggle('scrolled', window.scrollY > 0)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => {
      window.removeEventListener('scroll', sync)
      document.body.classList.remove('scrolled')
    }
  }, [])
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { count } = useCart()
  const { settings } = useSite()
  useBodyScrolledClass()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

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
    if (!q) return
    navigate(`/?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setSearchValue('')
  }

  const zalo = settings.zalo_number || settings.site_phone?.replace(/\s/g, '') || ''
  const phone = settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/bo-suu-tap', label: 'Bộ sưu tập' },
    { to: '/khuyen-mai', label: 'Khuyến mãi' },
    { to: '/ve-chung-toi', label: 'Giới thiệu' },
    { to: '/lien-he', label: 'Liên hệ' },
  ]

  return (
    <>
      <div className="nt-topbar" role="status">
        <span>{settings.hero_topbar_1 || 'Miễn phí giao hàng nội thành cho đơn từ 5.000.000₫'}</span>
        <span className="nt-topbar-sep">·</span>
        <span>{settings.hero_topbar_2 || 'Bảo hành 24 tháng'}</span>
        <span className="nt-topbar-sep">·</span>
        <span>{settings.hero_topbar_3 || 'Lắp đặt tận nơi toàn quốc'}</span>
      </div>

      <nav id="nt-nav" aria-label="Menu chính">
        <div className="nt-container">
          <div className="nt-nav-inner">
            <Link to="/" className="nt-logo" aria-label="MỘC AN - Trang chủ">MỘC <em>AN</em></Link>
            <ul className="nt-nav-links d-none d-lg-flex">
              {navLinks.map(l => (
                <li key={l.to}><Link to={l.to} className={location.pathname === l.to ? 'active' : undefined}>{l.label}</Link></li>
              ))}
            </ul>
            <div className="nt-nav-actions">
              <button
                id="navSearchBtn"
                className="nt-nav-icon-btn"
                aria-label="Tìm kiếm"
                aria-expanded={searchOpen}
                aria-controls="navSearchPanel"
                onClick={() => setSearchOpen(o => !o)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
              <Link to="/gio-hang" className="nt-nav-icon-btn" aria-label="Giỏ hàng">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                <span className="nt-cart-badge" style={{ display: count ? 'flex' : 'none' }}>{count}</span>
              </Link>
              <button className="nt-hamburger d-lg-none" aria-label="Mở menu" aria-expanded={mobileOpen} aria-controls="navMob" onClick={() => setMobileOpen(true)}>
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
          <div className="nt-search-panel" id="navSearchPanel" hidden={!searchOpen}>
            <form className="nt-search-form" onSubmit={submitSearch}>
              <input ref={searchInputRef} type="search" placeholder="Tìm sofa, bàn ăn, đèn trang trí..." aria-label="Từ khóa tìm kiếm" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
              <button type="submit" aria-label="Tìm kiếm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className={'nt-nav-mob' + (mobileOpen ? ' open' : '')} id="navMob" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
        <div className="nt-nav-mob-top">
          <span className="nt-logo">MỘC <em>AN</em></span>
          <button className="nt-nav-mob-close" aria-label="Đóng menu" onClick={() => setMobileOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <ul>
          {navLinks.map(l => (
            <li key={l.to}><Link to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link></li>
          ))}
        </ul>
        <div className="nt-nav-mob-actions">
          <Link to="/gio-hang" onClick={() => setMobileOpen(false)}>🛒 Giỏ hàng của tôi</Link>
          <a href={`tel:${phone.replace(/\s/g, '')}`}>📞 {phone}</a>
        </div>
      </div>

      <div className="nt-zalo-float">
        <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
          <svg viewBox="0 0 48 48" width="26" height="26"><text y="34" x="8" fontSize="28" fill="#fff" fontFamily="sans-serif">Z</text></svg>
        </a>
      </div>
    </>
  )
}
