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
  pref_doctor: string
  note: string
  status: string
  created_at: string
}

const STATUS_OPTIONS = ['new', 'confirmed', 'completed', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  new: 'Moi',
  confirmed: 'Da xac nhan',
  completed: 'Hoan thanh',
  cancelled: 'Da huy',
}
const STATUS_COLORS: Record<string, string> = {
  new: '#1d4ed8',
  confirmed: 'var(--accent)',
  completed: '#059669',
  cancelled: 'var(--text-3)',
}

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = () => {
    api.get<Booking[]>('/bookings').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleStatus = async (id: number, status: string) => {
    await api.put(`/bookings/${id}`, { status })
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xoa lich kham nay?')) return
    await api.delete(`/bookings/${id}`)
    load()
  }

  const filtered = filter === 'all' ? items : items.filter(b => b.status === filter)

  const newCount = items.filter(b => b.status === 'new').length

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">
            Dat lich kham
            {newCount > 0 && (
              <span style={{ marginLeft: '10px', background: '#1d4ed8', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '13px', fontWeight: 600 }}>{newCount} moi</span>
            )}
          </div>
          <div className="page-subtitle">Quan ly lich dat kham cua khach hang</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
          Tat ca ({items.length})
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {STATUS_LABELS[s]} ({items.filter(b => b.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Dang tai...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ho ten</th>
                <th>Lien he</th>
                <th>Dich vu</th>
                <th>Bac si</th>
                <th>Ngay / Gio</th>
                <th>Trang thai</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.fullname}</div>
                    {b.note && <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{b.note}</div>}
                  </td>
                  <td>
                    <div>{b.phone}</div>
                    {b.email && <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{b.email}</div>}
                  </td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{b.service}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{b.pref_doctor || '—'}</td>
                  <td style={{ fontSize: '13px' }}>
                    <div>{b.pref_date}</div>
                    {b.pref_time && <div style={{ color: 'var(--text-3)' }}>{b.pref_time}</div>}
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={e => handleStatus(b.id, e.target.value)}
                      style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', color: STATUS_COLORS[b.status] || 'inherit', cursor: 'pointer', background: 'var(--surface)' }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(b.id)} className="btn-danger btn-sm">Xoa</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Khong co lich kham nao</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
