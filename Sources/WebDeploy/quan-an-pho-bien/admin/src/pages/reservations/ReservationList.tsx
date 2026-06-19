import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Reservation {
  id: number
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
}

export default function ReservationList() {
  const [items, setItems] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [detail, setDetail] = useState<Reservation | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Reservation[]>('/reservations')) }
    finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    setUpdating(true)
    try {
      await api.put(`/reservations/${id}`, { status })
      if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
      load()
    } finally { setUpdating(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đơn đặt bàn này?')) return
    await api.delete(`/reservations/${id}`)
    setDetail(null); load()
  }

  const isStatusFilter = ['', 'pending', 'confirmed', 'cancelled'].includes(filter)
  const filtered = items.filter(i =>
    isStatusFilter
      ? (!filter || i.status === filter)
      : (i.name.toLowerCase().includes(filter.toLowerCase()) || i.phone.includes(filter) || i.date.includes(filter))
  )

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Quản lý đặt bàn</div>
          <div className="page-sub">{items.length} đơn đặt bàn</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {(['', 'pending', 'confirmed', 'cancelled'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {s === '' ? 'Tất cả' : STATUS_LABELS[s]}
            <span style={{ marginLeft: 4, opacity: .7 }}>({items.filter(i => s === '' || i.status === s).length})</span>
          </button>
        ))}
        <input type="text" className="form-control" placeholder="Tìm tên, SĐT, ngày..."
          value={isStatusFilter ? '' : filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 220, marginLeft: 8 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 360px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Ngày & Giờ</th>
                <th>Số khách</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} onClick={() => setDetail(r)} style={{ cursor: 'pointer', background: detail?.id === r.id ? 'var(--accent-light)' : undefined }}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{r.phone}</div>
                    {r.email && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{r.email}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.date}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{r.time}</div>
                  </td>
                  <td>{r.guests} người</td>
                  <td><span className={`badge badge-${r.status}`}>{STATUS_LABELS[r.status] ?? r.status}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status === 'pending' && <button onClick={() => updateStatus(r.id, 'confirmed')} className="btn-accent btn-sm" disabled={updating}>Xác nhận</button>}
                      {r.status !== 'cancelled' && <button onClick={() => updateStatus(r.id, 'cancelled')} className="btn-danger btn-sm" disabled={updating}>Hủy</button>}
                      <button onClick={() => handleDelete(r.id)} className="btn-ghost btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">Không có đơn đặt bàn nào.</div></div>}
        </div>

        {detail && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>Chi tiết đặt bàn #{detail.id}</div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {[
              ['Tên khách', detail.name],
              ['Điện thoại', detail.phone],
              ['Email', detail.email || '—'],
              ['Ngày', detail.date],
              ['Giờ', detail.time],
              ['Số khách', String(detail.guests) + ' người'],
              ['Ghi chú', detail.note || '—'],
              ['Trạng thái', STATUS_LABELS[detail.status] ?? detail.status],
              ['Ngày gửi', new Date(detail.created_at).toLocaleDateString('vi-VN')],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', width: 100, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 13, flex: 1 }}>{value}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {detail.status === 'pending' && <button onClick={() => updateStatus(detail.id, 'confirmed')} className="btn-accent btn-sm" disabled={updating}>Xác nhận</button>}
              {detail.status !== 'cancelled' && <button onClick={() => updateStatus(detail.id, 'cancelled')} className="btn-danger btn-sm" disabled={updating}>Hủy đơn</button>}
              <button onClick={() => handleDelete(detail.id)} className="btn-ghost btn-sm">Xóa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
