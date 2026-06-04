import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact { id: number; name: string; phone: string; email: string; subject: string; message: string; service: string; preferred_date: string; preferred_time: string; asset_range: string; consult_format: string; status: string; created_at: string }

export default function ContactDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [c, setC] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Contact>(`/contacts/${id}`).then(setC).catch(() => nav('/contacts')).finally(() => setLoading(false))
  }, [id])

  async function updateStatus(status: string) {
    await api.put(`/contacts/${id}`, { status })
    setC(prev => prev ? { ...prev, status } : null)
  }

  if (loading) return <p style={{ color: 'var(--text-3)' }}>Đang tải...</p>
  if (!c) return null

  const field = (label: string, value?: string) => value ? (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: 'var(--text)' }}>{value}</div>
    </div>
  ) : null

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/contacts" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Chi tiết liên hệ</h1>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>{c.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>{new Date(c.created_at).toLocaleString('vi-VN')}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {c.status !== 'read' && <button className="btn btn-ghost btn-sm" onClick={() => updateStatus('read')}>Đánh dấu đã đọc</button>}
            {c.status !== 'replied' && <button className="btn btn-primary btn-sm" onClick={() => updateStatus('replied')}>Đánh dấu đã trả lời</button>}
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', marginBottom: '16px' }} />
        {field('Điện thoại', c.phone)}
        {field('Email', c.email)}
        {field('Dịch vụ quan tâm', c.service)}
        {field('Ngày muốn tư vấn', c.preferred_date)}
        {field('Khung giờ', c.preferred_time)}
        {field('Quy mô tài sản', c.asset_range)}
        {field('Hình thức tư vấn', c.consult_format)}
        {field('Nội dung', c.message)}
      </div>
    </div>
  )
}
