import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

// ⚠️ BẮT BUỘC khai báo interface — TypeScript infer union type từ array sẽ báo lỗi TS2339
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
  const { user } = useAuth()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ new_contacts: number }>('/stats')
      .then(d => setNewContacts(d.new_contacts))
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
      section: 'Dự án',
      links: [
        { to: '/projects', icon: '🗂', label: 'Dự án' },
      ],
    },
    {
      section: 'Dịch vụ',
      links: [
        { to: '/services', icon: '⚡', label: 'Dịch vụ' },
        { to: '/pricing', icon: '💰', label: 'Bảng giá' },
        { to: '/faqs', icon: '❓', label: 'FAQ' },
      ],
    },
    {
      section: 'Đội ngũ & Đánh giá',
      links: [
        { to: '/team', icon: '👥', label: 'Đội ngũ' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
      ],
    },
    {
      section: 'Media & Tài nguyên',
      links: [
        { to: '/media', icon: '📸', label: 'Media' },
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

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <span>◆</span>
        Agency Admin
      </div>

      {menuStructure.map((section) => (
        <div key={section.section}>
          <div className="sidebar-section">{section.section}</div>
          {section.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="icon">{link.icon}</span>
              {link.label}
              {(link.badge ?? 0) > 0 && (
                <span className="sidebar-badge">{link.badge}</span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{user?.name}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
