import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings, categories } = useSite()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (settings.meta_title) {
      document.title = settings.meta_title
    }
    if (settings.meta_description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', settings.meta_description)
      else {
        const m = document.createElement('meta')
        m.name = 'description'
        m.content = settings.meta_description
        document.head.appendChild(m)
      }
    }
  }, [settings])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileOpen(false)
    }
  }

  const siteName = settings.site_name ?? 'Blog'

  return (
    <>
      <nav id="nav">
        <div className="wd-container">
          <div className="nav-inner">
            <Link to="/" className="logo">
              {siteName}<span>.</span>
            </Link>
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                Trang chủ
              </NavLink>
              {categories.slice(0, 4).map(cat => (
                <NavLink
                  key={cat.id}
                  to={`/danh-muc/${cat.slug}`}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {cat.name}
                </NavLink>
              ))}
            </div>
            <form className="nav-search" onSubmit={handleSearch}>
              <input
                ref={inputRef}
                type="search"
                placeholder="Tìm bài viết..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </form>
            <button
              className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        <Link to="/" onClick={() => setMobileOpen(false)}>Trang chủ</Link>
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/danh-muc/${cat.slug}`}
            onClick={() => setMobileOpen(false)}
          >
            {cat.name}
          </Link>
        ))}
        <Link to="/ve-toi" onClick={() => setMobileOpen(false)}>Về tôi</Link>
        <Link to="/lien-he" onClick={() => setMobileOpen(false)}>Liên hệ</Link>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '300px' }}>
          <input
            type="search"
            placeholder="Tìm bài viết..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              fontFamily: 'var(--sans)',
              fontSize: '14px',
              border: '1px solid var(--border)',
              borderRadius: '7px',
              padding: '8px 12px',
              background: 'var(--warm)',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              fontWeight: '500',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '7px',
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            Tìm
          </button>
        </form>
      </div>
    </>
  )
}
