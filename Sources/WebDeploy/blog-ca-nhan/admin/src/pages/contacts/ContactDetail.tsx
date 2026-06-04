import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<Contact>(`/contacts/${id}`)
      .then(c => { setContact(c); setStatus(c.status) })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [id])

  async function updateStatus(newStatus: string) {
    if (!id) return
    await api.put(`/contacts/${id}`, { status: newStatus })
    setStatus(newStatus)
    if (contact) setContact({ ...contact, status: newStatus })
  }

  if (loading) return <div style={{ padding: '24px' }}><div className="skeleton" style={{ height: '200px' }} /></div>

  if (!contact) return (
    <div>
      <div className="page-header">
        <Link to="/contacts" className="btn btn-ghost">← Quay lai</Link>
      </div>
      <div className="empty-state">
        <p>Khong tim thay tin nhan.</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chi tiet tin nhan</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {status !== 'replied' && (
            <button onClick={() => updateStatus('replied')} className="btn btn-accent btn-sm">Danh dau da tra loi</button>
          )}
          <Link to="/contacts" className="btn btn-ghost">← Quay lai</Link>
        </div>
      </div>

      <div className="form-card">
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Ho ten</div>
            <div style={{ fontWeight: '500' }}>{contact.name}</div>
          </div>
          {contact.email && (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Email</div>
              <a href={`mailto:${contact.email}`} style={{ color: 'var(--accent)' }}>{contact.email}</a>
            </div>
          )}
          {contact.phone && (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>SDT</div>
              <a href={`tel:${contact.phone}`} style={{ color: 'var(--accent)' }}>{contact.phone}</a>
            </div>
          )}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Trang thai</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className={`badge badge-${status}`}>{status === 'new' ? 'Moi' : status === 'read' ? 'Da doc' : 'Da tra loi'}</span>
              <select
                value={status}
                onChange={e => updateStatus(e.target.value)}
                className="form-control"
                style={{ width: 'auto', fontSize: '12px', padding: '3px 8px' }}
              >
                <option value="new">Moi</option>
                <option value="read">Da doc</option>
                <option value="replied">Da tra loi</option>
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Thoi gian gui</div>
            <div>{new Date(contact.created_at).toLocaleString('vi-VN')}</div>
          </div>
        </div>

        {contact.subject && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Chu de</div>
            <div style={{ fontWeight: '500' }}>{contact.subject}</div>
          </div>
        )}

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Noi dung</div>
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            lineHeight: '1.7',
            color: 'var(--text)',
            whiteSpace: 'pre-wrap',
          }}>
            {contact.message}
          </div>
        </div>

        {contact.email && (
          <div style={{ marginTop: '16px' }}>
            <a
              href={`mailto:${contact.email}?subject=Re: ${contact.subject ?? 'Lien he'}`}
              className="btn btn-accent"
            >
              Tra loi qua Email
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
