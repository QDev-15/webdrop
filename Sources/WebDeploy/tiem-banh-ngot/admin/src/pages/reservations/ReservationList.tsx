import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Order {
  id: number
  name: string
  phone: string
  email: string
  cake_type: string
  cake_size: string
  flavors: string
  decoration_style: string
  color_theme: string
  cake_message: string
  special_request: string
  pickup_date: string
  delivery_type: string
  delivery_address: string
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  in_progress: 'Đang làm',
  ready: 'Sẵn sàng nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#fffbeb',
  confirmed: '#eff6ff',
  in_progress: '#fdf4ff',
  ready: '#f0fdf4',
  completed: 'var(--accent-light)',
  cancelled: '#fff0f0',
}

export default function ReservationList() {
  const [items, setItems] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [detail, setDetail] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Order[]>('/orders')) }
    finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    setUpdating(true)
    try {
      await api.put(`/orders/${id}`, { status })
      if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
      load()
    } finally { setUpdating(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đơn đặt bánh này?')) return
    await api.delete(`/orders/${id}`)
    setDetail(null); load()
  }

  const statusFilters = ['', 'pending', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled']
  const filtered = items.filter(i =>
    !filter || i.status === filter ||
    i.name.toLowerCase().includes(filter.toLowerCase()) ||
    i.phone.includes(filter)
  )

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đơn đặt bánh</div>
          <div className="page-sub">{items.length} đơn hàng</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {statusFilters.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {s === '' ? 'Tất cả' : STATUS_LABELS[s]}
            <span style={{ marginLeft: 4, opacity: .7 }}>({items.filter(i => s === '' || i.status === s).length})</span>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <input type="text" className="form-control" placeholder="Tìm kiếm tên khách, SĐT..."
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 260 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 380px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Loại bánh</th>
                <th>Ngày nhận</th>
                <th>Giao hàng</th>
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
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{r.cake_type || '—'}</div>
                    {r.cake_size && <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{r.cake_size}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.pickup_date || '—'}</div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {r.delivery_type === 'delivery' ? 'Giao tận nơi' : 'Nhận tại tiệm'}
                  </td>
                  <td>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: STATUS_COLORS[r.status] ?? 'var(--warm)', fontWeight: 500 }}>
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.status === 'pending' && <button onClick={() => updateStatus(r.id, 'confirmed')} className="btn-accent btn-sm" disabled={updating}>Xác nhận</button>}
                      {r.status === 'confirmed' && <button onClick={() => updateStatus(r.id, 'in_progress')} className="btn-accent btn-sm" disabled={updating}>Bắt đầu làm</button>}
                      {r.status === 'in_progress' && <button onClick={() => updateStatus(r.id, 'ready')} className="btn-accent btn-sm" disabled={updating}>Đã xong</button>}
                      {!['completed','cancelled'].includes(r.status) && (
                        <button onClick={() => updateStatus(r.id, 'cancelled')} className="btn-danger btn-sm" disabled={updating}>Hủy</button>
                      )}
                      <button onClick={() => handleDelete(r.id)} className="btn-ghost btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">🎂</div><div className="empty-state-text">Không có đơn đặt bánh nào.</div></div>}
        </div>

        {detail && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>Chi tiết đơn #{detail.id}</div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {[
              ['Tên khách', detail.name],
              ['Điện thoại', detail.phone],
              ['Email', detail.email || '—'],
              ['Loại bánh', detail.cake_type || '—'],
              ['Kích thước', detail.cake_size || '—'],
              ['Hương vị', detail.flavors || '—'],
              ['Phong cách', detail.decoration_style || '—'],
              ['Màu chủ đạo', detail.color_theme || '—'],
              ['Thông điệp', detail.cake_message || '—'],
              ['Yêu cầu khác', detail.special_request || '—'],
              ['Ngày nhận', detail.pickup_date || '—'],
              ['Hình thức', detail.delivery_type === 'delivery' ? 'Giao tận nơi' : 'Nhận tại tiệm'],
              ['Địa chỉ giao', detail.delivery_address || '—'],
              ['Ghi chú', detail.note || '—'],
              ['Trạng thái', STATUS_LABELS[detail.status] ?? detail.status],
              ['Ngày gửi', new Date(detail.created_at).toLocaleDateString('vi-VN')],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', width: 110, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 13, flex: 1 }}>{value}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {detail.status === 'pending' && <button onClick={() => updateStatus(detail.id, 'confirmed')} className="btn-accent btn-sm" disabled={updating}>Xác nhận</button>}
              {detail.status === 'confirmed' && <button onClick={() => updateStatus(detail.id, 'in_progress')} className="btn-accent btn-sm" disabled={updating}>Bắt đầu làm</button>}
              {detail.status === 'in_progress' && <button onClick={() => updateStatus(detail.id, 'ready')} className="btn-accent btn-sm" disabled={updating}>Đã xong</button>}
              {!['completed','cancelled'].includes(detail.status) && (
                <button onClick={() => updateStatus(detail.id, 'cancelled')} className="btn-danger btn-sm" disabled={updating}>Hủy đơn</button>
              )}
              <button onClick={() => handleDelete(detail.id)} className="btn-ghost btn-sm">Xóa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
