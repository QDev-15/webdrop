import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Contact { id: number; name: string; email: string; phone: string; company: string; subject: string; message: string; status: string; created_at: string }

const statusLabel: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

export default function ContactList() {
  const [items, setItems]       = useState<Contact[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Contact[]>('/contacts')) }
    finally { setLoading(false) }
  }

  async function handleView(item: Contact) {
    const detail = await api.get<Contact>(`/contacts/${item.id}`)
    setSelected(detail)
    load()
  }

  async function handleStatus(id: number, status: string) {
    await api.put(`/contacts/${id}`, { status })
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa liên hệ này?')) return
    await api.delete(`/contacts/${id}`)
    if (selected?.id === id) setSelected(null)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Liên hệ</h1><p className="page-sub">Tin nhắn từ khách hàng</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
        <div className="card">
          {items.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">✉</div><div className="empty-state-text">Chưa có liên hệ nào</div></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Tên</th><th>Email</th><th>Công ty</th><th>Trạng thái</th><th>Ngày</th><th></th></tr></thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} style={{ cursor: 'pointer' }}>
                      <td onClick={() => handleView(item)}><strong>{item.name}</strong></td>
                      <td className="td-muted" onClick={() => handleView(item)}>{item.email}</td>
                      <td className="td-muted">{item.company}</td>
                      <td><span className={`badge badge-${item.status}`}>{statusLabel[item.status]}</span></td>
                      <td className="td-muted">{item.created_at?.slice(0, 10)}</td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleView(item)}>Xem</button>
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
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleStatus(selected.id, 'replied')}>Đánh dấu đã trả lời</button>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setSelected(null)}>×</button>
              </div>
            </div>
            <div className="detail-body">
              <div className="detail-row"><span className="detail-key">Email:</span><span className="detail-val">{selected.email}</span></div>
              <div className="detail-row"><span className="detail-key">Điện thoại:</span><span className="detail-val">{selected.phone || '—'}</span></div>
              <div className="detail-row"><span className="detail-key">Công ty:</span><span className="detail-val">{selected.company || '—'}</span></div>
              <div className="detail-row"><span className="detail-key">Chủ đề:</span><span className="detail-val">{selected.subject || '—'}</span></div>
              <div className="detail-row"><span className="detail-key">Nội dung:</span></div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap', background: 'var(--bg)', borderRadius: 9, padding: '12px 14px', marginTop: 4 }}>{selected.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
