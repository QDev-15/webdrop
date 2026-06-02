import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Contact {
  id: number; name: string; email: string; phone: string
  subject: string; message: string; status: string; created_at: string
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoad]      = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)
  const [toast, setToast]       = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoad(true)
    try { setContacts(await api.get<Contact[]>('/contacts')) }
    finally { setLoad(false) }
  }

  async function view(c: Contact) {
    setSelected(c)
    if (c.status === 'new') {
      await api.put('/contacts/' + c.id, { status: 'read' }).catch(() => {})
      setContacts(cs => cs.map(x => x.id === c.id ? { ...x, status: 'read' } : x))
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await api.put('/contacts/' + id, { status })
      setContacts(cs => cs.map(x => x.id === id ? { ...x, status } : x))
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
      show('Đã cập nhật trạng thái')
    } catch (e: unknown) { show(e instanceof Error ? e.message : 'Lỗi', true) }
  }

  async function remove(id: number) {
    if (!confirm('Xóa liên hệ này?')) return
    try {
      await api.delete('/contacts/' + id)
      setContacts(cs => cs.filter(x => x.id !== id))
      if (selected?.id === id) setSelected(null)
      show('Đã xóa')
    } catch (e: unknown) { show(e instanceof Error ? e.message : 'Lỗi', true) }
  }

  function show(msg: string, err = false) {
    setToast((err ? 'E:' : '') + msg); setTimeout(() => setToast(''), 3000)
  }

  const statusLabel: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

  return (
    <div className="row g-3">
      <div className={selected ? 'col-md-5' : 'col-12'}>
        <div className="admin-card" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
          ) : contacts.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">✉</div><p>Chưa có liên hệ nào.</p></div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Tên</th><th>Chủ đề</th><th>Trạng thái</th><th>Ngày</th><th></th></tr></thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => view(c)}>
                    <td>
                      <div style={{ fontWeight: c.status === 'new' ? 600 : 400 }}>{c.name}</div>
                      <div className="text-muted">{c.email}</div>
                    </td>
                    <td className="truncate">{c.subject || '—'}</td>
                    <td><span className={`badge-status badge-${c.status}`}>{statusLabel[c.status]}</span></td>
                    <td className="text-muted">{c.created_at.slice(0, 10)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn-icon" onClick={() => remove(c.id)} style={{ color: 'var(--danger)' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div className="col-md-7">
          <div className="admin-card">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{selected.name}</div>
                <div className="text-muted">{selected.email} {selected.phone && `• ${selected.phone}`}</div>
              </div>
              <button className="btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            {selected.subject && <div style={{ fontWeight: 500, marginBottom: 8 }}>{selected.subject}</div>}
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '12px 14px', fontSize: 13.5, lineHeight: 1.7, marginBottom: 16 }}>
              {selected.message}
            </div>
            <div className="d-flex gap-2 align-items-center">
              <select className="form-select" style={{ width: 'auto' }} value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}>
                <option value="new">Mới</option>
                <option value="read">Đã đọc</option>
                <option value="replied">Đã trả lời</option>
              </select>
              <button className="btn-danger" onClick={() => remove(selected.id)}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.startsWith('E:') ? 'toast-error' : 'toast-success'}`}>
            {toast.replace(/^E:/, '')}
          </div>
        </div>
      )}
    </div>
  )
}
