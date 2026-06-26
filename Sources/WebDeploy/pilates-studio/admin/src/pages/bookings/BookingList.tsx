import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  name: string
  phone: string
  email: string
  class_type: string
  level: string
  package: string
  goal: string
  preferred_days: string
  preferred_time: string
  start_date: string
  health_conditions: string
  medications: string
  notes: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
}

const STATUS_BADGE: Record<string, string> = {
  new: 'badge-new',
  contacted: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
}

const CLASS_LABELS: Record<string, string> = {
  mat: 'Mat Pilates',
  reformer: 'Reformer Pilates',
  clinical: 'Clinical Pilates',
  prenatal: 'Prenatal Pilates',
  trial: 'Dùng thử miễn phí',
}

export default function BookingList() {
  const [items, setItems]     = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('')
  const [detail, setDetail]   = useState<Booking | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Booking[]>('/bookings')) }
    finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    await api.put(`/bookings/${id}`, { status })
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đăng ký này?')) return
    await api.delete(`/bookings/${id}`)
    setDetail(null)
    load()
  }

  const filterStatuses = ['', 'new', 'contacted', 'confirmed', 'cancelled']
  const filtered = filter
    ? items.filter(i => i.status === filter)
    : items

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đăng ký lớp học</div>
          <div className="page-sub">
            {items.filter(i => i.status === 'new').length} mới · {items.length} tổng
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {filterStatuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {s === '' ? 'Tất cả' : (STATUS_LABELS[s] ?? s)}
            <span style={{ marginLeft: 4, opacity: .7 }}>({items.filter(i => s === '' || i.status === s).length})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 420px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Loại lớp</th>
                <th>Lịch ưu tiên</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}
                  onClick={() => setDetail(detail?.id === b.id ? null : b)}
                  style={{ cursor: 'pointer', fontWeight: b.status === 'new' ? 600 : undefined,
                    background: detail?.id === b.id ? 'var(--accent-light)' : undefined }}>
                  <td>
                    <div>{b.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                    {b.email && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{b.email}</div>}
                  </td>
                  <td style={{ fontSize: 13 }}>{CLASS_LABELS[b.class_type] ?? b.class_type ?? '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {b.preferred_days && <div>{b.preferred_days}</div>}
                    {b.preferred_time && <div>{b.preferred_time}</div>}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[b.status] ?? ''}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {new Date(b.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleDelete(b.id)} className="btn-ghost btn-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <div className="empty-state-text">Không có đăng ký nào.</div>
            </div>
          )}
        </div>

        {detail && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Chi tiết đăng ký</div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            {[
              ['Họ tên', detail.name],
              ['Điện thoại', detail.phone],
              ['Email', detail.email || '—'],
              ['Loại lớp', (CLASS_LABELS[detail.class_type] ?? detail.class_type) || '—'],
              ['Cấp độ', detail.level || '—'],
              ['Gói quan tâm', detail.package || '—'],
              ['Mục tiêu', detail.goal || '—'],
              ['Ngày ưu tiên', detail.preferred_days || '—'],
              ['Khung giờ ưu tiên', detail.preferred_time || '—'],
              ['Ngày bắt đầu dự kiến', detail.start_date || '—'],
              ['Tình trạng sức khỏe', detail.health_conditions || '—'],
              ['Thuốc đang dùng', detail.medications || '—'],
              ['Ghi chú', detail.notes || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', width: 130, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 13, flex: 1, color: 'var(--text)' }}>{value}</div>
              </div>
            ))}

            <div style={{ marginTop: 16 }}>
              <div className="form-label" style={{ marginBottom: 8 }}>Cập nhật trạng thái:</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['new', 'contacted', 'confirmed', 'cancelled'].map(s => (
                  <button key={s}
                    onClick={() => updateStatus(detail.id, s)}
                    className={detail.status === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => handleDelete(detail.id)} className="btn-danger" style={{ width: '100%', marginTop: 16 }}>
              Xóa đăng ký
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
