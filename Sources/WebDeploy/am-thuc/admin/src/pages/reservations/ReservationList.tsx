import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Reservation {
  id: number
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  area: string
  note: string
  status: string
  created_at: string
}

const statusOpts = [
  { value: 'pending',   label: 'Chờ xác nhận', color: '#d97706' },
  { value: 'confirmed', label: 'Đã xác nhận',  color: '#1a6b52' },
  { value: 'cancelled', label: 'Đã hủy',        color: '#e24b4a' },
]

export default function ReservationList() {
  const [items, setItems] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<Reservation | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Reservation[]>('/reservations')) }
    finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    const item = items.find(i => i.id === id)
    if (!item) return
    await api.put(`/reservations/${id}`, { ...item, status })
    if (selected?.id === id) setSelected({ ...selected, status })
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đặt bàn này?')) return
    await api.delete(`/reservations/${id}`)
    setSelected(null)
    load()
  }

  const filtered = filter ? items.filter(i => i.status === filter) : items

  if (loading) return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Đặt bàn</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{items.length} tổng · {items.filter(i => i.status === 'pending').length} chờ xác nhận</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setFilter('')} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: !filter ? 'var(--accent)' : 'var(--surface)', color: !filter ? '#fff' : 'var(--text-2)', cursor: 'pointer' }}>
          Tất cả ({items.length})
        </button>
        {statusOpts.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: filter === s.value ? s.color : 'var(--surface)', color: filter === s.value ? '#fff' : 'var(--text-2)', cursor: 'pointer' }}>
            {s.label} ({items.filter(i => i.status === s.value).length})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Không có đặt bàn nào</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Khách hàng', 'Ngày & Giờ', 'Số người', 'Khu vực', 'Trạng thái', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const s = statusOpts.find(o => o.value === item.status)
                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: selected?.id === item.id ? 'var(--accent-light)' : 'transparent' }}
                      onClick={() => setSelected(item)}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.phone}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                        <div>{item.date}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.time}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{item.guests} người</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>{item.area || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: (s?.color ?? '#6b6760') + '18', color: s?.color ?? '#6b6760', fontWeight: 500 }}>
                          {s?.label ?? item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #fdd', background: '#fff0f0', color: 'var(--danger)', cursor: 'pointer' }}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Chi tiết đặt bàn</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-3)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Họ tên</div><div style={{ fontSize: 14, fontWeight: 500 }}>{selected.name}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Điện thoại</div><div style={{ fontSize: 14 }}>{selected.phone}</div></div>
              {selected.email && <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Email</div><div style={{ fontSize: 13 }}>{selected.email}</div></div>}
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Ngày & Giờ</div><div style={{ fontSize: 14 }}>{selected.date} lúc {selected.time}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Số người</div><div style={{ fontSize: 14 }}>{selected.guests} người</div></div>
              {selected.area && <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Khu vực</div><div style={{ fontSize: 13 }}>{selected.area}</div></div>}
              {selected.note && (
                <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Ghi chú</div><div style={{ fontSize: 13, background: 'var(--bg)', padding: '8px 10px', borderRadius: 6 }}>{selected.note}</div></div>
              )}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>Cập nhật trạng thái</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {statusOpts.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => updateStatus(selected.id, opt.value)}
                      style={{ fontSize: 12, padding: '8px 12px', borderRadius: 6, border: `1px solid ${selected.status === opt.value ? opt.color : 'var(--border)'}`, background: selected.status === opt.value ? opt.color : 'transparent', color: selected.status === opt.value ? '#fff' : 'var(--text-2)', cursor: 'pointer', textAlign: 'left' }}
                    >
                      {selected.status === opt.value ? '✓ ' : ''}{opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(selected.id)} style={{ marginTop: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid #fdd', background: '#fff0f0', color: 'var(--danger)', cursor: 'pointer', fontSize: 13 }}>
                Xóa đặt bàn này
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
