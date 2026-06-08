import { useEffect, useState } from 'react'
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
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setContacts(await api.get<Contact[]>('/contacts')) }
    finally { setLoading(false) }
  }

  async function markRead(id: number) {
    await api.put(`/contacts/${id}`, { status: 'read' })
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status: 'read' } : null)
  }

  async function markReplied(id: number) {
    await api.put(`/contacts/${id}`, { status: 'replied' })
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status: 'replied' } : null)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa tin nhắn này?')) return
    await api.delete(`/contacts/${id}`)
    setSelected(null)
    load()
  }

  const statusLabel: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Liên hệ</div>
          <div className="page-sub">Tin nhắn từ người dùng gửi qua form liên hệ</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '16px' }}>
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: '40px 20px', color: 'var(--text-3)', textAlign: 'center' }}>Đang tải...</div>
          ) : contacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✉</div>
              <div className="empty-state-text">Chưa có tin nhắn nào</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Email / SĐT</th>
                  <th>Chủ đề</th>
                  <th>Trạng thái</th>
                  <th>Ngày</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => { setSelected(c); if (c.status === 'new') markRead(c.id) }}
                    style={{ cursor: 'pointer', background: selected?.id === c.id ? 'var(--accent-light)' : c.status === 'new' ? 'var(--warm)' : undefined }}
                  >
                    <td style={{ fontWeight: c.status === 'new' ? 600 : 400 }}>{c.name}</td>
                    <td style={{ fontSize: 12 }}>
                      <div>{c.email}</div>
                      <div style={{ color: 'var(--text-3)' }}>{c.phone}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{c.subject || '—'}</td>
                    <td><span className={`badge badge-${c.status}`}>{statusLabel[c.status] ?? c.status}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.created_at?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{selected.name}</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 18 }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 8, marginBottom: 16, fontSize: 13 }}>
              {selected.email && <div><span style={{ color: 'var(--text-3)' }}>Email: </span>{selected.email}</div>}
              {selected.phone && <div><span style={{ color: 'var(--text-3)' }}>SĐT: </span>{selected.phone}</div>}
              {selected.subject && <div><span style={{ color: 'var(--text-3)' }}>Chủ đề: </span>{selected.subject}</div>}
              <div><span style={{ color: 'var(--text-3)' }}>Ngày: </span>{selected.created_at?.slice(0, 16)?.replace('T', ' ')}</div>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 14, fontSize: 14, lineHeight: 1.7, marginBottom: 16, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {selected.message}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selected.status !== 'replied' && (
                <button className="btn-accent btn-sm" onClick={() => markReplied(selected.id)}>
                  Đánh dấu đã trả lời
                </button>
              )}
              {selected.email && (
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Liên hệ'}`} className="btn-ghost btn-sm">
                  Trả lời qua Email
                </a>
              )}
              <button className="btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Xóa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
