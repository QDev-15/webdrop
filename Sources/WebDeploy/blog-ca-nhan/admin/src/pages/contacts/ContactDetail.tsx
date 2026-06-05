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
        <Link to="/contacts" className="btn btn-ghost">← Quay lại</Link>
      </div>
      <div className="empty-state">
        <p>Không tìm thấy tin nhắn.</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chi tiết tin nhắn</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {status !== 'replied' && (
            <button onClick={() => updateStatus('replied')} className="btn btn-accent btn-sm">Đánh dấu đã trả lời</button>
          )}
          <Link to="/contacts" className="btn btn-ghost">← Quay lại</Link>
        </div>
      </div>

      <div className="form-card">
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Họ tên</div>
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
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>SĐT</div>
              <a href={`tel:${contact.phone}`} style={{ color: 'var(--accent)' }}>{contact.phone}</a>
            </div>
          )}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Trạng thái</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className={`badge badge-${status}`}>
                {status === 'new' ? 'Mới' : status === 'read' ? 'Đã đọc' : 'Đã trả lời'}
              </span>
              <select
                value={status}
                onChange={e => updateStatus(e.target.value)}
                className="form-control"
                style={{ width: 'auto', fontSize: '12px', padding: '3px 8px' }}
              >
                <option value="new">Mới</option>
                <option value="read">Đã đọc</option>
                <option value="replied">Đã trả lời</option>
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Thời gian gửi</div>
            <div>{new Date(contact.created_at).toLocaleString('vi-VN')}</div>
          </div>
        </div>

        {contact.subject && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Chủ đề</div>
            <div style={{ fontWeight: '500' }}>{contact.subject}</div>
          </div>
        )}

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '.5px' }}>Nội dung</div>
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
              href={`mailto:${contact.email}?subject=Re: ${contact.subject ?? 'Liên hệ'}`}
              className="btn btn-accent"
            >
              Trả lời qua Email
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
