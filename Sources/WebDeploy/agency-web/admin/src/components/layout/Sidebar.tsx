import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Stats { contacts_new: number }

const menu = [
  {
    section: 'Tổng quan',
    links: [
      { to: '/', icon: '⊞', label: 'Dashboard', exact: true },
    ],
  },
  {
    section: 'Trang chủ',
    links: [
      { to: '/slides',  icon: '🖼', label: 'Hero Slides' },
    ],
  },
  {
    section: 'Dịch vụ',
    links: [
      { to: '/services', icon: '🛠', label: 'Dịch vụ' },
    ],
  },
  {
    section: 'Dự án',
    links: [
      { to: '/projects', icon: '📁', label: 'Dự án / Portfolio' },
    ],
  },
  {
    section: 'Về chúng tôi',
    links: [
      { to: '/team',         icon: '👥', label: 'Đội ngũ' },
      { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
    ],
  },
  {
    section: 'Nội dung',
    links: [
      { to: '/posts', icon: '📝', label: 'Bài viết / Blog' },
      { to: '/media', icon: '📸', label: 'Media Library' },
    ],
  },
  {
    section: 'Khách hàng',
    links: [
      { to: '/contacts', icon: '✉', label: 'Liên hệ', badgeKey: 'contacts_new' },
    ],
  },
  {
    section: 'Hệ thống',
    links: [
      { to: '/settings', icon: '⚙', label: 'Cài đặt' },
    ],
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<Stats>('/stats').then(s => setNewContacts(s.contacts_new)).catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sb">
      <div className="sb-logo">
        Agency<span>WEB</span>
        <div className="sb-logo-sub">Admin Panel</div>
      </div>

      <nav style={{ flex: 1 }}>
        {menu.map(section => (
          <div key={section.section} className="sb-section">
            <div className="sb-section-title">{section.section}</div>
            {section.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={'exact' in link ? link.exact : false}
                className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
              >
                <span className="sb-icon">{link.icon}</span>
                {link.label}
                {'badgeKey' in link && link.badgeKey === 'contacts_new' && newContacts > 0 && (
                  <span className="sb-badge">{newContacts}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-footer">
        {user && (
          <div className="sb-user">
            <div className="sb-avatar">{user.name[0]?.toUpperCase()}</div>
            <div>
              <div className="sb-user-name">{user.name}</div>
              <div className="sb-user-role">{user.role}</div>
            </div>
          </div>
        )}
        <button className="sb-logout" onClick={handleLogout}>
          ← Đăng xuất
        </button>
      </div>
    </aside>
  )
}
