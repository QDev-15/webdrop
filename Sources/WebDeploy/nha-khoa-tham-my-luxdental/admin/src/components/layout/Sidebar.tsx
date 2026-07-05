import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact?: boolean
  badge?: number
}

export default function Sidebar() {
  const { user, logout } = useAuth()

  const mainLinks: NavLinkItem[] = [
    { to: '/', icon: '🏠', label: 'Tổng quan', exact: true },
  ]

  const contentLinks: NavLinkItem[] = [
    { to: '/services', icon: '💎', label: 'Dịch vụ' },
    { to: '/service-categories', icon: '📂', label: 'Nhóm dịch vụ' },
    { to: '/team', icon: '👨‍⚕️', label: 'Đội ngũ bác sĩ' },
    { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
    { to: '/slides', icon: '🖼️', label: 'Hero Slides' },
  ]

  const inquiryLinks: NavLinkItem[] = [
    { to: '/bookings', icon: '📅', label: 'Đặt lịch' },
    { to: '/contacts', icon: '✉️', label: 'Liên hệ' },
  ]

  const systemLinks: NavLinkItem[] = [
    { to: '/media', icon: '📁', label: 'Thư viện ảnh' },
    { to: '/settings', icon: '⚙️', label: 'Cài đặt' },
    { to: '/profile', icon: '👤', label: 'Hồ sơ' },
  ]

  const renderLink = (item: NavLinkItem) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.exact}
      className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
    >
      <span className="icon">{item.icon}</span>
      {item.label}
      {item.badge ? <span className="sidebar-badge">{item.badge}</span> : null}
    </NavLink>
  )

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>L</span>
        <span>LuxDental Admin</span>
      </div>

      <div className="sidebar-section">Tổng quan</div>
      {mainLinks.map(renderLink)}

      <div className="sidebar-section">Nội dung</div>
      {contentLinks.map(renderLink)}

      <div className="sidebar-section">Tiếp nhận</div>
      {inquiryLinks.map(renderLink)}

      <div className="sidebar-section">Hệ thống</div>
      {systemLinks.map(renderLink)}

      <div className="sidebar-footer">
        <div style={{ padding: '4px 12px', fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>
          {user?.name}
        </div>
        <button
          className="sidebar-link"
          style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent' }}
          onClick={() => logout()}
        >
          <span className="icon">🚪</span>
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
