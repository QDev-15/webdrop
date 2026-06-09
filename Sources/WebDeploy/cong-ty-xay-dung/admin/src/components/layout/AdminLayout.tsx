import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../contexts/AuthContext'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/slides': 'Hero Slides',
  '/services': 'Dịch vụ',
  '/projects': 'Dự án',
  '/testimonials': 'Đánh giá',
  '/users': 'Người dùng',
  '/contacts': 'Liên hệ',
  '/media': 'Thư viện Media',
  '/settings': 'Cài đặt',
  '/profile': 'Tài khoản',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { logout, user } = useAuth()

  const title = PAGE_TITLES[location.pathname] ?? 'Quản trị'

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-actions">
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              {user?.name}
            </span>
            <button
              className="btn-ghost btn-sm"
              onClick={() => logout()}
            >
              Đăng xuất
            </button>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
