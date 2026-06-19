import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  menu_items: number
  menu_categories: number
  testimonials: number
  gallery: number
  contacts: number
  new_contacts: number
  hero_slides: number
  recent_contacts: Array<{
    id: number
    name: string
    phone: string
    subject: string
    status: string
    created_at: string
  }>
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

  const statCards = [
    { icon: '🍜', label: 'Món ăn', value: stats.menu_items, link: '/menu-items', color: '#d97706' },
    { icon: '📂', label: 'Danh mục thực đơn', value: stats.menu_categories, link: '/menu-categories', color: '#d97706' },
    { icon: '⭐', label: 'Đánh giá', value: stats.testimonials, link: '/testimonials', color: '#f59e0b' },
    { icon: '📷', label: 'Ảnh gallery', value: stats.gallery, link: '/gallery', color: '#1a6b52' },
    { icon: '✉', label: 'Tin nhắn mới', value: stats.new_contacts, link: '/contacts', color: stats.new_contacts > 0 ? '#e24b4a' : '#6b6760' },
    { icon: '🖼', label: 'Hero Slides', value: stats.hero_slides, link: '/slides', color: '#1a6b52' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan quản trị Quán Ăn Phở Bình Dân</div>
        </div>
        <Link to="/menu-items/new" className="btn-accent">+ Thêm món ăn</Link>
      </div>

      {stats.new_contacts > 0 && (
        <div className="alert alert-info" style={{ marginBottom: 24 }}>
          Bạn có <strong>{stats.new_contacts} tin nhắn mới</strong> chưa đọc.{' '}
          <Link to="/contacts" style={{ color: 'inherit', fontWeight: 600 }}>Xem ngay →</Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map(card => (
          <Link key={card.label} to={card.link} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ transition: 'all .15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}>
              <div className="stat-card-icon">{card.icon}</div>
              <div className="stat-card-value" style={{ color: card.color }}>{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {stats.recent_contacts.length > 0 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Tin nhắn gần đây</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Người gửi</th>
                  <th>Chủ đề</th>
                  <th>Trạng thái</th>
                  <th>Ngày gửi</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_contacts.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: c.status === 'new' ? 600 : 400 }}>{c.name}</div>
                      {c.phone && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.phone}</div>}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{c.subject || '—'}</td>
                    <td>
                      <span className={`badge badge-${c.status}`}>
                        {c.status === 'new' ? 'Mới' : c.status === 'read' ? 'Đã đọc' : 'Đã trả lời'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {new Date(c.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/contacts" className="btn-ghost btn-sm">Xem tất cả tin nhắn →</Link>
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, padding: '20px', background: 'var(--warm)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-2)' }}>Truy cập nhanh</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link to="/slides" className="btn-ghost btn-sm">🖼 Hero Slides</Link>
          <Link to="/menu-categories" className="btn-ghost btn-sm">📂 Danh mục thực đơn</Link>
          <Link to="/menu-items/new" className="btn-ghost btn-sm">+ Thêm món ăn</Link>
          <Link to="/testimonials" className="btn-ghost btn-sm">⭐ Đánh giá</Link>
          <Link to="/gallery" className="btn-ghost btn-sm">📷 Gallery</Link>
          <Link to="/settings" className="btn-ghost btn-sm">⚙ Cài đặt</Link>
        </div>
      </div>
    </div>
  )
}
