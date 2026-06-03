import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact { id: number; name: string; phone: string; email: string; service: string; subject: string; message: string; status: string; created_at: string }

export default function ContactDetail() {
  const { id } = useParams(); const navigate = useNavigate()
  const [c, setC] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.get<Contact>(`/contacts/${id}`).then(setC).catch(() => {}).finally(() => setLoading(false)) }, [id])

  const changeStatus = async (status: string) => {
    await api.put(`/contacts/${id}/status`, { status })
    setC(prev => prev ? { ...prev, status } : prev)
  }

  if (loading) return <p className="text-muted">Đang tải...</p>
  if (!c) return <p className="text-danger">Không tìm thấy.</p>

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">Chi tiết Liên hệ #{c.id}</h1>
        <button onClick={() => navigate('/contacts')} className="btn btn-ghost">← Quay lại</button>
      </div>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div className="form-label">Họ tên</div>
            <div style={{ fontWeight: 600 }}>{c.name}</div>
          </div>
          <div>
            <div className="form-label">Điện thoại</div>
            <div><a href={`tel:${c.phone}`} style={{ color: 'var(--accent)' }}>{c.phone}</a></div>
          </div>
          <div>
            <div className="form-label">Email</div>
            <div>{c.email ? <a href={`mailto:${c.email}`} style={{ color: 'var(--accent)' }}>{c.email}</a> : '—'}</div>
          </div>
          <div>
            <div className="form-label">Dịch vụ quan tâm</div>
            <div>{c.service || c.subject || '—'}</div>
          </div>
          <div>
            <div className="form-label">Ngày gửi</div>
            <div>{new Date(c.created_at).toLocaleString('vi-VN')}</div>
          </div>
          <div>
            <div className="form-label">Trạng thái</div>
            <span className={`badge badge-${c.status}`}>{c.status}</span>
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">Nội dung</div>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 16px', fontSize: '14px', lineHeight: 1.7, color: 'var(--text-2)' }}>
            {c.message}
          </div>
        </div>

        <hr className="section-sep" />
        <div>
          <div className="form-label" style={{ marginBottom: '8px' }}>Đổi trạng thái</div>
          <div className="d-flex gap-2">
            {['new','read','replied'].map(s => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                className={`btn btn-sm ${c.status === s ? 'btn-primary' : 'btn-ghost'}`}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
