import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

export default function Contact() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'AMI Fashion'}`,
    description: `Liên hệ với ${settings.site_name || 'AMI Fashion'} qua Zalo, email hoặc điện thoại. Chúng tôi hỗ trợ 7 ngày trong tuần.`,
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.subject.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (*)')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSent(true)
    } catch {
      setError('Gửi tin nhắn thất bại, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="am-page-body">
      <div className="am-page-hero">
        <div className="am-container">
          <h1><em>Liên hệ với chúng tôi</em></h1>
          <p>Câu hỏi về sản phẩm, đổi trả hay cần tư vấn size? Chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
        </div>
      </div>

      <section className="am-sec" aria-label="Thông tin liên hệ và form">
        <div className="am-container">
          <div className="am-contact-grid" data-reveal>

            <div className="am-contact-info">
              <h2><em>Cách liên hệ</em></h2>

              <div className="am-contact-item">
                <div className="am-contact-item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.16h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <p className="am-contact-item-title">Điện thoại / Zalo</p>
                  <p className="am-contact-item-val">{settings.site_phone || '0909 345 678'}</p>
                </div>
              </div>

              <div className="am-contact-item">
                <div className="am-contact-item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div>
                  <p className="am-contact-item-title">Email</p>
                  <p className="am-contact-item-val">{settings.site_email || 'hello@amifashion.vn'}</p>
                </div>
              </div>

              <div className="am-contact-item">
                <div className="am-contact-item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div>
                  <p className="am-contact-item-title">Địa chỉ showroom</p>
                  <p className="am-contact-item-val">{settings.site_address || '12 Lê Văn Sỹ, Quận 3, TP.HCM'}</p>
                </div>
              </div>

              <div className="am-contact-item">
                <div className="am-contact-item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <p className="am-contact-item-title">Giờ mở cửa</p>
                  <p className="am-contact-item-val">{settings.working_hours || 'Thứ 2 – Chủ nhật: 9:00 – 21:00'}</p>
                </div>
              </div>

              {settings.contact_note && (
                <div style={{ marginTop: 24, padding: 20, background: 'var(--accent-light)', borderLeft: '3px solid var(--accent)' }}>
                  <p style={{ fontSize: 13, color: 'var(--accent-h)', lineHeight: 1.7, margin: 0 }}>
                    <strong>Phản hồi nhanh nhất</strong> {settings.contact_note.replace(/^Phản hồi nhanh nhất\s*/i, '')}
                  </p>
                </div>
              )}
            </div>

            <div>
              {sent ? (
                <div style={{ padding: 20, background: 'var(--accent-light)', borderLeft: '3px solid var(--accent)' }}>
                  <p style={{ color: 'var(--accent-h)', margin: 0, fontSize: 14 }}>Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 30 phút trong giờ làm việc.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {error && <div className="form-error-banner" style={{ marginBottom: 16 }}>{error}</div>}
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="am-form-field">
                        <label htmlFor="contactName" className="am-form-label">Họ và tên *</label>
                        <input type="text" id="contactName" className="am-form-input" placeholder="Nguyễn Văn A" required autoComplete="name" value={form.name} onChange={e => set('name', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="am-form-field">
                        <label htmlFor="contactPhone" className="am-form-label">Số điện thoại *</label>
                        <input type="tel" id="contactPhone" className="am-form-input" placeholder="0901 234 567" required autoComplete="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="am-form-field">
                        <label htmlFor="contactEmail" className="am-form-label">Email</label>
                        <input type="email" id="contactEmail" className="am-form-input" placeholder="email@example.com" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="am-form-field">
                        <label htmlFor="contactSubject" className="am-form-label">Chủ đề *</label>
                        <select id="contactSubject" className="am-form-input am-sort-select" style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)' }} required value={form.subject} onChange={e => set('subject', e.target.value)}>
                          <option value="">Chọn chủ đề...</option>
                          <option value="order">Hỏi về đơn hàng</option>
                          <option value="return">Đổi trả sản phẩm</option>
                          <option value="size">Tư vấn chọn size</option>
                          <option value="product">Hỏi về sản phẩm</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="am-form-field">
                        <label htmlFor="contactMessage" className="am-form-label">Nội dung *</label>
                        <textarea id="contactMessage" className="am-form-input" rows={5} placeholder="Nhập nội dung câu hỏi hoặc yêu cầu của bạn..." required value={form.message} onChange={e => set('message', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="am-btn-primary" style={{ width: 'auto', padding: '14px 40px' }} disabled={submitting}>
                        {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
