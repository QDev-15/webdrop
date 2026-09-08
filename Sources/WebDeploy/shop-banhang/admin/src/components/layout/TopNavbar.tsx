import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

interface Stats {
  new_contacts: number
  low_stock: number
}

interface NavItem {
  to: string
  label: string
  exact?: boolean
  badge?: number
}

export default function TopNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({ new_contacts: 0, low_stock: 0 })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
  }, [])

  const primaryLinks: NavItem[] = [
    { to: '/', label: 'Dashboard', exact: true },
    { to: '/products', label: 'Quản lý sản phẩm' },
    { to: '/stock-imports', label: 'Nhập kho' },
    { to: '/stocktake', label: 'Kiểm kho', badge: stats.low_stock },
    { to: '/customers', label: 'Khách hàng' },
    { to: '/reports', label: 'Thống kê' },
  ]

  const moreLinks: NavItem[] = [
    { to: '/contacts', label: 'Liên hệ', badge: stats.new_contacts },
    { to: '/slides', label: 'Hero Slides' },
    { to: '/media', label: 'Thư viện Media' },
    { to: '/users', label: 'Tài khoản' },
    { to: '/settings', label: 'Cài đặt' },
  ]

  function closeAll() {
    setMobileOpen(false)
    setMoreOpen(false)
  }

  async function handleLogout() {
    if (!confirm('Bạn chắc chắn muốn đăng xuất?')) return
    setLoggingOut(true)
    try {
      await logout()
      closeAll()
      navigate('/', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <nav className="bp-navbar">
      <div className="bp-navbar-brand">🍴 Admin POS</div>

      <button
        type="button"
        className="admin-navbar-toggle"
        aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(o => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`admin-navbar-menu${mobileOpen ? ' open' : ''}`}>
        {primaryLinks.map(link => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.exact} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>
              {link.label}
              {(link.badge ?? 0) > 0 && <span className="admin-navbar-badge">{link.badge}</span>}
            </NavLink>
          </li>
        ))}

        <li className={`admin-navbar-more${moreOpen ? ' open' : ''}`}>
          <button type="button" className="admin-navbar-more-btn" onClick={() => setMoreOpen(o => !o)}>
            Khác ▾
          </button>
          <ul className="admin-navbar-more-menu">
            {moreLinks.map(link => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>
                  {link.label}
                  {(link.badge ?? 0) > 0 && <span className="admin-navbar-badge">{link.badge}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      <div className="bp-navbar-user">
        <NavLink to="/profile" className={({ isActive }) => `admin-navbar-profile${isActive ? ' active' : ''}`} onClick={closeAll}>
          👤 {user?.name}
        </NavLink>
        <button className="bp-btn bp-btn-secondary bp-btn-sm" onClick={handleLogout} disabled={loggingOut}>
          Đăng xuất
        </button>
      </div>
    </nav>
  )
}
