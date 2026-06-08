import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'

interface Props {
  children: ReactNode
  title?: string
}

export default function AdminLayout({ children, title }: Props) {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true })
  }, [user, loading, navigate])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return null

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="topbar-title">{title || 'Admin Panel'}</span>
          <div className="topbar-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
              Xem website
            </a>
            <button className="btn-ghost btn-sm" onClick={() => { logout().then(() => navigate('/login')) }}>
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
