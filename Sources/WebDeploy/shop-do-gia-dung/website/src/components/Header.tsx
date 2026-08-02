import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { settings } = useSite()
  const { count } = useCart()
  const navigate = useNavigate()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [mobOpen, setMobOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const siteName = String(settings.site_name || 'Shop Đồ Gia Dụng')
  const sitePhone = String(settings.site_phone || '')
  const workingHours = String(settings.working_hours || '')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setMobOpen(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 100)
  }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQ.trim()
    if (q) {
      navigate(`/san-pham?q=${encodeURIComponent(q)}`)
      setSearchQ(''); setSearchOpen(false)
    }
  }

  const navCls = ({ isActive }: { isActive: boolean }) => isActive ? 'active' : ''

  const parts = siteName.split(' ')
  const logoMain = parts.slice(0, -1).join(' ')
  const logoAccent = parts.slice(-1)[0]

  return (
    <>
      {/* Topbar */}
      <div id="dg-topbar">
        <div className="dg-topbar__items">
          {workingHours && <span className="dg-topbar__item">⏰ {workingHours}</span>}
          {sitePhone && <span className="dg-topbar__item">📞 {sitePhone}</span>}
          <span className="dg-topbar__item">🚚 Miễn phí giao hàng từ 500.000đ</span>
        </div>
      </div>

      {/* Nav */}
      <nav id="dg-nav">
        <div className="dg-nav__inner">
          <Link to="/" className="dg-nav__logo">
            {logoMain} <span>{logoAccent}</span>
          </Link>

          <div className="dg-nav__links">
            <NavLink to="/" className={navCls} end>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={navCls}>Sản phẩm</NavLink>
            <NavLink to="/bo-suu-tap" className={navCls}>Bộ sưu tập</NavLink>
            <NavLink to="/ve-chung-toi" className={navCls}>Về chúng tôi</NavLink>
            <NavLink to="/lien-he" className={navCls}>Liên hệ</NavLink>
          </div>

          <div className="dg-nav__actions">
            <button
              className="dg-nav__icon-btn"
              onClick={() => setSearchOpen(v => !v)}
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            <Link to="/gio-hang" className="dg-nav__icon-btn" aria-label="Giỏ hàng">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && <span className="dg-cart-count">{count}</span>}
            </Link>

            <button className="dg-hamburger" onClick={() => setMobOpen(true)} aria-label="Mở menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Search panel */}
      <div id="dg-search-panel" className={searchOpen ? 'open' : ''}>
        <div className="dg-container">
          <form className="dg-search-panel__inner" onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              className="dg-search-panel__input"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
            <button type="submit" className="dg-search-panel__btn">Tìm kiếm</button>
            <button type="button" className="dg-nav__icon-btn" onClick={() => setSearchOpen(false)} aria-label="Đóng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile overlay */}
      <div id="dg-nav-overlay" className={mobOpen ? 'open' : ''} onClick={() => setMobOpen(false)} />

      {/* Mobile menu */}
      <div id="dg-nav-mob" className={mobOpen ? 'open' : ''}>
        <button id="dg-nav-close" onClick={() => setMobOpen(false)} aria-label="Đóng menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <nav className="dg-nav-mob__links">
          <NavLink to="/" className={navCls} end onClick={() => setMobOpen(false)}>Trang chủ</NavLink>
          <NavLink to="/san-pham" className={navCls} onClick={() => setMobOpen(false)}>Sản phẩm</NavLink>
          <NavLink to="/bo-suu-tap" className={navCls} onClick={() => setMobOpen(false)}>Bộ sưu tập</NavLink>
          <NavLink to="/ve-chung-toi" className={navCls} onClick={() => setMobOpen(false)}>Về chúng tôi</NavLink>
          <NavLink to="/lien-he" className={navCls} onClick={() => setMobOpen(false)}>Liên hệ</NavLink>
          <Link to="/chinh-sach-bao-mat" style={{ fontSize: 14, color: 'var(--text-3)', padding: '8px 14px' }} onClick={() => setMobOpen(false)}>Chính sách bảo mật</Link>
          <Link to="/dieu-khoan" style={{ fontSize: 14, color: 'var(--text-3)', padding: '8px 14px' }} onClick={() => setMobOpen(false)}>Điều khoản sử dụng</Link>
        </nav>
      </div>
    </>
  )
}
