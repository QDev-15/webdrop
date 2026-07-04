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
    api.get<{ new_bookings: number; new_contacts: number }>('/stats')
      .then(s => {
        setNewBookings(s.new_bookings)
        setNewContacts(s.new_contacts)
      })
      .catch(() => {})
  }, [])

  const menuStructure: MenuSection[] = [
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
        { to: '/service-categories', icon: '📂', label: 'Danh mục dịch vụ' },
        { to: '/services', icon: '🦷', label: 'Dịch vụ' },
      ],
    },
    {
      section: 'Đặt lịch',
      links: [
        { to: '/bookings', icon: '📅', label: 'Lịch hẹn', badge: newBookings },
      ],
    },
    {
      section: 'Đội ngũ',
      links: [
        { to: '/team', icon: '👨‍⚕️', label: 'Bác sĩ' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá khách hàng' },
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
        { to: '/media', icon: '🖼', label: 'Thư viện media' },
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-dot"></span>
          <span>Smile<span style={{ opacity: 0.5, fontWeight: 400 }}>Tech</span></span>
        </div>
        <div className="sidebar-subtitle">Admin Panel</div>
      </div>

      <nav className="sidebar-nav">
        {menuStructure.map(({ section, links }) => (
          <div key={section} className="sidebar-section">
            <div className="sidebar-section-title">{section}</div>
            {links.map(({ to, icon, label, exact, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="sidebar-icon">{icon}</span>
                <span>{label}</span>
                {badge != null && badge > 0 && (
                  <span className="sidebar-badge">{badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="sidebar-icon">👤</span>
          <span>{user?.name ?? 'Profile'}</span>
        </NavLink>
        <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">↩</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
