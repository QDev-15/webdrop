import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/bo-suu-tap', label: 'Bộ sưu tập' },
  { to: '/khuyen-mai', label: 'Khuyến mãi' },
  { to: '/ve-chung-toi', label: 'Giới thiệu' },
  { to: '/lien-he', label: 'Liên hệ' },
]

// Age-gate 18+ (localStorage rv_age_ok) — khớp #rvAgeGate trong template gốc, hiển thị 1 lần
// cho tới khi khách xác nhận đủ tuổi (hoặc rời trang nếu chưa đủ tuổi).
function AgeGate() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('rv_age_ok') !== '1') {
      setVisible(true)
      document.body.style.overflow = 'hidden'
    }
  }, [])

  const confirm = () => {
    localStorage.setItem('rv_age_ok', '1')
    setVisible(false)
    document.body.style.overflow = ''
  }
  const decline = () => { window.location.href = 'https://www.google.com' }

  if (!visible) return null
  return (
    <div className="rv-agegate">
      <div className="rv-agegate-box">
        <div className="rv-agegate-mark">18+</div>
        <h2>Xác nhận độ tuổi</h2>
        <p>Mộc Vang là nền tảng bán rượu vang trực tuyến. Theo quy định pháp luật Việt Nam, chúng tôi chỉ phục vụ khách hàng từ đủ 18 tuổi trở lên. Vui lòng xác nhận bạn đã đủ 18 tuổi để tiếp tục truy cập website.</p>
        <div className="rv-agegate-actions">
          <button className="rv-btn rv-btn-outline" onClick={decline}>Tôi chưa đủ 18</button>
          <button className="rv-btn rv-btn-solid" onClick={confirm}>Tôi đã đủ 18 tuổi</button>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { count } = useCart()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
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

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    navigate('/' + (q ? `?q=${encodeURIComponent(q)}` : ''))
    setSearchOpen(false)
  }

  return (
    <>
      <AgeGate />
      <header id="rv-nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container rv-nav-inner">
          <Link to="/" className="rv-logo" aria-label="Mộc Vang — Trang chủ">
            <span className="rv-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M8 2h8M9 2v6a5 5 0 0 0 10 0V2M9 2 5 8a5 5 0 0 0 10 0L11 2" /><path d="M12 15v7M9 22h6" /></svg>
            </span>
            MỘC<em>VANG</em>
          </Link>
          <nav className="rv-nav-links d-none d-lg-flex">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : undefined}>{l.label}</Link>
            ))}
          </nav>
          <div className="rv-nav-actions">
            <button className="rv-icon-btn" aria-label="Tìm kiếm" aria-expanded={searchOpen} onClick={() => setSearchOpen(o => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
            <Link to="/gio-hang" className="rv-icon-btn" aria-label="Giỏ hàng">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
              <span className="rv-cart-count">{count}</span>
            </Link>
            <button className={'rv-burger d-lg-none' + (mobileOpen ? ' open' : '')} aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(o => !o)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        <div className={'rv-nav-search' + (searchOpen ? ' open' : '')}>
          <div className="wd-container">
            <form onSubmit={submitSearch}>
              <input ref={searchInputRef} type="search" placeholder="Tìm vang đỏ, vang Pháp, Champagne..." value={searchValue} onChange={e => setSearchValue(e.target.value)} />
              <button type="submit">Tìm</button>
            </form>
          </div>
        </div>
      </header>
      <nav className={'rv-nav-mobile' + (mobileOpen ? ' open' : '')}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link>
        ))}
        <Link to="/gio-hang" onClick={() => setMobileOpen(false)}>Giỏ hàng</Link>
      </nav>
    </>
  )
}
