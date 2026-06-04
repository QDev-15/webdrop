import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact {
  id: number; name: string; phone: string; email: string
  construction_type: string; area: string; budget: string; location: string
  message: string; status: string; created_at: string
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ContactDetail() {
  const { id } = useParams(); const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Contact>(`/contacts/${id}`).then(setContact).catch(() => navigate('/contacts')).finally(() => setLoading(false))
  }, [id, navigate])

  async function handleStatus(status: string) {
    await api.put(`/contacts/${id}/status`, { status })
    setContact(c => c ? { ...c, status } : c)
  }

  async function handleDelete() {
    if (!confirm('Xóa yêu cầu này?')) return
    await api.delete(`/contacts/${id}`)
    navigate('/contacts')
  }

  if (loading) return <div className="card"><p style={{ color: 'var(--text-3)' }}>Đang tải...</p></div>
  if (!contact) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/contacts" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Chi tiết yêu cầu báo giá</h1>
      </div>

      <div className="grid grid-2" style={{ gap: 24, alignItems: 'start' }}>
        <div className="card">
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Thông tin khách hàng</h2>
          {[
            ['Họ tên', contact.name],
            ['Điện thoại', contact.phone],
            ['Email', contact.email],
            ['Loại công trình', contact.construction_type],
            ['Diện tích', contact.area],
            ['Ngân sách', contact.budget],
            ['Địa điểm thi công', contact.location],
            ['Thời gian gửi', fmtDate(contact.created_at)],
          ].map(([label, value]) => value ? (
            <div key={label} style={{ display: 'flex', marginBottom: 14, gap: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .5, minWidth: 140 }}>{label}</div>
              <div style={{ fontSize: 14, color: 'var(--text)', flex: 1 }}>{value}</div>
            </div>
          ) : null)}
          {contact.message && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>Ghi chú / Yêu cầu thêm</div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{contact.message}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Trạng thái xử lý</h2>
          <div style={{ marginBottom: 20 }}>
            <span className={`badge badge-${contact.status}`} style={{ fontSize: 13, padding: '5px 12px' }}>
              {contact.status === 'new' ? 'Mới' : contact.status === 'read' ? 'Đã xem' : 'Đã trả lời'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => handleStatus('read')} disabled={contact.status === 'read'}>
              Đánh dấu Đã xem
            </button>
            <button className="btn btn-primary" onClick={() => handleStatus('replied')} disabled={contact.status === 'replied'}>
              Đánh dấu Đã trả lời
            </button>
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="btn btn-ghost">
                Gọi {contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="btn btn-ghost">
                Email {contact.email}
              </a>
            )}
            <button className="btn btn-danger" style={{ marginTop: 8 }} onClick={handleDelete}>
              Xóa yêu cầu này
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
