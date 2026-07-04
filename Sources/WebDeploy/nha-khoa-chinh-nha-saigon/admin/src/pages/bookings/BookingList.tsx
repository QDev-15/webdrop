import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  customer_name: string
  phone: string
  email: string
  pref_service: string
  pref_date: string
  pref_time: string
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Moi',
  confirmed: 'Da xac nhan',
  done: 'Hoan thanh',
  cancelled: 'Da huy',
}
const STATUS_BADGE: Record<string, string> = {
  new: 'badge-new',
  confirmed: 'badge-building',
  done: 'badge-done',
  cancelled: 'badge-draft',
}

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = () => {
    api.get<Booking[]>('/bookings').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const updateStatus = async (id: number, status: string) => {
    await api.put(`/bookings/${id}`, { status })
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xoa dat lich nay?')) return
    await api.delete(`/bookings/${id}`)
    load()
  }

  const filtered = filter === 'all' ? items : items.filter(b => b.status === filter)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dat lich tu van</div>
          <div className="page-subtitle">Quan ly lich hen tu khach hang</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'new', 'confirmed', 'done', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
              {s === 'all' ? 'Tat ca' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Dang tai...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Khach hang</th>
                <th>Dien thoai</th>
                <th>Dich vu</th>
                <th>Ngay / Gio</th>
                <th>Trang thai</th>
                <th>Ngay gui</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>
                    {b.customer_name}
                    {b.email && <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{b.email}</div>}
                  </td>
                  <td><a href={`tel:${b.phone}`} style={{ color: 'var(--accent)' }}>{b.phone}</a></td>
                  <td style={{ color: 'var(--text-2)' }}>{b.pref_service || '—'}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-2)' }}>
                    {b.pref_date || '—'}{b.pref_time ? ` / ${b.pref_time}` : ''}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[b.status] ?? 'badge-draft'}`}>
                      <span className="badge-dot" />
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>
                    {new Date(b.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <div className="td-actions">
                      <select
                        value={b.status}
                        onChange={e => updateStatus(b.id, e.target.value)}
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        <option value="new">Moi</option>
                        <option value="confirmed">Da xac nhan</option>
                        <option value="done">Hoan thanh</option>
                        <option value="cancelled">Da huy</option>
                      </select>
                      <button onClick={() => handleDelete(b.id)} className="btn-danger btn-sm">Xoa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Chua co dat lich nao</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
