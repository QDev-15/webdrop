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

interface Stats {
  newContacts: number
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<Stats>('/stats').then(s => setNewContacts(s.newContacts ?? 0)).catch(() => {})
  }, [])

  const menuStructure: MenuSection[] = [
    { section: 'Tổng quan', links: [
      { to: '/', icon: '⊞', label: 'Dashboard', exact: true },
    ]},
    { section: 'Trang chủ', links: [
      { to: '/slides',          icon: '🖼', label: 'Hero Slides' },
      { to: '/featured-drinks', icon: '☕', label: 'Thức uống nổi bật' },
      { to: '/brew-methods',    icon: '🫗', label: 'Phương pháp pha chế' },
      { to: '/testimonials',    icon: '⭐', label: 'Đánh giá khách hàng' },
    ]},
    { section: 'Thực đơn', links: [
      { to: '/menu-categories', icon: '📂', label: 'Danh mục thực đơn' },
      { to: '/menu-items',      icon: '🍽', label: 'Món & đồ uống' },
      { to: '/retail-beans',    icon: '🛍', label: 'Hạt rang mang về' },
    ]},
    { section: 'Không gian', links: [
      { to: '/work-areas', icon: '🏭', label: 'Khu vực xưởng' },
      { to: '/gallery',    icon: '📸', label: 'Thư viện ảnh' },
    ]},
    { section: 'Giới thiệu', links: [
      { to: '/timeline',    icon: '🕰', label: 'Hành trình thương hiệu' },
      { to: '/roast-steps', icon: '🔥', label: 'Quy trình chọn hạt' },
      { to: '/faqs',        icon: '❓', label: 'Câu hỏi thường gặp' },
    ]},
    { section: 'Khách hàng', links: [
      { to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts },
    ]},
    { section: 'Hệ thống', links: [
      { to: '/media',    icon: '🗂', label: 'Thư viện media' },
      { to: '/settings', icon: '⚙', label: 'Cài đặt' },
    ]},
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🔥</span> Mộc<span style={{ color: '#e3a768' }}>Rang</span>
      </div>

      <nav>
        {menuStructure.map(sec => (
          <div key={sec.section}>
            <div className="sidebar-section">{sec.section}</div>
            {sec.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="icon">{link.icon}</span>
                {link.label}
                {!!link.badge && <span className="sidebar-badge">{link.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">👤</span>
          {user?.name ?? 'Tài khoản'}
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 12px', margin: '1px 8px', cursor: 'pointer' }}>
          <span className="icon">🚪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
