import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { count } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const mobNavRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [pathname])

  // `inert` chưa có trong JSX.IntrinsicElements typing của React 18 — set thủ công qua ref.
  useEffect(() => {
    mobNavRef.current?.toggleAttribute('inert', !mobileOpen)
  }, [mobileOpen])

  return (
    <>
      {/* Nav-6 Full-Width Dark Bar — nav luôn tối, cố định trên cùng */}
      <header id="ts-nav">
        <div className="ts-container ts-nav-inner">
          <Link to="/" className="ts-logo">Maison<span>Cuir</span></Link>
          <nav className="ts-nav-links" aria-label="Menu chính">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
            <NavLink to="/bo-suu-tap" className={({ isActive }) => isActive ? 'active' : ''}>Bộ Sưu Tập</NavLink>
            <NavLink to="/ve-chung-toi" className={({ isActive }) => isActive ? 'active' : ''}>Về Chúng Tôi</NavLink>
            <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
          </nav>
          <div className="ts-nav-actions">
            <button
              type="button"
              className="ts-nav-icon-btn"
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(v => !v)}
            >
              <i className="bi bi-search" />
            </button>
            <Link to="/gio-hang" className="ts-nav-icon-btn" aria-label="Xem giỏ hàng">
              <i className="bi bi-bag" />
              <span className="ts-cart-count">{count}</span>
            </Link>
            <button
              className={'ts-burger' + (mobileOpen ? ' open' : '')}
              aria-label="Mở menu điều hướng"
              aria-expanded={mobileOpen}
              aria-controls="ts-nav-mob"
              onClick={() => setMobileOpen(o => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="ts-search-panel">
          <div className="ts-container">
            <form
              className="ts-search-panel-form"
              role="search"
              onSubmit={e => {
                e.preventDefault()
                const q = searchValue.trim()
                setSearchOpen(false)
                navigate(q ? `/san-pham?q=${encodeURIComponent(q)}` : '/san-pham')
              }}
            >
              <i className="bi bi-search" aria-hidden="true" />
              <input
                type="search"
                className="ts-search-panel-input"
                placeholder="Tìm sản phẩm..."
                aria-label="Tìm kiếm sản phẩm"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                autoFocus
              />
              <button type="submit" className="ts-search-panel-submit" aria-label="Tìm">Tìm</button>
              <button type="button" className="ts-search-panel-close" aria-label="Đóng" onClick={() => setSearchOpen(false)}>&times;</button>
            </form>
          </div>
        </div>
      )}

      <div className={'ts-nav-scrim' + (mobileOpen ? ' open' : '')} onClick={() => setMobileOpen(false)} />
      <nav ref={mobNavRef} id="ts-nav-mob" aria-label="Menu điều hướng di động" className={mobileOpen ? 'open' : ''}>
        <button className="ts-nav-mob-close" aria-label="Đóng menu" onClick={() => setMobileOpen(false)}><i className="bi bi-x-lg" /></button>
        <ul className="ts-nav-mob-links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink></li>
          <li><NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink></li>
          <li><NavLink to="/bo-suu-tap" className={({ isActive }) => isActive ? 'active' : ''}>Bộ Sưu Tập</NavLink></li>
          <li><NavLink to="/ve-chung-toi" className={({ isActive }) => isActive ? 'active' : ''}>Về Chúng Tôi</NavLink></li>
          <li><NavLink to="/gio-hang" className={({ isActive }) => isActive ? 'active' : ''}>Giỏ hàng ({count})</NavLink></li>
          <li><NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink></li>
        </ul>
      </nav>
    </>
  )
}
