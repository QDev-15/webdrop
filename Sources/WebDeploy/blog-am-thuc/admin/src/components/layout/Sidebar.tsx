import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

interface NavLinkItem { to: string; icon: string; label: string; exact?: boolean; badge?: number }
interface MenuSection { section: string; links: NavLinkItem[] }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ new_contacts: number }>('/stats').then(s => setNewContacts(s.new_contacts)).catch(() => null)
  }, [])

  const menuStructure: MenuSection[] = [
    { section: 'Tổng quan', links: [{ to: '/', icon: '⊞', label: 'Dashboard', exact: true }] },
    { section: 'Trang chủ', links: [{ to: '/slides', icon: '🖼', label: 'Hero Slides' }] },
    { section: 'Nội dung', links: [
      { to: '/categories', icon: '📂', label: 'Chuyên mục' },
      { to: '/posts',      icon: '📝', label: 'Bài viết & Công thức' },
    ]},
    { section: 'Về tôi', links: [
      { to: '/timeline',     icon: '🕒', label: 'Hành trình' },
      { to: '/testimonials', icon: '⭐', label: 'Đánh giá độc giả' },
    ]},
    { section: 'Trang chủ FAQ', links: [{ to: '/faqs', icon: '❓', label: 'Câu hỏi thường gặp' }] },
    { section: 'Khách hàng', links: [{ to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts || undefined }] },
    { section: 'Thư viện', links: [{ to: '/media', icon: '🖼️', label: 'Thư viện ảnh' }] },
    { section: 'Hệ thống', links: [{ to: '/settings', icon: '⚙', label: 'Cài đặt' }] },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🥗</span> Bếp Xanh Admin
      </div>

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
              <span>{link.label}</span>
              {!!link.badge && <span className="sidebar-badge">{link.badge}</span>}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <NavLink to="/profile" className="sidebar-profile" style={{ textDecoration: 'none' }}>
          <div className="sidebar-avatar">{(user?.name || '?').charAt(0).toUpperCase()}</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{user?.name}</div>
            <div className="sidebar-profile-role">{user?.role === 'superadmin' ? 'Quản trị viên' : 'Nhân viên'}</div>
          </div>
        </NavLink>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <div className="sidebar-logout" onClick={() => logout()} title="Đăng xuất">⏻</div>
        </div>
      </div>
    </div>
  )
}
