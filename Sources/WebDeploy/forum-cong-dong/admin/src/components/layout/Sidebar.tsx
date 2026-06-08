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
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ new_contacts: number }>('/stats')
      .then(d => setNewContacts(d.new_contacts ?? 0))
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuStructure: MenuSection[] = [
    {
      section: 'Tổng quan',
      links: [
        { to: '/', icon: 'grid', label: 'Dashboard', exact: true },
      ],
    },
    {
      section: 'Diễn đàn',
      links: [
        { to: '/forum-categories', icon: 'folder', label: 'Danh mục' },
        { to: '/forum-threads', icon: 'message-square', label: 'Chủ đề bài viết' },
        { to: '/forum-tags', icon: 'tag', label: 'Tags' },
      ],
    },
    {
      section: 'Trang chủ',
      links: [
        { to: '/slides', icon: 'image', label: 'Hero Slides' },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/media', icon: 'camera', label: 'Media' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: 'mail', label: 'Liên hệ', badge: newContacts > 0 ? newContacts : undefined },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/settings', icon: 'settings', label: 'Cài đặt' },
      ],
    },
  ]

  const icons: Record<string, string> = {
    grid: '⊞', folder: '📂', 'message-square': '💬', tag: '🏷',
    image: '🖼', camera: '📸', mail: '✉', settings: '⚙',
  }

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>.</span> Forum<span style={{ color: 'rgba(255,255,255,.4)', fontWeight: 400 }}>Admin</span>
      </div>

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
              <span className="icon">{icons[link.icon] ?? '•'}</span>
              <span style={{ flex: 1 }}>{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="sidebar-badge">{link.badge}</span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', marginTop: '4px' }}
        >
          <span className="icon">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
