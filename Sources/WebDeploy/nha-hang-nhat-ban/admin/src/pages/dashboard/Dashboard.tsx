import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  reservations_total: number
  reservations_pending: number
  contacts_total: number
  contacts_new: number
  menu_items: number
  gallery_items: number
  testimonials: number
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
  menu_type: string
  status: string
  created_at: string
}

interface Contact {
  id: number
  name: string
  email: string
  subject: string
  status: string
  created_at: string
}

const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Chờ xác nhận', color: '#92400e', bg: '#fffbeb' },
  confirmed: { label: 'Đã xác nhận',  color: '#1a6b52', bg: '#e8f4ef' },
  cancelled: { label: 'Đã hủy',       color: '#e24b4a', bg: '#fff0f0' },
  new:       { label: 'Mới',          color: '#1d4ed8', bg: '#eff6ff' },
  read:      { label: 'Đã đọc',       color: '#6b6760', bg: '#f5f0e8' },
  replied:   { label: 'Đã trả lời',   color: '#1a6b52', bg: '#e8f4ef' },
}

function StatusBadge({ status }: { status: string }) {
  const s = statusLabel[status] ?? { label: status, color: '#666', bg: '#eee' }
  return (
    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: 500, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-3)' }}>
        Đang tải...
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-.5px' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-3)', marginTop: '4px' }}>Tổng quan nhà hàng Nhật Bản</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Đặt bàn mới', value: stats?.reservations_pending ?? 0, icon: '📅', color: '#92400e', bg: '#fffbeb', link: '/reservations' },
          { label: 'Tổng đặt bàn', value: stats?.reservations_total ?? 0, icon: '📊', color: 'var(--accent)', bg: 'var(--accent-light)', link: '/reservations' },
          { label: 'Liên hệ mới', value: stats?.contacts_new ?? 0, icon: '✉', color: '#1d4ed8', bg: '#eff6ff', link: '/contacts' },
          { label: 'Tổng liên hệ', value: stats?.contacts_total ?? 0, icon: '📬', color: 'var(--text-2)', bg: 'var(--warm)', link: '/contacts' },
          { label: 'Món ăn', value: stats?.menu_items ?? 0, icon: '🍣', color: 'var(--accent)', bg: 'var(--accent-light)', link: '/menu-items' },
          { label: 'Đánh giá', value: stats?.testimonials ?? 0, icon: '⭐', color: '#d97706', bg: '#fffbeb', link: '/testimonials' },
        ].map(stat => (
          <Link key={stat.label} to={stat.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', transition: 'box-shadow .2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.06)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: stat.color, letterSpacing: '-1px', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Reservations */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Đặt bàn gần đây</div>
            <Link to="/reservations" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Xem tất cả</Link>
          </div>
          {(stats?.recent_reservations ?? []).length === 0 ? (
            <div style={{ color: 'var(--text-3)', fontSize: '13px', textAlign: 'center', padding: '16px' }}>Chưa có đặt bàn</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(stats?.recent_reservations ?? []).map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--bg)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{r.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{r.date} {r.time} · {r.guests} người</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contacts */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Liên hệ gần đây</div>
            <Link to="/contacts" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Xem tất cả</Link>
          </div>
          {(stats?.recent_contacts ?? []).length === 0 ? (
            <div style={{ color: 'var(--text-3)', fontSize: '13px', textAlign: 'center', padding: '16px' }}>Chưa có liên hệ</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(stats?.recent_contacts ?? []).map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--bg)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{c.subject || c.email}</div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ marginTop: '24px', padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-2)' }}>Thao tác nhanh</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { to: '/slides/new', label: 'Thêm slide mới' },
            { to: '/menu-items/new', label: 'Thêm món ăn' },
            { to: '/testimonials/new', label: 'Thêm đánh giá' },
            { to: '/settings', label: 'Cài đặt website' },
          ].map(q => (
            <Link key={q.to} to={q.to} style={{ fontSize: '13px', padding: '8px 16px', background: 'var(--warm)', borderRadius: '8px', color: 'var(--text-2)', textDecoration: 'none', border: '1px solid var(--border)' }}>
              {q.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
