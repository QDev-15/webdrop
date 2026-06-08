import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Link } from 'react-router-dom'

interface Stats {
  categories: number
  threads: number
  tags: number
  new_contacts: number
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

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan diễn đàn cộng đồng</div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)' }}>Đang tải...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-card-icon">📂</div>
            <div className="stat-card-value">{stats?.categories ?? 0}</div>
            <div className="stat-card-label">Danh mục</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">💬</div>
            <div className="stat-card-value">{stats?.threads ?? 0}</div>
            <div className="stat-card-label">Chủ đề bài viết</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">🏷</div>
            <div className="stat-card-value">{stats?.tags ?? 0}</div>
            <div className="stat-card-label">Tags</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">✉</div>
            <div className="stat-card-value" style={{ color: stats?.new_contacts ? 'var(--danger)' : 'var(--text)' }}>
              {stats?.new_contacts ?? 0}
            </div>
            <div className="stat-card-label">Liên hệ mới</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card">
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Quản lý nhanh
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Link to="/forum-threads" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              💬 Quản lý chủ đề bài viết
            </Link>
            <Link to="/forum-categories" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              📂 Quản lý danh mục
            </Link>
            <Link to="/forum-tags" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              🏷 Quản lý tags
            </Link>
            <Link to="/slides" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              🖼 Hero Slides
            </Link>
            <Link to="/contacts" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              ✉ Xem liên hệ
            </Link>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Cài đặt nhanh
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Link to="/settings" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              ⚙ Cài đặt website
            </Link>
            <Link to="/media" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              📸 Thư viện media
            </Link>
            <Link to="/profile" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              👤 Tài khoản của tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
