import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface NavItem { to: string; icon: string; label: string; exact?: boolean; badge?: number }
interface Section { section: string; links: NavItem[] }

interface Props { stats?: { new_contacts: number; new_consults: number } }

export default function Sidebar({ stats }: Props) {
  const { user, logout } = useAuth()
  const newContacts = (stats?.new_contacts || 0) + (stats?.new_consults || 0)

  const menu: Section[] = [
    {
      section: 'Tổng quan',
      links: [
        { to: '/', icon: '⊞', label: 'Dashboard' },
      ],
    },
    {
      section: 'Trang chủ',
      links: [
        { to: '/slides',   icon: '🖼', label: 'Hero Slides' },
      ],
    },
    {
      section: 'Lĩnh Vực',
      links: [
        { to: '/services', icon: '⚖', label: 'Lĩnh vực hành nghề' },
      ],
    },
    {
      section: 'Luật Sư',
      links: [
        { to: '/lawyers',  icon: '👤', label: 'Đội ngũ luật sư' },
      ],
    },
    {
      section: 'Vụ Việc',
      links: [
        { to: '/cases',    icon: '📋', label: 'Vụ việc tiêu biểu' },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/testimonials', icon: '💬', label: 'Đánh giá thân chủ' },
        { to: '/media',        icon: '📸', label: 'Media' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/consultations', icon: '📅', label: 'Đăng ký tư vấn', badge: stats?.new_consults },
        { to: '/contacts',      icon: '✉', label: 'Liên hệ',         badge: stats?.new_contacts },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="sb-brand">
        <div className="sb-brand-name">Văn Phòng Luật Sư</div>
        <div className="sb-brand-sub">Quản trị hệ thống</div>
      </div>

      <nav className="sb-nav">
        {menu.map(section => (
          <div key={section.section}>
            <div className="sb-section-label">{section.section}</div>
            {section.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
              >
                <span className="sb-icon">{link.icon}</span>
                {link.label}
                {link.badge ? <span className="sb-badge">{link.badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-bottom">
        <NavLink
          to="/profile"
          className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
          style={{ fontSize: '12px', padding: '7px 12px 10px', color: 'rgba(255,255,255,.35)' }}
        >
          <span className="sb-icon">👤</span>
          {user?.name || 'Tài khoản'}
        </NavLink>
        <button className="sb-logout-btn" onClick={logout}>
          <span>↩</span> Đăng xuất
        </button>
      </div>
    </aside>
  )
}
