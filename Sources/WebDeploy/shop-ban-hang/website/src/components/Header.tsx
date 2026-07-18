import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { settings } = useSite()
  const { count } = useCart()
  const navigate = useNavigate()
  const [mobOpen, setMobOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const siteName = settings['site_name'] || 'Shop Hữu Cơ'

  const toggle = () => setMobOpen(v => !v)
  const close = () => setMobOpen(false)

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    setSearchOpen(false)
    navigate(q ? `/san-pham?q=${encodeURIComponent(q)}` : '/san-pham')
  }

  return (
    <>
      <nav id="sb-nav">
        <div className="sb-nav-inner">
          <Link to="/" className="sb-logo" onClick={close}>
            {siteName.split(' ').slice(0, -1).join(' ')} <span>{siteName.split(' ')[siteName.split(' ').length - 1]}</span>
          </Link>

          <div className="sb-nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
            <NavLink to="/san-pham" className={({ isActive }) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
            <NavLink to="/ve-chung-toi" className={({ isActive }) => isActive ? 'active' : ''}>Về Chúng Tôi</NavLink>
            <NavLink to="/khuyen-mai" className={({ isActive }) => isActive ? 'active' : ''}>Khuyến Mãi</NavLink>
            <NavLink to="/lien-he" className={({ isActive }) => isActive ? 'active' : ''}>Liên hệ</NavLink>
          </div>

          <div className="sb-nav-right">
            <button
              type="button"
              className="sb-nav-search-btn"
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(v => !v)}
            >
              <i className="bi bi-search" />
            </button>
            <Link to="/gio-hang" className="sb-nav-cart" aria-label="Giỏ hàng">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && <span className="sb-cart-count">{count > 99 ? '99+' : count}</span>}
            </Link>
            <Link to="/san-pham" className="sb-nav-cta">Mua ngay</Link>
            <button id="sb-burger" className={mobOpen ? 'open' : ''} onClick={toggle} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div className="sb-search-panel">
          <div className="sb-container">
            <form className="sb-search-panel-form" onSubmit={submitSearch}>
              <i className="bi bi-search" aria-hidden="true" />
              <input
                type="search"
                className="sb-search-panel-input"
                placeholder="Tìm sản phẩm..."
                aria-label="Tìm kiếm sản phẩm"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                autoFocus
              />
              <button type="submit" className="sb-search-panel-submit" aria-label="Tìm">Tìm</button>
              <button type="button" className="sb-search-panel-close" aria-label="Đóng" onClick={() => setSearchOpen(false)}>&times;</button>
            </form>
          </div>
        </div>
      )}

      <div id="sb-nav-mob" className={mobOpen ? 'open' : ''}>
        <Link to="/" onClick={close}>Trang chủ</Link>
        <Link to="/san-pham" onClick={close}>Sản phẩm</Link>
        <Link to="/ve-chung-toi" onClick={close}>Về Chúng Tôi</Link>
        <Link to="/khuyen-mai" onClick={close}>Khuyến Mãi</Link>
        <Link to="/lien-he" onClick={close}>Liên hệ</Link>
        <Link to="/gio-hang" onClick={close} className="mt-3"><i className="bi bi-bag me-2" />Giỏ hàng</Link>
      </div>
    </>
  )
}
