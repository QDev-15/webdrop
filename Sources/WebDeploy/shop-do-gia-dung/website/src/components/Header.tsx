import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { count } = useCart()
  const { settings } = useSite()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/san-pham?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header>
      {/* Topbar */}
      <div id="dg-topbar">
        <div className="dg-topbar__items">
          <div className="dg-topbar__item">✓ Miễn phí vận chuyển</div>
          <div className="dg-topbar__item">✓ Đổi trả dễ dàng</div>
          <div className="dg-topbar__item">✓ Chất lượng đảm bảo</div>
        </div>
      </div>

      {/* Main Nav */}
      <nav id="dg-nav">
        <div className="dg-nav__inner">
          {/* Logo */}
          <Link to="/" className="dg-nav__logo">
            {settings.site_name || 'Shop Đồ Gia Dụng'}
          </Link>

          {/* Menu */}
          <ul className="dg-nav__links">
            <li><Link to="/" className={isActive('/') ? 'active' : ''}>Trang chủ</Link></li>
            <li><Link to="/san-pham" className={isActive('/san-pham') ? 'active' : ''}>Sản phẩm</Link></li>
            <li><Link to="/bo-suu-tap" className={isActive('/bo-suu-tap') ? 'active' : ''}>Bộ sưu tập</Link></li>
            <li><Link to="/ve-chung-toi" className={isActive('/ve-chung-toi') ? 'active' : ''}>Giới thiệu</Link></li>
            <li><Link to="/lien-he" className={isActive('/lien-he') ? 'active' : ''}>Liên hệ</Link></li>
          </ul>

          {/* Search & Cart */}
          <div className="dg-nav__actions">
            <button className="dg-nav__icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
              🔍
            </button>
            <Link to="/gio-hang" className="dg-nav__icon-btn">
              🛒
              {count > 0 && <span className="dg-cart-count">{count}</span>}
            </Link>
          </div>

          {/* Hamburger Button — Mobile Only */}
          <button className="dg-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Search Panel */}
        {searchOpen && (
          <div id="dg-search-panel" className="open">
            <div className="dg-search-panel__inner">
              <form onSubmit={handleSearch} style={{flex: 1, display: 'flex', gap: '8px'}}>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dg-search-panel__input"
                  autoFocus
                />
                <button type="submit" className="dg-search-panel__btn">Tìm kiếm</button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Nav Overlay */}
      <div id="dg-nav-overlay" className={mobileMenuOpen ? 'open' : ''} onClick={closeMobileMenu}></div>

      {/* Mobile Nav Menu */}
      <nav id="dg-nav-mob" className={mobileMenuOpen ? 'open' : ''}>
        <button id="dg-nav-close" onClick={closeMobileMenu} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
        <div className="dg-nav-mob__links">
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMobileMenu}>Trang chủ</Link>
          <Link to="/san-pham" className={isActive('/san-pham') ? 'active' : ''} onClick={closeMobileMenu}>Sản phẩm</Link>
          <Link to="/bo-suu-tap" className={isActive('/bo-suu-tap') ? 'active' : ''} onClick={closeMobileMenu}>Bộ sưu tập</Link>
          <Link to="/ve-chung-toi" className={isActive('/ve-chung-toi') ? 'active' : ''} onClick={closeMobileMenu}>Giới thiệu</Link>
          <Link to="/lien-he" className={isActive('/lien-he') ? 'active' : ''} onClick={closeMobileMenu}>Liên hệ</Link>
        </div>
      </nav>
    </header>
  )
}
