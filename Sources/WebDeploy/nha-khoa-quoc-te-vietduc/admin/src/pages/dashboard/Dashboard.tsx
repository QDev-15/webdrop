import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  bookings: number
  new_bookings: number
  contacts: number
  new_contacts: number
  doctors: number
  services: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Tổng Quan</h1>
        <p className="adm-page-sub">Nha Khoa Quốc Tế Việt Đức — Quản trị hệ thống</p>
      </div>

      <div className="adm-stats-grid">
        <div className="adm-stat-card">
          <div className="adm-stat-value">{stats?.bookings ?? 0}</div>
          <div className="adm-stat-label">Tổng đặt lịch</div>
          {(stats?.new_bookings ?? 0) > 0 && (
            <div className="adm-stat-badge">{stats?.new_bookings} mới</div>
          )}
          <Link to="/bookings" className="adm-stat-link">Xem tất cả →</Link>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-value">{stats?.contacts ?? 0}</div>
          <div className="adm-stat-label">Liên hệ</div>
          {(stats?.new_contacts ?? 0) > 0 && (
            <div className="adm-stat-badge">{stats?.new_contacts} mới</div>
          )}
          <Link to="/contacts" className="adm-stat-link">Xem tất cả →</Link>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-value">{stats?.doctors ?? 0}</div>
          <div className="adm-stat-label">Bác sĩ</div>
          <Link to="/team" className="adm-stat-link">Quản lý →</Link>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-value">{stats?.services ?? 0}</div>
          <div className="adm-stat-label">Dịch vụ</div>
          <Link to="/services" className="adm-stat-link">Quản lý →</Link>
        </div>
      </div>

      <div className="adm-quick-links">
        <h2 className="adm-section-title">Truy cập nhanh</h2>
        <div className="adm-quick-grid">
          <Link to="/bookings" className="adm-quick-card">
            <span className="adm-quick-icon">📅</span>
            <span>Quản lý đặt lịch</span>
          </Link>
          <Link to="/team/new" className="adm-quick-card">
            <span className="adm-quick-icon">👨‍⚕️</span>
            <span>Thêm bác sĩ</span>
          </Link>
          <Link to="/services/new" className="adm-quick-card">
            <span className="adm-quick-icon">🦷</span>
            <span>Thêm dịch vụ</span>
          </Link>
          <Link to="/settings" className="adm-quick-card">
            <span className="adm-quick-icon">⚙</span>
            <span>Cài đặt hệ thống</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
