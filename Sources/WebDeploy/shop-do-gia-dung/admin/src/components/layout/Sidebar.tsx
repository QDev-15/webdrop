import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <Link to="/admin">Shop Đồ Gia Dụng</Link>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/admin"
          className={`sidebar-nav-item ${isActive('/admin') ? 'active' : ''}`}
        >
          📊 Dashboard
        </Link>
        <Link
          to="/admin/products"
          className={`sidebar-nav-item ${isActive('/admin/products') ? 'active' : ''}`}
        >
          📦 Sản phẩm
        </Link>
        <Link
          to="/admin/orders"
          className={`sidebar-nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
        >
          🛒 Đơn hàng
        </Link>
        <Link
          to="/admin/settings"
          className={`sidebar-nav-item ${isActive('/admin/settings') ? 'active' : ''}`}
        >
          ⚙️ Cài đặt
        </Link>
      </nav>

      <div className="sidebar-profile">
        <div className="sidebar-user">
          <div className="sidebar-avatar">👤</div>
          <div>
            <p className="sidebar-username">{user?.name || 'Admin'}</p>
            <p className="sidebar-email">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="sidebar-logout">
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
