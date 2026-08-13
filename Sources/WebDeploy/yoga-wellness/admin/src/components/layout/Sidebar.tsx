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
  { to: '/admin/team', icon: '👥', label: 'Đội ngũ' },
  { to: '/admin/testimonials', icon: '⭐', label: 'Bình luận khách' },
  { to: '/admin/bookings', icon: '📅', label: 'Đặt lịch' },
  { to: '/admin/contacts', icon: '💬', label: 'Liên hệ' },
  { to: '/admin/slides', icon: '🖼️', label: 'Hình ảnh banner' },
  { to: '/admin/media', icon: '🗂️', label: 'Thư viện ảnh' },
  { to: '/admin/settings', icon: '⚙️', label: 'Cài đặt' },
]

export default function Sidebar() {
  const { logout } = useAuth()
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
      <div className="sidebar-logo">
        <span>🧘‍♀️</span> Yoga Admin
      </div>

      <nav>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${isActive(link.to, link.exact) ? 'active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/admin/profile" className="sidebar-link">
          <span className="icon">👤</span>
          Tài khoản
        </Link>
        <button onClick={handleLogout} className="sidebar-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 12px', margin: '1px 8px', cursor: 'pointer'}}>
          <span className="icon">🚪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
