import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact?: boolean
}

const navLinks: NavLinkItem[] = [
  { to: '/admin', icon: '📊', label: 'Bảng điều khiển', exact: true },
  { to: '/admin/services', icon: '🧘', label: 'Dịch vụ' },
  { to: '/admin/service-categories', icon: '📂', label: 'Danh mục dịch vụ' },
  { to: '/admin/team', icon: '👥', label: 'Đội ngũ' },
  { to: '/admin/testimonials', icon: '⭐', label: 'Bình luận khách' },
  { to: '/admin/bookings', icon: '📅', label: 'Đặt lịch' },
  { to: '/admin/contacts', icon: '💬', label: 'Liên hệ' },
  { to: '/admin/slides', icon: '🖼️', label: 'Hình ảnh banner' },
  { to: '/admin/media', icon: '🗂️', label: 'Thư viện ảnh' },
  { to: '/admin/settings', icon: '⚙️', label: 'Cài đặt' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to
    return location.pathname.startsWith(to)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span>🧘‍♀️</span>
        </div>
        <h2>Yoga Admin</h2>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-nav-link ${isActive(link.to, link.exact) ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {user?.name.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
            <div className="sidebar-user-email">{user?.email || 'admin@example.com'}</div>
          </div>
        </div>
        <Link to="/admin/profile" className="sidebar-nav-link">
          <span className="nav-icon">👤</span>
          <span className="nav-label">Tài khoản</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-logout">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
