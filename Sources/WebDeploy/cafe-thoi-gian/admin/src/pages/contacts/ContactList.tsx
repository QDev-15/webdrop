import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  created_at: string
}

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    api.get<Contact[]>('/contacts').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa liên hệ này?')) return
    await api.delete(`/contacts/${id}`)
    load()
  }

  const filtered = filter ? items.filter(i => i.status === filter) : items

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { new: 'badge-new', read: 'badge-read', replied: 'badge-replied' }
    const labels: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }
    return <span className={`badge ${map[s] || 'badge-draft'}`}>{labels[s] || s}</span>
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Liên hệ</div><div className="page-sub">{items.filter(i => i.status === 'new').length} chưa đọc</div></div>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {['', 'new', 'read', 'replied'].map(s => (
          <button key={s} className="btn-ghost btn-sm" onClick={() => setFilter(s)} style={filter === s ? { background: 'var(--accent-light)', borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>
            {s === '' ? 'Tất cả' : s === 'new' ? 'Mới' : s === 'read' ? 'Đã đọc' : 'Đã trả lời'}
          </button>
        ))}
      </div>

      {loading ? <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Người gửi</th><th>Chủ đề</th><th>Ngày</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={c.status === 'new' ? { fontWeight: 500 } : {}}>
                  <td>
                    <div style={{ fontWeight: c.status === 'new' ? 600 : 500 }}>{c.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>{c.phone || c.email || '—'}</div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-2)' }}>{c.subject || c.message?.slice(0, 40) || '—'}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>{statusBadge(c.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/contacts/${c.id}`} className="btn-ghost btn-sm">Xem</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">✉</div><div className="empty-state-text">Không có liên hệ nào</div></div></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
