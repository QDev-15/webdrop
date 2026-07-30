import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <Link to="/">Shop Đồ Gia Dụng</Link>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">📊 Quản lý</div>
        <Link
          to="/"
          className={`sidebar-nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
        >
          Dashboard
        </Link>

        <div className="sidebar-section-title">📦 Sản phẩm</div>
        <Link
          to="/products"
          className={`sidebar-nav-item ${isActive('/products') ? 'active' : ''}`}
        >
          Danh sách Sản phẩm
        </Link>
        <Link
          to="/categories"
          className={`sidebar-nav-item ${isActive('/categories') ? 'active' : ''}`}
        >
          Danh mục
        </Link>

        <div className="sidebar-section-title">🛒 Đơn hàng</div>
        <Link
          to="/orders"
          className={`sidebar-nav-item ${isActive('/orders') ? 'active' : ''}`}
        >
          Đơn hàng
        </Link>
        <Link
          to="/contacts"
          className={`sidebar-nav-item ${isActive('/contacts') ? 'active' : ''}`}
        >
          Liên hệ
        </Link>

        <div className="sidebar-section-title">⚙️ Hệ thống</div>
        <Link
          to="/slides"
          className={`sidebar-nav-item ${isActive('/slides') ? 'active' : ''}`}
        >
          Hero Slides
        </Link>
        <Link
          to="/media"
          className={`sidebar-nav-item ${isActive('/media') ? 'active' : ''}`}
        >
          Thư viện ảnh
        </Link>
        <Link
          to="/settings"
          className={`sidebar-nav-item ${isActive('/settings') ? 'active' : ''}`}
        >
          Cài đặt
        </Link>
        <Link
          to="/profile"
          className={`sidebar-nav-item ${isActive('/profile') ? 'active' : ''}`}
        >
          Hồ sơ tài khoản
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
