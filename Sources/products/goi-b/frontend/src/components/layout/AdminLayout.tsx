import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/posts': 'Bài viết',
  '/posts/new': 'Tạo bài viết',
  '/pages': 'Trang',
  '/pages/new': 'Tạo trang',
  '/categories': 'Danh mục',
  '/contacts': 'Liên hệ',
  '/settings': 'Cài đặt',
  '/banners': 'Banners',
  '/banners/new': 'Tạo banner',
  '/media': 'Media',
}

function getTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname]
  if (/\/posts\/\d+\/edit/.test(pathname)) return 'Chỉnh sửa bài viết'
  if (/\/pages\/\d+\/edit/.test(pathname)) return 'Chỉnh sửa trang'
  if (/\/banners\/\d+\/edit/.test(pathname)) return 'Chỉnh sửa banner'
  return 'Admin'
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <header className="admin-header">
          <h1>{getTitle(pathname)}</h1>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
