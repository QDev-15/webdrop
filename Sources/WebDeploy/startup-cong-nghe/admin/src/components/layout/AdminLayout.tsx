import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'

const pageTitles: Record<string, string> = {
  '/':            'Dashboard',
  '/slides':      'Hero Slides',
  '/features':    'Tính năng sản phẩm',
  '/pricing':     'Bảng giá',
  '/faqs':        'FAQ',
  '/testimonials':'Đánh giá khách hàng',
  '/contacts':    'Liên hệ',
  '/demos':       'Đặt lịch demo',
  '/media':       'Thư viện media',
  '/settings':    'Cài đặt',
  '/profile':     'Tài khoản',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const title = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => location.pathname === path || location.pathname.startsWith(path + '/'))?.[1]
    ?? 'Admin'

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-user">
            <span className="topbar-user-name">{user?.name}</span>
            <button className="topbar-logout-btn" onClick={logout}>Đăng xuất</button>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
