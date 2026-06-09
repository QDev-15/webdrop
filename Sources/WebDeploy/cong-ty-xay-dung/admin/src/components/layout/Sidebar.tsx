import { NavLink } from 'react-router-dom'
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
  const { user } = useAuth()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ new_contacts: number }>('/stats')
      .then(d => setNewContacts(d.new_contacts ?? 0))
      .catch(() => {})
  }, [])

  const menuStructure: MenuSection[] = [
    {
      section: 'Tổng quan',
      links: [
        { to: '/', icon: '⊞', label: 'Dashboard', exact: true },
      ]
    },
    {
      section: 'Trang chủ',
      links: [
        { to: '/slides', icon: '🖼', label: 'Hero Slides' },
      ]
    },
    {
      section: 'Dịch vụ & Dự án',
      links: [
        { to: '/services', icon: '🏗', label: 'Dịch vụ' },
        { to: '/projects', icon: '🏢', label: 'Dự án' },
      ]
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
        { to: '/media', icon: '📸', label: 'Thư viện Media' },
      ]
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts },
      ]
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/users', icon: '👥', label: 'Người dùng' },
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ]
    },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🏗</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Xây Dựng</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 400 }}>Admin Panel</div>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
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
                {(link.badge ?? 0) > 0 && (
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
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
