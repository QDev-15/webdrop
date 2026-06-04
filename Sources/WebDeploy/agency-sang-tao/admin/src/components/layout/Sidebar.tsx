import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Stats {
  contacts_new: number
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(s => setNewContacts(s.contacts_new))
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'AD'

  return (
    <div className="sb">
      <div className="sb-logo">
        NOVA<span>.</span>
        <div className="sb-logo-sub">Admin Panel</div>
      </div>

      <div className="sb-section">
        <div className="sb-section-title">Tổng quan</div>
        <NavLink to="/" end className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
          <span className="sb-icon">⊞</span> Dashboard
        </NavLink>
      </div>

      {/* Trang chủ — menu nav item */}
      <div className="sb-section">
        <div className="sb-section-title">Trang chủ</div>
        <NavLink to="/services" className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
          <span className="sb-icon">◆</span> Dịch vụ
        </NavLink>
      </div>

      {/* Dự án — menu nav item */}
      <div className="sb-section">
        <div className="sb-section-title">Dự án</div>
        <NavLink to="/projects" className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
          <span className="sb-icon">▣</span> Portfolio / Dự án
        </NavLink>
      </div>

      {/* Về chúng tôi — menu nav item */}
      <div className="sb-section">
        <div className="sb-section-title">Về chúng tôi</div>
        <NavLink to="/team" className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
          <span className="sb-icon">👥</span> Đội ngũ
        </NavLink>
        <NavLink to="/testimonials" className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
          <span className="sb-icon">⭐</span> Nhận xét KH
        </NavLink>
      </div>

      {/* Media */}
      <div className="sb-section">
        <div className="sb-section-title">Nội dung</div>
        <NavLink to="/media" className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
          <span className="sb-icon">🖼</span> Media
        </NavLink>
      </div>

      {/* Liên hệ — menu nav item */}
      <div className="sb-section">
        <div className="sb-section-title">Liên hệ</div>
        <NavLink to="/contacts" className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
          <span className="sb-icon">✉</span> Brief / Liên hệ
          {newContacts > 0 && <span className="sb-badge">{newContacts}</span>}
        </NavLink>
      </div>

      {/* Hệ thống */}
      <div className="sb-section">
        <div className="sb-section-title">Hệ thống</div>
        <NavLink to="/settings" className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
          <span className="sb-icon">⚙</span> Cài đặt
        </NavLink>
      </div>

      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-avatar">{initials}</div>
          <div>
            <div className="sb-user-name">{user?.name || 'Admin'}</div>
            <div className="sb-user-role">{user?.role || 'superadmin'}</div>
          </div>
        </div>
        <button className="sb-logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
