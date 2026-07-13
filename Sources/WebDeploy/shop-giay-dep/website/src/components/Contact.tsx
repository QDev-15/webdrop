import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const TOPICS = [
  { value: '', label: '-- Chọn chủ đề --' },
  { value: 'size', label: 'Tư vấn chọn size' },
  { value: 'order-status', label: 'Theo dõi đơn hàng' },
  { value: 'return', label: 'Đổi trả sản phẩm' },
  { value: 'wholesale', label: 'Mua sỉ / Hợp tác' },
  { value: 'other', label: 'Vấn đề khác' },
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
      setError('Vui lòng điền đầy đủ thông tin bắt buộc (*)')
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
    <section className="gd-contact-section">
      <div className="gd-container">
        <div className="gd-contact-grid">
          <div data-reveal>
            <h2>Ghé thăm <em>cửa hàng</em></h2>
            <p>Chúng tôi luôn chào đón bạn đến trực tiếp tham quan showroom và thử giày trước khi mua. Đội ngũ tư vấn viên sẽ giúp bạn chọn được size chuẩn nhất.</p>
            <div className="gd-contact-details">
              <div className="gd-contact-detail">
                <div className="gd-contact-icon"><i className="bi bi-geo-alt-fill" /></div>
                <div className="gd-contact-detail-text"><strong>Địa chỉ showroom</strong><p>{settings.site_address}</p></div>
              </div>
              <div className="gd-contact-detail">
                <div className="gd-contact-icon"><i className="bi bi-telephone-fill" /></div>
                <div className="gd-contact-detail-text"><strong>Điện thoại / Zalo</strong><p><a href={`tel:${settings.site_phone}`} style={{ color: 'var(--accent)' }}>{settings.site_phone}</a></p></div>
              </div>
              <div className="gd-contact-detail">
                <div className="gd-contact-icon"><i className="bi bi-envelope-fill" /></div>
                <div className="gd-contact-detail-text"><strong>Email</strong><p><a href={`mailto:${settings.site_email}`} style={{ color: 'var(--accent)' }}>{settings.site_email}</a></p></div>
              </div>
              <div className="gd-contact-detail">
                <div className="gd-contact-icon"><i className="bi bi-clock-fill" /></div>
                <div className="gd-contact-detail-text"><strong>Giờ mở cửa</strong><p>Tất cả các ngày: {settings.working_hours}</p></div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}>Theo dõi chúng tôi</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {settings.facebook && (
                  <a href={settings.facebook} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }} target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook" style={{ color: '#1877f2' }} /> Facebook</a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }} target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram" style={{ color: '#e1306c' }} /> Instagram</a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }} target="_blank" rel="noopener noreferrer"><i className="bi bi-tiktok" /> TikTok</a>
                )}
              </div>
            </div>

            {settings.map_embed && (
              <div className="gd-contact-map" style={{ marginTop: 32 }} aria-label="Bản đồ vị trí cửa hàng">
                <iframe title={`Bản đồ vị trí ${settings.site_name}`} src={settings.map_embed} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </div>

          <div data-reveal data-delay="2">
            <div className="gd-contact-form">
              <h3>Gửi tin nhắn cho chúng tôi</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="gd-form-row">
                  <div className="gd-form-group">
                    <label htmlFor="contact-name">Họ và tên <span style={{ color: 'var(--accent)' }}>*</span></label>
                    <input type="text" id="contact-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="gd-form-group">
                    <label htmlFor="contact-phone">Số điện thoại <span style={{ color: 'var(--accent)' }}>*</span></label>
                    <input type="tel" id="contact-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0900 000 000" required />
                  </div>
                </div>
                <div className="gd-form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input type="email" id="contact-email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div className="gd-form-group">
                  <label htmlFor="contact-topic">Chủ đề</label>
                  <select id="contact-topic" value={form.topic} onChange={e => set('topic', e.target.value)}>
                    {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="gd-form-group">
                  <label htmlFor="contact-message">Tin nhắn <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <textarea id="contact-message" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả chi tiết nội dung bạn muốn hỏi hoặc yêu cầu hỗ trợ..." rows={5} required />
                </div>
                {error && <div style={{ color: 'var(--sale)', fontSize: 13, marginBottom: 12 }}>{error}</div>}
                <button type="submit" className="gd-submit-btn" disabled={submitting}>
                  {sent ? <><i className="bi bi-check-circle-fill me-1" />Đã gửi thành công!</> : submitting ? 'Đang gửi...' : <><i className="bi bi-send-fill" />Gửi tin nhắn</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
