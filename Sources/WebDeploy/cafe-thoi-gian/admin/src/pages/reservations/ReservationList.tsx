import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Reservation {
  id: number
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number | string
  area: string
  purpose: string
  note: string
  status: string
  created_at: string
}

export default function ReservationList() {
  const [items, setItems] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    api.get<Reservation[]>('/reservations').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  const updateStatus = async (id: number, status: string) => {
    await api.put(`/reservations/${id}`, { status })
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đặt chỗ này?')) return
    await api.delete(`/reservations/${id}`)
    load()
  }

  const filtered = filter ? items.filter(i => i.status === filter) : items
  const statusBadge = (s: string) => {
    const map: Record<string, string> = { pending: 'badge-pending', confirmed: 'badge-confirmed', cancelled: 'badge-cancelled' }
    const labels: Record<string, string> = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', cancelled: 'Đã hủy' }
    return <span className={`badge ${map[s] || 'badge-draft'}`}>{labels[s] || s}</span>
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Đặt chỗ</div><div className="page-sub">{items.length} yêu cầu</div></div>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {['', 'pending', 'confirmed', 'cancelled'].map(s => (
          <button key={s} className="btn-ghost btn-sm" onClick={() => setFilter(s)} style={filter === s ? { background: 'var(--accent-light)', borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>
            {s === '' ? 'Tất cả' : s === 'pending' ? 'Chờ xác nhận' : s === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
          </button>
        ))}
      </div>

      {loading ? <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Khách</th><th>Ngày/Giờ</th><th>Số người</th><th>Khu vực</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>{r.phone} {r.email ? `· ${r.email}` : ''}</div>
                    {r.note && <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px', fontStyle: 'italic' }}>{r.note}</div>}
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    <div>{r.date || '—'}</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '12px' }}>{r.time || ''}</div>
                  </td>
                  <td>{r.guests} người</td>
                  <td style={{ fontSize: '12.5px' }}>{r.area || '—'}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {r.status === 'pending' && <button className="btn-accent btn-sm" onClick={() => updateStatus(r.id, 'confirmed')}>Xác nhận</button>}
                      {r.status !== 'cancelled' && <button className="btn-ghost btn-sm" onClick={() => updateStatus(r.id, 'cancelled')}>Hủy</button>}
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">Không có đặt chỗ nào</div></div></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
