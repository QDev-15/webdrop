import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    if (!confirm('Bạn chắc chắn muốn đăng xuất?')) return
    setLoggingOut(true)
    try {
      await logout()
      navigate('/', { replace: true })
    } finally { setLoggingOut(false) }
  }

  return (
    <nav className="bp-navbar">
      <div className="bp-navbar-brand">🍴 POS Bán Hàng</div>
      <ul className="bp-navbar-menu">
        <li><Link to="/pos">Lập đơn</Link></li>
        <li><Link to="/tra-hang">Trả hàng</Link></li>
        <li><Link to="/ca-lam-viec">Ca làm việc</Link></li>
        <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
        <li><Link to="/lien-he">Liên hệ</Link></li>
      </ul>
      <div className="bp-navbar-user">
        {user ? (
          <>
            <span id="userDisplay">👤 {user.name}{user.role === 'superadmin' ? ' (Quản lý)' : ' (Thu ngân)'}</span>
            <button className="bp-btn bp-btn-secondary bp-btn-sm" onClick={handleLogout} disabled={loggingOut}>Đăng xuất</button>
          </>
        ) : (
          <Link to="/" className="bp-btn bp-btn-secondary bp-btn-sm">Đăng nhập</Link>
        )}
      </div>
    </nav>
  )
}
