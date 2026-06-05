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

interface Stats { contacts_new: number }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(s => setNewContacts(s.contacts_new))
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const menu: MenuSection[] = [
    {
      section: 'Tổng quan',
      links: [{ to: '/', icon: '⊞', label: 'Dashboard', exact: true }],
    },
    {
      section: 'Trang chủ',
      links: [{ to: '/services', icon: '◆', label: 'Dịch vụ' }],
    },
    {
      section: 'Dự án',
      links: [{ to: '/projects', icon: '▣', label: 'Portfolio / Dự án' }],
    },
    {
      section: 'Về chúng tôi',
      links: [
        { to: '/team',         icon: '👥', label: 'Đội ngũ' },
        { to: '/testimonials', icon: '⭐', label: 'Nhận xét KH' },
      ],
    },
    {
      section: 'Nội dung',
      links: [{ to: '/media', icon: '🖼', label: 'Media' }],
    },
    {
      section: 'Liên hệ',
      links: [{ to: '/contacts', icon: '✉', label: 'Brief / Liên hệ', badge: newContacts || undefined }],
    },
    {
      section: 'Hệ thống',
      links: [{ to: '/settings', icon: '⚙', label: 'Cài đặt' }],
    },
  ]

  return (
    <div className="sb">
      <div className="sb-logo">
        NOVA<span>.</span>
        <div className="sb-logo-sub">Admin Panel</div>
      </div>

      {menu.map(section => (
        <div className="sb-section" key={section.section}>
          <div className="sb-section-title">{section.section}</div>
          {section.links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
            >
              <span className="sb-icon">{link.icon}</span>
              <span style={{ flex: 1 }}>{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="sb-badge">{link.badge}</span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sb-footer">
        <NavLink to="/profile" className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`} style={{ marginBottom: '4px' }}>
          <span className="sb-icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </NavLink>
        <button className="sb-logout" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </div>
  )
}
