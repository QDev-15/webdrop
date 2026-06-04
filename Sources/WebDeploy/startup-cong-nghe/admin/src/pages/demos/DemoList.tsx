import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Demo { id: number; name: string; email: string; phone: string; time_pref: string; note: string; status: string; created_at: string }

const statusLabel: Record<string, string> = { new: 'Mới', contacted: 'Đã liên hệ', done: 'Hoàn tất', cancelled: 'Hủy' }
const timePrefLabel: Record<string, string> = { morning: 'Buổi sáng (8-12h)', afternoon: 'Buổi chiều (13-17h)', flexible: 'Linh hoạt' }

export default function DemoList() {
  const [items, setItems]       = useState<Demo[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<Demo | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Demo[]>('/demos')) }
    finally { setLoading(false) }
  }

  async function handleStatus(id: number, status: string) {
    await api.put(`/demos/${id}`, { status })
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa yêu cầu demo này?')) return
    await api.delete(`/demos/${id}`)
    if (selected?.id === id) setSelected(null)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Đặt lịch demo</h1><p className="page-sub">Yêu cầu xem demo từ khách hàng</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
        <div className="card">
          {items.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">Chưa có yêu cầu demo nào</div></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Tên</th><th>Email</th><th>Điện thoại</th><th>Thời gian</th><th>Trạng thái</th><th>Ngày</th><th></th></tr></thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td className="td-muted">{item.email}</td>
                      <td className="td-muted">{item.phone}</td>
                      <td className="td-muted">{timePrefLabel[item.time_pref] ?? item.time_pref}</td>
                      <td><span className={`badge badge-${item.status}`}>{statusLabel[item.status]}</span></td>
                      <td className="td-muted">{item.created_at?.slice(0, 10)}</td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(item)}>Xem</button>
                        <select className="form-control" style={{ fontSize: 12, padding: '4px 8px', borderRadius: 7 }} value={item.status} onChange={e => handleStatus(item.id, e.target.value)}>
                          <option value="new">Mới</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="done">Hoàn tất</option>
                          <option value="cancelled">Hủy</option>
                        </select>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div className="detail-card">
            <div className="detail-header">
              <strong>{selected.name}</strong>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="detail-body">
              <div className="detail-row"><span className="detail-key">Email:</span><span className="detail-val">{selected.email}</span></div>
              <div className="detail-row"><span className="detail-key">Điện thoại:</span><span className="detail-val">{selected.phone || '—'}</span></div>
              <div className="detail-row"><span className="detail-key">Thời gian:</span><span className="detail-val">{(timePrefLabel[selected.time_pref] ?? selected.time_pref) || '—'}</span></div>
              <div className="detail-row"><span className="detail-key">Ghi chú:</span><span className="detail-val">{selected.note || '—'}</span></div>
              <div className="detail-row"><span className="detail-key">Trạng thái:</span><span className={`badge badge-${selected.status}`}>{statusLabel[selected.status]}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
