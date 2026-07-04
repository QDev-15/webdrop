import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const phone = settings.site_phone || '0901 234 567'
  const email = settings.site_email || 'info@smiletech.vn'
  const address = settings.site_address || '123 Nguyễn Đình Chiểu, Q.3, TP.HCM'
  const hours = settings.working_hours || 'T2–T7: 8:00–20:00 · CN: 8:00–17:00'
  const mapEmbed = settings.map_embed || ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setStatus('error')
      setErrMsg('Vui lòng điền đầy đủ họ tên và nội dung tin nhắn.')
      return
    }
    setStatus('loading')
    setErrMsg('')
    try {
      await api.post('/public/contacts', form)
      setStatus('success')
      setForm({ name: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrMsg(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.')
    }
  }

  return (
    <div className="wd-container">
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'start' }}>
        {/* Form */}
        <form className="st-form-panel" onSubmit={handleSubmit} noValidate>
          {status === 'success' && (
            <div className="st-alert st-alert-success">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Cảm ơn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất.
            </div>
          )}
          {status === 'error' && (
            <div className="st-alert st-alert-error">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errMsg}
            </div>
          )}

          <div className="st-form-row">
            <div className="st-field" style={{ marginBottom: 0 }}>
              <label htmlFor="ct-name">Họ và tên *</label>
              <input
                id="ct-name" name="name" type="text"
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="st-field" style={{ marginBottom: 0 }}>
              <label htmlFor="ct-phone">Số điện thoại</label>
              <input
                id="ct-phone" name="phone" type="tel"
                placeholder="0901 234 567"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="st-field">
            <label htmlFor="ct-subject">Tiêu đề</label>
            <input
              id="ct-subject" name="subject" type="text"
              placeholder="Tôi cần tư vấn về..."
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div className="st-field">
            <label htmlFor="ct-message">Nội dung *</label>
            <textarea
              id="ct-message" name="message"
              placeholder="Mô tả câu hỏi hoặc vấn đề bạn muốn tư vấn..."
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="st-btn st-btn-primary st-btn-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <><span className="st-spin" /> Đang gửi...</>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Gửi tin nhắn
              </>
            )}
          </button>
        </form>

        {/* Info sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="st-info-card" data-reveal>
            <div className="icon">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <h4>Địa chỉ</h4>
              <p>{address}</p>
            </div>
          </div>

          <div className="st-info-card" data-reveal data-reveal-delay="1">
            <div className="icon">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.62 1.41h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <h4>Điện thoại / Hotline</h4>
              <p><a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--accent-h)' }}>{phone}</a></p>
            </div>
          </div>

          <div className="st-info-card" data-reveal data-reveal-delay="2">
            <div className="icon">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h4>Email</h4>
              <p><a href={`mailto:${email}`} style={{ color: 'var(--accent-h)' }}>{email}</a></p>
            </div>
          </div>

          <div className="st-info-card" data-reveal data-reveal-delay="3">
            <div className="icon">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h4>Giờ làm việc</h4>
              <p>{hours}</p>
            </div>
          </div>

          <div className="st-map-frame" data-reveal data-reveal-delay="4">
            {mapEmbed ? (
              <iframe
                src={mapEmbed}
                title="Bản đồ SmileTech"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: 'var(--text-3)', fontSize: 13 }}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
