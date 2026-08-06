import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const navigate = useNavigate()
  const { count } = useCart()
  const { settings } = useSite()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/?q=${encodeURIComponent(searchValue)}`)
      setSearchOpen(false)
      setSearchValue('')
    }
  }

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const topbarItems = [
    settings['hero_topbar_1'] || 'Miễn phí ship đơn từ 500K',
    settings['hero_topbar_2'] || 'Đổi size miễn phí',
    settings['hero_topbar_3'] || 'Bảo hành 12 tháng'
  ]

  return (
    <>
      {/* TOPBAR */}
      <div className="tt-topbar">
        <div className="tt-container">
          <div className="tt-topbar-inner">
            {topbarItems.map((item, idx) => (
              <div key={idx}>
                {idx > 0 && <span className="tt-topbar-sep">|</span>}
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav id="ttNav">
        <div className="tt-nav-inner">
          <div className="tt-logo">
            SPORT <span>THE</span> THAO
          </div>

          {/* Desktop nav links */}
          <div className="tt-nav-links">
            <Link to="/">Trang chủ</Link>
            <Link to="/bo-suu-tap">Bộ sưu tập</Link>
            <Link to="/khuyen-mai">Khuyến mãi</Link>
            <Link to="/dich-vu">Dịch vụ</Link>
            <Link to="/lien-he">Liên hệ</Link>
          </div>

          {/* Nav actions */}
          <div className="tt-nav-actions">
            <button
              className="tt-nav-btn"
              aria-label="Tìm kiếm"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>

            <Link to="/gio-hang" className="tt-nav-btn" style={{ position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {count > 0 && <span className="tt-cart-count">{count}</span>}
            </Link>

            <button
              className="tt-burger"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div className="tt-nav-search-panel open">
            <div className="tt-container">
              <form className="tt-nav-search-form" onSubmit={handleSearch}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit">Tìm</button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile nav overlay */}
      <div className={`tt-mob-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
        <Link to="/bo-suu-tap" onClick={() => setMobileMenuOpen(false)}>Bộ sưu tập</Link>
        <Link to="/khuyen-mai" onClick={() => setMobileMenuOpen(false)}>Khuyến mãi</Link>
        <Link to="/dich-vu" onClick={() => setMobileMenuOpen(false)}>Dịch vụ</Link>
        <Link to="/lien-he" onClick={() => setMobileMenuOpen(false)}>Liên hệ</Link>
        <hr style={{ borderColor: 'var(--border)', margin: '20px 0' }} />
        <Link to="/chinh-sach-bao-mat" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '13px', opacity: 0.7 }}>
          Chính sách bảo mật
        </Link>
        <Link to="/dieu-khoan" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '13px', opacity: 0.7 }}>
          Điều khoản
        </Link>
      </div>
    </>
  )
}
