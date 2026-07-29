import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { count } = useCart()
  const { settings } = useSite()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/san-pham?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="dg-header">
      {/* Topbar */}
      <div className="dg-topbar">
        <div className="dg-container">
          <div className="dg-topbar-content">
            <span>✓ Miễn phí vận chuyển</span>
            <span>✓ Đổi trả dễ dàng</span>
            <span>✓ Chất lượng đảm bảo</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="dg-nav">
        <div className="dg-container">
          <div className="dg-nav-content">
            {/* Logo */}
            <Link to="/" className="dg-logo">
              {settings.site_name || 'Shop Đồ Gia Dụng'}
            </Link>

            {/* Menu */}
            <ul className="dg-nav-menu">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/san-pham">Sản phẩm</Link></li>
              <li><Link to="/bo-suu-tap">Bộ sưu tập</Link></li>
              <li><Link to="/ve-chung-toi">Giới thiệu</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>

            {/* Search & Cart */}
            <div className="dg-nav-actions">
              <button className="dg-search-btn" onClick={() => setSearchOpen(!searchOpen)}>
                🔍
              </button>
              <Link to="/gio-hang" className="dg-cart-btn">
                🛒
                {count > 0 && <span className="dg-cart-badge">{count}</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Panel */}
        {searchOpen && (
          <div className="dg-search-panel">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit">Tìm kiếm</button>
            </form>
          </div>
        )}
      </nav>
    </header>
  )
}
