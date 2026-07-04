import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const EMPTY: ContactForm = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm]     = useState<ContactForm>(EMPTY)
  const [submitting, setSub] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const phone   = settings.site_phone   || '028 3822 0000'
  const email   = settings.site_email   || 'lienhe@chinhnhasaigon.vn'
  const address = settings.site_address || '123 Nguyễn Văn Trỗi, P.12, Q. Phú Nhuận, TP.HCM'
  const hours   = settings.working_hours|| 'T2–T7: 8:00–20:00 | CN: 8:00–12:00'
  const mapEmbed = settings.map_embed   || ''

  const set = (k: keyof ContactForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Vui lòng nhập họ tên.'); return }
    if (!form.message.trim()) { setError('Vui lòng nhập nội dung tin nhắn.'); return }
    setSub(true); setError('')
    try {
      await api.post('/contacts', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch {
      setError('Gửi thất bại. Vui lòng thử lại hoặc liên hệ trực tiếp.')
    } finally { setSub(false) }
  }

  return (
    <section className="cn-contact sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 52 }} data-reveal>
          <div className="cn-eyebrow">Liên hệ với chúng tôi</div>
          <h2 className="cn-title">Sẵn sàng lắng nghe <em>thắc mắc</em></h2>
          <p className="cn-sub" style={{ margin: '0 auto' }}>
            Liên hệ trực tiếp hoặc để lại tin nhắn — chúng tôi phản hồi trong 30 phút trong giờ làm việc.
          </p>
        </div>

        <div className="cn-contact-wrap">
          {/* Left: map + info */}
          <div data-reveal>
            <div className="cn-map-wrap">
              {mapEmbed ? (
                <iframe
                  src={mapEmbed}
                  width="100%"
                  height="300"
                  style={{ display: 'block', border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Bản đồ phòng khám"
                />
              ) : (
                <div className="cn-map-placeholder">
                  <div className="cn-map-grid" aria-hidden="true" />
                  <div className="cn-map-pin-wrap">
                    <div className="cn-map-pin">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div className="cn-map-addr">{address}</div>
                  </div>
                </div>
              )}
              <div className="cn-map-cta-bar">
                <div className="cn-map-cta-text">{address}</div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cn-map-cta-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Xem Google Maps
                </a>
              </div>
            </div>

            <div className="cn-contact-details">
              <div className="cn-contact-item">
                <div className="cn-contact-icon" aria-hidden="true">📞</div>
                <div>
                  <div className="cn-contact-label">Điện thoại</div>
                  <div className="cn-contact-val"><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></div>
                </div>
              </div>
              <div className="cn-contact-item">
                <div className="cn-contact-icon" aria-hidden="true">✉</div>
                <div>
                  <div className="cn-contact-label">Email</div>
                  <div className="cn-contact-val"><a href={`mailto:${email}`}>{email}</a></div>
                </div>
              </div>
              <div className="cn-contact-item">
                <div className="cn-contact-icon" aria-hidden="true">📍</div>
                <div>
                  <div className="cn-contact-label">Địa chỉ</div>
                  <div className="cn-contact-val">{address}</div>
                </div>
              </div>
              <div className="cn-contact-item">
                <div className="cn-contact-icon" aria-hidden="true">⏱</div>
                <div>
                  <div className="cn-contact-label">Giờ làm việc</div>
                  <div className="cn-contact-val">{hours}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: short form */}
          <div data-reveal data-delay="1">
            <div className="cn-short-form">
              <div className="cn-short-form-title">Gửi tin nhắn</div>
              <div className="cn-short-form-sub">Chúng tôi phản hồi trong 30 phút (giờ làm việc).</div>

              {success ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✓</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Đã gửi thành công!</div>
                  <div style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,.4)' }}>Chúng tôi sẽ phản hồi sớm nhất có thể.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{ background: 'rgba(255,0,0,.1)', border: '1px solid rgba(255,100,100,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#ff8080', fontSize: 12 }}>
                      {error}
                    </div>
                  )}
                  <div className="cn-form-dark-group">
                    <label className="cn-label-dark" htmlFor="ct-name">Họ tên *</label>
                    <input id="ct-name" className="cn-input-dark" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Thị An" required />
                  </div>
                  <div className="cn-form-dark-group">
                    <label className="cn-label-dark" htmlFor="ct-phone">Số điện thoại</label>
                    <input id="ct-phone" className="cn-input-dark" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
                  </div>
                  <div className="cn-form-dark-group">
                    <label className="cn-label-dark" htmlFor="ct-email">Email</label>
                    <input id="ct-email" className="cn-input-dark" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div className="cn-form-dark-group">
                    <label className="cn-label-dark" htmlFor="ct-msg">Tin nhắn *</label>
                    <textarea id="ct-msg" className="cn-input-dark" rows={4} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Câu hỏi hoặc nội dung cần tư vấn..." required />
                  </div>
                  <button type="submit" disabled={submitting} className="cn-submit-dark">
                    {submitting ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
