import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  service: string
  budget: string
  message: string
  status: string
  created_at: string
}

const STATUS_CLASS: Record<string, string> = { new: 'badge-new', read: 'badge-read', replied: 'badge-replied' }
const STATUS_LABEL: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    api.get<Contact>(`/contacts/${id}`)
      .then(setContact)
      .catch(() => navigate('/contacts'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function updateStatus(status: string) {
    if (!contact) return
    setUpdatingStatus(true)
    try {
      await api.put(`/contacts/${id}/status`, { status })
      setContact({ ...contact, status })
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>
  if (!contact) return null

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Chi tiết liên hệ #{contact.id}</h1>
          <div className="page-hd-sub">{new Date(contact.created_at).toLocaleString('vi-VN')}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/contacts')}>← Quay lại</button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
          <div>
            <div className="form-label">Tên</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{contact.name}</div>
          </div>
          <div>
            <div className="form-label">Trạng thái</div>
            <span className={`badge ${STATUS_CLASS[contact.status] || 'badge-read'}`}>{STATUS_LABEL[contact.status] || contact.status}</span>
          </div>
          {contact.email && (
            <div>
              <div className="form-label">Email</div>
              <a href={`mailto:${contact.email}`} style={{ color: 'var(--accent)', fontSize: '14px' }}>{contact.email}</a>
            </div>
          )}
          {contact.phone && (
            <div>
              <div className="form-label">Điện thoại</div>
              <a href={`tel:${contact.phone}`} style={{ color: 'var(--accent)', fontSize: '14px' }}>{contact.phone}</a>
            </div>
          )}
          {contact.company && (
            <div>
              <div className="form-label">Công ty / Thương hiệu</div>
              <div style={{ fontSize: '14px', color: 'var(--text)' }}>{contact.company}</div>
            </div>
          )}
          {contact.service && (
            <div>
              <div className="form-label">Dịch vụ quan tâm</div>
              <div style={{ fontSize: '14px', color: 'var(--text)' }}>{contact.service}</div>
            </div>
          )}
          {contact.budget && (
            <div>
              <div className="form-label">Ngân sách dự kiến</div>
              <div style={{ fontSize: '14px', color: 'var(--text)' }}>{contact.budget}</div>
            </div>
          )}
        </div>

        <hr className="section-sep" />
        <div className="form-label">Mô tả dự án / Brief</div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', fontSize: '14px', color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {contact.message}
        </div>

        <hr className="section-sep" />
        <div className="form-label" style={{ marginBottom: '10px' }}>Cập nhật trạng thái</div>
        <div className="d-flex gap-2">
          {['new', 'read', 'replied'].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${contact.status === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => updateStatus(s)}
              disabled={updatingStatus || contact.status === s}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
