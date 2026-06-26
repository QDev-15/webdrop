import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number; name: string; phone: string; service: string
  technician: string; date: string; time: string; note: string
  status: string; created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới', confirmed: 'Xác nhận', done: 'Hoàn thành', cancelled: 'Hủy',
}
const STATUS_CLASSES: Record<string, string> = {
  new: 'badge-new', confirmed: 'badge-confirmed', done: 'badge-published', cancelled: 'badge-cancelled',
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get<Booking[]>('/bookings').then(data => { setBookings(data); setLoading(false) })
  }, [])

  async function changeStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa lịch hẹn này?')) return
    await api.delete(`/bookings/${id}`)
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Lịch hẹn</div>
          <div className="page-sub">Quản lý đặt lịch làm nail từ website</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all','new','confirmed','done','cancelled'].map(s => (
            <button key={s} className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'} onClick={() => setFilter(s)}>
              {s === 'all' ? 'Tất cả' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Khách hàng</th><th>Dịch vụ</th><th>Thợ</th>
              <th>Ngày</th><th>Giờ</th><th>Trạng thái</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                </td>
                <td>
                  <div style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.service}</div>
                  {b.note && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{b.note.slice(0, 40)}...</div>}
                </td>
                <td>{b.technician || '—'}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>
                  <select
                    className={`badge ${STATUS_CLASSES[b.status] ?? ''}`}
                    value={b.status}
                    onChange={e => changeStatus(b.id, e.target.value)}
                    style={{ border: 'none', cursor: 'pointer', background: 'inherit', color: 'inherit', fontWeight: 500, fontSize: 11.5 }}
                  >
                    <option value="new">Mới</option>
                    <option value="confirmed">Xác nhận</option>
                    <option value="done">Hoàn thành</option>
                    <option value="cancelled">Hủy</option>
                  </select>
                </td>
                <td>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7}>
                <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">Không có lịch hẹn</div></div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
