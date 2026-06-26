import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact?: boolean
  badge?: number
}

const navItems: NavLinkItem[] = [
  { to: '/', icon: '📊', label: 'Tổng quan', exact: true },
]

const contentItems: NavLinkItem[] = [
  { to: '/hero-slides',  icon: '🖼️',  label: 'Hero Slides' },
  { to: '/services',     icon: '🧘',  label: 'Lớp học' },
  { to: '/team',         icon: '👥',  label: 'Huấn luyện viên' },
  { to: '/testimonials', icon: '⭐',  label: 'Đánh giá' },
]

const operationItems: NavLinkItem[] = [
  { to: '/bookings',  icon: '📅', label: 'Đăng ký lớp' },
  { to: '/contacts',  icon: '✉️', label: 'Liên hệ' },
  { to: '/media',     icon: '📂', label: 'Media' },
]

const systemItems: NavLinkItem[] = [
  { to: '/settings',            icon: '⚙️', label: 'Cài đặt' },
  { to: '/service-categories',  icon: '🏷️', label: 'Danh mục lớp' },
]

function SLink({ item }: { item: NavLinkItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.exact}
      className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
    >
      <span className="icon">{item.icon}</span>
      {item.label}
      {item.badge ? <span className="sidebar-badge">{item.badge}</span> : null}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🧘</span> Pilates Admin
      </div>

      {navItems.map(i => <SLink key={i.to} item={i} />)}

      <div className="sidebar-section">Nội dung</div>
      {contentItems.map(i => <SLink key={i.to} item={i} />)}

      <div className="sidebar-section">Vận hành</div>
      {operationItems.map(i => <SLink key={i.to} item={i} />)}

      <div className="sidebar-section">Hệ thống</div>
      {systemItems.map(i => <SLink key={i.to} item={i} />)}

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">👤</span>
          {user?.name ?? 'Hồ sơ'}
        </NavLink>
        <button
          onClick={logout}
          style={{ width: '100%', marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,.4)' }}
        >
          <span className="icon">🚪</span> Đăng xuất
        </button>
      </div>
    </div>
  )
}
