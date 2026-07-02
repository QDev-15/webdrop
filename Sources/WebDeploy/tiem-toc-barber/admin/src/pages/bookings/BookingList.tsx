import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  full_name: string
  phone: string
  service_name: string
  stylist_pref: string
  pref_date: string
  pref_time: string
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã hủy',
}
const STATUS_OPTIONS = ['new', 'confirmed', 'completed', 'cancelled']

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [detail, setDetail] = useState<Booking | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Booking[]>('/bookings')) }
    finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa lịch đặt này?')) return
    await api.delete(`/bookings/${id}`)
    if (detail?.id === id) setDetail(null)
    load()
  }

  const filtered = filter ? items.filter(i => i.status === filter) : items

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đặt lịch</div>
          <div className="page-sub">{items.filter(i => i.status === 'new').length} lịch mới · {items.length} tổng</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {s === '' ? 'Tất cả' : STATUS_LABELS[s]}
            <span style={{ marginLeft: 4, opacity: .7 }}>({s === '' ? items.length : items.filter(i => i.status === s).length})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 360px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Ngày / Giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} onClick={() => setDetail(b)} style={{ cursor: 'pointer', background: detail?.id === b.id ? 'var(--accent-light)' : undefined }}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.full_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{b.service_name || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.pref_date || '—'} {b.pref_time}</td>
                  <td><span className={`badge badge-${b.status === 'new' ? 'new' : b.status === 'confirmed' ? 'confirmed' : b.status === 'completed' ? 'published' : 'cancelled'}`}>{STATUS_LABELS[b.status] ?? b.status}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleDelete(b.id)} className="btn-ghost btn-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">Không có lịch đặt nào.</div></div>}
        </div>

        {detail && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Chi tiết lịch đặt</div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {[
              ['Họ tên', detail.full_name],
              ['Điện thoại', detail.phone],
              ['Dịch vụ', detail.service_name || '—'],
              ['Stylist yêu cầu', detail.stylist_pref || '—'],
              ['Ngày muốn đến', detail.pref_date || '—'],
              ['Giờ muốn đến', detail.pref_time || '—'],
              ['Ngày gửi', new Date(detail.created_at).toLocaleDateString('vi-VN')],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', width: 120, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 13, flex: 1 }}>{value}</div>
              </div>
            ))}
            {detail.note && (
              <div style={{ marginTop: 12, padding: '12px', background: 'var(--bg)', borderRadius: 8, fontSize: 13, lineHeight: 1.7, color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                {detail.note}
              </div>
            )}
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={detail.status} onChange={e => updateStatus(detail.id, e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
