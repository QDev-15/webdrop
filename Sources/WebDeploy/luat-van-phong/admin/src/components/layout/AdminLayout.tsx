import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

const PAGE_TITLES: Record<string, string> = {
  '/':              'Dashboard',
  '/slides':        'Hero Slides',
  '/services':      'Lĩnh vực hành nghề',
  '/lawyers':       'Đội ngũ luật sư',
  '/cases':         'Vụ việc tiêu biểu',
  '/testimonials':  'Đánh giá thân chủ',
  '/contacts':      'Liên hệ',
  '/consultations': 'Đăng ký tư vấn',
  '/media':         'Media',
  '/settings':      'Cài đặt',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  const [stats, setStats] = useState<{ new_contacts: number; new_consults: number } | undefined>()

  const title = PAGE_TITLES[location.pathname] ||
    (location.pathname.endsWith('/new')  ? 'Thêm mới' :
     location.pathname.endsWith('/edit') ? 'Chỉnh sửa' : '')

  useEffect(() => {
    api.get<{ new_contacts: number; new_consults: number }>('/stats')
      .then(s => setStats(s))
      .catch(() => {})
  }, [location.pathname])

  return (
    <div className="admin-wrap">
      <Sidebar stats={stats} />
      <div className="admin-main">
        <header className="admin-topbar">
          <span className="tb-title">{title}</span>
          <span className="tb-user">{user?.name}</span>
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}
