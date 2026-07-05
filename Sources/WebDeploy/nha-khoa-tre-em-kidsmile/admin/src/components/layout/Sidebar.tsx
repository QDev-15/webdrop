import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  to: string
  icon: string
  label: string
  end?: boolean
}

const NAV_MAIN: NavLinkItem[] = [
  { to: '/', icon: '📊', label: 'Tổng quan', end: true },
  { to: '/bookings', icon: '📅', label: 'Đặt lịch khám' },
  { to: '/services', icon: '🦷', label: 'Dịch vụ' },
  { to: '/team', icon: '👨‍⚕️', label: 'Bác sĩ' },
  { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
  { to: '/articles', icon: '📚', label: 'Cẩm nang cha mẹ' },
  { to: '/contacts', icon: '✉️', label: 'Liên hệ' },
]

const NAV_SYSTEM: NavLinkItem[] = [
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
      <div className="sidebar-logo">
        <span aria-hidden="true">🦷</span>
        KidSmile Admin
      </div>

      <div className="sidebar-section">Quản lý</div>
      {NAV_MAIN.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon" aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      <div className="sidebar-section">Hệ thống</div>
      {NAV_SYSTEM.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon" aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="icon" aria-hidden="true">👤</span>
          {user?.name || 'Tài khoản'}
        </NavLink>
        <button
          className="sidebar-link"
          onClick={handleLogout}
          style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="icon" aria-hidden="true">🚪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
