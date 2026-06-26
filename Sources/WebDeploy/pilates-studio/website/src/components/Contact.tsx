import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface FormData { name: string; email: string; phone: string; subject: string; message: string }
const empty: FormData = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm]   = useState<FormData>(empty)
  const [sending, setSending] = useState(false)
  const [sent, setSent]   = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) { setError('Vui lòng điền tên và nội dung.'); return }
    setSending(true); setError('')
    try {
      await api.post('/contacts', form)
      setSent(true); setForm(empty)
    } catch {
      setError('Gửi tin nhắn thất bại. Vui lòng thử lại sau.')
    } finally { setSending(false) }
  }

  return (
    <section className="ps-contact sec-pad">
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-lg-5 reveal">
            <div className="ps-eyebrow">Liên hệ</div>
            <h2 className="ps-sec-title">Chúng tôi lắng nghe<br /><em>từng câu hỏi.</em></h2>
            <div className="ps-contact-items">
              {settings.site_phone && (
                <div className="ps-contact-item">
                  <div className="ps-ci-icon">📞</div>
                  <div>
                    <div className="ps-ci-label">Điện thoại / Zalo</div>
                    <a href={`tel:${settings.site_phone.replace(/\s/g,'')}`} className="ps-ci-val">{settings.site_phone}</a>
                  </div>
                </div>
              )}
              {settings.site_email && (
                <div className="ps-contact-item">
                  <div className="ps-ci-icon">✉️</div>
                  <div>
                    <div className="ps-ci-label">Email</div>
                    <a href={`mailto:${settings.site_email}`} className="ps-ci-val">{settings.site_email}</a>
                  </div>
                </div>
              )}
              {settings.site_address && (
                <div className="ps-contact-item">
                  <div className="ps-ci-icon">📍</div>
                  <div>
                    <div className="ps-ci-label">Địa chỉ</div>
                    <div className="ps-ci-val">{settings.site_address}</div>
                  </div>
                </div>
              )}
              {settings.working_hours && (
                <div className="ps-contact-item">
                  <div className="ps-ci-icon">⏰</div>
                  <div>
                    <div className="ps-ci-label">Giờ mở cửa</div>
                    <div className="ps-ci-val">{settings.working_hours}</div>
                  </div>
                </div>
              )}
            </div>
            {settings.google_maps_url && (
              <div className="ps-maps-wrap" style={{ marginTop: 24, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <iframe
                  src={settings.google_maps_url}
                  width="100%" height="200"
                  style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ studio"
                />
              </div>
            )}
          </div>

          <div className="col-lg-7 reveal reveal-d2">
            <div className="ps-contact-form-wrap">
              {sent ? (
                <div className="ps-booking-success">
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3>Gửi tin nhắn thành công!</h3>
                  <p>Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
                  <button className="ps-btn-solid" onClick={() => setSent(false)} style={{ marginTop: 16 }}>Gửi thêm</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <div className="ps-form-error">{error}</div>}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="ps-form-label">Họ tên *</label>
                      <input className="ps-form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                    </div>
                    <div className="col-md-6">
                      <label className="ps-form-label">Số điện thoại</label>
                      <input className="ps-form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
                    </div>
                    <div className="col-12">
                      <label className="ps-form-label">Email</label>
                      <input className="ps-form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="example@gmail.com" />
                    </div>
                    <div className="col-12">
                      <label className="ps-form-label">Chủ đề</label>
                      <select className="ps-form-input" value={form.subject} onChange={e => set('subject', e.target.value)}>
                        <option value="">Chọn chủ đề</option>
                        <option>Hỏi về lớp học</option>
                        <option>Đăng ký thành viên</option>
                        <option>Thuê địa điểm / Hợp tác</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="ps-form-label">Nội dung *</label>
                      <textarea className="ps-form-input" rows={5} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Câu hỏi của bạn..." required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="ps-btn-solid" disabled={sending} style={{ width: '100%', justifyContent: 'center', padding: '14px 0' }}>
                        {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
