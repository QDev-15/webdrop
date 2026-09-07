import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  total_menu_items: number
  menu_items: number
  categories: number
  new_contacts: number
  total_contacts: number
  gallery_count: number
  testimonials: number
  faqs: number
  recent_contacts: Array<{
    name: string
    email: string
    phone: string
    subject: string
    created_at: string
    status: string
  }>
}

const STATUS_LABELS: Record<string, string> = {
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
          <div className="page-sub">Tổng quan hệ thống Lặng Trang — Cà Phê Sách</div>
        </div>
        <Link to="/contacts" className="btn-accent">Xem đặt chỗ</Link>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="card stat-card">
          <div className="stat-icon">☕</div>
          <div className="stat-value">{stats.total_menu_items}</div>
          <div className="stat-label">Món & đồ uống</div>
          <div className="stat-sub">{stats.categories} danh mục</div>
        </div>
        <div className="card stat-card" style={{ borderLeft: stats.new_contacts > 0 ? '3px solid var(--accent)' : undefined }}>
          <div className="stat-icon">✉</div>
          <div className="stat-value">{stats.total_contacts}</div>
          <div className="stat-label">Đặt chỗ / Liên hệ</div>
          <div className="stat-sub" style={{ color: stats.new_contacts > 0 ? 'var(--accent)' : undefined }}>
            {stats.new_contacts} chưa đọc
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📸</div>
          <div className="stat-value">{stats.gallery_count}</div>
          <div className="stat-label">Ảnh thư viện</div>
          <div className="stat-sub">Đã xuất bản</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.testimonials}</div>
          <div className="stat-label">Đánh giá</div>
          <div className="stat-sub">Đã xuất bản</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">❓</div>
          <div className="stat-value">{stats.faqs}</div>
          <div className="stat-label">Câu hỏi thường gặp</div>
          <div className="stat-sub">Đã xuất bản</div>
        </div>
      </div>

      {/* Recent contacts */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Đặt chỗ / Liên hệ gần đây</div>
          <Link to="/contacts" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
        </div>
        {stats.recent_contacts.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">✉</div><div className="empty-state-text">Chưa có yêu cầu nào.</div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.recent_contacts.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.subject || c.phone || c.email}</div>
                </div>
                <span className={`badge badge-${c.status}`}>{STATUS_LABELS[c.status] ?? c.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Thao tác nhanh</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/menu-items/new" className="btn-ghost btn-sm">+ Thêm món/đồ uống</Link>
          <Link to="/slides/new" className="btn-ghost btn-sm">+ Thêm slide</Link>
          <Link to="/gallery" className="btn-ghost btn-sm">+ Thêm ảnh</Link>
          <Link to="/testimonials/new" className="btn-ghost btn-sm">+ Thêm đánh giá</Link>
          <Link to="/faqs" className="btn-ghost btn-sm">+ Thêm câu hỏi</Link>
          <Link to="/settings" className="btn-ghost btn-sm">Cài đặt website</Link>
        </div>
      </div>
    </div>
  )
}
