import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  menu_items: number
  total_menu_items: number
  pending_reservations: number
  total_reservations: number
  new_contacts: number
  total_contacts: number
  gallery_count: number
  testimonials: number
  categories: number
  recent_reservations: Array<{
    name: string
    date: string
    time: string
    guests: number
    status: string
    created_at: string
  }>
  recent_contacts: Array<{
    name: string
    email: string
    created_at: string
    status: string
  }>
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
  new: 'Mới',
  read: 'Đã đọc',
  replied: 'Đã trả lời',
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(() => setError('Không thể tải dữ liệu thống kê.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!stats) return null

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan hệ thống Le Bistro Français</div>
        </div>
        <Link to="/reservations" className="btn-accent">Xem đặt bàn</Link>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="card stat-card">
          <div className="stat-icon">🍽</div>
          <div className="stat-value">{stats.total_menu_items}</div>
          <div className="stat-label">Món ăn</div>
          <div className="stat-sub">{stats.categories} danh mục</div>
        </div>
        <div className="card stat-card" style={{ borderLeft: stats.pending_reservations > 0 ? '3px solid var(--accent)' : undefined }}>
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.total_reservations}</div>
          <div className="stat-label">Đặt bàn</div>
          <div className="stat-sub" style={{ color: stats.pending_reservations > 0 ? 'var(--accent)' : undefined }}>
            {stats.pending_reservations} chờ xử lý
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📸</div>
          <div className="stat-value">{stats.gallery_count}</div>
          <div className="stat-label">Ảnh thư viện</div>
          <div className="stat-sub">Đã xuất bản</div>
        </div>
        <div className="card stat-card" style={{ borderLeft: stats.new_contacts > 0 ? '3px solid var(--accent)' : undefined }}>
          <div className="stat-icon">✉</div>
          <div className="stat-value">{stats.total_contacts}</div>
          <div className="stat-label">Liên hệ</div>
          <div className="stat-sub" style={{ color: stats.new_contacts > 0 ? 'var(--accent)' : undefined }}>
            {stats.new_contacts} chưa đọc
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.testimonials}</div>
          <div className="stat-label">Đánh giá</div>
          <div className="stat-sub">Đã xuất bản</div>
        </div>
      </div>

      {/* Recent data */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent reservations */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Đặt bàn gần đây</div>
            <Link to="/reservations" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
          </div>
          {stats.recent_reservations.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">Chưa có đặt bàn.</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.recent_reservations.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.date} · {r.time} · {r.guests} người</div>
                  </div>
                  <span className={`badge badge-${r.status}`}>{STATUS_LABELS[r.status] ?? r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent contacts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Liên hệ gần đây</div>
            <Link to="/contacts" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
          </div>
          {stats.recent_contacts.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">✉</div><div className="empty-state-text">Chưa có liên hệ.</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.recent_contacts.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.email}</div>
                  </div>
                  <span className={`badge badge-${c.status}`}>{STATUS_LABELS[c.status] ?? c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Thao tác nhanh</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/menu-items/new" className="btn-ghost btn-sm">+ Thêm món ăn</Link>
          <Link to="/slides/new" className="btn-ghost btn-sm">+ Thêm slide</Link>
          <Link to="/gallery" className="btn-ghost btn-sm">+ Thêm ảnh</Link>
          <Link to="/testimonials/new" className="btn-ghost btn-sm">+ Thêm đánh giá</Link>
          <Link to="/settings" className="btn-ghost btn-sm">Cài đặt website</Link>
        </div>
      </div>
    </div>
  )
}
