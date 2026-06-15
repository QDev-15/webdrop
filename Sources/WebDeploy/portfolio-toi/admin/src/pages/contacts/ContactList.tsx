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
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try { setItems(await api.get<Contact[]>('/contacts')) }
    finally { setLoading(false) }
  }

  const handleView = async (c: Contact) => {
    setSelected(c)
    if (c.status === 'new') {
      await api.put(`/contacts/${c.id}`, { status: 'read' })
      load()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa liên hệ này?')) return
    await api.delete(`/contacts/${id}`)
    if (selected?.id === id) setSelected(null)
    load()
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Liên hệ</div>
          <div className="page-sub">Tin nhắn từ form liên hệ trên website</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        <div>
          {loading ? (
            <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✉</div>
              <div className="empty-state-text">Chưa có liên hệ nào</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Người gửi</th>
                    <th>Loại dự án</th>
                    <th>Ngày gửi</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer', background: selected?.id === c.id ? 'var(--bg)' : undefined }} onClick={() => handleView(c)}>
                      <td>
                        <div style={{ fontWeight: c.status === 'new' ? 600 : 400 }}>{c.name}</div>
                        {c.email && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.email}</div>}
                      </td>
                      <td style={{ fontSize: 13 }}>{c.subject || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmt(c.created_at)}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <span className={`badge badge-${c.status}`}>
                          {c.status === 'new' ? 'Mới' : c.status === 'read' ? 'Đã đọc' : 'Đã trả lời'}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>{selected.name}</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 8, fontSize: 13, marginBottom: 16 }}>
              {selected.email && <div><span style={{ color: 'var(--text-3)' }}>Email: </span>{selected.email}</div>}
              {selected.phone && <div><span style={{ color: 'var(--text-3)' }}>SĐT: </span>{selected.phone}</div>}
              {selected.subject && <div><span style={{ color: 'var(--text-3)' }}>Loại dự án: </span>{selected.subject}</div>}
              <div><span style={{ color: 'var(--text-3)' }}>Ngày gửi: </span>{fmt(selected.created_at)}</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg)', borderRadius: 8, fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {selected.message}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {selected.email && (
                <a href={`mailto:${selected.email}`} className="btn-accent btn-sm">Trả lời qua Email</a>
              )}
              <button onClick={() => handleDelete(selected.id)} className="btn-danger btn-sm">Xóa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
