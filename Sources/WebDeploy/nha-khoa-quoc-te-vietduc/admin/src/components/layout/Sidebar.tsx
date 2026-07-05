import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  to: string
  icon: string
  label: string
  exact?: boolean
  badge?: number
}

const MENU: NavLinkItem[] = [
  { to: '/',                   icon: '⊞', label: 'Tổng quan',        exact: true },
  { to: '/bookings',           icon: '📅', label: 'Đặt lịch'                      },
  { to: '/contacts',          icon: '✉', label: 'Liên hệ'                       },
  { to: '/team',               icon: '👨‍⚕️', label: 'Bác sĩ'                        },
  { to: '/services',           icon: '🦷', label: 'Dịch vụ'                       },
  { to: '/service-categories', icon: '📂', label: 'Nhóm dịch vụ'                  },
  { to: '/testimonials',       icon: '⭐', label: 'Đánh giá'                      },
  { to: '/hero',               icon: '🖼', label: 'Hero Slides'                   },
  { to: '/media',              icon: '🗂', label: 'Media'                         },
  { to: '/settings',           icon: '⚙', label: 'Cài đặt'                       },
  { to: '/users',              icon: '👥', label: 'Người dùng'                    },
  { to: '/profile',            icon: '👤', label: 'Hồ sơ'                         },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sb-sidebar">
      <div className="sb-brand">
        <span className="sb-brand-dot" />
        <span className="sb-brand-name">Viet Duc</span>
        <span className="sb-brand-sub">Admin</span>
      </div>

      <nav className="sb-nav">
        {MENU.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
          >
            <span className="sb-icon">{item.icon}</span>
            <span className="sb-label">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="sb-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sb-footer">
        {user && (
          <div className="sb-user">
            <div className="sb-user-name">{user.name}</div>
            <div className="sb-user-role">{user.role}</div>
          </div>
        )}
        <button className="sb-logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
