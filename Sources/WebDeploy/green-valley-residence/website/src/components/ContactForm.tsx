import { useState } from 'react'
import { api } from '../api/client'
import { useUnitTypes } from '../hooks/useUnitTypes'
import { formatVND } from '../utils/format'

interface Props {
  variant?: 'compact' | 'full'
  defaultUnitSlug?: string
}

export default function ContactForm({ variant = 'full', defaultUnitSlug = '' }: Props) {
  const { units } = useUnitTypes()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [unitInterest, setUnitInterest] = useState(defaultUnitSlug)
  const [visitDate, setVisitDate] = useState('')
  const [contactMethod, setContactMethod] = useState('Điện thoại')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess(false)
    if (!name.trim() || !phone.trim()) { setError('Vui lòng nhập họ tên và số điện thoại.'); return }
    setSubmitting(true)
    try {
      await api.post('/public/contact', {
        name, phone, email,
        subject: 'Đăng ký nhận bảng giá & tư vấn',
        unit_interest: unitInterest,
        visit_date: visitDate,
        contact_method: contactMethod,
        note,
      })
      setSuccess(true)
      setName(''); setPhone(''); setEmail(''); setVisitDate(''); setNote('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi đăng ký thất bại, vui lòng thử lại.')
    } finally { setSubmitting(false) }
  }

  if (variant === 'compact') {
    return (
      <div className="gvr-card gvr-card-solid p-4 gvr-form">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Đăng ký nhận bảng giá &amp; tư vấn</h3>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18 }}>Để lại thông tin — chúng tôi liên hệ trong 30 phút.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Họ và tên</label>
            <input type="text" className="form-control" required placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input type="tel" className="form-control" required placeholder="09xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Loại căn quan tâm</label>
            <select className="form-select" value={unitInterest} onChange={e => setUnitInterest(e.target.value)}>
              {units.map(u => <option key={u.slug} value={u.slug}>{u.name} — {formatVND(u.price_from)}</option>)}
            </select>
          </div>
          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
          {success && <div style={{ marginBottom: 14, padding: '12px 14px', background: 'var(--ok-light)', color: 'var(--ok)', borderRadius: 10, fontSize: 13, fontWeight: 600 }}>✓ Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm nhất.</div>}
          <button type="submit" className="gvr-btn gvr-btn-accent gvr-btn-block" disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi đăng ký →'}</button>
        </form>
      </div>
    )
  }

  return (
    <div className="gvr-card gvr-card-solid p-4 gvr-form mb-4">
      <h2 className="sec-title" style={{ fontSize: 22, marginBottom: 6 }}>Đăng ký nhận bảng giá &amp; đặt lịch xem nhà mẫu</h2>
      <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 22 }}>Điền thông tin bên dưới, chúng tôi sẽ liên hệ tư vấn trong vòng 30 phút làm việc.</p>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Họ và tên</label>
            <input type="text" className="form-control" required placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Số điện thoại</label>
            <input type="tel" className="form-control" required placeholder="09xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="email@vidu.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Loại căn quan tâm</label>
            <select className="form-select" value={unitInterest} onChange={e => setUnitInterest(e.target.value)}>
              <option value="">— Chưa xác định —</option>
              {units.map(u => <option key={u.slug} value={u.slug}>{u.name} — {formatVND(u.price_from)}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Ngày mong muốn tham quan nhà mẫu</label>
            <input type="date" className="form-control" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Hình thức liên hệ ưu tiên</label>
            <select className="form-select" value={contactMethod} onChange={e => setContactMethod(e.target.value)}>
              <option>Điện thoại</option>
              <option>Zalo</option>
              <option>Email</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Ghi chú thêm</label>
            <textarea className="form-control" rows={3} placeholder="Ngân sách dự kiến, nhu cầu vay ngân hàng, thời gian phù hợp liên hệ..." value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>
        {error && <div className="alert alert-danger py-2 small" style={{ marginTop: 16 }}>{error}</div>}
        <button type="submit" className="gvr-btn gvr-btn-accent" style={{ marginTop: 20 }} disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi đăng ký →'}</button>
        {success && (
          <div style={{ display: 'block', marginTop: 16, padding: '14px 18px', background: 'var(--ok-light)', color: 'var(--ok)', borderRadius: 12, fontSize: 13.5, fontWeight: 600 }}>
            ✓ Cảm ơn bạn đã đăng ký! Phòng Kinh doanh dự án sẽ liên hệ trong vòng 30 phút.
          </div>
        )}
      </form>
    </div>
  )
}
