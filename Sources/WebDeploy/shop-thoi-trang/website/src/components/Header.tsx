import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/san-pham', label: 'Bộ sưu tập' },
  { to: '/san-pham?cat=nam', label: 'Nam' },
  { to: '/san-pham?cat=nu', label: 'Nữ' },
  { to: '/san-pham?sale=1', label: 'Sale' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const { count } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(!isHome)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    setSearchOpen(false)
    navigate(q ? `/san-pham?q=${encodeURIComponent(q)}` : '/san-pham')
  }

  useEffect(() => {
    if (!isHome) { setScrolled(true); return }
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const siteName = settings.site_name || 'Nova Store'
  const [namePart1, ...rest] = siteName.split(' ')
  const namePart2 = rest.join(' ') || 'Store'

  return (
    <>
      <div className={'st-mob-nav' + (mobileOpen ? ' open' : '')} aria-hidden={!mobileOpen} role="dialog" aria-label="Menu di động">
        <ul>
          {NAV_LINKS.map(link => (
            <li key={link.label}><Link to={link.to} className={pathname === link.to ? 'st-active' : ''}>{link.label}</Link></li>
          ))}
        </ul>
        <div className="st-mob-actions">
          <Link to="/gio-hang" className="st-btn st-btn-outline-white">
            <i className="bi bi-bag" /> Giỏ hàng ({count})
          </Link>
        </div>
      </div>

      <header id="stNav" className={'st-nav' + (scrolled ? ' st-scrolled' : '')} role="banner">
        <div className="st-container st-nav-inner">
          <Link to="/" className="st-logo">{namePart1}<span>.</span>{namePart2}</Link>

          <nav className="st-nav-links" aria-label="Menu chính">
            {NAV_LINKS.map(link => (
              <NavLink key={link.label} to={link.to} end={link.end} className={({ isActive }) => isActive ? 'st-active' : ''}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="st-nav-actions">
            <button type="button" className="st-nav-icon" aria-label="Tìm kiếm" onClick={() => setSearchOpen(o => !o)}>
              <i className="bi bi-search" />
            </button>
            <Link to="/gio-hang" className="st-nav-icon" aria-label="Giỏ hàng">
              <i className="bi bi-bag" />
              {count > 0 && <span className="st-cart-badge">{count}</span>}
            </Link>
            <button
              id="stBurger"
              className={'st-burger' + (mobileOpen ? ' open' : '')}
              aria-label="Mở menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="st-container" style={{ paddingBottom: 16 }}>
            <form onSubmit={submitSearch} style={{ display: 'flex', maxWidth: 420 }}>
              <input
                type="search"
                autoFocus
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Tìm sản phẩm..."
                aria-label="Tìm kiếm sản phẩm"
                style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)', borderRight: 'none', fontFamily: 'var(--sans)', fontSize: 14, outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0 18px', background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                <i className="bi bi-search" />
              </button>
            </form>
          </div>
        )}
      </header>
    </>
  )
}
