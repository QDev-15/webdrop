import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  email?: string
  phone?: string
  subject?: string
  message: string
  status: string
  created_at: string
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => { load() }, [filterStatus])

  async function load() {
    setLoading(true)
    const q = filterStatus ? `?status=${filterStatus}` : ''
    api.get<Contact[]>(`/contacts${q}`).then(setContacts).catch(() => null).finally(() => setLoading(false))
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoa tin nhan nay?')) return
    await api.delete(`/contacts/${id}`)
    load()
  }

  const newsletters = contacts.filter(c => c.subject === 'newsletter')
  const messages = contacts.filter(c => c.subject !== 'newsletter')

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Lien he</div>
          <div className="page-sub">{messages.length} tin nhan · {newsletters.length} dang ky newsletter</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <div className="table-title">Tin nhan lien he</div>
          <select className="form-control" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tat ca</option>
            <option value="new">Moi</option>
            <option value="read">Da doc</option>
            <option value="replied">Da tra loi</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: '24px' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '44px', marginBottom: '8px' }} />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✉</div>
            <p>Chua co tin nhan nao</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ho ten</th>
                <th>Email / SDT</th>
                <th>Chu de</th>
                <th>Trang thai</th>
                <th>Thoi gian</th>
                <th style={{ width: '100px' }}></th>
              </tr>
            </thead>
            <tbody>
              {messages.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: c.status === 'new' ? '600' : '400', color: 'var(--text)' }}>{c.name}</td>
                  <td style={{ fontSize: '12px' }}>
                    {c.email && <div>{c.email}</div>}
                    {c.phone && <div>{c.phone}</div>}
                  </td>
                  <td style={{ maxWidth: '180px' }}>
                    <div className="text-truncate">{c.subject ?? '(Khong co chu de)'}</div>
                  </td>
                  <td><span className={`badge badge-${c.status}`}>{c.status === 'new' ? 'Moi' : c.status === 'read' ? 'Da doc' : 'Da tra loi'}</span></td>
                  <td style={{ fontSize: '12px', color: 'var(--text-3)' }}>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/contacts/${c.id}`} className="btn btn-ghost btn-sm">Xem</Link>
                      <button onClick={() => handleDelete(c.id)} className="btn btn-sm" style={{ background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd' }}>Xoa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Newsletter subscribers */}
      {newsletters.length > 0 && (
        <div className="table-wrap" style={{ marginTop: '20px' }}>
          <div className="table-header">
            <div className="table-title">Dang ky Newsletter ({newsletters.length})</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Ngay dang ky</th>
                <th style={{ width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {newsletters.map(n => (
                <tr key={n.id}>
                  <td>{n.email}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-3)' }}>{new Date(n.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button onClick={() => handleDelete(n.id)} className="btn btn-sm" style={{ background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd' }}>Xoa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
