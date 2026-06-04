import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  phone: string
  email: string
  construction_type: string
  budget: string
  status: string
  created_at: string
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get('/contacts')) }
    finally { setLoading(false) }
  }

  const filtered = filter ? items.filter(c => c.status === filter) : items

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Yêu cầu báo giá</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Yêu cầu từ khách hàng qua form liên hệ</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['', 'new', 'read', 'replied'].map(s => (
            <button key={s} className={`btn btn-ghost btn-sm${filter === s ? ' btn-primary' : ''}`}
              style={filter === s ? { background: 'var(--accent)', color: '#fff', border: 'none' } : {}}
              onClick={() => setFilter(s)}>
              {s === '' ? 'Tất cả' : s === 'new' ? 'Mới' : s === 'read' ? 'Đã xem' : 'Đã trả lời'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card"><p style={{ color: 'var(--text-3)' }}>Đang tải...</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Khách hàng</th><th>Điện thoại</th><th>Loại CT</th><th>Ngân sách</th><th>Trạng thái</th><th>Thời gian</th><th>Thao tác</th>
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><Link to={`/contacts/${c.id}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>{c.name}</Link></td>
                  <td>{c.phone}</td>
                  <td style={{ fontSize: 12 }}>{c.construction_type || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.budget || '—'}</td>
                  <td><span className={`badge badge-${c.status}`}>{c.status === 'new' ? 'Mới' : c.status === 'read' ? 'Đã xem' : 'Đã trả lời'}</span></td>
                  <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{fmtDate(c.created_at)}</td>
                  <td><Link to={`/contacts/${c.id}`} className="btn btn-ghost btn-sm">Xem</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">✉</div><div className="empty-state-text">Không có yêu cầu nào.</div></div>}
        </div>
      )}
    </div>
  )
}
