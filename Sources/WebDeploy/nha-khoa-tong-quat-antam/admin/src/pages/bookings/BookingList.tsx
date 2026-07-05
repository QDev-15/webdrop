import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  fullname: string
  phone: string
  email: string
  service: string
  doctor: string
  date: string
  time: string
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
}

const STATUS_CLASS: Record<string, string> = {
  new: 'badge-new',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
}

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Booking | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Booking[]>('/bookings')) }
    finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    setItems(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa lịch hẹn này?')) return
    await api.delete(`/bookings/${id}`)
    setDetail(null); load()
  }

  const filtered = filter
    ? items.filter(b => b.status === filter)
    : items

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đặt lịch khám</div>
          <div className="page-sub">
            {items.filter(b => b.status === 'new').length} mới · {items.length} tổng
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['', 'Tất cả'], ['new', 'Mới'], ['confirmed', 'Đã xác nhận'], ['cancelled', 'Đã hủy']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={filter === val ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {label}
            <span style={{ marginLeft: 4, opacity: .7 }}>
              ({val === '' ? items.length : items.filter(b => b.status === val).length})
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 380px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bệnh nhân</th>
                <th>Dịch vụ</th>
                <th>Ngày / Giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} onClick={() => setDetail(b)}
                  style={{ cursor: 'pointer', background: detail?.id === b.id ? 'var(--accent-light)' : undefined, fontWeight: b.status === 'new' ? 600 : undefined }}>
                  <td>
                    <div>{b.fullname}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                    {b.email && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.email}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{b.service || '—'}</div>
                    {b.doctor && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>BS: {b.doctor}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{b.date || '—'}</div>
                    {b.time && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.time}</div>}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[b.status] || 'badge-draft'}`}>
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {b.status === 'new' && (
                        <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-accent btn-sm">Xác nhận</button>
                      )}
                      <button onClick={() => handleDelete(b.id)} className="btn-ghost btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <div className="empty-state-text">Chưa có lịch hẹn nào.</div>
            </div>
          )}
        </div>

        {detail && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Chi tiết lịch hẹn</div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {([
              ['Họ tên', detail.fullname],
              ['Điện thoại', detail.phone],
              ['Email', detail.email || '—'],
              ['Dịch vụ', detail.service || '—'],
              ['Bác sĩ', detail.doctor || '—'],
              ['Ngày hẹn', detail.date || '—'],
              ['Giờ hẹn', detail.time || '—'],
              ['Trạng thái', STATUS_LABELS[detail.status] || detail.status],
              ['Ngày đặt', new Date(detail.created_at).toLocaleDateString('vi-VN')],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', width: 100, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 13, flex: 1 }}>{value}</div>
              </div>
            ))}
            {detail.note && (
              <div style={{ marginTop: 12, padding: 12, background: 'var(--bg)', borderRadius: 8, fontSize: 13, lineHeight: 1.7, color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                {detail.note}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {detail.status === 'new' && (
                <button onClick={() => updateStatus(detail.id, 'confirmed')} className="btn-accent btn-sm">Xác nhận</button>
              )}
              {detail.status !== 'cancelled' && (
                <button onClick={() => updateStatus(detail.id, 'cancelled')} className="btn-ghost btn-sm">Hủy lịch</button>
              )}
              <button onClick={() => handleDelete(detail.id)} className="btn-ghost btn-sm">Xóa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
