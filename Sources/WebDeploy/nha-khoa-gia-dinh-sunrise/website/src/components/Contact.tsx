import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface ContactBody {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

const SUBJECTS = [
  'Tư vấn dịch vụ',
  'Đặt lịch khám',
  'Hỏi về giá',
  'Khiếu nại / góp ý',
  'Khác',
]

const EMPTY: ContactBody = { name: '', phone: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState<ContactBody>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const phone   = settings.site_phone    || '0900 000 000'
  const email   = settings.site_email    || 'contact@sunrise-dental.vn'
  const address = settings.site_address  || '123 Đường Gia Đình, Quận 1, TP.HCM'
  const hours   = settings.working_hours || 'Thứ 2 - Chủ nhật: 8:00 - 20:00'
  const mapEmbed = settings.map_embed    || ''

  const set = (k: keyof ContactBody, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) { setError('Vui lòng nhập họ tên và số điện thoại.'); return }
    setSaving(true); setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp qua điện thoại.')
    } finally {
      setSaving(false)
    }
  }

  const infos = [
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.15.65.3 1.2.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.31.38 2.31.6 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: 'Điện thoại', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M4 6l8 6 8-6"/></svg>, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Địa chỉ', value: address, href: undefined },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>, label: 'Giờ làm việc', value: hours, href: undefined },
  ]

  return (
    <>
      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        {infos.map((c, i) => (
          <div key={i} className="sr-contact-card" data-reveal data-delay={String(i + 1)}>
            <div className="sr-contact-icon">{c.icon}</div>
            <div className="sr-contact-label">{c.label}</div>
            <div className="sr-contact-value">
              {c.href ? <a href={c.href} style={{ color: 'inherit' }}>{c.value}</a> : c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Form + Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        <div className="sr-form-panel" data-reveal>
          <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '6px', color: 'var(--text)' }}>Gửi tin nhắn cho chúng tôi</div>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '24px' }}>Chúng tôi sẽ trả lời trong vòng 4 giờ trong giờ làm việc.</p>

          {success && (
            <div className="sr-form-success show">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.</span>
            </div>
          )}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid var(--danger)', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px', fontSize: '14px', color: 'var(--danger)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="sr-form-row">
              <div className="sr-field">
                <label htmlFor="ct-name">Họ tên <span className="req">*</span></label>
                <input id="ct-name" className="sr-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
              </div>
              <div className="sr-field">
                <label htmlFor="ct-phone">Số điện thoại <span className="req">*</span></label>
                <input id="ct-phone" className="sr-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0912 345 678" required />
              </div>
            </div>
            <div className="sr-field">
              <label htmlFor="ct-email">Email</label>
              <input id="ct-email" className="sr-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="sr-field">
              <label htmlFor="ct-subject">Chủ đề</label>
              <select id="ct-subject" className="sr-select" value={form.subject} onChange={e => set('subject', e.target.value)}>
                <option value="">-- Chọn chủ đề --</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sr-field">
              <label htmlFor="ct-message">Tin nhắn</label>
              <textarea id="ct-message" className="sr-textarea" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nội dung bạn muốn hỏi..." />
            </div>
            <button type="submit" className="sr-btn sr-btn-primary sr-btn-block" disabled={saving}>
              {saving ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        </div>

        {/* Map */}
        <div data-reveal data-delay="1">
          {mapEmbed ? (
            <div className="sr-map">
              <iframe src={mapEmbed} width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps" />
            </div>
          ) : (
            <div className="sr-map">
              <div className="sr-map-pin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="sr-map-text">{address}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
