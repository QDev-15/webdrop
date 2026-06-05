import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  reservations_pending: number
  contacts_new: number
  menu_items_total: number
  gallery_total: number
  recent_reservations: Array<{ id: number; name: string; phone: string; date: string; time: string; guests: number; status: string; created_at: string }>
  recent_contacts: Array<{ id: number; name: string; subject: string; status: string; created_at: string }>
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(console.error)
  }, [])

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: 'badge-pending', confirmed: 'badge-confirmed', cancelled: 'badge-cancelled',
      new: 'badge-new', read: 'badge-read', replied: 'badge-replied',
    }
    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', cancelled: 'Đã hủy',
      new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời',
    }
    return <span className={`badge ${map[s] || 'badge-draft'}`}>{labels[s] || s}</span>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan hoạt động quán cà phê</div>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">Xem website</a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { icon: '📅', value: stats?.reservations_pending ?? '—', label: 'Đặt chỗ chờ', color: '#d97706' },
          { icon: '✉', value: stats?.contacts_new ?? '—', label: 'Liên hệ mới', color: '#1d4ed8' },
          { icon: '☕', value: stats?.menu_items_total ?? '—', label: 'Món trong menu', color: 'var(--accent)' },
          { icon: '🖼', value: stats?.gallery_total ?? '—', label: 'Ảnh gallery', color: '#7e22ce' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-value" style={{ color: s.color }}>{String(s.value)}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent reservations */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Đặt chỗ gần đây</div>
            <Link to="/reservations" style={{ fontSize: '12px', color: 'var(--accent)' }}>Xem tất cả</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Khách</th><th>Ngày/Giờ</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {(stats?.recent_reservations ?? []).map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>{r.phone}</div>
                    </td>
                    <td style={{ fontSize: '12px' }}>{r.date || '—'} {r.time || ''}</td>
                    <td>{statusBadge(r.status)}</td>
                  </tr>
                ))}
                {!stats?.recent_reservations?.length && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px' }}>Chưa có đặt chỗ</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent contacts */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Liên hệ gần đây</div>
            <Link to="/contacts" style={{ fontSize: '12px', color: 'var(--accent)' }}>Xem tất cả</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Khách</th><th>Chủ đề</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {(stats?.recent_contacts ?? []).map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>{c.subject || '—'}</td>
                    <td>{statusBadge(c.status)}</td>
                  </tr>
                ))}
                {!stats?.recent_contacts?.length && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px' }}>Chưa có liên hệ</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
