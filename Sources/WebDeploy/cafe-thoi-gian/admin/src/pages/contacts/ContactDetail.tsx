import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)

  useEffect(() => {
    api.get<Contact>(`/contacts/${id}`).then(setContact).catch(() => navigate('/contacts'))
  }, [id, navigate])

  const updateStatus = async (status: string) => {
    await api.put(`/contacts/${id}`, { status })
    setContact(prev => prev ? { ...prev, status } : null)
  }

  if (!contact) return <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div>

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div><div className="page-title">Chi tiết liên hệ</div></div>
        <button className="btn-ghost btn-sm" onClick={() => navigate('/contacts')}>← Quay lại</button>
      </div>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Họ tên</div>
            <div style={{ fontWeight: 600 }}>{contact.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Số điện thoại</div>
            <div>{contact.phone || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Email</div>
            <div>{contact.email ? <a href={`mailto:${contact.email}`} style={{ color: 'var(--accent)' }}>{contact.email}</a> : '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Ngày gửi</div>
            <div style={{ fontSize: '13px' }}>{new Date(contact.created_at).toLocaleString('vi-VN')}</div>
          </div>
        </div>
        {contact.subject && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Chủ đề</div>
            <div style={{ fontWeight: 500 }}>{contact.subject}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '8px' }}>Nội dung</div>
          <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '10px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text)' }}>{contact.message}</div>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
          <button className="btn-accent btn-sm" onClick={() => updateStatus('replied')}>Đánh dấu đã trả lời</button>
          {contact.status !== 'new' && <button className="btn-ghost btn-sm" onClick={() => updateStatus('new')}>Đánh dấu mới</button>}
          {contact.email && <a href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Liên hệ'}`} className="btn-ghost btn-sm">Gửi email trả lời</a>}
        </div>
      </div>
    </div>
  )
}
