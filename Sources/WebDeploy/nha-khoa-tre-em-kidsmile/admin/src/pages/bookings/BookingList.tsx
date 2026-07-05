import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  parent_name: string
  phone: string
  email: string
  child_name: string
  child_age: string
  service: string
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
  done: 'Hoàn thành',
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setBookings(await api.get<Booking[]>('/bookings')) }
    finally { setLoading(false) }
  }

  async function handleStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa lịch hẹn này?')) return
    await api.delete(`/bookings/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đặt lịch khám</div>
          <div className="page-sub">{bookings.length} lịch hẹn</div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Phụ huynh</th>
              <th>Bé</th>
              <th>Dịch vụ</th>
              <th>Ngày / Giờ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(bk => (
              <tr key={bk.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{bk.parent_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{bk.phone}</div>
                  {bk.email && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{bk.email}</div>}
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{bk.child_name}</div>
                  {bk.child_age && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{bk.child_age}</div>}
                </td>
                <td>
                  {bk.service
                    ? <span className="badge badge-published">{bk.service}</span>
                    : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>Chưa chọn</span>
                  }
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{bk.date}</div>
                  {bk.time && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{bk.time}</div>}
                </td>
                <td>
                  <select
                    value={bk.status || 'new'}
                    onChange={e => handleStatus(bk.id, e.target.value)}
                    className="form-control"
                    style={{ padding: '4px 8px', fontSize: 12, minWidth: 120 }}
                    aria-label="Trạng thái đặt lịch"
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(bk.id)} className="btn-danger btn-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">Chưa có lịch hẹn nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
