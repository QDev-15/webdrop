import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

const SUBJECTS = [
  'Tư vấn combo rau củ',
  'Hỏi về nguồn gốc sản phẩm',
  'Theo dõi đơn hàng',
  'Góp ý dịch vụ giao hàng',
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
    <div className="rx-container rx-contact-section" style={{ paddingTop: 0 }}>
      <div className="rx-contact-grid">
        <div className="rx-contact-info" data-reveal>
          <h2>Cần hỗ trợ đặt <strong>rau tươi</strong>?</h2>
          <p>{settings.contact_intro || 'Đội ngũ Vườn Xanh sẵn sàng tư vấn combo phù hợp, giải đáp về nguồn gốc rau củ hoặc hỗ trợ theo dõi đơn hàng của bạn.'}</p>

          <div className="rx-contact-details">
            <div className="rx-contact-detail">
              <div className="rx-contact-icon"><i className="bi bi-geo-alt" /></div>
              <div className="rx-contact-detail-text">
                <strong>Địa chỉ kho giao hàng</strong>
                <p>{settings.site_address}</p>
              </div>
            </div>
            <div className="rx-contact-detail">
              <div className="rx-contact-icon"><i className="bi bi-telephone" /></div>
              <div className="rx-contact-detail-text">
                <strong>Hotline đặt hàng</strong>
                <p>{settings.site_phone} ({settings.working_hours})</p>
              </div>
            </div>
            <div className="rx-contact-detail">
              <div className="rx-contact-icon"><i className="bi bi-envelope" /></div>
              <div className="rx-contact-detail-text">
                <strong>Email hỗ trợ</strong>
                <p>{settings.site_email}</p>
              </div>
            </div>
            <div className="rx-contact-detail">
              <div className="rx-contact-icon"><i className="bi bi-clock" /></div>
              <div className="rx-contact-detail-text">
                <strong>Giờ nhận đơn giao trong ngày</strong>
                <p>{settings.contact_delivery_note || 'Đặt trước 10:00 sáng — nhận rau ngay chiều cùng ngày'}</p>
              </div>
            </div>
          </div>

          {settings.map_embed && (
            <div className="rx-contact-map">
              <iframe src={settings.map_embed} title="Bản đồ kho giao hàng" loading="lazy" />
            </div>
          )}
        </div>

        <div className="rx-contact-form" data-reveal data-delay="1">
          <h3>Gửi tin nhắn cho chúng tôi</h3>
          <form onSubmit={handleSubmit} noValidate>
            {sent && <p style={{ color: 'var(--accent)', fontSize: 14, marginBottom: 14 }}>Đã gửi tin nhắn thành công — Vườn Xanh sẽ phản hồi sớm nhất!</p>}
            {error && <p style={{ color: 'var(--sale)', fontSize: 14, marginBottom: 14 }}>{error}</p>}
            <div className="rx-form-row">
              <div className="rx-form-group">
                <label htmlFor="rx-name">Họ và tên</label>
                <input type="text" id="rx-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nhập họ tên của bạn" required />
              </div>
              <div className="rx-form-group">
                <label htmlFor="rx-phone">Số điện thoại</label>
                <input type="tel" id="rx-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Nhập số điện thoại" required />
              </div>
            </div>
            <div className="rx-form-group">
              <label htmlFor="rx-email">Email</label>
              <input type="email" id="rx-email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Nhập email của bạn" />
            </div>
            <div className="rx-form-group">
              <label htmlFor="rx-subject">Chủ đề</label>
              <select id="rx-subject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="rx-form-group">
              <label htmlFor="rx-message">Lời nhắn</label>
              <textarea id="rx-message" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Bạn cần Vườn Xanh hỗ trợ điều gì?" required />
            </div>
            <button type="submit" className="rx-submit-btn" disabled={submitting}>
              <i className="bi bi-send" /> {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
