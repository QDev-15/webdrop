import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface NavLinkItem { to: string; icon: string; label: string; exact?: boolean; badge?: number }
interface MenuSection { section: string; links: NavLinkItem[] }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newBookings, setNewBookings] = useState(0)
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ new_bookings: number; new_contacts: number }>('/stats')
      .then(s => {
        setNewBookings(s.new_bookings ?? 0)
        setNewContacts(s.new_contacts ?? 0)
      })
      .catch(() => {})
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
      links: [
        { to: '/slides', icon: '🖼', label: 'Hero Slides' },
      ],
    },
    {
      section: 'Dịch vụ',
      links: [
        { to: '/service-categories', icon: '📋', label: 'Nhóm dịch vụ' },
        { to: '/services', icon: '🦷', label: 'Dịch vụ nha khoa' },
      ],
    },
    {
      section: 'Đội ngũ bác sĩ',
      links: [
        { to: '/team', icon: '👨‍⚕️', label: 'Bác sĩ' },
      ],
    },
    {
      section: 'Đặt lịch',
      links: [
        { to: '/bookings', icon: '📅', label: 'Đặt lịch khám', badge: newBookings },
      ],
    },
    {
      section: 'Đánh giá',
      links: [
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
      section: 'Media',
      links: [
        { to: '/media', icon: '🗂', label: 'Thư viện ảnh' },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/users', icon: '👤', label: 'Người dùng' },
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">✿</div>
        <div className="sidebar-logo-text">
          <div>Nụ Cười Xưa</div>
          <div className="sidebar-logo-sub">Nha Khoa Retro</div>
        </div>
      </div>

      <nav className="sidebar-nav">
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
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-label">{link.label}</span>
                {link.badge != null && link.badge > 0 && (
                  <span className="sidebar-badge">{link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className="sidebar-link">
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-label">{user?.name ?? 'Admin'}</span>
        </NavLink>
        <button className="sidebar-logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
