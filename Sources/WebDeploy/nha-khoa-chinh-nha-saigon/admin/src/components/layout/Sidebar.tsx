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
      section: 'Tong quan',
      links: [{ to: '/', icon: '⊞', label: 'Dashboard', exact: true }],
    },
    {
      section: 'Trang chu',
      links: [
        { to: '/slides', icon: '🖼', label: 'Hero Slides' },
      ],
    },
    {
      section: 'Dich vu',
      links: [
        { to: '/services', icon: '🦷', label: 'Dich vu nieng rang' },
      ],
    },
    {
      section: 'Doi ngu',
      links: [
        { to: '/team', icon: '👨‍⚕️', label: 'Bac si chuyen khoa' },
      ],
    },
    {
      section: 'Dat lich',
      links: [
        { to: '/bookings', icon: '📅', label: 'Dat lich tu van', badge: newBookings },
      ],
    },
    {
      section: 'Danh gia',
      links: [
        { to: '/testimonials', icon: '⭐', label: 'Danh gia khach hang' },
      ],
    },
    {
      section: 'Khach hang',
      links: [
        { to: '/contacts', icon: '✉', label: 'Lien he', badge: newContacts },
      ],
    },
    {
      section: 'Media',
      links: [
        { to: '/media', icon: '🗂', label: 'Thu vien anh' },
      ],
    },
    {
      section: 'He thong',
      links: [
        { to: '/users', icon: '👤', label: 'Nguoi dung' },
        { to: '/settings', icon: '⚙', label: 'Cai dat' },
      ],
    },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">+</div>
        <div className="sidebar-logo-text">
          <div>Chinh Nha</div>
          <div className="sidebar-logo-sub">Sai Gon</div>
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
          Dang xuat
        </button>
      </div>
    </div>
  )
}
