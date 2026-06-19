import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
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
      .then(d => setNewContacts(d.new_contacts))
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
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
        { to: '/menu-items', icon: '🍜', label: 'Món ăn' },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
        { to: '/gallery', icon: '📷', label: 'Thư viện ảnh' },
        { to: '/media', icon: '📸', label: 'Media' },
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
        <span>🍜</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Quán Ăn</div>
          <div style={{ fontSize: 11, color: '#d97706', fontWeight: 400 }}>Phở Bình Dân</div>
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
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', marginTop: 4 }}
        >
          <span className="icon">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
