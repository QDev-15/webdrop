import { NavLink } from 'react-router-dom'
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

interface Stats {
  new_contacts?: number
  pending_reservations?: number
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<Stats>({})

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
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
      section: 'Thực đơn',
      links: [
        { to: '/menu-categories', icon: '📂', label: 'Danh mục' },
        { to: '/menu-items', icon: '🍽', label: 'Món ăn' },
      ],
    },
    {
      section: 'Đặt bàn',
      links: [
        { to: '/reservations', icon: '📅', label: 'Đặt bàn', badge: stats.pending_reservations },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/gallery', icon: '🖼', label: 'Thư viện ảnh' },
        { to: '/testimonials', icon: '⭐', label: 'Đánh giá' },
        { to: '/media', icon: '📸', label: 'Media' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: stats.new_contacts },
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
        <span>🌿</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>Lá Xanh Chay</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)' }}>Admin Panel</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {menuStructure.map(section => (
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
                {link.badge != null && link.badge > 0 && (
                  <span className="sidebar-badge">{link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
        </NavLink>
        <button
          onClick={logout}
          style={{ width: '100%', marginTop: '4px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '7px 12px', borderRadius: '8px', color: 'rgba(255,255,255,.35)', fontSize: '12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all .15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}
        >
          <span>🚪</span> Đăng xuất
        </button>
      </div>
    </div>
  )
}
