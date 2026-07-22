import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { count } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobNavRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [pathname])

  // `inert` chưa có trong JSX.IntrinsicElements typing của React 18 — set thủ công qua ref.
  useEffect(() => {
    mobNavRef.current?.toggleAttribute('inert', !mobileOpen)
  }, [mobileOpen])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 10)
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    setSearchOpen(false)
    navigate(q ? `/san-pham?q=${encodeURIComponent(q)}` : '/san-pham')
  }

  const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'ma-active' : '')

  return (
    <>
      <nav ref={mobNavRef} id="ma-nav-mob" className={'ma-mob-nav' + (mobileOpen ? ' open' : '')} aria-label="Menu di động">
        <ul>
          <li><NavLink to="/" end className={navClass}><i className="bi bi-house" /> Trang chủ</NavLink></li>
          <li><NavLink to="/san-pham" className={navClass}><i className="bi bi-camera" /> Sản phẩm</NavLink></li>
          <li><NavLink to="/dich-vu" className={navClass}><i className="bi bi-tools" /> Dịch Vụ</NavLink></li>
          <li><NavLink to="/thuong-hieu" className={navClass}><i className="bi bi-award" /> Thương Hiệu</NavLink></li>
          <li><NavLink to="/lien-he" className={navClass}><i className="bi bi-envelope" /> Liên hệ</NavLink></li>
          <li><NavLink to="/gio-hang" className={navClass}><i className="bi bi-bag" /> Giỏ hàng ({count})</NavLink></li>
        </ul>
        <div className="ma-mob-actions">
          <Link to="/san-pham" className="ma-btn ma-btn-primary ma-btn-full">Mua ngay</Link>
        </div>
      </nav>

      {/* Nav-4 Minimal Top Line */}
      <header id="ma-nav" className={scrolled ? 'ma-scrolled' : ''}>
        <div className="ma-container ma-nav-inner">
          <Link to="/" className="ma-logo"><span className="ma-logo-dot" />PhotoPro</Link>
          <nav className="ma-nav-links" aria-label="Menu chính">
            <NavLink to="/" end className={navClass}>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={navClass}>Sản phẩm</NavLink>
            <NavLink to="/dich-vu" className={navClass}>Dịch Vụ</NavLink>
            <NavLink to="/thuong-hieu" className={navClass}>Thương Hiệu</NavLink>
            <NavLink to="/lien-he" className={navClass}>Liên hệ</NavLink>
          </nav>
          <div className="ma-nav-actions">
            <button
              type="button"
              className="ma-nav-icon ma-nav-search-btn"
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(v => !v)}
            >
              <i className="bi bi-search" />
            </button>
            <Link to="/gio-hang" className="ma-nav-icon" aria-label="Giỏ hàng">
              <i className="bi bi-bag" />
              <span className="ma-cart-badge">{count}</span>
            </Link>
            <Link to="/san-pham" className="ma-btn ma-btn-primary ma-btn-sm">Mua ngay</Link>
            <button
              id="ma-burger"
              className={'ma-burger' + (mobileOpen ? ' open' : '')}
              aria-label="Mở menu"
              aria-expanded={mobileOpen}
              aria-controls="ma-nav-mob"
              onClick={() => setMobileOpen(o => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div className="ma-search-panel" hidden={!searchOpen}>
          <div className="ma-container">
            <form className="ma-search-panel-form" role="search" onSubmit={submitSearch}>
              <i className="bi bi-search" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                className="ma-search-panel-input"
                placeholder="Tìm sản phẩm..."
                aria-label="Tìm kiếm sản phẩm"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <button type="submit" className="ma-search-panel-submit">Tìm</button>
              <button type="button" className="ma-search-panel-close" aria-label="Đóng" onClick={() => setSearchOpen(false)}>&times;</button>
            </form>
          </div>
        </div>
      </header>
    </>
  )
}
