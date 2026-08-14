import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  name: string
  email: string
  phone: string
  service_name: string
  experience_level: string
  preferred_time: string
  start_date: string
  package: string
  health_note: string
  goal: string
  how_know: string
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

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [detail, setDetail] = useState<Booking | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.get<Booking[]>('/bookings')
      setItems(data)
      setError('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/bookings/${id}`, { status })
      setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
      if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
    } catch (err) {
      alert((err as Error).message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đặt lịch này?')) return
    try {
      await api.delete(`/bookings/${id}`)
      setDetail(null)
      load()
    } catch (err) {
      alert((err as Error).message)
    }
  }

  const filterStatuses = ['', 'new', 'contacted', 'confirmed', 'cancelled']
  const filtered = filter ? items.filter(i => i.status === filter) : items

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Đặt lịch</div>
          <div className="page-sub">
            {items.filter(i => i.status === 'new').length} mới · {items.length} tổng
          </div>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {filterStatuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {s === '' ? 'Tất cả' : (STATUS_LABELS[s] ?? s)}
            <span style={{ marginLeft: 4, opacity: .7 }}>({items.filter(i => s === '' || i.status === s).length})</span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Chưa có đặt lịch nào</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 420px' : '1fr', gap: 16 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Dịch vụ</th>
                  <th>Ngày bắt đầu</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => setDetail(detail?.id === item.id ? null : item)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: item.status === 'new' ? 600 : undefined,
                      background: detail?.id === item.id ? 'var(--accent-light)' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{item.phone}</div>
                      {item.email && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.email}</div>}
                    </td>
                    <td style={{ fontSize: 13 }}>{item.service_name || '—'}</td>
                    <td style={{ fontSize: 13 }}>{item.start_date || '—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[item.status] ?? ''}`}>{STATUS_LABELS[item.status] ?? item.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleDelete(item.id)} className="btn-ghost btn-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Không có đặt lịch phù hợp bộ lọc.</div>
            )}
          </div>

          {detail && (
            <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Chi tiết đặt lịch</div>
                <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
              </div>

              {[
                ['Họ tên', detail.name],
                ['Điện thoại', detail.phone],
                ['Email', detail.email || '—'],
                ['Dịch vụ', detail.service_name || '—'],
                ['Trình độ', detail.experience_level || '—'],
                ['Khung giờ ưu tiên', detail.preferred_time || '—'],
                ['Ngày bắt đầu', detail.start_date || '—'],
                ['Gói quan tâm', detail.package || '—'],
                ['Tình trạng sức khỏe', detail.health_note || '—'],
                ['Mục tiêu', detail.goal || '—'],
                ['Biết đến qua', detail.how_know || '—'],
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
                    <button
                      key={s}
                      onClick={() => updateStatus(detail.id, s)}
                      className={detail.status === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => handleDelete(detail.id)} className="btn-danger" style={{ width: '100%', marginTop: 16 }}>
                Xóa đặt lịch
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
