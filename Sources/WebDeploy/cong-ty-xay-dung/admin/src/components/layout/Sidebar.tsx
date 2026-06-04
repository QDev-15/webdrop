import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Stats {
  new_contacts: number
}

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact: boolean
  badge: number
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<Stats>('/stats').then(s => setNewContacts(s.new_contacts || 0)).catch(() => { })
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuStructure: { section: string; links: NavLinkItem[] }[] = [
    {
      section: 'Tổng quan',
      links: [
        { to: '/', icon: '⊞', label: 'Dashboard', exact: true, badge: 0 },
      ],
    },
    {
      section: 'Trang chủ',
      links: [
        { to: '/settings', icon: '⚙', label: 'Cài đặt & Hero', exact: true, badge: 0 },
      ],
    },
    {
      section: 'Dịch vụ',
      links: [
        { to: '/services', icon: '🔨', label: 'Dịch vụ', exact: true, badge: 0 },
      ],
    },
    {
      section: 'Dự án',
      links: [
        { to: '/projects', icon: '🏗', label: 'Công trình / Dự án', exact: true, badge: 0 },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá KH', exact: true, badge: 0 },
        { to: '/media', icon: '🖼', label: 'Media', exact: true, badge: 0 },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: '✉', label: 'Yêu cầu báo giá', badge: newContacts, exact: true },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/settings', icon: '⚙', label: 'Cài đặt chung', exact: true, badge: 0 },
      ],
    },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 21V9l9-6 9 6v12H3zM9 21V12h6v9" />
          </svg>
        </div>
        <div className="sidebar-logo-text">
          XÂY DỰNG<br /><span>ADMIN</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Admin menu">
        {menuStructure.map(section => (
          <div className="sidebar-section" key={section.section}>
            <span className="sidebar-section-label">{section.section}</span>
            {section.links.map(link => (
              <NavLink
                key={link.to + link.label}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span>{link.label}</span>
                {(link.badge ?? 0) > 0 && (
                  <span className="sidebar-badge">{link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <span className="sidebar-user-name">{user?.name || 'Admin'}</span>
        <button className="sidebar-logout-btn" onClick={handleLogout} aria-label="Đăng xuất" title="Đăng xuất">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  )
}
