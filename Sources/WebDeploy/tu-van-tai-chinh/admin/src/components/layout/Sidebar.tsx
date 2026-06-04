import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Stats { new_contacts?: number }

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact?: boolean
  badge?: number
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<Stats>('/stats').then(s => setNewContacts(s.new_contacts ?? 0)).catch(() => {})
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const menu: { section: string; links: NavLinkItem[] }[] = [
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
        { to: '/services', icon: '💼', label: 'Dịch vụ tư vấn' },
      ],
    },
    {
      section: 'Đội ngũ',
      links: [
        { to: '/team', icon: '👥', label: 'Chuyên gia' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: '✉', label: 'Liên hệ & Đặt lịch', badge: newContacts },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/media', icon: '📸', label: 'Media' },
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
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
          </svg>
        </div>
        <span className="sidebar-logo-text">Viet<span>Finance</span></span>
      </div>

      <nav className="sidebar-nav">
        {menu.map(section => (
          <div key={section.section} className="sidebar-section">
            <div className="sidebar-section-label">{section.section}</div>
            {section.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="icon">{link.icon}</span>
                <span>{link.label}</span>
                {link.badge ? <span className="badge">{link.badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} style={{ marginBottom: '2px' }}>
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{user?.name}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span className="icon">⏏</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
