import { useState } from 'react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function ContactPage() {
  useDocumentMeta({ title: 'Liên hệ | RaoNhà', description: 'Liên hệ RaoNhà để được hỗ trợ đăng tin, báo cáo tin đăng sai thông tin, hoặc hợp tác quảng cáo.' })
  const { settings } = useSite()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('Hỗ trợ đăng tin')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !message.trim()) { setError('Vui lòng nhập họ tên và nội dung.'); return }
    setSending(true)
    try {
      await api.post('/public/contact', { name, phone, email, subject, message })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi liên hệ thất bại, vui lòng thử lại.')
    } finally { setSending(false) }
  }

  return (
    <>
      <section className="rn-page-hero">
        <div className="rn-container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Hỗ trợ</div>
          <h1 className="sec-title">Liên hệ <em>RaoNhà</em></h1>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Cần hỗ trợ đăng tin, báo cáo tin đăng sai thông tin, hoặc hợp tác quảng cáo — đội ngũ RaoNhà luôn sẵn sàng.</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="rn-container">
          <div className="rn-contact-grid">
            <div data-reveal>
              <div className="rn-contact-info-item">
                <div className="ic">📞</div>
                <div><strong>Hotline hỗ trợ</strong><br /><span style={{ color: 'var(--text-2)' }}>{settings.contact_hotline || '1900 6789'} (7:30 - 21:00 hằng ngày)</span></div>
              </div>
              <div className="rn-contact-info-item">
                <div className="ic">✉️</div>
                <div><strong>Email</strong><br /><span style={{ color: 'var(--text-2)' }}>{settings.contact_email || 'hotro@raonha.vn'}</span></div>
              </div>
              <div className="rn-contact-info-item">
                <div className="ic">📍</div>
                <div><strong>Văn phòng đại diện</strong><br /><span style={{ color: 'var(--text-2)' }}>{settings.contact_address || 'Tầng 8, Tòa nhà Sunrise, Đường Xuân Thủy, Cầu Giấy, Hà Nội'}</span></div>
              </div>
              <div className="rn-contact-info-item">
                <div className="ic">🚩</div>
                <div><strong>Báo cáo tin đăng</strong><br /><span style={{ color: 'var(--text-2)' }}>Gửi link tin đăng nghi vấn qua email hoặc hotline — xử lý trong 24 giờ</span></div>
              </div>
            </div>

            {sent ? (
              <div className="rn-form-success" data-reveal>✓ Cảm ơn bạn! RaoNhà sẽ phản hồi trong thời gian sớm nhất.</div>
            ) : (
              <form className="rn-booking-form" data-reveal onSubmit={submit}>
                {error && <div className="alert-danger" style={{ marginBottom: 12 }}>{error}</div>}
                <div className="row g-3">
                  <div className="col-md-6 rn-form-group"><label htmlFor="contact-name">Họ và tên</label><input id="contact-name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" /></div>
                  <div className="col-md-6 rn-form-group"><label htmlFor="contact-phone">Số điện thoại</label><input id="contact-phone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xx xxx xxx" /></div>
                  <div className="col-12 rn-form-group"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@vidu.com" /></div>
                  <div className="col-12 rn-form-group"><label htmlFor="contact-subject">Chủ đề</label>
                    <select id="contact-subject" value={subject} onChange={e => setSubject(e.target.value)}>
                      <option>Hỗ trợ đăng tin</option><option>Báo cáo tin đăng sai thông tin</option><option>Hợp tác quảng cáo / gói VIP</option><option>Khác</option>
                    </select>
                  </div>
                  <div className="col-12 rn-form-group"><label htmlFor="contact-message">Nội dung</label><textarea id="contact-message" rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Mô tả yêu cầu của bạn..."></textarea></div>
                </div>
                <button type="submit" className="btn-rn btn-rn-primary btn-rn-block mt-2" disabled={sending}>{sending ? 'Đang gửi...' : 'Gửi liên hệ'}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
