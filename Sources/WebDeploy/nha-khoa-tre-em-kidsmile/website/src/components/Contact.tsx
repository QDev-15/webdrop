import { useState } from 'react'
import { useEffect } from 'react'
import { api } from '../api/client'

interface Settings {
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  map_embed?: string
  zalo_number?: string
}

export default function Contact() {
  const [s, setS] = useState<Settings>({})
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Settings>('/public/settings').then(setS).catch(() => {})
  }, [])

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setError('Vui lòng điền tên và số điện thoại.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const phone = s.site_phone || ''
  const zaloHref = s.zalo_number ? `https://zalo.me/${s.zalo_number.replace(/\s/g, '')}` : 'https://zalo.me/0289999888'

  return (
    <div className="ks-contact-grid">
      {/* Form */}
      <div>
        {success ? (
          <div className="ks-form-wrap" style={{ textAlign: 'center', padding: '40px 32px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💜</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, fontStyle: 'normal', marginBottom: 10 }}>Đã nhận tin nhắn!</h3>
            <p style={{ color: 'var(--text-2)', fontWeight: 300 }}>
              Cảm ơn bạn đã liên hệ. KidSmile sẽ phản hồi trong vòng 2 giờ.
            </p>
          </div>
        ) : (
          <form className="ks-form-wrap" onSubmit={handleSubmit} noValidate aria-label="Form liên hệ">
            <h3 style={{ fontSize: 20, fontWeight: 600, fontStyle: 'normal', marginBottom: 24, color: 'var(--text)' }}>
              Gửi tin nhắn cho chúng tôi
            </h3>
            {error && (
              <div role="alert" style={{
                background: '#fff0f2', color: 'var(--danger)',
                borderRadius: 12, padding: '12px 18px', marginBottom: 20, fontSize: 13,
              }}>
                {error}
              </div>
            )}
            <div className="ks-form-row">
              <div className="ks-form-group">
                <label htmlFor="ct-name" className="ks-form-label">Họ tên <span className="req" aria-hidden="true">*</span></label>
                <input id="ct-name" type="text" className="ks-form-control" placeholder="Nguyễn Thị Hoa"
                  value={form.name} onChange={e => set('name', e.target.value)} required aria-required="true" />
              </div>
              <div className="ks-form-group">
                <label htmlFor="ct-phone" className="ks-form-label">Điện thoại <span className="req" aria-hidden="true">*</span></label>
                <input id="ct-phone" type="tel" className="ks-form-control" placeholder="0901 234 567"
                  value={form.phone} onChange={e => set('phone', e.target.value)} required aria-required="true" />
              </div>
            </div>
            <div className="ks-form-group">
              <label htmlFor="ct-email" className="ks-form-label">Email</label>
              <input id="ct-email" type="email" className="ks-form-control" placeholder="email@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="ks-form-group">
              <label htmlFor="ct-subject" className="ks-form-label">Chủ đề</label>
              <input id="ct-subject" type="text" className="ks-form-control" placeholder="Tôi muốn hỏi về..."
                value={form.subject} onChange={e => set('subject', e.target.value)} />
            </div>
            <div className="ks-form-group">
              <label htmlFor="ct-message" className="ks-form-label">Nội dung</label>
              <textarea id="ct-message" className="ks-form-control" rows={4} placeholder="Nhắn gì cho chúng tôi..."
                value={form.message} onChange={e => set('message', e.target.value)} />
            </div>
            <button type="submit" className="ks-btn ks-btn-primary ks-btn-block" disabled={submitting}>
              {submitting ? 'Đang gửi...' : '💌 Gửi tin nhắn'}
            </button>
          </form>
        )}
      </div>

      {/* Info */}
      <div>
        <div className="ks-info-card" style={{ marginBottom: 20 }}>
          <div className="ks-info-row">
            <div className="ks-info-icon" aria-hidden="true">📍</div>
            <div>
              <div className="ks-info-title">Địa chỉ</div>
              <div className="ks-info-text">{s.site_address || 'Địa chỉ phòng khám KidSmile'}</div>
            </div>
          </div>
          <div className="ks-info-row">
            <div className="ks-info-icon" aria-hidden="true">📞</div>
            <div>
              <div className="ks-info-title">Điện thoại</div>
              <div className="ks-info-text">
                {phone ? <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a> : '—'}
              </div>
            </div>
          </div>
          <div className="ks-info-row">
            <div className="ks-info-icon" aria-hidden="true">✉️</div>
            <div>
              <div className="ks-info-title">Email</div>
              <div className="ks-info-text">
                {s.site_email ? <a href={`mailto:${s.site_email}`}>{s.site_email}</a> : '—'}
              </div>
            </div>
          </div>
          <div className="ks-info-row">
            <div className="ks-info-icon" aria-hidden="true">🕐</div>
            <div>
              <div className="ks-info-title">Giờ làm việc</div>
              <div className="ks-info-text">{s.working_hours || 'Thứ 2 — Chủ nhật: 8:00 — 20:00'}</div>
            </div>
          </div>
        </div>

        {/* Zalo quick contact */}
        <a
          href={zaloHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ks-btn ks-btn-block"
          style={{ background: '#0068FF', color: '#fff', fontWeight: 600, fontSize: 14.5, borderRadius: '14px', marginBottom: 16, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 20px' }}
        >
          <span aria-hidden="true">💬</span> Nhắn Zalo ngay
        </a>

        {/* Map embed or placeholder */}
        {s.map_embed ? (
          <iframe
            src={s.map_embed}
            title="Vị trí phòng khám KidSmile"
            width="100%"
            height="220"
            style={{ border: 0, borderRadius: 14 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="ks-map-ph" role="img" aria-label="Vị trí phòng khám trên bản đồ">
            <div className="ks-map-ph-icon" aria-hidden="true">📍</div>
            <div>Bản đồ sẽ hiển thị sau khi cài đặt Google Maps Embed</div>
          </div>
        )}
      </div>

    </div>
  )
}
