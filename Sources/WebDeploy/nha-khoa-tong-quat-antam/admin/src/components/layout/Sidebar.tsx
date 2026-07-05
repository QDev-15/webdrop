import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavItem {
  to: string
  icon: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: '📊', label: 'Tổng quan' },
  { to: '/bookings', icon: '📅', label: 'Đặt lịch' },
  { to: '/services', icon: '🦷', label: 'Dịch vụ' },
  { to: '/team', icon: '👨‍⚕️', label: 'Bác sĩ' },
  { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
  { to: '/contacts', icon: '✉️', label: 'Liên hệ' },
  { to: '/slides', icon: '🖼️', label: 'Hero Slides' },
  { to: '/media', icon: '🗂️', label: 'Media' },
  { to: '/settings', icon: '⚙️', label: 'Cài đặt' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar" role="navigation" aria-label="Admin navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <span aria-hidden="true">🦷</span>
        An Tâm Admin
      </div>

      {/* Section: content */}
      <div className="sidebar-section">Quản lý</div>
      {NAV_ITEMS.slice(0, 7).map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon" aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      {/* Section: system */}
      <div className="sidebar-section">Hệ thống</div>
      {NAV_ITEMS.slice(7).map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon" aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      {/* Footer */}
      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="icon" aria-hidden="true">👤</span>
          {user?.name || 'Tài khoản'}
        </NavLink>
        <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
          <span className="icon" aria-hidden="true">🚪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
