import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const TITLES: Record<string, string> = {
  '/':             'Dashboard',
  '/slides':       'Hero Slides',
  '/services':     'Dịch vụ',
  '/projects':     'Dự án / Portfolio',
  '/team':         'Đội ngũ',
  '/testimonials': 'Đánh giá',
  '/posts':        'Bài viết',
  '/contacts':     'Liên hệ',
  '/media':        'Media Library',
  '/settings':     'Cài đặt',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const path     = location.pathname

  // Match longest prefix
  let title = 'Admin'
  let matched = ''
  for (const key of Object.keys(TITLES)) {
    if (path.startsWith(key) && key.length > matched.length) {
      matched = key
      title   = TITLES[key]
    }
  }

  // Append sub-label for create/edit
  if (path.endsWith('/new'))  title += ' — Thêm mới'
  if (path.includes('/edit')) title += ' — Chỉnh sửa'

  return (
    <>
      <Sidebar />
      <div className="main">
        <div className="main-header">
          <span className="main-title">{title}</span>
          <span className="main-breadcrumb">Agency Web Admin</span>
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>
    </>
  )
}
