import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  fullname: string
  phone: string
  email: string
  service: string
  branch: string
  pref_date: string
  pref_time: string
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
}
const STATUS_COLORS: Record<string, string> = {
  new: 'var(--accent)',
  confirmed: '#0284c7',
  cancelled: 'var(--danger)',
}

export default function BookingList() {
  const [items, setItems]     = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail]   = useState<Booking | null>(null)
  const [filter, setFilter]   = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Booking[]>('/bookings')) }
    finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    setItems(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa lịch hẹn này?')) return
    await api.delete(`/bookings/${id}`)
    setDetail(null); load()
  }

  const filtered = filter ? items.filter(b => b.status === filter) : items

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Đặt Lịch Khám</h1>
          <p className="adm-page-sub">{items.filter(b => b.status === 'new').length} lịch mới · {items.length} tổng</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', 'new', 'confirmed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={filter === s ? 'adm-btn-primary adm-btn-sm' : 'adm-btn-ghost adm-btn-sm'}
          >
            {s === '' ? 'Tất cả' : STATUS_LABELS[s]}
            <span style={{ marginLeft: 4, opacity: .7 }}>({items.filter(b => s === '' || b.status === s).length})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 380px' : '1fr', gap: 16 }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Chi nhánh</th>
                <th>Dịch vụ</th>
                <th>Ngày / Giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr
                  key={b.id}
                  onClick={() => setDetail(b)}
                  style={{ cursor: 'pointer', background: detail?.id === b.id ? 'var(--accent-light)' : undefined }}
                >
                  <td>
                    <div style={{ fontWeight: b.status === 'new' ? 700 : 500 }}>{b.fullname}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{b.branch || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{b.service || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    <div>{b.pref_date || '—'}</div>
                    <div>{b.pref_time || '—'}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLORS[b.status] ?? '#666' }}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleDelete(b.id)} className="adm-btn-ghost adm-btn-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="adm-empty">Không có lịch hẹn nào.</p>}
        </div>

        {detail && (
          <div className="adm-detail-panel">
            <div className="adm-detail-header">
              <span style={{ fontWeight: 600 }}>Chi tiết đặt lịch #{detail.id}</span>
              <button onClick={() => setDetail(null)} className="adm-close-btn">×</button>
            </div>
            <div className="adm-detail-body">
              {[
                ['Họ tên',    detail.fullname],
                ['Điện thoại',detail.phone],
                ['Email',     detail.email     || '—'],
                ['Chi nhánh', detail.branch    || '—'],
                ['Dịch vụ',   detail.service   || '—'],
                ['Ngày hẹn',  detail.pref_date || '—'],
                ['Giờ hẹn',   detail.pref_time || '—'],
                ['Ghi chú',   detail.note      || '—'],
                ['Trạng thái',STATUS_LABELS[detail.status] ?? detail.status],
                ['Ngày tạo',  new Date(detail.created_at).toLocaleDateString('vi-VN')],
              ].map(([label, value]) => (
                <div key={label} className="adm-detail-row">
                  <span className="adm-detail-label">{label}</span>
                  <span className="adm-detail-value">{value}</span>
                </div>
              ))}
            </div>
            <div className="adm-detail-actions">
              {detail.status === 'new' && (
                <button onClick={() => updateStatus(detail.id, 'confirmed')} className="adm-btn-primary adm-btn-sm">Xác nhận</button>
              )}
              {detail.status !== 'cancelled' && (
                <button onClick={() => updateStatus(detail.id, 'cancelled')} className="adm-btn-ghost adm-btn-sm">Hủy lịch</button>
              )}
              <button onClick={() => handleDelete(detail.id)} className="adm-btn-danger adm-btn-sm">Xóa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
