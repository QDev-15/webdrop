import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

const SUBJECTS = [
  'Tư vấn sản phẩm',
  'Hỏi về đơn hàng',
  'Đổi trả / hoàn tiền',
  'Hợp tác nông trại',
  'Khác',
]

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: SUBJECTS[0], message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ họ tên, số điện thoại và lời nhắn')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm({ name: '', phone: '', email: '', subject: SUBJECTS[0], message: '' })
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi tin nhắn thất bại, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="tp-container tp-contact-wrap" style={{ paddingTop: 0 }}>
      <div className="tp-contact-grid">
        <div className="tp-contact-info" data-reveal>
          <h2>Chúng tôi luôn sẵn sàng <em style={{ color: 'var(--accent)' }}>lắng nghe</em></h2>
          <p>{settings.contact_intro || 'Có câu hỏi về sản phẩm, đơn hàng hoặc muốn hợp tác nông trại? Gửi tin nhắn cho chúng tôi, đội ngũ sẽ phản hồi trong vòng 24 giờ.'}</p>

          <div className="tp-contact-details">
            <div className="tp-contact-detail">
              <div className="tp-contact-icon"><i className="bi bi-geo-alt" /></div>
              <div className="tp-contact-detail-text">
                <strong>Địa chỉ cửa hàng</strong>
                <p>{settings.site_address}</p>
              </div>
            </div>
            <div className="tp-contact-detail">
              <div className="tp-contact-icon"><i className="bi bi-telephone" /></div>
              <div className="tp-contact-detail-text">
                <strong>Hotline đặt hàng</strong>
                <p>{settings.site_phone} ({settings.working_hours})</p>
              </div>
            </div>
            <div className="tp-contact-detail">
              <div className="tp-contact-icon"><i className="bi bi-envelope" /></div>
              <div className="tp-contact-detail-text">
                <strong>Email hỗ trợ</strong>
                <p>{settings.site_email}</p>
              </div>
            </div>
            <div className="tp-contact-detail">
              <div className="tp-contact-icon"><i className="bi bi-clock" /></div>
              <div className="tp-contact-detail-text">
                <strong>Giờ giao hàng</strong>
                <p>{settings.contact_delivery_note || 'Giao hàng lạnh trong 2–4 giờ tại nội thành'}</p>
              </div>
            </div>
          </div>

          {settings.map_embed && (
            <div className="tp-contact-map">
              <iframe src={settings.map_embed} title="Bản đồ vị trí cửa hàng" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
        </div>

        <div className="tp-contact-form" data-reveal data-delay="1">
          <h3>Gửi tin nhắn cho chúng tôi</h3>
          <form onSubmit={handleSubmit} noValidate>
            {sent && <p style={{ color: 'var(--accent)', fontSize: 14, marginBottom: 14 }}>Đã gửi tin nhắn thành công — chúng tôi sẽ phản hồi sớm nhất!</p>}
            {error && <p style={{ color: 'var(--sale)', fontSize: 14, marginBottom: 14 }}>{error}</p>}
            <div className="tp-form-row">
              <div className="tp-form-group">
                <label htmlFor="tp-name">Họ và tên</label>
                <input type="text" id="tp-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
              </div>
              <div className="tp-form-group">
                <label htmlFor="tp-phone">Số điện thoại</label>
                <input type="tel" id="tp-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09xx xxx xxx" required />
              </div>
            </div>
            <div className="tp-form-group">
              <label htmlFor="tp-email">Email</label>
              <input type="email" id="tp-email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ban@email.com" />
            </div>
            <div className="tp-form-group">
              <label htmlFor="tp-subject">Chủ đề</label>
              <select id="tp-subject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="tp-form-group">
              <label htmlFor="tp-message">Nội dung</label>
              <textarea id="tp-message" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nội dung tin nhắn của bạn..." required />
            </div>
            <button type="submit" className="tp-btn tp-btn-primary tp-btn-full" disabled={submitting}>
              <i className="bi bi-send" /> {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
