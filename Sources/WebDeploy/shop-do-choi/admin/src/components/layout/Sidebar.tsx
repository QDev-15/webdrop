import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (path: string) => location.pathname.startsWith(path)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="admin-sidebar">
      {/* Logo & brand */}
      <div className="sidebar-logo">
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>🎮</span>
          <span>KidZone</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
            📊 Dashboard
          </Link>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Sản phẩm</h4>
          <Link to="/products" className={`sidebar-link ${isActive('/products') ? 'active' : ''}`}>
            Danh sách sản phẩm
          </Link>
          <Link to="/product-categories" className={`sidebar-link ${isActive('/product-categories') ? 'active' : ''}`}>
            Danh mục
          </Link>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Đơn hàng & Liên hệ</h4>
          <Link to="/orders" className={`sidebar-link ${isActive('/orders') ? 'active' : ''}`}>
            Đơn hàng
          </Link>
          <Link to="/coupons" className={`sidebar-link ${isActive('/coupons') ? 'active' : ''}`}>
            Phiếu giảm giá
          </Link>
          <Link to="/contacts" className={`sidebar-link ${isActive('/contacts') ? 'active' : ''}`}>
            Tin nhắn liên hệ
          </Link>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Nội dung</h4>
          <Link to="/slides" className={`sidebar-link ${isActive('/slides') ? 'active' : ''}`}>
            Slide trang chủ
          </Link>
          <Link to="/media" className={`sidebar-link ${isActive('/media') ? 'active' : ''}`}>
            Thư viện ảnh
          </Link>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Cài đặt</h4>
          <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}>
            ⚙️ Cài đặt chung
          </Link>
        </div>
      </nav>

      {/* Profile section */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user?.name || 'Admin'}</p>
          <p className="sidebar-user-role">{user?.role || 'User'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/profile" title="Hồ sơ" style={{ fontSize: 14 }}>👤</Link>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}
          >
            🚪
          </button>
        </div>
      </div>
    </div>
  )
}
