import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact { id: number; name: string; email: string; phone: string; subject: string; status: string; created_at: string }

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { api.get<Contact[]>('/contacts').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const statusLabel: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Liên hệ</div><div className="page-subtitle">Danh sách yêu cầu từ khách</div></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-3)', padding: '8px 12px' }}>
            Tổng: {items.length} | Mới: {items.filter(i => i.status === 'new').length}
          </span>
        </div>
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> :
        items.length === 0 ? <div className="empty-state"><div className="empty-state-icon">✉️</div><div className="empty-state-text">Chưa có liên hệ nào.</div></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tên</th><th>SĐT</th><th>Email</th><th>Dịch vụ</th><th>Trạng thái</th><th>Thời gian</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.map(c => (
                  <tr key={c.id} style={c.status === 'new' ? { background: '#fffbeb' } : {}}>
                    <td style={{ fontWeight: c.status === 'new' ? 600 : 400 }}>{c.name}</td>
                    <td>{c.phone || '—'}</td>
                    <td style={{ color: 'var(--text-2)' }}>{c.email || '—'}</td>
                    <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{c.subject || '—'}</td>
                    <td><span className={`badge badge-${c.status}`}><span className="badge-dot" />{statusLabel[c.status]}</span></td>
                    <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                    <td><div className="td-actions">
                      <Link to={`/contacts/${c.id}`} className="btn-ghost btn-sm">Xem</Link>
                      <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/contacts/${c.id}`); load() } }} className="btn-danger btn-sm">Xóa</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}
