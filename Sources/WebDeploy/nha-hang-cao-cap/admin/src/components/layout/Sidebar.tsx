import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState, useEffect } from 'react'
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
  const [newContacts, setNewContacts] = useState(0)
  const [pendingReservations, setPendingReservations] = useState(0)

  useEffect(() => {
    api.get<{ contacts_new: number; reservations_pending: number }>('/stats')
      .then(s => {
        setNewContacts(s.contacts_new ?? 0)
        setPendingReservations(s.reservations_pending ?? 0)
      })
      .catch(() => {})
  }, [])

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
        { to: '/gallery', icon: '📸', label: 'Thư viện ảnh' },
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
        { to: '/reservations', icon: '📅', label: 'Đặt bàn', badge: pendingReservations },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
        { to: '/media', icon: '🗂', label: 'Media' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🍴</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-.2px' }}>Fine Dining</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 400 }}>Admin Panel</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {menuStructure.map(section => (
          <div key={section.section}>
            <div className="sidebar-section">{section.section}</div>
            {section.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="icon">{link.icon}</span>
                <span style={{ flex: 1 }}>{link.label}</span>
                {link.badge != null && link.badge > 0 && (
                  <span className="sidebar-badge">{link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </NavLink>
        <button
          onClick={logout}
          className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2 }}
        >
          <span className="icon">↩</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
