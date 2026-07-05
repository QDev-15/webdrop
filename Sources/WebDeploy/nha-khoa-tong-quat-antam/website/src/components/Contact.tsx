import { useEffect, useState, FormEvent } from 'react'
import { api } from '../api/client'

interface Settings {
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  map_embed?: string
  parking_note?: string
}

interface ContactForm {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

const EMPTY: ContactForm = { name: '', phone: '', email: '', subject: '', message: '' }

const CONTACT_INFO = [
  { label: 'Địa chỉ', key: 'site_address' as const },
  { label: 'Điện thoại', key: 'site_phone' as const },
  { label: 'Email', key: 'site_email' as const },
  { label: 'Giờ làm việc', key: 'working_hours' as const },
]

export default function Contact() {
  const [settings, setSettings] = useState<Settings>({})
  const [form, setForm] = useState<ContactForm>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Settings>('/public/settings').then(setSettings).catch(() => {})
  }, [])

  function set<K extends keyof ContactForm>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setError('Vui lòng nhập họ tên và ít nhất một phương thức liên hệ.')
      return
    }
    setLoading(true)
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'start' }}>
        {/* Info column */}
        <div>
          <div className="at-eyebrow">
            <span className="at-eyebrow-line" />
            Thông tin liên hệ
          </div>
          <h2 className="at-title" style={{ marginBottom: 36 }}>
            Chúng tôi ở đây<br />
            <em>vì bạn</em>
          </h2>

          <div>
            {CONTACT_INFO.map(item => {
              const value = settings[item.key]
              if (!value) return null
              return (
                <div key={item.key} className="at-contact-item">
                  <div className="at-contact-label">{item.label}</div>
                  {item.key === 'site_phone' ? (
                    <a href={`tel:${value.replace(/\s/g, '')}`} className="at-contact-value" style={{ display: 'block' }}>
                      {value}
                    </a>
                  ) : item.key === 'site_email' ? (
                    <a href={`mailto:${value}`} className="at-contact-value" style={{ display: 'block' }}>
                      {value}
                    </a>
                  ) : (
                    <div className="at-contact-value">{value}</div>
                  )}
                  {item.key === 'site_address' && settings.parking_note && (
                    <div className="at-contact-note">{settings.parking_note}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form column */}
        <div>
          <div className="at-booking-card">
            <h3 className="at-booking-title">Gửi tin nhắn</h3>
            <p className="at-booking-sub">Câu hỏi, góp ý, hoặc chỉ đơn giản là muốn hỏi thêm.</p>

            {success && (
              <div className="at-alert-success" role="status">
                Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.
              </div>
            )}
            {error && <div className="at-alert-error" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="at-form-grid-2">
                <div className="at-form-row">
                  <label htmlFor="ct-name" className="at-form-label">Họ và tên *</label>
                  <input
                    id="ct-name"
                    type="text"
                    className="at-form-control"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="at-form-row">
                  <label htmlFor="ct-phone" className="at-form-label">Điện thoại</label>
                  <input
                    id="ct-phone"
                    type="tel"
                    className="at-form-control"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="09x xxx xxxx"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="at-form-row">
                <label htmlFor="ct-email" className="at-form-label">Email</label>
                <input
                  id="ct-email"
                  type="email"
                  className="at-form-control"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="at-form-row">
                <label htmlFor="ct-subject" className="at-form-label">Chủ đề</label>
                <input
                  id="ct-subject"
                  type="text"
                  className="at-form-control"
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                  placeholder="Tôi muốn hỏi về..."
                />
              </div>

              <div className="at-form-row">
                <label htmlFor="ct-message" className="at-form-label">Tin nhắn</label>
                <textarea
                  id="ct-message"
                  className="at-form-control"
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Nội dung..."
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="at-btn at-btn-accent"
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map */}
      {settings.map_embed && (
        <div className="at-map-wrap" style={{ marginTop: 'clamp(48px,6vw,80px)' }}>
          <iframe
            src={settings.map_embed}
            title="Bản đồ Nha Khoa An Tâm"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  )
}
