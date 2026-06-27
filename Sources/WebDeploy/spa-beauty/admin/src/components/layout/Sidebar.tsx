import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem { to: string; icon: string; label: string; exact?: boolean; badge?: number }
interface MenuSection { section: string; links: NavLinkItem[] }

interface Props { newBookings?: number; newContacts?: number }

export default function Sidebar({ newBookings = 0, newContacts = 0 }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const menuStructure: MenuSection[] = [
    { section: 'Tổng quan', links: [
      { to: '/', icon: '⊞', label: 'Dashboard', exact: true },
    ]},
    { section: 'Trang chủ', links: [
      { to: '/slides', icon: '🖼', label: 'Hero Slides' },
    ]},
    { section: 'Dịch vụ', links: [
      { to: '/service-categories', icon: '📂', label: 'Danh mục dịch vụ' },
      { to: '/services',           icon: '💆', label: 'Dịch vụ' },
    ]},
    { section: 'Đặt lịch', links: [
      { to: '/bookings', icon: '📅', label: 'Lịch hẹn', badge: newBookings },
    ]},
    { section: 'Nội dung', links: [
      { to: '/testimonials', icon: '⭐', label: 'Đánh giá khách hàng' },
      { to: '/team',         icon: '👩', label: 'Đội ngũ chuyên viên' },
    ]},
    { section: 'Khách hàng', links: [
      { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts },
    ]},
    { section: 'Media', links: [
      { to: '/media', icon: '📁', label: 'Thư viện ảnh' },
    ]},
    { section: 'Hệ thống', links: [
      { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      { to: '/users',    icon: '👤', label: 'Tài khoản' },
    ]},
  ]

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🌿</span>
        <span>Bella Spa Admin</span>
      </div>

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

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">👤</span>
          <span style={{ fontSize: 12 }}>{user?.name ?? 'Tài khoản'}</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
        >
          <span className="icon">🚪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
