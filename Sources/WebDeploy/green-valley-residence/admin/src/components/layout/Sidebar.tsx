import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

interface NavLinkItem { to: string; icon: string; label: string; exact?: boolean; badge?: number }
interface MenuSection { section: string; links: NavLinkItem[] }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<{ contacts_new: number }>('/stats').then(s => setNewContacts(s.contacts_new)).catch(() => {})
  }, [])

  const menuStructure: MenuSection[] = [
    { section: 'Tổng quan', links: [{ to: '/', icon: '⊞', label: 'Dashboard', exact: true }] },
    { section: 'Trang chủ', links: [{ to: '/slides', icon: '🖼', label: 'Hero Slides' }] },
    { section: 'Dự án', links: [
      { to: '/unit-types', icon: '🏢', label: 'Loại căn hộ' },
      { to: '/amenities', icon: '🏊', label: 'Tiện ích nội khu' },
      { to: '/nearby-amenities', icon: '📍', label: 'Tiện ích xung quanh' },
      { to: '/payment-phases', icon: '💳', label: 'Tiến độ thanh toán' },
      { to: '/sales-policies', icon: '💸', label: 'Chính sách bán hàng' },
    ]},
    { section: 'Nội dung', links: [
      { to: '/faqs', icon: '❓', label: 'Câu hỏi thường gặp' },
      { to: '/testimonials', icon: '💬', label: 'Đánh giá khách hàng' },
    ]},
    { section: 'Khách hàng', links: [{ to: '/contacts', icon: '✉', label: 'Liên hệ', badge: newContacts || undefined }] },
    { section: 'Hệ thống', links: [
      { to: '/media', icon: '📁', label: 'Thư viện ảnh' },
      { to: '/settings', icon: '⚙', label: 'Cài đặt' },
    ]},
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo"><span>GV</span> Green Valley</div>

      {menuStructure.map(group => (
        <div key={group.section}>
          <div className="sidebar-section">{group.section}</div>
          {group.links.map(link => (
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

      <div className="sidebar-footer" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <NavLink to="/profile" className="sidebar-profile" style={{ textDecoration: 'none', flex: 1, minWidth: 0 }}>
          <div className="sidebar-avatar">{(user?.name || '?').charAt(0).toUpperCase()}</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{user?.name}</div>
            <div className="sidebar-profile-role">{user?.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}</div>
          </div>
        </NavLink>
        <div className="sidebar-logout" title="Đăng xuất" onClick={() => logout()}>⏻</div>
      </div>
    </div>
  )
}
