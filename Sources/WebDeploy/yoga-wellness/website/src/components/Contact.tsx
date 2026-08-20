import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Settings {
  site_phone: string
  site_email: string
  site_address: string
  working_hours: string
}

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function Contact() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<{ [key: string]: string }>('/public/settings').then(data => {
      setSettings({
        site_phone: data.site_phone || '',
        site_email: data.site_email || '',
        site_address: data.site_address || '',
        working_hours: data.working_hours || ''
      })
    }).catch(() => {})
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError((err as Error).message || 'Lỗi khi gửi tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="sec-pad yw-strip">
      <div className="wd-container">
        <div className="yw-sec-header text-center mb-5" data-reveal>
          <div className="yw-eyebrow">Liên Hệ</div>
          <h2 className="yw-title">Hãy liên hệ với <em>chúng tôi</em></h2>
          <p className="yw-sub centered">Chúng tôi luôn sẵn sàng lắng nghe và trả lời mọi câu hỏi của bạn</p>
        </div>

        <div className="row g-5 mt-4">
          <div className="col-lg-5">
            <div data-reveal>
              <h3 className="yw-form-title mb-4">Thông tin liên hệ</h3>
              {settings ? (
                <>
                  {settings.site_phone && (
                    <div className="yw-contact-info-card">
                      <div className="yw-contact-icon">📱</div>
                      <div>
                        <div className="yw-contact-label">Điện thoại</div>
                        <a href={`tel:${settings.site_phone}`} className="yw-contact-value" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{settings.site_phone}</a>
                      </div>
                    </div>
                  )}
                  {settings.site_email && (
                    <div className="yw-contact-info-card">
                      <div className="yw-contact-icon">📧</div>
                      <div>
                        <div className="yw-contact-label">Email</div>
                        <a href={`mailto:${settings.site_email}`} className="yw-contact-value" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{settings.site_email}</a>
                      </div>
                    </div>
                  )}
                  {settings.site_address && (
                    <div className="yw-contact-info-card">
                      <div className="yw-contact-icon">📍</div>
                      <div>
                        <div className="yw-contact-label">Địa chỉ</div>
                        <div className="yw-contact-value">{settings.site_address}</div>
                      </div>
                    </div>
                  )}
                  {settings.working_hours && (
                    <div className="yw-contact-info-card">
                      <div className="yw-contact-icon">🕐</div>
                      <div>
                        <div className="yw-contact-label">Giờ làm việc</div>
                        <div className="yw-contact-value">{settings.working_hours}</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted">Đang tải...</p>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="yw-form-box" data-reveal>
              <h3 className="yw-form-title">Gửi tin nhắn</h3>
              <p className="yw-form-sub">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
              {success && <div className="alert alert-success" style={{ marginBottom: '16px' }}>✓ Tin nhắn được gửi thành công! Cảm ơn bạn.</div>}
              {error && <div className="alert alert-danger" style={{ marginBottom: '16px' }}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="yw-form-label">Họ tên *</label>
                    <input type="text" className="yw-form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="yw-form-label">Email *</label>
                    <input type="email" className="yw-form-control" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="yw-form-label">Điện thoại</label>
                  <input type="tel" className="yw-form-control" name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="yw-form-label">Chủ đề *</label>
                  <input type="text" className="yw-form-control" name="subject" value={form.subject} onChange={handleChange} placeholder="Ví dụ: Hỏi về lớp Vinyasa" required />
                </div>
                <div className="mb-3">
                  <label className="yw-form-label">Nội dung *</label>
                  <textarea className="yw-form-control" name="message" value={form.message} onChange={handleChange} placeholder="Tin nhắn của bạn..." required rows={5} />
                </div>
                <button type="submit" className="yw-btn w-100" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi tin nhắn'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
