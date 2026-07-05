import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  fullname: string
  phone: string
  email: string
  service: string
  pref_date: string
  pref_time: string
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', done: 'Hoàn thành', cancelled: 'Đã hủy'
}
const STATUS_COLORS: Record<string, string> = {
  new: '#dbeafe', confirmed: '#dcfce7', done: '#f0fdf4', cancelled: '#fee2e2'
}

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)

  const load = () => {
    api.get<Booking[]>('/bookings').then(setItems).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/bookings/${id}`, { status })
      setMsg('Đã cập nhật trạng thái.')
      load()
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    } catch { setMsg('Lỗi cập nhật.') }
  }

  const del = async (id: number) => {
    if (!confirm('Xóa đặt lịch này?')) return
    try { await api.delete(`/bookings/${id}`); setMsg('Đã xóa.'); load(); setSelected(null) }
    catch { setMsg('Lỗi xóa.') }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Đặt lịch</h1>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Tổng: {items.length}</span>
      </div>
      {msg && <div style={{ marginBottom: 12, color: 'var(--accent)', fontSize: 13 }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 20 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Khách hàng</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Dịch vụ</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Ngày hẹn</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Trạng thái</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, color: 'var(--text-2)' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: selected?.id === b.id ? 'var(--warm)' : 'transparent' }}
                  onClick={() => setSelected(b)}>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{b.fullname}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{b.phone}</div>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-2)' }}>{b.service || '—'}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-2)' }}>{b.pref_date} {b.pref_time && `(${b.pref_time})`}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: STATUS_COLORS[b.status] || '#f1f5f9', color: 'var(--text)' }}>
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                      style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, background: 'var(--bg)', marginRight: 6 }}>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <button onClick={() => del(b.id)} style={{ padding: '5px 10px', background: '#fee2e2', color: 'var(--danger)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có lịch đặt nào.</div>}
        </div>

        {selected && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Chi tiết đặt lịch #{selected.id}</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 16 }}>✕</button>
            </div>
            <Detail label="Họ tên" value={selected.fullname} />
            <Detail label="Điện thoại" value={selected.phone} />
            <Detail label="Email" value={selected.email || '—'} />
            <Detail label="Dịch vụ" value={selected.service || '—'} />
            <Detail label="Ngày mong muốn" value={selected.pref_date || '—'} />
            <Detail label="Khung giờ" value={selected.pref_time || '—'} />
            <Detail label="Ghi chú" value={selected.note || '—'} />
            <Detail label="Trạng thái" value={STATUS_LABELS[selected.status] || selected.status} />
            <Detail label="Ngày tạo" value={selected.created_at} />
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-3)', minWidth: 100 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text)' }}>{value}</span>
    </div>
  )
}
