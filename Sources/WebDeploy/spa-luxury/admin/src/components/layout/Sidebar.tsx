import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact?: boolean
  badge?: number
}

const NAV_SECTIONS: { title: string; items: NavLinkItem[] }[] = [
  {
    title: 'Tổng quan',
    items: [
      { to: '/', icon: '📊', label: 'Tổng quan', exact: true },
    ],
  },
  {
    title: 'Nội dung',
    items: [
      { to: '/service-categories', icon: '🗂️', label: 'Danh mục dịch vụ' },
      { to: '/services', icon: '💆', label: 'Danh sách dịch vụ' },
      { to: '/testimonials', icon: '⭐', label: 'Đánh giá khách hàng' },
      { to: '/team', icon: '👥', label: 'Đội ngũ' },
      { to: '/slides', icon: '🖼️', label: 'Hero Slides' },
    ],
  },
  {
    title: 'Quản lý',
    items: [
      { to: '/bookings', icon: '📅', label: 'Đặt gói dịch vụ' },
      { to: '/contacts', icon: '✉️', label: 'Liên hệ' },
      { to: '/media', icon: '🖼', label: 'Thư viện ảnh' },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { to: '/settings', icon: '⚙️', label: 'Cài đặt' },
      { to: '/profile', icon: '👤', label: 'Tài khoản' },
    ],
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <span>✦</span>
        Spa Luxury Admin
      </div>

      {NAV_SECTIONS.map(section => (
        <div key={section.title}>
          <div className="sidebar-section">{section.title}</div>
          {section.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div style={{ padding: '8px 12px', fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.name}
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <span className="icon">🚪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
