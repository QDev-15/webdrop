import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number; name: string; phone: string; service: string; therapist: string
  date: string; time: string; note: string; status: string; created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', done: 'Hoàn thành', cancelled: 'Đã hủy'
}
const STATUS_COLORS: Record<string, string> = {
  new: '#1d4ed8', confirmed: '#7e22ce', done: 'var(--accent)', cancelled: 'var(--text-3)'
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try { setBookings(await api.get<Booking[]>('/bookings')) }
    catch { setError('Không thể tải lịch hẹn.') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: number, status: string) {
    try { await api.put(`/bookings/${id}`, { status }); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Lỗi') }
  }

  async function remove(id: number) {
    if (!confirm('Xóa lịch hẹn này?')) return
    try { await api.delete(`/bookings/${id}`); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Lỗi xóa') }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Lịch hẹn</div>
          <div className="page-sub">{bookings.filter(b => b.status === 'new').length} lịch hẹn mới</div>
        </div>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="admin-loading">Đang tải...</div> : (
        <div className="card">
          <table className="admin-table">
            <thead>
              <tr><th>Khách hàng</th><th>Dịch vụ</th><th>Chuyên viên</th><th>Ngày / Giờ</th><th>Ghi chú</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{b.service}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{b.therapist || '—'}</td>
                  <td style={{ fontSize: 13 }}>{b.date} · {b.time}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)', maxWidth: 140 }}>{b.note || '—'}</td>
                  <td>
                    <select
                      value={b.status}
                      onChange={e => updateStatus(b.id, e.target.value)}
                      style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 6,
                        border: '1px solid var(--border)', color: STATUS_COLORS[b.status] ?? 'inherit',
                        background: 'var(--surface)', fontFamily: 'var(--sans)', cursor: 'pointer'
                      }}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(b.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
