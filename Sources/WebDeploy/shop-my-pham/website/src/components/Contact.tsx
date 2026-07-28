import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Contact() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên Hệ — ${settings.site_name || 'LUMIÈRE Beauty'}`,
    description: `Liên hệ với ${settings.site_name || 'LUMIÈRE Beauty'} để được tư vấn sản phẩm, hỗ trợ đơn hàng hoặc góp ý. Phản hồi trong vòng 2 giờ làm việc.`,
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!form.name.trim()) nextErrors.name = 'Vui lòng nhập họ và tên.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Vui lòng nhập email hợp lệ.'
    if (!form.message.trim() || form.message.trim().length < 10) nextErrors.message = 'Nội dung phải có ít nhất 10 ký tự.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 6000)
    } catch {
      setErrors({ message: 'Gửi thất bại, vui lòng thử lại sau.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main id="mp-main">
      <section className="mp-page-hero">
        <div className="wd-container">
          <nav aria-label="Breadcrumb">
            <ol className="mp-breadcrumb">
              <li><a href="/">Trang chủ</a></li>
              <li><span>Liên hệ</span></li>
            </ol>
          </nav>
          <h1 className="mp-page-hero-title">Liên Hệ</h1>
          <p className="mp-page-hero-sub">Chúng tôi luôn sẵn sàng hỗ trợ bạn. Phản hồi trong vòng 2 giờ trong giờ làm việc.</p>
        </div>
      </section>

      <div className="wd-container">
        <div className="mp-contact-layout">
          <div className="mp-contact-form-wrap">
            <h2 className="mp-contact-form-title">Gửi tin nhắn</h2>
            <form className="mp-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="mp-form-row">
                <div className="mp-form-group">
                  <label htmlFor="mpContactName">Họ và tên <span aria-hidden="true">*</span></label>
                  <input type="text" id="mpContactName" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" autoComplete="name" aria-required="true" />
                  <span className="mp-field-error" role="alert">{errors.name}</span>
                </div>
                <div className="mp-form-group">
                  <label htmlFor="mpContactPhone">Số điện thoại</label>
                  <input type="tel" id="mpContactPhone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" autoComplete="tel" />
                </div>
              </div>
              <div className="mp-form-group">
                <label htmlFor="mpContactEmail">Email <span aria-hidden="true">*</span></label>
                <input type="email" id="mpContactEmail" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" autoComplete="email" aria-required="true" />
                <span className="mp-field-error" role="alert">{errors.email}</span>
              </div>
              <div className="mp-form-group">
                <label htmlFor="mpContactSubject">Chủ đề</label>
                <select id="mpContactSubject" value={form.subject} onChange={e => set('subject', e.target.value)} aria-label="Chọn chủ đề liên hệ">
                  <option value="">-- Chọn chủ đề --</option>
                  <option value="san-pham">Tư vấn sản phẩm</option>
                  <option value="don-hang">Hỏi về đơn hàng</option>
                  <option value="doi-tra">Đổi trả sản phẩm</option>
                  <option value="hop-tac">Hợp tác kinh doanh</option>
                  <option value="khac">Khác</option>
                </select>
              </div>
              <div className="mp-form-group">
                <label htmlFor="mpContactMessage">Nội dung <span aria-hidden="true">*</span></label>
                <textarea id="mpContactMessage" rows={5} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả chi tiết vấn đề bạn cần hỗ trợ..." aria-required="true" />
                <span className="mp-field-error" role="alert">{errors.message}</span>
              </div>
              <button type="submit" className="mp-btn mp-btn-accent mp-btn-large" disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
              {success && (
                <div className="mp-form-success" role="status" aria-live="polite">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  Cảm ơn bạn! Chúng tôi sẽ phản hồi trong vòng 2 giờ làm việc.
                </div>
              )}
            </form>
          </div>

          <aside className="mp-contact-info" aria-label="Thông tin liên hệ">
            <h2 className="mp-contact-info-title">Thông tin liên hệ</h2>

            <dl className="mp-contact-details">
              <div className="mp-contact-detail-item">
                <dt>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  Điện thoại
                </dt>
                <dd><a href={`tel:+84${(settings.site_phone || '').replace(/\D/g, '').replace(/^0/, '')}`}>{settings.site_phone || '0901 234 567'}</a></dd>
              </div>
              <div className="mp-contact-detail-item">
                <dt>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  Email
                </dt>
                <dd><a href={`mailto:${settings.site_email || 'hello@lumiere-beauty.vn'}`}>{settings.site_email || 'hello@lumiere-beauty.vn'}</a></dd>
              </div>
              <div className="mp-contact-detail-item" id="doi-tra">
                <dt>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  Địa chỉ
                </dt>
                <dd>{settings.site_address || '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'}</dd>
              </div>
              <div className="mp-contact-detail-item">
                <dt>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Giờ làm việc
                </dt>
                <dd>{settings.working_hours || 'Thứ Hai – Thứ Bảy: 8:00 – 22:00, Chủ Nhật: 9:00 – 20:00'}</dd>
              </div>
            </dl>

            <div className="mp-contact-policy-box" aria-label="Chính sách đổi trả">
              <h3>Chính Sách Đổi Trả</h3>
              <p style={{ whiteSpace: 'pre-line' }}>
                {settings.return_policy_note || 'Đổi trả miễn phí trong 30 ngày kể từ ngày nhận hàng. Sản phẩm còn nguyên seal, chưa qua sử dụng. Hàng lỗi / không đúng mô tả: đổi ngay, không tính phí. Liên hệ hotline hoặc email để được hỗ trợ.'}
              </p>
            </div>

            <div className="mp-contact-social-box">
              <h3>Kết nối với LUMIÈRE</h3>
              <div className="mp-contact-social-links" aria-label="Mạng xã hội">
                <a href={settings.facebook || '#'} className="mp-contact-social-link" rel="noopener noreferrer" target="_blank" aria-label="Facebook LUMIÈRE">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  Facebook
                </a>
                <a href={settings.instagram || '#'} className="mp-contact-social-link" rel="noopener noreferrer" target="_blank" aria-label="Instagram LUMIÈRE">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  Instagram
                </a>
                {settings.zalo_number && (
                  <a href={`https://zalo.me/${settings.zalo_number}`} className="mp-contact-social-link" rel="noopener noreferrer" target="_blank" aria-label="Zalo LUMIÈRE">
                    <svg width="16" height="16" viewBox="0 0 50 50" fill="currentColor" aria-hidden="true"><text x="6" y="34" fontSize="28" fontWeight="bold" fontFamily="Arial,sans-serif">Z</text></svg>
                    Zalo
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
