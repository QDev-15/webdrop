import React from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/services': 'Dịch vụ',
  '/services/new': 'Thêm dịch vụ',
  '/projects': 'Dự án / Portfolio',
  '/projects/new': 'Thêm dự án',
  '/team': 'Đội ngũ',
  '/team/new': 'Thêm thành viên',
  '/testimonials': 'Nhận xét khách hàng',
  '/testimonials/new': 'Thêm nhận xét',
  '/contacts': 'Liên hệ',
  '/media': 'Media',
  '/settings': 'Cài đặt',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const path = location.pathname
  let title = TITLES[path] || ''
  if (!title) {
    if (path.includes('/edit')) title = 'Chỉnh sửa'
    else title = 'Admin'
  }

  return (
    <>
      <Sidebar />
      <div className="main">
        <div className="main-header">
          <span className="main-title">{title}</span>
          <span className="main-breadcrumb">Agency Sáng Tạo</span>
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>
    </>
  )
}
