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

  const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')

  return (
    <>
      <nav ref={mobNavRef} id="mt-nav-mob" aria-label="Menu di động" className={mobileOpen ? 'open' : ''}>
        <NavLink to="/" end className={navClass}>Trang chủ</NavLink>
        <NavLink to="/san-pham" className={navClass}>Sản phẩm</NavLink>
        <NavLink to="/dich-vu" className={navClass}>Dịch Vụ</NavLink>
        <NavLink to="/khuyen-mai" className={navClass}>Khuyến Mãi</NavLink>
        <NavLink to="/lien-he" className={navClass}>Liên hệ</NavLink>
        <NavLink to="/gio-hang" className={navClass}><i className="bi bi-bag me-2" />Giỏ hàng ({count})</NavLink>
      </nav>

      {/* Nav-1 Transparent → Scrolled (glass) */}
      <header id="mt-nav" className={scrolled ? 'scrolled' : ''}>
        <div className="mt-search-panel" hidden={!searchOpen}>
          <div className="mt-container">
            <form className="mt-search-panel-form" role="search" onSubmit={submitSearch}>
              <i className="bi bi-search" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                className="mt-search-panel-input"
                placeholder="Tìm sản phẩm..."
                aria-label="Tìm kiếm sản phẩm"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <button type="submit" className="mt-search-panel-submit">Tìm</button>
              <button type="button" className="mt-search-panel-close" aria-label="Đóng" onClick={() => setSearchOpen(false)}>&times;</button>
            </form>
          </div>
        </div>
        <div className="mt-container mt-nav-inner">
          <Link to="/" className="mt-logo">Nova<span>.</span>Tech</Link>
          <nav className="mt-nav-links" aria-label="Menu chính">
            <NavLink to="/" end className={navClass}>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={navClass}>Sản phẩm</NavLink>
            <NavLink to="/dich-vu" className={navClass}>Dịch Vụ</NavLink>
            <NavLink to="/khuyen-mai" className={navClass}>Khuyến Mãi</NavLink>
            <NavLink to="/lien-he" className={navClass}>Liên hệ</NavLink>
          </nav>
          <div className="mt-nav-right">
            <button
              type="button"
              className="mt-nav-search-btn"
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(v => !v)}
            >
              <i className="bi bi-search" />
            </button>
            <Link to="/gio-hang" className="mt-nav-cart" aria-label="Giỏ hàng">
              <i className="bi bi-bag" />
              <span className="mt-cart-count">{count}</span>
            </Link>
            <Link to="/san-pham" className="mt-nav-cta">Mua ngay</Link>
            <button
              id="mt-burger"
              className={mobileOpen ? 'open' : ''}
              aria-label="Mở menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
