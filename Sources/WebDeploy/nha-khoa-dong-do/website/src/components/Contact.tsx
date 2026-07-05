import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function Contact() {
  const { settings } = useSite()
  const phone    = settings.site_phone || ''
  const email    = settings.site_email || ''
  const address  = settings.site_address || ''
  const hours    = settings.working_hours || 'T2-CN: 08:00 – 20:00'

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Vui lòng nhập họ và tên.'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSubmitted(true)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dd-contact-wrap">
      <div>
        {phone && (
          <div className="dd-contact-item">
            <h4>Điện thoại</h4>
            <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
          </div>
        )}
        {email && (
          <div className="dd-contact-item">
            <h4>Email</h4>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        )}
        {hours && (
          <div className="dd-contact-item">
            <h4>Giờ làm việc</h4>
            <p>{hours}</p>
          </div>
        )}
        {address && (
          <div className="dd-contact-item">
            <h4>Địa chỉ</h4>
            <p>{address}</p>
          </div>
        )}
      </div>

      <div>
        {submitted ? (
          <div className="dd-form-success show">
            Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="dd-form-grid">
              <div className="dd-field">
                <label htmlFor="contactName">Họ và tên *</label>
                <input type="text" id="contactName" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn An" required />
              </div>
              <div className="dd-field">
                <label htmlFor="contactPhone">Số điện thoại</label>
                <input type="tel" id="contactPhone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
              </div>
              <div className="dd-field full">
                <label htmlFor="contactEmail">Email</label>
                <input type="email" id="contactEmail" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="dd-field full">
                <label htmlFor="contactSubject">Chủ đề</label>
                <input type="text" id="contactSubject" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Tôi muốn hỏi về..." />
              </div>
              <div className="dd-field full">
                <label htmlFor="contactMessage">Tin nhắn</label>
                <textarea id="contactMessage" value={form.message} onChange={e => set('message', e.target.value)} rows={5} placeholder="Nội dung tin nhắn..." />
              </div>
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '14px', marginTop: '12px' }}>{error}</p>}
            <button type="submit" className="dd-btn dd-btn-fill" style={{ marginTop: '28px' }} disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
              {!loading && <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
