import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

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

interface Stats {
  newContacts?: number
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [newContacts, setNewContacts] = useState(0)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(s => setNewContacts(s.newContacts ?? 0))
      .catch(() => null)
  }, [])

  const menuStructure: MenuSection[] = [
    {
      section: 'Tổng quan',
      links: [
        { to: '/', icon: '⊞', label: 'Dashboard', exact: true },
      ],
    },
    {
      section: 'Bài viết',
      links: [
        { to: '/posts', icon: '✍', label: 'Bài viết' },
        { to: '/categories', icon: '📂', label: 'Danh mục' },
      ],
    },
    {
      section: 'Nội dung',
      links: [
        { to: '/media', icon: '🖼', label: 'Thư viện ảnh' },
      ],
    },
    {
      section: 'Độc giả',
      links: [
        {
          to: '/contacts',
          icon: '✉',
          label: 'Liên hệ',
          badge: newContacts > 0 ? newContacts : undefined,
        },
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
    <aside className="sidebar">
      <div className="sidebar-logo">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <div className="logo-dot" />
          Blog Admin
        </a>
      </div>

      <nav className="sidebar-nav">
        {menuStructure.map(sec => (
          <div key={sec.section} className="sidebar-section">
            <div className="sidebar-section-title">{sec.section}</div>
            {sec.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact === true}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="icon">{link.icon}</span>
                <span style={{ flex: 1 }}>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="sidebar-badge">{link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <span className="icon">👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>
              {user?.name ?? 'Admin'}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email ?? ''}
            </div>
          </div>
        </NavLink>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '7px 10px',
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderRadius: '7px',
            cursor: 'pointer',
            fontSize: '13px',
            color: 'rgba(255,255,255,.35)',
            fontFamily: 'var(--sans)',
            transition: 'all .15s',
            marginTop: '4px',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,.06)'
            e.currentTarget.style.color = 'rgba(255,255,255,.6)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,.35)'
          }}
        >
          <span style={{ width: '18px', textAlign: 'center', fontSize: '14px' }}>→</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
