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
  const [newContacts, setNewContacts] = useState(0)
  const [newReservations, setNewReservations] = useState(0)

  useEffect(() => {
    api.get<{ contacts_new: number; reservations_pending: number }>('/stats')
      .then(data => {
        setNewContacts(data.contacts_new)
        setNewReservations(data.reservations_pending)
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
      section: 'Thực đơn',
      links: [
        { to: '/menu-categories', icon: '📂', label: 'Danh mục' },
        { to: '/menu-items', icon: '☕', label: 'Món & Đồ uống' },
      ],
    },
    {
      section: 'Đặt chỗ',
      links: [
        { to: '/reservations', icon: '📅', label: 'Đặt chỗ', badge: newReservations || undefined },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/gallery', icon: '🖼', label: 'Gallery ảnh' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
        { to: '/media', icon: '📸', label: 'Media' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts || undefined },
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
        <span>☕</span> Thời Gian <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '11px' }}>Admin</span>
      </div>

      {menu.map(section => (
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
          style={{ marginBottom: '4px' }}
        >
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{user?.name}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.4)', fontSize: '13px' }}
        >
          <span className="icon">↩</span> Đăng xuất
        </button>
      </div>
    </div>
  )
}
