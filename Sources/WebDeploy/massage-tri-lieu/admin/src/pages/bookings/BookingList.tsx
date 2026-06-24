import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  name: string
  phone: string
  service_type: string
  duration: string
  therapist: string
  book_date: string
  book_time: string
  health_note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: '#eff6ff', color: '#1d4ed8' },
  confirmed: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  completed: { bg: '#f0fdf4', color: '#15803d' },
  cancelled: { bg: '#fff0f0', color: 'var(--danger)' },
}

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Booking | null>(null)

  const load = () => {
    setLoading(true)
    api.get<Booking[]>('/bookings').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id: number, status: string) => {
    try { await api.put(`/bookings/${id}`, { status }); load() } catch {}
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa lịch đặt này?')) return
    try { await api.delete(`/bookings/${id}`); setSelected(null); load() } catch {}
  }

  const sc = (s: string) => STATUS_COLORS[s] || { bg: 'var(--warm)', color: 'var(--text-3)' }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Quản lý đặt lịch</div>
          <div className="page-sub">Danh sách lịch đặt massage từ khách hàng</div>
        </div>
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 460, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Chi tiết đặt lịch #{selected.id}</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-3)' }}>✕</button>
            </div>
            {[
              ['Họ tên', selected.name],
              ['Số điện thoại', selected.phone],
              ['Dịch vụ', selected.service_type],
              ['Thời lượng', selected.duration],
              ['Chuyên viên', selected.therapist || 'Không có ưu tiên'],
              ['Ngày hẹn', selected.book_date],
              ['Giờ hẹn', selected.book_time],
              ['Ghi chú sức khỏe', selected.health_note || '—'],
              ['Ngày đặt', new Date(selected.created_at).toLocaleString('vi-VN')],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: 13.5 }}>
                <span style={{ color: 'var(--text-3)', minWidth: 140 }}>{k}:</span>
                <span style={{ fontWeight: 500, color: 'var(--text)' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>Cập nhật trạng thái</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <button key={key} onClick={() => handleStatus(selected.id, key)}
                    style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer',
                      background: selected.status === key ? sc(key).bg : 'transparent',
                      color: selected.status === key ? sc(key).color : 'var(--text-2)', fontFamily: 'var(--sans)' }}>
                    {label}
                  </button>
                ))}
              </div>
              <button className="btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Xóa đặt lịch</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: 'var(--text-3)' }}>Đang tải...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>ID</th><th>Họ tên</th><th>SĐT</th><th>Dịch vụ</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th><th>Thao tác</th>
            </tr></thead>
            <tbody>
              {items.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td style={{ fontWeight: 500 }}>{b.name}</td>
                  <td>{b.phone}</td>
                  <td style={{ fontSize: 12 }}>{b.service_type}</td>
                  <td style={{ fontSize: 12 }}>{b.book_date}</td>
                  <td style={{ fontSize: 12 }}>{b.book_time}</td>
                  <td>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, ...sc(b.status) }}>
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-ghost btn-sm" onClick={() => setSelected(b)}>Chi tiết</button>
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
