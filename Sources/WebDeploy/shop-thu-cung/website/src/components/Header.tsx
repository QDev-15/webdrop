import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/bo-suu-tap', label: 'Bộ sưu tập' },
  { to: '/khuyen-mai', label: 'Khuyến mãi' },
  { to: '/ve-chung-toi', label: 'Giới thiệu' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const navigate = useNavigate()
  const { count } = useCart()

  // #tcNav là fixed, top:33px cố định để chừa chỗ cho .tc-topbar khi ở đỉnh trang. Khi cuộn xuống,
  // topbar (nằm trong flow bình thường) trôi ra khỏi khung nhìn nhưng nav fixed không tự theo — phải
  // toggle class .scrolled (CSS #tcNav.scrolled{top:0}) để kéo nav lên sát mép trên, tránh để trống
  // khoảng trắng 33px vĩnh viễn. Port từ assets/js/main.js::initNavScroll() (threshold scrollY>0).
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Toggle thêm .scrolled trên <body> — dùng cho các phần tử sticky/fixed khác NGOÀI
    // Header (vd .tc-filter-wrap ở ProductsPage) cũng cần bớt đúng phần chiều cao topbar
    // sau khi cuộn, mà không thể dùng chung state cục bộ `scrolled` của component này.
    const onScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
      document.body.classList.toggle('scrolled', isScrolled)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobileOpen(false); setSearchOpen(false) } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    navigate('/' + (q ? `?q=${encodeURIComponent(q)}` : ''))
    setSearchOpen(false)
    setSearchValue('')
  }

  return (
    <>
      <div className="tc-topbar">
        <div className="tc-topbar-inner">
          <span>Miễn phí ship đơn từ 400K</span>
          <span className="tc-topbar-sep">·</span>
          <span>Đổi trả trong 7 ngày</span>
          <span className="tc-topbar-sep">·</span>
          <span>100% sản phẩm kiểm định an toàn</span>
        </div>
      </div>

      <nav id="tcNav" className={scrolled ? 'scrolled' : ''}>
        <div className="tc-nav-inner">
          <Link to="/" className="tc-logo" aria-label="Pet Haus — Trang chủ">
            <span className="tc-logo-dot"></span>PET<span style={{ color: 'var(--accent-mid)' }}>HAUS</span>
          </Link>
          <div className="tc-nav-links d-none d-lg-flex">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to}>{l.label}</Link>
            ))}
          </div>
          <div className="tc-nav-actions">
            <button className="tc-nav-btn" aria-label="Tìm kiếm" aria-expanded={searchOpen} onClick={() => setSearchOpen(o => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <Link to="/gio-hang" className="tc-nav-btn" aria-label="Giỏ hàng" style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {count > 0 && <span className="tc-cart-count">{count}</span>}
            </Link>
            <button className={'tc-burger d-lg-none' + (mobileOpen ? ' open' : '')} aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(o => !o)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={'tc-mob-nav' + (mobileOpen ? ' open' : '')}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link>
        ))}
        <div className="tc-mob-nav-sep"></div>
        <div className="tc-mob-nav-footer">
          <Link to="/chinh-sach-bao-mat" onClick={() => setMobileOpen(false)}>Chính sách bảo mật</Link>
          <Link to="/dieu-khoan" onClick={() => setMobileOpen(false)}>Điều khoản</Link>
        </div>
      </div>

      <div className="tc-nav-search-panel" style={{ display: searchOpen ? 'block' : 'none' }}>
        <div className="tc-container" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <form onSubmit={submitSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
            <input ref={searchInputRef} type="text" placeholder="Tìm sản phẩm cho chó, mèo..." autoComplete="off" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
            <button type="submit" className="tc-btn tc-btn-primary">Tìm</button>
          </form>
          <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, lineHeight: 1, padding: '4px 8px' }} aria-label="Đóng">×</button>
        </div>
      </div>
    </>
  )
}
