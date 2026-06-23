import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  name: string
  phone: string
  service_group: string
  service_detail: string
  stylist: string
  book_date: string
  book_time: string
  note: string
  status: string
  created_at: string
}

const statusLabel: Record<string, string> = {
  pending:   'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
  done:      'Hoàn thành',
}
const statusBadge: Record<string, string> = {
  pending:   'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  done:      'badge-published',
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    try { setBookings(await api.get<Booking[]>('/bookings')) }
    finally { setLoading(false) }
  }

  async function changeStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa lịch hẹn này?')) return
    await api.delete(`/bookings/${id}`)
    load()
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Quản lý lịch hẹn</div>
          <div className="page-sub">{bookings.length} lịch hẹn tổng cộng</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all','pending','confirmed','done','cancelled'].map(s => (
          <button
            key={s}
            className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'Tất cả' : statusLabel[s]}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Điện thoại</th>
              <th>Dịch vụ</th>
              <th>Ngày & Giờ</th>
              <th>Stylist</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.name}</div>
                  {b.note && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>📝 {b.note}</div>}
                </td>
                <td>
                  <a href={`tel:${b.phone}`} style={{ color: 'var(--accent)' }}>{b.phone}</a>
                </td>
                <td>
                  <div>{b.service_group}</div>
                  {b.service_detail && <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{b.service_detail}</div>}
                </td>
                <td>
                  <div>{b.book_date}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{b.book_time}</div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{b.stylist || '—'}</td>
                <td>
                  <span className={`badge ${statusBadge[b.status] ?? 'badge-pending'}`}>
                    {statusLabel[b.status] ?? b.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {b.status === 'pending' && (
                      <button className="btn-accent btn-sm" onClick={() => changeStatus(b.id, 'confirmed')}>Xác nhận</button>
                    )}
                    {b.status === 'confirmed' && (
                      <button className="btn-ghost btn-sm" onClick={() => changeStatus(b.id, 'done')}>Hoàn thành</button>
                    )}
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button className="btn-danger btn-sm" onClick={() => changeStatus(b.id, 'cancelled')}>Hủy</button>
                    )}
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>Không có lịch hẹn nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
