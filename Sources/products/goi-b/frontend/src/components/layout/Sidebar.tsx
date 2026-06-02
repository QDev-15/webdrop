import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Stats { new_contacts: number }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(s => setNewContacts(s.new_contacts))
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const link = (to: string, icon: string, label: string, badge?: number) => (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
    >
      <span className="icon">{icon}</span>
      {label}
      {!!badge && <span className="sidebar-badge">{badge}</span>}
    </NavLink>
  )

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">web<span>drop</span>.admin</div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">Tổng quan</div>
        {link('/', '⊞', 'Dashboard')}

        <div className="sidebar-section">Nội dung</div>
        {link('/posts', '✏', 'Bài viết')}
        {link('/pages', '📄', 'Trang')}
        {link('/categories', '📂', 'Danh mục')}
        {link('/banners', '🖼', 'Banners')}
        {link('/media', '📸', 'Media')}

        <div className="sidebar-section">Khách hàng</div>
        {link('/contacts', '✉', 'Liên hệ', newContacts || undefined)}

        <div className="sidebar-section">Hệ thống</div>
        {link('/settings', '⚙', 'Cài đặt')}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">👤 {user?.name}</div>
        <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </aside>
  )
}
