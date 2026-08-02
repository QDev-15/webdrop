import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

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

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const menu: MenuSection[] = [
    {
      section: 'Tổng quan',
      links: [{ to: '/', icon: '⊞', label: 'Dashboard', exact: true }],
    },
    {
      section: 'Sản phẩm',
      links: [
        { to: '/product-categories', icon: '📂', label: 'Danh mục' },
        { to: '/colors',             icon: '🎨', label: 'Màu sắc' },
        { to: '/products',           icon: '🛍',  label: 'Sản phẩm' },
      ],
    },
    {
      section: 'Bán hàng',
      links: [
        { to: '/orders',   icon: '📦', label: 'Đơn hàng' },
        { to: '/coupons',  icon: '🏷',  label: 'Phiếu giảm giá' },
        { to: '/contacts', icon: '✉',  label: 'Liên hệ' },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/slides', icon: '🖼', label: 'Hero Slides' },
        { to: '/media',  icon: '🗂', label: 'Thư viện ảnh' },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <span>🏠</span>
        Shop Đồ Gia Dụng
      </div>

      <nav style={{ flex: 1 }}>
        {menu.map(section => (
          <div key={section.section}>
            <div className="sidebar-section">{section.section}</div>
            {section.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="icon">{link.icon}</span>
                {link.label}
                {link.badge ? <span className="sidebar-badge">{link.badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className="sidebar-profile">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>{user?.name ?? 'Admin'}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>Hồ sơ cá nhân</div>
          </div>
        </NavLink>
        <button className="sidebar-logout" onClick={handleLogout}>
          ⬡ Đăng xuất
        </button>
      </div>
    </aside>
  )
}
