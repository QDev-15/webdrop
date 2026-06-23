import { useState, useEffect } from 'react'
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

const STATUS_LABELS: Record<string, string> = {
  new: 'Moi',
  read: 'Da doc',
  replied: 'Da tra loi',
}

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Contact | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Contact[]>('/contacts')) }
    finally { setLoading(false) }
  }

  async function handleView(c: Contact) {
    setDetail(c)
    if (c.status === 'new') {
      await api.get<Contact>(`/contacts/${c.id}`)
      setItems(prev => prev.map(i => i.id === c.id ? { ...i, status: 'read' } : i))
      setDetail({ ...c, status: 'read' })
    }
  }

  async function markReplied(id: number) {
    await api.put(`/contacts/${id}`, { status: 'replied' })
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'replied' } : i))
    if (detail?.id === id) setDetail(d => d ? { ...d, status: 'replied' } : d)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoa tin nhan nay?')) return
    await api.delete(`/contacts/${id}`)
    setDetail(null); load()
  }

  const filtered = items.filter(i =>
    !filter || ['', 'new', 'read', 'replied'].includes(filter)
      ? (!filter || i.status === filter)
      : (i.name.toLowerCase().includes(filter.toLowerCase()) || (i.email ?? '').toLowerCase().includes(filter.toLowerCase()))
  )

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Lien he</div>
          <div className="page-sub">{items.filter(i => i.status === 'new').length} tin nhan moi · {items.length} tong</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['', 'new', 'read', 'replied'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {s === '' ? 'Tat ca' : STATUS_LABELS[s]}
            <span style={{ marginLeft: 4, opacity: .7 }}>({items.filter(i => s === '' || i.status === s).length})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 380px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nguoi gui</th>
                <th>Chu de</th>
                <th>Trang thai</th>
                <th>Ngay gui</th>
                <th>Thao tac</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => handleView(c)} style={{ cursor: 'pointer', background: detail?.id === c.id ? 'var(--accent-light)' : undefined, fontWeight: c.status === 'new' ? 600 : undefined }}>
                  <td>
                    <div>{c.name}</div>
                    {c.email && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.email}</div>}
                    {c.phone && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.phone}</div>}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{c.subject || '—'}</td>
                  <td><span className={`badge badge-${c.status}`}>{STATUS_LABELS[c.status] ?? c.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleDelete(c.id)} className="btn-ghost btn-sm">Xoa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">✉</div><div className="empty-state-text">Khong co tin nhan nao.</div></div>}
        </div>

        {detail && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Chi tiet tin nhan</div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {[
              ['Ho ten', detail.name],
              ['Email', detail.email || '—'],
              ['Dien thoai', detail.phone || '—'],
              ['Chu de', detail.subject || '—'],
              ['Trang thai', STATUS_LABELS[detail.status] ?? detail.status],
              ['Ngay gui', new Date(detail.created_at).toLocaleDateString('vi-VN')],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', width: 100, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 13, flex: 1 }}>{value}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, padding: '12px', background: 'var(--bg)', borderRadius: 8, fontSize: 13, lineHeight: 1.7, color: 'var(--text-2)', border: '1px solid var(--border)' }}>
              {detail.message}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {detail.status !== 'replied' && (
                <button onClick={() => markReplied(detail.id)} className="btn-accent btn-sm">Danh dau da tra loi</button>
              )}
              <button onClick={() => handleDelete(detail.id)} className="btn-ghost btn-sm">Xoa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
