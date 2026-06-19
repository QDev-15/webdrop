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

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [newContacts, setNewContacts] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)

  useEffect(() => {
    api.get<{ new_contacts: number; pending_orders: number }>('/stats')
      .then(d => {
        setNewContacts(d.new_contacts ?? 0)
        setPendingOrders(d.pending_orders ?? 0)
      })
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
      section: 'Sản phẩm',
      links: [
        { to: '/product-categories', icon: '📂', label: 'Danh mục bánh' },
        { to: '/products', icon: '🎂', label: 'Sản phẩm bánh' },
      ],
    },
    {
      section: 'Đặt bánh',
      links: [
        { to: '/orders', icon: '📋', label: 'Đơn đặt bánh', badge: pendingOrders },
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
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: 22 }}>🎂</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#fff', letterSpacing: '-.2px' }}>La Douceur</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginTop: 1 }}>Patisserie Admin</div>
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
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </NavLink>
        <button
          onClick={logout}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', cursor: 'pointer', padding: '8px', borderRadius: 8, fontSize: 16, transition: 'color .15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.3)')}
          title="Đăng xuất"
        >
          ⎋
        </button>
      </div>
    </div>
  )
}
