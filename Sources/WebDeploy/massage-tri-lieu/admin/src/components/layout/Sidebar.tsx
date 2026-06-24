import { NavLink, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [newBookings, setNewBookings] = useState(0)
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ new_bookings: number; new_contacts: number }>('/stats').then(d => {
      setNewBookings(d.new_bookings ?? 0)
      setNewContacts(d.new_contacts ?? 0)
    }).catch(() => {})
  }, [])

  const handleLogout = async () => {
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
      links: [{ to: '/slides', icon: '🖼', label: 'Hero Slides' }],
    },
    {
      section: 'Dịch vụ',
      links: [
        { to: '/service-categories', icon: '📂', label: 'Danh mục' },
        { to: '/services', icon: '💆', label: 'Dịch vụ' },
      ],
    },
    {
      section: 'Đặt lịch',
      links: [
        { to: '/bookings', icon: '📅', label: 'Đặt lịch', badge: newBookings || undefined },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
        { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts || undefined },
      ],
    },
    {
      section: 'Đội ngũ',
      links: [{ to: '/team', icon: '👥', label: 'Chuyên viên' }],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/media', icon: '📁', label: 'Thư viện ảnh' },
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>💆</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Tam Thu Massage</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', fontWeight: 400 }}>Quản trị viên</div>
        </div>
      </div>

      {menu.map((section) => (
        <div key={section.section}>
          <div className="sidebar-section">{section.section}</div>
          {section.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
            >
              <span className="icon">{link.icon}</span>
              <span>{link.label}</span>
              {link.badge != null && link.badge > 0 && (
                <span className="sidebar-badge">{link.badge}</span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">👤</span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Hồ sơ'}
          </span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <span className="icon">↩</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
