import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact?: boolean
  badge?: number
}

interface MenuSection {
  section: string
  links: NavLinkItem[]
}

interface Props {
  newBookings?: number
  newContacts?: number
}

export default function Sidebar({ newBookings = 0, newContacts = 0 }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const menuStructure: MenuSection[] = [
    { section: 'Tổng quan', links: [
      { to: '/', icon: '📊', label: 'Bảng điều khiển', exact: true },
    ]},
    { section: 'Nội dung', links: [
      { to: '/services', icon: '🧘', label: 'Các lớp học' },
      { to: '/team', icon: '👥', label: 'Đội ngũ' },
      { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
      { to: '/slides', icon: '🖼️', label: 'Hình ảnh banner' },
    ]},
    { section: 'Vận hành', links: [
      { to: '/bookings', icon: '📅', label: 'Đặt lịch', badge: newBookings },
      { to: '/contacts', icon: '💬', label: 'Liên hệ', badge: newContacts },
      { to: '/media', icon: '🗂️', label: 'Thư viện ảnh' },
    ]},
    { section: 'Hệ thống', links: [
      { to: '/settings', icon: '⚙️', label: 'Cài đặt' },
    ]},
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🧘‍♀️</span> Yoga Admin
      </div>

      <nav>
        {menuStructure.map(sec => (
          <div key={sec.section}>
            <div className="sidebar-section">{sec.section}</div>
            {sec.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="icon">{link.icon}</span>
                {link.label}
                {!!link.badge && <span className="sidebar-badge">{link.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">👤</span>
          {user?.name ?? 'Tài khoản'}
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 12px', margin: '1px 8px', cursor: 'pointer' }}>
          <span className="icon">🚪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
