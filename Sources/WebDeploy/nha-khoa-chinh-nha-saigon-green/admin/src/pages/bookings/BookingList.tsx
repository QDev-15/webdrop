import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  full_name: string
  phone: string
  email: string
  service_name: string
  pref_date: string
  pref_time: string
  message: string
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new:       'Mới',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
}
const STATUS_BADGE: Record<string, string> = {
  new:       'badge-new',
  confirmed: 'badge-published',
  completed: 'badge-published',
  cancelled: 'badge-draft',
}

export default function BookingList() {
  const [items, setItems]       = useState<Booking[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState<Booking | null>(null)

  useEffect(() => { load() }, [filter])

  async function load() {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/bookings' : `/bookings?status=${filter}`
      setItems(await api.get<Booking[]>(url))
    } finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
    load()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20, alignItems: 'start' }}>
      <div>
        <div className="page-header">
          <div>
            <div className="page-title">Đặt lịch tư vấn</div>
            <div className="page-sub">{items.length} lịch hẹn</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'new', 'confirmed', 'completed', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}
              >
                {s === 'all' ? 'Tất cả' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">Không có lịch hẹn nào.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Dịch vụ quan tâm</th>
                  <th>Ngày / Giờ mong muốn</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(b => (
                  <tr
                    key={b.id}
                    style={{ cursor: 'pointer', background: selected?.id === b.id ? 'var(--warm)' : '' }}
                    onClick={() => setSelected(s => s?.id === b.id ? null : b)}
                  >
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.full_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 160 }}>{b.service_name || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      {b.pref_date || '—'}{b.pref_time ? ' ' + b.pref_time : ''}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[b.status] ?? 'badge-draft'}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {new Date(b.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <select
                        value={b.status}
                        onChange={e => updateStatus(b.id, e.target.value)}
                        className="form-control"
                        style={{ fontSize: 12, padding: '4px 8px', width: 130 }}
                      >
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="card" style={{ position: 'sticky', top: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Chi tiết lịch hẹn</div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <div className="form-label">Khách hàng</div>
              <div style={{ fontWeight: 500 }}>{selected.full_name}</div>
            </div>
            <div>
              <div className="form-label">Số điện thoại</div>
              <a href={`tel:${selected.phone}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{selected.phone}</a>
            </div>
            {selected.email && (
              <div>
                <div className="form-label">Email</div>
                <div style={{ fontSize: 13 }}>{selected.email}</div>
              </div>
            )}
            <div>
              <div className="form-label">Dịch vụ quan tâm</div>
              <div style={{ fontSize: 13 }}>{selected.service_name || '—'}</div>
            </div>
            <div>
              <div className="form-label">Ngày / Giờ mong muốn</div>
              <div style={{ fontSize: 13 }}>
                {selected.pref_date || '—'}{selected.pref_time ? ' lúc ' + selected.pref_time : ''}
              </div>
            </div>
            {selected.message && (
              <div>
                <div className="form-label">Tin nhắn</div>
                <div style={{ fontSize: 13, background: 'var(--warm)', padding: '10px 12px', borderRadius: 8, lineHeight: 1.6 }}>{selected.message}</div>
              </div>
            )}
            {selected.note && (
              <div>
                <div className="form-label">Ghi chú nội bộ</div>
                <div style={{ fontSize: 13, background: 'var(--warm)', padding: '10px 12px', borderRadius: 8, lineHeight: 1.6 }}>{selected.note}</div>
              </div>
            )}
            <div>
              <div className="form-label">Ngày đặt</div>
              <div style={{ fontSize: 13 }}>{new Date(selected.created_at).toLocaleString('vi-VN')}</div>
            </div>
            <div>
              <div className="form-label">Trạng thái</div>
              <select
                value={selected.status}
                onChange={e => updateStatus(selected.id, e.target.value)}
                className="form-control"
                style={{ fontSize: 13 }}
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
