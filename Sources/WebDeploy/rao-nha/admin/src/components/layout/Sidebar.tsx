import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface NavLinkItem { to: string; icon: string; label: string; exact?: boolean; badge?: number }
interface MenuSection { section: string; links: NavLinkItem[] }

interface Stats {
  listings_pending: number
  wallet_pending: number
  contacts_new: number
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({ listings_pending: 0, wallet_pending: 0, contacts_new: 0 })

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
  }, [])

  const menuStructure: MenuSection[] = [
    { section: 'Tổng quan', links: [{ to: '/', icon: '⊞', label: 'Dashboard', exact: true }] },
    { section: 'Trang chủ', links: [{ to: '/slides', icon: '🖼', label: 'Hero Slides' }] },
    {
      section: 'Bất động sản',
      links: [
        { to: '/listings', icon: '🏠', label: 'Tin đăng', badge: stats.listings_pending },
        { to: '/listing-packages', icon: '💎', label: 'Gói tin VIP' },
      ],
    },
    {
      section: 'Người dùng',
      links: [
        { to: '/accounts', icon: '👤', label: 'Tài khoản đăng tin' },
        { to: '/wallet-transactions', icon: '💳', label: 'Ví & giao dịch', badge: stats.wallet_pending },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/articles', icon: '📰', label: 'Tin tức' },
        { to: '/testimonials', icon: '💬', label: 'Đánh giá' },
        { to: '/faqs', icon: '❓', label: 'Câu hỏi thường gặp' },
      ],
    },
    { section: 'Khách hàng', links: [{ to: '/contacts', icon: '✉', label: 'Liên hệ', badge: stats.contacts_new }] },
    { section: 'Phương tiện', links: [{ to: '/media', icon: '🖼', label: 'Thư viện ảnh' }] },
    { section: 'Hệ thống', links: [{ to: '/settings', icon: '⚙', label: 'Cài đặt' }] },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🏠</span>
        <span>RaoNhà Admin</span>
      </div>

      <nav style={{ flex: 1 }}>
        {menuStructure.map(({ section, links }) => (
          <div key={section}>
            <div className="sidebar-section">{section}</div>
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="icon">{link.icon}</span>
                <span>{link.label}</span>
                {link.badge ? <span className="sidebar-badge">{link.badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-profile' + (isActive ? ' active' : '')}>
          <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() ?? 'A'}</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{user?.name}</div>
            <div className="sidebar-profile-role">{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</div>
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
