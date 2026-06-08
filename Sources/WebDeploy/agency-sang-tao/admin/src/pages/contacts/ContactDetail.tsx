import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  service: string
  message: string
  status: string
  created_at: string
}

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem]     = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Contact>(`/contacts/${id}`)
      .then(setItem)
      .catch(() => navigate('/contacts'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <AdminLayout title="Liên hệ"><div className="empty-state"><div className="empty-state-icon">⏳</div></div></AdminLayout>
  if (!item) return null

  return (
    <AdminLayout title="Chi tiết liên hệ">
      <div className="page-header">
        <h1 className="page-title">Chi tiết liên hệ</h1>
        <button className="btn-ghost" onClick={() => navigate('/contacts')}>Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: 640 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><div className="form-label">Tên</div><div style={{ fontWeight: 500 }}>{item.name}</div></div>
            <div><div className="form-label">Email</div><div>{item.email || '—'}</div></div>
            <div><div className="form-label">Điện thoại</div><div>{item.phone || '—'}</div></div>
            <div><div className="form-label">Dịch vụ</div><div>{item.service || '—'}</div></div>
          </div>
          <div>
            <div className="form-label">Tiêu đề</div>
            <div>{item.subject || '—'}</div>
          </div>
          <div>
            <div className="form-label">Nội dung</div>
            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: 8, lineHeight: 1.7 }}>{item.message}</div>
          </div>
          <div>
            <div className="form-label">Ngày gửi</div>
            <div>{new Date(item.created_at).toLocaleString('vi-VN')}</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
