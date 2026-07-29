import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/san-pham?q=${encodeURIComponent(searchInput.trim())}`)
      setSearchInput('')
      setSearchOpen(false)
    }
  }

  const isActive = (path: string) => location.pathname === path ? 'active' : ''

  return (
    <>
      {/* Topbar */}
      <div className="dc-topbar">
        <div className="dc-topbar-inner">
          <span>Miễn phí ship đơn từ 300K</span>
          <span className="dc-topbar-sep">·</span>
          <span>Đổi trả 30 ngày</span>
          <span className="dc-topbar-sep">·</span>
          <span>Bảo hành chính hãng</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="dc-nav" role="navigation" aria-label="Menu chính">
        <div className="dc-nav-inner">
          <Link to="/" className="dc-nav-logo" aria-label="KidZone trang chủ">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <text x="16" y="22" fontSize="18" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fill="white">K</text>
            </svg>
            <span>KidZone</span>
          </Link>
          <ul className="dc-nav-links" role="list">
            <li><Link to="/" className={isActive('/')}>Trang chủ</Link></li>
            <li><Link to="/san-pham" className={isActive('/san-pham')}>Sản phẩm</Link></li>
            <li><a href="#" onClick={e => { e.preventDefault(); navigate('/bo-suu-tap') }}>Bộ sưu tập</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); navigate('/ve-chung-toi') }}>Giới thiệu</a></li>
            <li><Link to="/lien-he" className={isActive('/lien-he')}>Liên hệ</Link></li>
          </ul>
          <div className="dc-nav-actions">
            <button
              className="dc-nav-icon"
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
              aria-controls="dcSearchPanel"
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
            <Link to="/gio-hang" className="dc-nav-icon dc-cart-icon" aria-label="Giỏ hàng">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {count > 0 && <span className="dc-cart-badge">{count}</span>}
            </Link>
            <button
              className="dc-burger"
              aria-label="Mở menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="dcNavMob"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div className="dc-search-panel" id="dcSearchPanel">
            <form className="dc-search-form" onSubmit={handleSearch} role="search">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Tìm đồ chơi cho bé..."
                autoComplete="off"
                aria-label="Tìm kiếm sản phẩm"
                autoFocus
              />
              <button type="submit" aria-label="Tìm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="dc-nav-mob" id="dcNavMob" role="navigation" aria-label="Menu di động">
          <ul role="list">
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link></li>
            <li><Link to="/san-pham" onClick={() => setMobileMenuOpen(false)}>Sản phẩm</Link></li>
            <li><a href="#" onClick={e => { e.preventDefault(); navigate('/bo-suu-tap'); setMobileMenuOpen(false) }}>Bộ sưu tập</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); navigate('/ve-chung-toi'); setMobileMenuOpen(false) }}>Giới thiệu</a></li>
            <li><Link to="/lien-he" onClick={() => setMobileMenuOpen(false)}>Liên hệ</Link></li>
          </ul>
        </div>
      )}
    </>
  )
}
