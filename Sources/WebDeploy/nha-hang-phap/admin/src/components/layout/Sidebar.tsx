import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

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
  const [pendingRes, setPendingRes] = useState(0)
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ pending_reservations: number; new_contacts: number }>('/stats')
      .then(d => {
        setPendingRes(d.pending_reservations ?? 0)
        setNewContacts(d.new_contacts ?? 0)
      })
      .catch(() => {/* ignore */})
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

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
        { to: '/menu-items', icon: '🍽', label: 'Món ăn' },
      ],
    },
    {
      section: 'Đặt bàn',
      links: [
        { to: '/reservations', icon: '📅', label: 'Đặt bàn', badge: pendingRes > 0 ? pendingRes : undefined },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/gallery', icon: '📸', label: 'Thư viện ảnh' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts > 0 ? newContacts : undefined },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/media', icon: '📁', label: 'Media' },
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">Le Bistro</div>
        <div className="sidebar-logo-sub">Admin Panel</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuStructure.map(group => (
          <div key={group.section} className="sidebar-section-wrap">
            <div className="sidebar-section">{group.section}</div>
            {group.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span className="sidebar-link-label">{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="sidebar-badge">{link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-user' + (isActive ? ' active' : '')}>
          <div className="sidebar-user-avatar">{(user?.name ?? 'A')[0].toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name ?? ''}</div>
            <div className="sidebar-user-role">{user?.role === 'superadmin' ? 'Super Admin' : 'Quản trị viên'}</div>
          </div>
        </NavLink>
        <button className="sidebar-logout" onClick={handleLogout} title="Đăng xuất">
          ⏻
        </button>
      </div>
    </div>
  )
}
