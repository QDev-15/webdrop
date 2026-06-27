import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  name: string
  phone: string
  email: string
  service_name: string
  num_people: number
  preferred_date: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
}

const STATUS_OPTIONS = ['new', 'confirmed', 'cancelled'] as const
type StatusOption = typeof STATUS_OPTIONS[number]

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [changingStatus, setChangingStatus] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Booking[]>('/bookings')) }
    finally { setLoading(false) }
  }

  async function changeStatus(id: number, status: StatusOption) {
    setChangingStatus(id)
    try {
      await api.put(`/bookings/${id}`, { status })
      setItems(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } finally {
      setChangingStatus(null)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đơn đặt gói này?')) return
    await api.delete(`/bookings/${id}`)
    load()
  }

  const filtered = filterStatus
    ? items.filter(b => b.status === filterStatus)
    : items

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const newCount = items.filter(b => b.status === 'new').length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đặt gói dịch vụ</div>
          <div className="page-sub">
            {newCount > 0 ? `${newCount} đơn mới · ` : ''}{items.length} tổng
          </div>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['', 'Tất cả'], ['new', 'Mới'], ['confirmed', 'Đã xác nhận'], ['cancelled', 'Đã hủy']].map(([s, label]) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={filterStatus === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}
          >
            {label}
            <span style={{ marginLeft: 4, opacity: .65 }}>
              ({items.filter(b => s === '' || b.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <div>Chưa có đơn đặt gói nào.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Điện thoại</th>
                <th>Email</th>
                <th>Gói đặt</th>
                <th>Số người</th>
                <th>Ngày ưu tiên</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ fontWeight: b.status === 'new' ? 600 : undefined }}>
                  <td style={{ fontWeight: 500 }}>{b.name}</td>
                  <td style={{ fontSize: 13 }}>{b.phone || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{b.email || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{b.service_name || '—'}</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-2)' }}>{b.num_people || 1}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td>
                    <select
                      className={`badge badge-${b.status}`}
                      value={b.status}
                      disabled={changingStatus === b.id}
                      onChange={e => changeStatus(b.id, e.target.value as StatusOption)}
                      style={{ cursor: 'pointer', border: 'none', background: 'transparent', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500 }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {new Date(b.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Xóa</button>
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
