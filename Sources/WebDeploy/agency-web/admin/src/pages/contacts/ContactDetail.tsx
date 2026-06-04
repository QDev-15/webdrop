import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact { id: number; name: string; email: string; phone: string; subject: string; message: string; status: string; created_at: string }

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Contact>(`/contacts/${id}`).then(setContact).catch(console.error).finally(() => setLoading(false))
  }, [id])

  const handleStatus = async (status: string) => {
    await api.put(`/contacts/${id}`, { status })
    if (contact) setContact({ ...contact, status })
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
  if (!contact) return <div className="empty-state"><div className="empty-state-text">Không tìm thấy liên hệ.</div></div>

  const statusLabel: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Chi tiết liên hệ</div></div>
        <button onClick={() => navigate('/contacts')} className="btn-ghost">← Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>{contact.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{new Date(contact.created_at).toLocaleString('vi-VN')}</div>
            </div>
            <span className={`badge badge-${contact.status}`}><span className="badge-dot" />{statusLabel[contact.status]}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>SĐT</div>
              <div>{contact.phone ? <a href={`tel:${contact.phone}`} style={{ color: 'var(--accent)' }}>{contact.phone}</a> : '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Email</div>
              <div>{contact.email ? <a href={`mailto:${contact.email}`} style={{ color: 'var(--accent)' }}>{contact.email}</a> : '—'}</div>
            </div>
          </div>
          {contact.subject && (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Dịch vụ quan tâm</div>
              <div style={{ fontWeight: 500 }}>{contact.subject}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px' }}>Nội dung</div>
            <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '16px', fontSize: '14px', lineHeight: 1.75, color: 'var(--text-2)' }}>{contact.message}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
            {['new', 'read', 'replied'].map(s => (
              <button key={s} onClick={() => handleStatus(s)} className={contact.status === s ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
                {statusLabel[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
