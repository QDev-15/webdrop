import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const TOPICS = [
  { value: '', label: '-- Chọn chủ đề --' },
  { value: 'tu-van', label: 'Tư vấn sản phẩm' },
  { value: 'bao-hanh', label: 'Bảo hành / Sửa chữa' },
  { value: 'hop-tac', label: 'Hợp tác kinh doanh' },
  { value: 'khac', label: 'Khác' },
]

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', email: '', topic: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ họ tên, số điện thoại và nội dung')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', {
        name: form.name, phone: form.phone, email: form.email,
        subject: TOPICS.find(t => t.value === form.topic)?.label || '', message: form.message,
      })
      setSent(true)
      setForm({ name: '', phone: '', email: '', topic: '', message: '' })
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="sec-pad">
      <div className="ts-container">
        <div className="ts-contact-layout">
          <div data-reveal>
            <div className="ts-eyebrow">Thông tin liên hệ</div>
            <h2 className="ts-sec-title" style={{ marginBottom: 30 }}>Ghé thăm <em>showroom</em> của chúng tôi</h2>

            <div className="ts-contact-info-item">
              <i className="bi bi-geo-alt" />
              <div><strong>Địa chỉ showroom</strong><span>{settings.site_address}</span></div>
            </div>
            <div className="ts-contact-info-item">
              <i className="bi bi-telephone" />
              <div><strong>Hotline tư vấn</strong><span>{settings.site_phone} ({settings.working_hours})</span></div>
            </div>
            <div className="ts-contact-info-item">
              <i className="bi bi-envelope" />
              <div><strong>Email hỗ trợ</strong><span>{settings.site_email}</span></div>
            </div>
            {(settings.zalo || settings.facebook) && (
              <div className="ts-contact-info-item">
                <i className="bi bi-chat-dots" />
                <div><strong>Zalo / Fanpage</strong><span>{settings.zalo}{settings.zalo && settings.facebook ? ' · ' : ''}{settings.facebook}</span></div>
              </div>
            )}

            {settings.map_embed && (
              <div className="ts-map-wrap">
                <iframe src={settings.map_embed} title={`Bản đồ chỉ đường đến showroom ${settings.site_name || 'Maison Cuir'}`} loading="lazy" />
              </div>
            )}
          </div>

          <div data-reveal data-reveal-d1>
            <div className="ts-eyebrow">Gửi yêu cầu</div>
            <h2 className="ts-sec-title" style={{ marginBottom: 30 }}>Chúng tôi sẽ <em>phản hồi sớm</em></h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="ts-form-row">
                <div className="ts-form-group">
                  <label htmlFor="cf-name">Họ và tên</label>
                  <input type="text" id="cf-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nhập họ tên của bạn" required />
                </div>
                <div className="ts-form-group">
                  <label htmlFor="cf-phone">Số điện thoại</label>
                  <input type="tel" id="cf-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0900 000 000" required />
                </div>
              </div>
              <div className="ts-form-group">
                <label htmlFor="cf-email">Email</label>
                <input type="email" id="cf-email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="ts-form-group">
                <label htmlFor="cf-subject">Chủ đề</label>
                <select id="cf-subject" value={form.topic} onChange={e => set('topic', e.target.value)}>
                  {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="ts-form-group">
                <label htmlFor="cf-message">Nội dung</label>
                <textarea id="cf-message" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nhập nội dung bạn muốn trao đổi..." required />
              </div>
              {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button type="submit" className="ts-btn solid block" disabled={submitting}>
                {sent ? 'Đã gửi thành công ✓' : submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
