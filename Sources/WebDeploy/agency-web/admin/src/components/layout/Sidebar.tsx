import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

// ⚠️  PHẢI khai báo interface rõ ràng — tránh TS2339 "Property 'exact' does not exist"
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
      .then(s => setNewContacts(s.new_contacts))
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
      ],
    },
    {
      section: 'Dịch vụ',
      links: [
        { to: '/services', icon: '⚡', label: 'Dịch vụ' },
        { to: '/pricing',  icon: '💰', label: 'Bảng giá' },
        { to: '/faqs',     icon: '❓', label: 'FAQ' },
      ],
    },
    {
      section: 'Dự án',
      links: [
        { to: '/projects', icon: '💼', label: 'Dự án / Portfolio' },
      ],
    },
    {
      section: 'Về chúng tôi',
      links: [
        { to: '/team', icon: '👥', label: 'Đội ngũ' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: '✉️', label: 'Liên hệ', badge: newContacts > 0 ? newContacts : undefined },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/media',    icon: '📸', label: 'Media' },
        { to: '/users',    icon: '👤', label: 'Tài khoản' },
        { to: '/settings', icon: '⚙️', label: 'Cài đặt' },
      ],
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-logo">
          Agency<span>Web</span>
        </a>
        <div className="sidebar-logo-sub">Quản trị nội dung</div>
      </div>

      <nav className="sidebar-nav">
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
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="sidebar-badge">{link.badge > 99 ? '99+' : link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{user?.name}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', marginTop: '4px', cursor: 'pointer', background: 'transparent', border: 'none', textAlign: 'left' }}>
          <span className="icon">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
