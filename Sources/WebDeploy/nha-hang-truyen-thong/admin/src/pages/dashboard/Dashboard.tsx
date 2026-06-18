import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  total_menu_items: number
  total_reservations: number
  pending_reservations: number
  confirmed_reservations: number
  total_contacts: number
  new_contacts: number
  total_gallery: number
  total_testimonials: number
  recent_reservations: Reservation[]
  recent_contacts: Contact[]
}

interface Reservation {
  id: number
  name: string
  phone: string
  date: string
  time: string
  guests: number
  status: string
  created_at: string
}

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  status: string
  created_at: string
}

const STATUS_RES: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ xử lý',  color: '#d97706' },
  confirmed: { label: 'Đã xác nhận', color: '#1a6b52' },
  cancelled: { label: 'Đã hủy',     color: '#e24b4a' },
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(data => { setStats(data); setError(null) })
      .catch(err => setError(err instanceof Error ? err.message : 'Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (error) return (
    <div style={{ padding: 32 }}>
      <div style={{ padding: '16px 20px', borderRadius: 10, background: '#fff0f0', border: '1px solid #fdd', color: '#c0392b', fontSize: 14 }}>
        ⚠️ Lỗi tải dữ liệu: {error}
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan nhà hàng ẩm thực truyền thống</div>
        </div>
        <Link to="/reservations" className="btn-accent">Xem đặt bàn</Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '📅', label: 'Tổng đặt bàn', value: stats?.total_reservations ?? 0, sub: `${stats?.pending_reservations ?? 0} chờ xử lý`, link: '/reservations', color: '#b45309' },
          { icon: '✉', label: 'Liên hệ mới', value: stats?.new_contacts ?? 0, sub: `${stats?.total_contacts ?? 0} tổng liên hệ`, link: '/contacts', color: '#1a6b52' },
          { icon: '🍽', label: 'Món ăn', value: stats?.total_menu_items ?? 0, sub: 'Đang hiển thị', link: '/menu-items', color: '#7c3aed' },
          { icon: '🖼', label: 'Thư viện ảnh', value: stats?.total_gallery ?? 0, sub: `${stats?.total_testimonials ?? 0} đánh giá`, link: '/gallery', color: '#0891b2' },
        ].map(card => (
          <Link key={card.label} to={card.link} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, cursor: 'pointer', transition: 'box-shadow .2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: card.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: card.color, lineHeight: 1.1, letterSpacing: '-1px' }}>{card.value}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginTop: 2 }}>{card.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{card.sub}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent reservations */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Đặt bàn gần đây</div>
            <Link to="/reservations" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(stats?.recent_reservations ?? []).map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{r.date} lúc {r.time} · {r.guests} người</div>
                </div>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: (STATUS_RES[r.status]?.color ?? '#888') + '18', color: STATUS_RES[r.status]?.color ?? '#888' }}>
                  {STATUS_RES[r.status]?.label ?? r.status}
                </span>
              </div>
            ))}
            {(stats?.recent_reservations ?? []).length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-3)', fontSize: 13 }}>Chưa có đặt bàn nào</div>
            )}
          </div>
        </div>

        {/* Recent contacts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Liên hệ gần đây</div>
            <Link to="/contacts" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(stats?.recent_contacts ?? []).map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.subject || 'Không có tiêu đề'}</div>
                </div>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: c.status === 'new' ? '#dbeafe' : '#f0fdf4', color: c.status === 'new' ? '#1d4ed8' : '#166534' }}>
                  {c.status === 'new' ? 'Mới' : c.status === 'read' ? 'Đã đọc' : 'Đã trả lời'}
                </span>
              </div>
            ))}
            {(stats?.recent_contacts ?? []).length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-3)', fontSize: 13 }}>Chưa có liên hệ nào</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Thao tác nhanh</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { to: '/slides/new', label: '+ Thêm slide mới' },
            { to: '/menu-items/new', label: '+ Thêm món ăn' },
            { to: '/gallery/new', label: '+ Thêm ảnh' },
            { to: '/testimonials/new', label: '+ Thêm đánh giá' },
            { to: '/settings', label: '⚙ Cài đặt website' },
          ].map(link => (
            <Link key={link.to} to={link.to} className="btn-ghost" style={{ fontSize: 13 }}>{link.label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
