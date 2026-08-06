import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'OFFICEHUB'}`,
    description: `Liên hệ ${settings.site_name || 'OFFICEHUB'} để đặt hàng, báo giá doanh nghiệp, hoặc hỗ trợ sau bán hàng. ${settings.contact_note || 'Phản hồi trong 30 phút trong giờ hành chính.'}`,
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ và tên'
    if (!form.phone.trim() || !/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Số điện thoại không hợp lệ (9–11 chữ số)'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email không đúng định dạng'
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Vui lòng nhập nội dung (ít nhất 10 ký tự)'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

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
    <>
      <div className="vp-page-header">
        <div className="vp-container">
          <nav aria-label="Breadcrumb" className="vp-breadcrumb">
            <a href="/">Trang chủ</a>
            <span>›</span>
            <span aria-current="page">Liên hệ</span>
          </nav>
          <h1>Liên hệ với chúng tôi</h1>
          <p>{settings.contact_note || 'Phản hồi trong 30 phút trong giờ hành chính'}</p>
        </div>
      </div>

      <section className="vp-section" aria-labelledby="contact-heading">
        <div className="vp-container">
          <div className="vp-contact-grid">
            <div data-reveal>
              <h2 className="vp-sec-title" id="contact-heading" style={{ fontSize: 'clamp(22px,2.5vw,30px)', marginBottom: 28 }}>Thông tin <em>liên hệ</em></h2>

              <div className="vp-contact-info-block">
                {settings.site_phone && (
                  <div className="vp-contact-info-item">
                    <div className="vp-contact-info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                    </div>
                    <div>
                      <div className="vp-contact-info-label">Hotline</div>
                      <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`} className="vp-contact-info-value">{settings.site_phone}</a>
                      {settings.working_hours && <div className="vp-contact-info-note">{settings.working_hours}</div>}
                    </div>
                  </div>
                )}
                {settings.site_email && (
                  <div className="vp-contact-info-item">
                    <div className="vp-contact-info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div>
                      <div className="vp-contact-info-label">Email</div>
                      <a href={`mailto:${settings.site_email}`} className="vp-contact-info-value">{settings.site_email}</a>
                      <div className="vp-contact-info-note">Phản hồi trong vòng 2 giờ</div>
                    </div>
                  </div>
                )}
                {settings.site_address && (
                  <div className="vp-contact-info-item">
                    <div className="vp-contact-info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <div>
                      <div className="vp-contact-info-label">Văn phòng</div>
                      <div className="vp-contact-info-value">{settings.site_address}</div>
                      <div className="vp-contact-info-note">Kho hàng + showroom · Có chỗ đỗ xe</div>
                    </div>
                  </div>
                )}
                {settings.working_hours && (
                  <div className="vp-contact-info-item">
                    <div className="vp-contact-info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div>
                      <div className="vp-contact-info-label">Giờ làm việc</div>
                      <div className="vp-contact-info-value">{settings.working_hours}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="vp-contact-office-img" style={{ marginTop: 28 }}>
                <img
                  src="https://images.unsplash.com/photo-1536584754829-12214d404f32?w=600&auto=format&fit=crop&q=80"
                  alt={`Showroom ${settings.site_name || 'OFFICEHUB'}`}
                  loading="lazy"
                />
              </div>
            </div>

            <div data-reveal>
              <div className="vp-contact-form-wrap">
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Gửi yêu cầu</h2>
                <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24 }}>Để lại thông tin — chúng tôi sẽ liên hệ lại trong vòng 2 giờ làm việc.</p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="vp-form-row">
                    <div className="vp-form-group">
                      <label htmlFor="cfName">Họ và tên <span className="vp-req" aria-hidden="true">*</span></label>
                      <input type="text" id="cfName" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" autoComplete="name" />
                      <div className="vp-form-error" role="alert">{errors.name}</div>
                    </div>
                    <div className="vp-form-group">
                      <label htmlFor="cfPhone">Số điện thoại <span className="vp-req" aria-hidden="true">*</span></label>
                      <input type="tel" id="cfPhone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09x xxx xxxx" autoComplete="tel" />
                      <div className="vp-form-error" role="alert">{errors.phone}</div>
                    </div>
                  </div>
                  <div className="vp-form-group">
                    <label htmlFor="cfEmail">Email</label>
                    <input type="email" id="cfEmail" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@congty.vn" autoComplete="email" />
                    <div className="vp-form-error" role="alert">{errors.email}</div>
                  </div>
                  <div className="vp-form-group">
                    <label htmlFor="cfSubject">Chủ đề</label>
                    <select id="cfSubject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                      <option value="">-- Chọn chủ đề --</option>
                      <option>Hỏi giá / báo giá doanh nghiệp</option>
                      <option>Đặt hàng số lượng lớn</option>
                      <option>In logo thương hiệu</option>
                      <option>Hợp đồng cung ứng định kỳ</option>
                      <option>Hỗ trợ đơn hàng</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className="vp-form-group">
                    <label htmlFor="cfMessage">Nội dung <span className="vp-req" aria-hidden="true">*</span></label>
                    <textarea id="cfMessage" rows={5} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả nhu cầu của bạn: số lượng, chủng loại, thời gian cần..." />
                    <div className="vp-form-error" role="alert">{errors.message}</div>
                  </div>
                  <button type="submit" className="vp-btn vp-btn-primary vp-btn-full" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                  </button>
                  {success && (
                    <div className="vp-form-success" role="alert">
                      ✓ Gửi thành công! Chúng tôi sẽ liên hệ lại trong vòng 2 giờ.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
