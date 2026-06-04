import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Stats { new_contacts: number; new_demos: number }
interface SidebarLink { to: string; icon: string; label: string; exact?: boolean; badge?: number }
interface SidebarSection { section: string; links: SidebarLink[] }

export default function Sidebar() {
  const location = useLocation()
  const [stats, setStats] = useState<Stats>({ new_contacts: 0, new_demos: 0 })

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
  }, [location.pathname])

  const menu: SidebarSection[] = [
    {
      section: 'Tổng quan',
      links: [
        { to: '/', icon: '▦', label: 'Dashboard', exact: true },
      ],
    },
    {
      section: 'Trang chủ',
      links: [
        { to: '/slides', icon: '▶', label: 'Hero Slides' },
      ],
    },
    {
      section: 'Sản phẩm',
      links: [
        { to: '/features', icon: '⚙', label: 'Tính năng' },
      ],
    },
    {
      section: 'Bảng giá',
      links: [
        { to: '/pricing', icon: '💎', label: 'Gói giá' },
        { to: '/faqs',    icon: '❓', label: 'FAQ' },
      ],
    },
    {
      section: 'Khách hàng',
      links: [
        { to: '/testimonials', icon: '★', label: 'Đánh giá' },
        { to: '/contacts',     icon: '✉', label: 'Liên hệ', badge: stats.new_contacts },
        { to: '/demos',        icon: '📅', label: 'Đặt lịch demo', badge: stats.new_demos },
      ],
    },
    {
      section: 'Hệ thống',
      links: [
        { to: '/media',    icon: '🖼', label: 'Media' },
        { to: '/settings', icon: '⚙', label: 'Cài đặt' },
      ],
    },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="sb-logo">
        <div className="sb-logo-dot"></div>
        <span className="sb-logo-text">TechFlow Admin</span>
      </div>

      {menu.map((section) => (
        <div key={section.section} className="sb-section">
          <div className="sb-section-label">{section.section}</div>
          {section.links.map((link) => {
            const isActive = link.exact
              ? location.pathname === '/'
              : location.pathname.startsWith(link.to) && link.to !== '/'
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={'sb-link' + (isActive ? ' active' : '')}
              >
                <span className="sb-icon">{link.icon}</span>
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="sb-badge">{link.badge}</span>
                )}
              </NavLink>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
