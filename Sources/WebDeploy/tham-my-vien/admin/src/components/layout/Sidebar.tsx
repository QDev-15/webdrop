import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact?: boolean
  badge?: number
}

interface Props {
  newBookings?: number
  newContacts?: number
}

export default function Sidebar({ newBookings = 0, newContacts = 0 }: Props) {
  const { user, logout } = useAuth()

  const nav: NavLinkItem[] = [
    { to: '/', icon: '⊞', label: 'Tổng quan', exact: true },
  ]

  const serviceNav: NavLinkItem[] = [
    { to: '/services', icon: '✦', label: 'Dịch vụ' },
    { to: '/service-categories', icon: '⊞', label: 'Danh mục dịch vụ' },
  ]

  const bookingNav: NavLinkItem[] = [
    { to: '/bookings', icon: '📅', label: 'Đặt lịch', badge: newBookings },
  ]

  const teamNav: NavLinkItem[] = [
    { to: '/team', icon: '👨‍⚕️', label: 'Đội ngũ bác sĩ' },
    { to: '/testimonials', icon: '★', label: 'Đánh giá' },
  ]

  const siteNav: NavLinkItem[] = [
    { to: '/slides', icon: '🖼', label: 'Hero Slides' },
    { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts },
    { to: '/media', icon: '🗂', label: 'Thư viện media' },
    { to: '/settings', icon: '⚙', label: 'Cài đặt' },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>✦</span>
        Thẩm Mỹ Viện
      </div>

      <NavSection title="Tổng quan" items={nav} />
      <NavSection title="Dịch vụ" items={serviceNav} />
      <NavSection title="Đặt lịch" items={bookingNav} />
      <NavSection title="Đội ngũ & Đánh giá" items={teamNav} />
      <NavSection title="Website" items={siteNav} />

      <div className="sidebar-footer">
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 8, paddingLeft: 4 }}>
          {user?.name}
        </div>
        <NavLink to="/profile" style={{ textDecoration: 'none' }}>
          <div className="sidebar-link">
            <span className="icon">👤</span>
            Hồ sơ
          </div>
        </NavLink>
        <button
          onClick={logout}
          className="sidebar-link"
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="icon">↩</span>
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

function NavSection({ title, items }: { title: string; items: NavLinkItem[] }) {
  return (
    <>
      <div className="sidebar-section">{title}</div>
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon">{item.icon}</span>
          {item.label}
          {(item.badge ?? 0) > 0 && (
            <span className="sidebar-badge">{item.badge}</span>
          )}
        </NavLink>
      ))}
    </>
  )
}
