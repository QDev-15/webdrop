import { useEffect, useState, FormEvent } from 'react'
import { api } from '../api/client'

interface Settings {
  site_name?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  social_facebook?: string
  social_instagram?: string
  social_zalo?: string
  [key: string]: string | undefined
}

interface ContactPayload {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  message?: string
}

export default function Contact() {
  const [settings, setSettings] = useState<Settings>({})
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors]   = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  useEffect(() => {
    api.get<Settings>('/public/settings')
      .then(setSettings)
      .catch(() => {})
  }, [])

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = 'Vui lòng nhập họ tên.'
    if (!message.trim()) errs.message = 'Vui lòng nhập nội dung.'
    return errs
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const payload: ContactPayload = { name, email, phone, subject, message }
      await api.post<unknown>('/contacts', payload)
      setSubmitted(true)
    } catch {
      setErrors({ name: 'Có lỗi xảy ra, vui lòng thử lại.' })
    } finally {
      setSubmitting(false)
    }
  }

  const sitePhone   = settings.site_phone   || '0901 234 567'
  const siteEmail   = settings.site_email   || 'info@luxuryspa.vn'
  const siteAddress = settings.site_address || '123 Đường Resort, Quận 2, TP.HCM'
  const hours       = settings.working_hours || 'Thứ 2 – Chủ nhật: 7:00 – 22:00'
  const facebook    = settings.social_facebook
  const instagram   = settings.social_instagram
  const zalo        = settings.social_zalo

  return (
    <section className="sl-contact-bg sl-section">
      <div className="sl-container">
        <div className="sl-contact-layout">
          {/* ── Left: contact info ── */}
          <div>
            <div className="sl-sec-head" data-reveal>
              <p className="sl-eyebrow">Thông tin liên hệ</p>
              <h2 className="sl-sec-title">Chúng tôi ở <em>đây</em> cho bạn</h2>
              <p className="sl-sec-sub">
                Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn chọn gói phù hợp và trả lời mọi thắc mắc.
              </p>
            </div>

            <div className="sl-contact-cards">
              {/* Phone */}
              <div className="sl-contact-card" data-reveal>
                <div className="sl-contact-card-icon">📞</div>
                <div>
                  <p className="sl-contact-card-label">Hotline</p>
                  <p className="sl-contact-card-value">
                    <a href={`tel:${sitePhone.replace(/\s/g, '')}`}>{sitePhone}</a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="sl-contact-card" data-reveal>
                <div className="sl-contact-card-icon">✉️</div>
                <div>
                  <p className="sl-contact-card-label">Email</p>
                  <p className="sl-contact-card-value">
                    <a href={`mailto:${siteEmail}`}>{siteEmail}</a>
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="sl-contact-card" data-reveal>
                <div className="sl-contact-card-icon">📍</div>
                <div>
                  <p className="sl-contact-card-label">Địa chỉ</p>
                  <p className="sl-contact-card-value">{siteAddress}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="sl-contact-card" data-reveal>
                <div className="sl-contact-card-icon">🕐</div>
                <div>
                  <p className="sl-contact-card-label">Giờ phục vụ</p>
                  <p className="sl-contact-card-value">{hours}</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sl-btn sl-btn-outline sl-btn-sm"
                >
                  Facebook
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sl-btn sl-btn-outline sl-btn-sm"
                >
                  Instagram
                </a>
              )}
              {zalo && (
                <a
                  href={`https://zalo.me/${zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sl-btn sl-btn-outline sl-btn-sm"
                  style={{ color: '#0068FF', borderColor: '#0068FF' }}
                >
                  Zalo
                </a>
              )}
            </div>

            {/* Map placeholder */}
            <div className="sl-map-wrap" data-reveal>
              <div className="sl-map-placeholder">
                <div style={{ fontSize: 32 }}>🗺️</div>
                <p>Bản đồ — {siteAddress}</p>
              </div>
            </div>
          </div>

          {/* ── Right: contact form ── */}
          <div>
            <div className="sl-contact-form-wrap" data-reveal>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                  <h3 style={{ fontSize: 20, fontWeight: 300, color: 'var(--accent)', marginBottom: 12 }}>
                    Tin nhắn đã được gửi!
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.
                  </p>
                  <button
                    className="sl-btn sl-btn-outline"
                    style={{ marginTop: 20 }}
                    onClick={() => {
                      setSubmitted(false)
                      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('')
                    }}
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 className="sl-contact-form-title">Gửi tin nhắn</h2>

                  <div className="sl-form-row">
                    <div className="sl-field">
                      <label htmlFor="ct-name">Họ và tên *</label>
                      <input
                        id="ct-name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                      {errors.name && <span className="sl-field-error">{errors.name}</span>}
                    </div>
                    <div className="sl-field">
                      <label htmlFor="ct-phone">Số điện thoại</label>
                      <input
                        id="ct-phone"
                        type="tel"
                        placeholder="0901 234 567"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sl-field">
                    <label htmlFor="ct-email">Email</label>
                    <input
                      id="ct-email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="sl-field">
                    <label htmlFor="ct-subject">Chủ đề</label>
                    <select
                      id="ct-subject"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                    >
                      <option value="">-- Chọn chủ đề --</option>
                      <option>Tư vấn gói dịch vụ</option>
                      <option>Đặt lịch trải nghiệm</option>
                      <option>Hỏi về giá</option>
                      <option>Khiếu nại / góp ý</option>
                      <option>Hợp tác</option>
                      <option>Khác</option>
                    </select>
                  </div>

                  <div className="sl-field">
                    <label htmlFor="ct-message">Nội dung *</label>
                    <textarea
                      id="ct-message"
                      rows={5}
                      placeholder="Nội dung tin nhắn..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                    />
                    {errors.message && <span className="sl-field-error">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="sl-btn sl-btn-gold"
                    style={{ width: '100%', justifyContent: 'center', opacity: submitting ? .7 : 1 }}
                    disabled={submitting}
                  >
                    {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
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
