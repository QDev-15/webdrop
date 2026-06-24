import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'
import { useEffect, useState } from 'react'

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

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newBookings, setNewBookings] = useState(0)
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ new_bookings: number; new_contacts: number }>('/stats')
      .then(d => {
        setNewBookings(d.new_bookings ?? 0)
        setNewContacts(d.new_contacts ?? 0)
      })
      .catch(() => {})
  }, [])

  const menuStructure: MenuSection[] = [
    {
      section: 'Tổng quan',
      links: [{ to: '/', icon: '⊞', label: 'Dashboard', exact: true }],
    },
    {
      section: 'Trang chủ',
      links: [{ to: '/slides', icon: '🖼', label: 'Hero Slides' }],
    },
    {
      section: 'Dịch vụ & Giá',
      links: [
        { to: '/service-categories', icon: '📂', label: 'Danh mục điều trị' },
        { to: '/services', icon: '💉', label: 'Dịch vụ điều trị' },
      ],
    },
    {
      section: 'Đặt lịch',
      links: [
        { to: '/bookings', icon: '📅', label: 'Lịch hẹn', badge: newBookings },
      ],
    },
    {
      section: 'Đội ngũ',
      links: [
        { to: '/team', icon: '👨‍⚕️', label: 'Bác sĩ' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
      ],
    },
    {
      section: 'Liên hệ',
      links: [
        { to: '/contacts', icon: '✉', label: 'Tin nhắn', badge: newContacts },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/media', icon: '🖼', label: 'Thư viện ảnh' },
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  async function handleLogout() {
    await logout().catch(() => {})
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-mark">D</span>
        <span className="sidebar-logo-text">DermaCare<span>Admin</span></span>
      </div>

      <nav className="sidebar-nav">
        {menuStructure.map(({ section, links }) => (
          <div key={section} className="sidebar-section-group">
            <div className="sidebar-section">{section}</div>
            {links.map(({ to, icon, label, exact, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="sidebar-link-icon">{icon}</span>
                <span className="sidebar-link-label">{label}</span>
                {badge != null && badge > 0 && (
                  <span className="sidebar-badge">{badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-footer-user' + (isActive ? ' active' : '')}>
          <div className="sidebar-footer-avatar">
            {(user?.name ?? 'A')[0].toUpperCase()}
          </div>
          <div className="sidebar-footer-info">
            <div className="sidebar-footer-name">{user?.name ?? 'Admin'}</div>
            <div className="sidebar-footer-role">{user?.role === 'superadmin' ? 'Quản trị viên' : 'Nhân viên'}</div>
          </div>
        </NavLink>
        <button className="sidebar-logout-btn" onClick={handleLogout} title="Đăng xuất">
          ↩
        </button>
      </div>
    </aside>
  )
}
