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
  menu_pkg: string
  note: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Cho xu ly',
  confirmed: 'Da xac nhan',
  cancelled: 'Da huy',
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
    if (!confirm('Xoa don dat ban nay?')) return
    await api.delete(`/reservations/${id}`)
    setDetail(null); load()
  }

  const filtered = items.filter(i =>
    !filter ||
    i.name.toLowerCase().includes(filter.toLowerCase()) ||
    i.phone.includes(filter) ||
    i.date.includes(filter)
  )

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Quan ly dat ban</div>
          <div className="page-sub">{items.length} don dat ban</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', 'pending', 'confirmed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {s === '' ? 'Tat ca' : STATUS_LABELS[s]}
            <span style={{ marginLeft: 4, opacity: .7 }}>({items.filter(i => s === '' || i.status === s).length})</span>
          </button>
        ))}
        <input type="text" className="form-control" placeholder="Tim kiem ten, sdt, ngay..."
          value={typeof filter === 'string' && !['pending','confirmed','cancelled',''].includes(filter) ? filter : ''}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 220, marginLeft: 8 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 360px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Khach hang</th>
                <th>Ngay & Gio</th>
                <th>So khach</th>
                <th>Goi menu</th>
                <th>Trang thai</th>
                <th>Thao tac</th>
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
                  <td>{r.guests} nguoi</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)', maxWidth: 140 }}>{r.menu_pkg || '—'}</td>
                  <td><span className={`badge badge-${r.status}`}>{STATUS_LABELS[r.status] ?? r.status}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status === 'pending' && <button onClick={() => updateStatus(r.id, 'confirmed')} className="btn-accent btn-sm" disabled={updating}>Xac nhan</button>}
                      {r.status !== 'cancelled' && <button onClick={() => updateStatus(r.id, 'cancelled')} className="btn-danger btn-sm" disabled={updating}>Huy</button>}
                      <button onClick={() => handleDelete(r.id)} className="btn-ghost btn-sm">Xoa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">Khong co don dat ban nao.</div></div>}
        </div>

        {detail && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>Chi tiet dat ban #{detail.id}</div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {[
              ['Ten khach', detail.name],
              ['Dien thoai', detail.phone],
              ['Email', detail.email || '—'],
              ['Ngay', detail.date],
              ['Gio', detail.time],
              ['So khach', String(detail.guests) + ' nguoi'],
              ['Goi menu', detail.menu_pkg || '—'],
              ['Ghi chu', detail.note || '—'],
              ['Trang thai', STATUS_LABELS[detail.status] ?? detail.status],
              ['Ngay gui', new Date(detail.created_at).toLocaleDateString('vi-VN')],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', width: 100, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 13, flex: 1 }}>{value}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {detail.status === 'pending' && <button onClick={() => updateStatus(detail.id, 'confirmed')} className="btn-accent btn-sm" disabled={updating}>Xac nhan</button>}
              {detail.status !== 'cancelled' && <button onClick={() => updateStatus(detail.id, 'cancelled')} className="btn-danger btn-sm" disabled={updating}>Huy don</button>}
              <button onClick={() => handleDelete(detail.id)} className="btn-ghost btn-sm">Xoa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
