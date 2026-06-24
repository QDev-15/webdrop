import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number; name: string; phone: string; email: string
  skin_concerns: string; skin_type: string; prefer_doctor: string
  appt_date: string; appt_time: string; note: string
  status: string; created_at: string
}

const STATUS_OPTIONS = ['new', 'confirmed', 'done', 'cancelled']
const STATUS_LABEL: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', done: 'Hoàn thành', cancelled: 'Đã hủy',
}

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Booking | null>(null)

  function load() {
    api.get<Booking[]>('/bookings')
      .then(setItems)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    load()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoá lịch hẹn này?')) return
    await api.delete(`/bookings/${id}`)
    setSelected(null)
    load()
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Lịch hẹn</h1>
          <p className="page-sub">Quản lý lịch tư vấn và điều trị</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Bệnh nhân</th><th>Điện thoại</th><th>Ngày hẹn</th><th>Giờ</th><th>Trạng thái</th><th></th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={6} className="table-empty">Chưa có lịch hẹn.</td></tr>}
              {items.map(b => (
                <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(b)}>
                  <td>{b.name}</td>
                  <td>{b.phone}</td>
                  <td>{b.appt_date || '—'}</td>
                  <td>{b.appt_time || '—'}</td>
                  <td>
                    <select
                      className="form-input"
                      style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                      value={b.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStatus(b.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                  </td>
                  <td className="table-actions">
                    <button className="btn-icon danger" onClick={e => { e.stopPropagation(); handleDelete(b.id) }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="form-card" style={{ minWidth: 300, maxWidth: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Chi tiết lịch hẹn #{selected.id}</h3>
              <button className="btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="detail-row"><span>Tên:</span> <strong>{selected.name}</strong></div>
            <div className="detail-row"><span>Điện thoại:</span> {selected.phone}</div>
            <div className="detail-row"><span>Email:</span> {selected.email || '—'}</div>
            <div className="detail-row"><span>Vấn đề da:</span> {selected.skin_concerns || '—'}</div>
            <div className="detail-row"><span>Loại da:</span> {selected.skin_type || '—'}</div>
            <div className="detail-row"><span>Bác sĩ ưu tiên:</span> {selected.prefer_doctor || 'Không có'}</div>
            <div className="detail-row"><span>Ngày hẹn:</span> {selected.appt_date || '—'}</div>
            <div className="detail-row"><span>Giờ hẹn:</span> {selected.appt_time || '—'}</div>
            <div className="detail-row"><span>Ghi chú:</span> {selected.note || '—'}</div>
            <div className="detail-row"><span>Ngày tạo:</span> {new Date(selected.created_at).toLocaleString('vi')}</div>
            <div style={{ marginTop: 16 }}>
              <label className="form-label">Cập nhật trạng thái</label>
              <select className="form-input" value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
