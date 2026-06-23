import { NavLink } from 'react-router-dom'
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

interface SidebarProps {
  newContacts?: number
  pendingReservations?: number
}

export default function Sidebar({ newContacts = 0, pendingReservations = 0 }: SidebarProps) {
  const { user } = useAuth()

  const menuStructure: MenuSection[] = [
    {
      section: 'Tổng quan',
      links: [
        { to: '/', icon: '⊞', label: 'Dashboard', exact: true },
      ],
    },
    {
      section: 'Trang chủ',
      links: [
        { to: '/slides', icon: '🖼', label: 'Hero Slides' },
      ],
    },
    {
      section: 'Thực đơn',
      links: [
        { to: '/menu-categories', icon: '📂', label: 'Danh mục' },
        { to: '/menu-items', icon: '🥩', label: 'Món ăn' },
      ],
    },
    {
      section: 'Đặt bàn',
      links: [
        { to: '/reservations', icon: '📅', label: 'Đặt bàn', badge: pendingReservations },
      ],
    },
    {
      section: 'Không gian',
      links: [
        { to: '/gallery', icon: '🖼', label: 'Thư viện ảnh' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
        { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/media', icon: '🗂', label: 'Media' },
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🔥</span>
        <span>BBQ <strong>Admin</strong></span>
      </div>

      <nav className="sidebar-nav">
        {menuStructure.map(section => (
          <div key={section.section} className="sidebar-section-block">
            <div className="sidebar-section">{section.section}</div>
            {section.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span className="sidebar-link-label">{link.label}</span>
                {link.badge != null && link.badge > 0 && (
                  <span className="sidebar-badge">{link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-profile' + (isActive ? ' active' : '')}>
          <div className="sidebar-avatar">{(user?.name ?? 'A')[0].toUpperCase()}</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{user?.name ?? 'Admin'}</div>
            <div className="sidebar-profile-role">{user?.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}</div>
          </div>
        </NavLink>
      </div>
    </div>
  )
}
