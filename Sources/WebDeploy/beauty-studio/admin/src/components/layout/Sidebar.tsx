import { useEffect, useState } from 'react'
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
  const [newBookings, setNewBookings]   = useState(0)
  const [newContacts, setNewContacts]   = useState(0)

  useEffect(() => {
    api.get<{ pending_bookings: number; new_contacts: number }>('/stats').then(d => {
      setNewBookings(d.pending_bookings ?? 0)
      setNewContacts(d.new_contacts ?? 0)
    }).catch(() => {})
  }, [])

  const menu: MenuSection[] = [
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
        { to: '/service-categories', icon: '📂', label: 'Danh mục dịch vụ' },
        { to: '/services',           icon: '💄', label: 'Danh sách dịch vụ' },
      ],
    },
    {
      section: 'Đặt lịch',
      links: [
        { to: '/bookings', icon: '📅', label: 'Lịch hẹn', badge: newBookings },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/team',         icon: '👥', label: 'Đội ngũ stylist' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá khách hàng' },
      ],
    },
    {
      section: 'Truyền thông',
      links: [
        { to: '/media', icon: '🗂', label: 'Thư viện ảnh' },
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

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>✦</span>
        Beauty Studio
      </div>

      {menu.map(section => (
        <div key={section.section}>
          <div className="sidebar-section">{section.section}</div>
          {section.links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
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

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">👤</span>
          <span style={{ flex: 1 }}>{user?.name ?? 'Tài khoản'}</span>
        </NavLink>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            marginTop: 4,
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            background: 'rgba(255,255,255,.05)',
            color: 'rgba(255,255,255,.4)',
            fontSize: 13,
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--sans)',
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  )
}
