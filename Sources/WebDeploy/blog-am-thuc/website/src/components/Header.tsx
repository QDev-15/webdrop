import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/chuyen-muc', label: 'Chuyên mục' },
  { to: '/cong-thuc-nau-an', label: 'Công thức nấu ăn' },
  { to: '/ve-toi', label: 'Về tôi' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const siteName = settings.site_name || 'Bếp Xanh'
  const lastSpace = siteName.lastIndexOf(' ')
  const logoMain = lastSpace === -1 ? siteName : siteName.slice(0, lastSpace + 1)
  const logoAccent = lastSpace === -1 ? '' : siteName.slice(lastSpace + 1)

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    const q = query.trim()
    navigate(q ? `/chuyen-muc?q=${encodeURIComponent(q)}` : '/chuyen-muc')
  }

  return (
    <>
      <nav id="nav">
        <div className="bam-container bam-nav-inner">
          <NavLink to="/" className="bam-logo">
            <span className="bam-logo-mark">🥗</span>{logoMain}<span>{logoAccent}</span>
          </NavLink>
          <div className="bam-nav-links">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="bam-nav-cta">
            <div className="bam-nav-search">
              <i className="bi bi-search" />
              <input
                type="text"
                placeholder="Tìm công thức..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <button
              className={'bam-hamburger' + (mobileOpen ? ' open' : '')}
              id="navBurger"
              aria-label="Mở menu"
              onClick={() => setMobileOpen(o => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={'bam-nav-mobile' + (mobileOpen ? ' open' : '')} id="navMob">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </>
  )
}
