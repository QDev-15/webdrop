import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  name: string
  phone: string
  email: string
  service: string
  date: string
  time_slot: string
  note: string
  status: string
  created_at: string
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã huỷ' },
]

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Booking[]>('/bookings')
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id: number, status: string) => {
    try {
      await api.put(`/bookings/${id}`, { status })
      load()
    } catch (e: unknown) {
      alert((e as Error).message)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xoá lịch hẹn của "${name}"?`)) return
    try {
      await api.delete(`/bookings/${id}`)
      load()
    } catch (e: unknown) {
      alert((e as Error).message)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Lịch hẹn</h1>
        <span className="badge-count">{bookings.filter(b => b.status === 'new').length} mới</span>
      </div>

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Khách hàng</th>
              <th>Dịch vụ</th>
              <th>Ngày / Giờ</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={7} className="empty-row">Chưa có lịch hẹn nào.</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  <div className="fw-600">{b.name}</div>
                  <div className="text-muted">{b.phone}</div>
                  {b.email && <div className="text-muted">{b.email}</div>}
                </td>
                <td>{b.service || '—'}</td>
                <td>
                  {b.date && <div>{b.date}</div>}
                  {b.time_slot && <div className="text-muted">{b.time_slot}</div>}
                </td>
                <td style={{ maxWidth: 180, fontSize: 13 }}>{b.note || '—'}</td>
                <td>
                  <select
                    className="select-sm"
                    value={b.status}
                    onChange={e => handleStatus(b.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id, b.name)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
