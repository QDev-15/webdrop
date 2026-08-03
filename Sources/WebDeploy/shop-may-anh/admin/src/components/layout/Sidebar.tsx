import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface NavLinkItem { to: string; icon: string; label: string; exact?: boolean; badge?: number }
interface MenuSection { section: string; links: NavLinkItem[] }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newContacts, setNewContacts] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)

  useEffect(() => {
    api.get<{ new_contacts: number; pending_orders: number }>('/stats')
      .then(r => {
        if (r.new_contacts) setNewContacts(r.new_contacts)
        if (r.pending_orders) setPendingOrders(r.pending_orders)
      })
      .catch(() => {})
  }, [])

  const menuStructure: MenuSection[] = [
    { section: 'Tổng quan', links: [{ to: '/', icon: '⊞', label: 'Dashboard', exact: true }] },
    { section: 'Trang chủ', links: [{ to: '/slides', icon: '🖼', label: 'Hero Slides' }] },
    {
      section: 'Sản phẩm',
      links: [
        { to: '/product-categories', icon: '📂', label: 'Danh mục' },
        { to: '/products', icon: '📷', label: 'Sản phẩm' },
      ],
    },
    {
      section: 'Đơn hàng',
      links: [
        { to: '/orders', icon: '🧾', label: 'Đơn hàng', badge: pendingOrders },
        { to: '/coupons', icon: '🏷', label: 'Phiếu giảm giá' },
      ],
    },
    { section: 'Khách hàng', links: [{ to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts }] },
    { section: 'Phương tiện', links: [{ to: '/media', icon: '🖼', label: 'Thư viện ảnh' }] },
    { section: 'Hệ thống', links: [{ to: '/settings', icon: '⚙', label: 'Cài đặt' }] },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">📷</span>
          <span>PhotoPro Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuStructure.map(({ section, links }) => (
          <div key={section} className="sidebar-section-wrap">
            <div className="sidebar-section">{section}</div>
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-label">{link.label}</span>
                {link.badge ? <span className="sidebar-badge">{link.badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-profile' + (isActive ? ' active' : '')}>
          <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() ?? 'A'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</div>
          </div>
        </NavLink>
        <button className="sidebar-logout" onClick={handleLogout} title="Đăng xuất">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  )
}
