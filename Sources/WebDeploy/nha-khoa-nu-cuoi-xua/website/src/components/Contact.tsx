import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

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
  const [form, setForm] = useState<ContactForm>(EMPTY)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const phone    = settings.site_phone   || '0901 234 567'
  const email    = settings.site_email   || 'hello@nucoixua.vn'
  const address  = settings.site_address || '123 Nguyễn Văn Linh, Q.7, TP.HCM'
  const hours    = settings.working_hours|| 'T2-T6: 8:00-20:00 | T7: 8:00-18:00 | CN: 8:00-12:00'
  const mapEmbed = settings.map_embed    || ''

  const set = (k: keyof ContactForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setError('Vui lòng nhập họ tên và nội dung.'); return
    }
    setSending(true); setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại sau.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
      {/* Info panel */}
      <div>
        <div className="nc-info-panel">
          <div className="nc-info-row">
            <div className="nc-info-icon">📞</div>
            <div>
              <div className="nc-info-label">Điện thoại</div>
              <div className="nc-info-val"><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></div>
            </div>
          </div>
          <div className="nc-info-row">
            <div className="nc-info-icon">✉️</div>
            <div>
              <div className="nc-info-label">Email</div>
              <div className="nc-info-val"><a href={`mailto:${email}`}>{email}</a></div>
            </div>
          </div>
          <div className="nc-info-row">
            <div className="nc-info-icon">📍</div>
            <div>
              <div className="nc-info-label">Địa chỉ</div>
              <div className="nc-info-val">{address}</div>
            </div>
          </div>
          <div className="nc-info-row">
            <div className="nc-info-icon">🕐</div>
            <div>
              <div className="nc-info-label">Giờ làm việc</div>
              <div className="nc-info-val">{hours}</div>
            </div>
          </div>
        </div>

        {mapEmbed && (
          <div className="nc-map-wrap" style={{ marginTop: '24px' }}>
            <iframe
              src={mapEmbed}
              title="Bản đồ Nụ Cười Xưa Nha Khoa"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>

      {/* Contact form */}
      <div className="nc-form-wrap">
        {success ? (
          <div className="nc-form-success">
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✓</div>
            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>Gửi thành công!</div>
            <p>Chúng tôi sẽ phản hồi trong 1-2 giờ làm việc. Cảm ơn bạn!</p>
            <button className="nc-btn" style={{ marginTop: '16px' }} onClick={() => setSuccess(false)}>
              Gửi tin nhắn khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span className="nc-step-badge">✉</span>
                <span className="nc-step-label">Gửi tin nhắn cho chúng tôi</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label htmlFor="ct-name">Họ tên <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input id="ct-name" type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                </div>
                <div>
                  <label htmlFor="ct-phone">Số điện thoại</label>
                  <input id="ct-phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label htmlFor="ct-email">Email</label>
                <input id="ct-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label htmlFor="ct-subject">Chủ đề</label>
                <input id="ct-subject" type="text" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Hỏi về dịch vụ tẩy trắng răng" />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="ct-message">Nội dung <span style={{ color: 'var(--danger)' }}>*</span></label>
                <textarea id="ct-message" rows={4} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nội dung bạn cần tư vấn..." required />
              </div>

              {error && <div className="nc-form-error">{error}</div>}

              <button type="submit" className="nc-btn" style={{ width: '100%' }} disabled={sending}>
                {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
