import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm]   = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true); setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true); setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch { setError('Gửi thất bại. Vui lòng thử lại.') }
    finally { setSending(false) }
  }

  const hours = [
    { day: 'Thứ 2 – Thứ 6', time: '09:00 – 20:00' },
    { day: 'Thứ 7', time: '08:30 – 20:30' },
    { day: 'Chủ Nhật', time: '09:00 – 19:00' },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5">
          {/* Info */}
          <div className="col-lg-5">
            <div data-reveal>
              <div className="bst-eyebrow">Liên hệ</div>
              <h2 className="bst-title">Kết nối <em>với chúng tôi</em></h2>
              <p className="bst-sub mb-4">Sẵn sàng hỗ trợ bạn mọi lúc — gọi điện, nhắn tin hoặc ghé thăm studio.</p>
            </div>

            <div data-reveal data-delay="1">
              {settings.site_address && (
                <div className="bst-info-item">
                  <div className="bst-info-icon">📍</div>
                  <div>
                    <div className="bst-info-label">Địa chỉ</div>
                    <div className="bst-info-value">{settings.site_address}</div>
                  </div>
                </div>
              )}
              {settings.site_phone && (
                <div className="bst-info-item">
                  <div className="bst-info-icon">📞</div>
                  <div>
                    <div className="bst-info-label">Hotline</div>
                    <div className="bst-info-value"><a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a></div>
                  </div>
                </div>
              )}
              {settings.site_email && (
                <div className="bst-info-item">
                  <div className="bst-info-icon">✉</div>
                  <div>
                    <div className="bst-info-label">Email</div>
                    <div className="bst-info-value"><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></div>
                  </div>
                </div>
              )}
            </div>

            {/* Hours */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginTop: 24 }} data-reveal data-delay="2">
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Giờ hoạt động</div>
              {hours.map((h, i) => (
                <div key={i} className="bst-hours-row">
                  <span className="bst-hours-day">{h.day}</span>
                  <span className="bst-hours-time">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="col-lg-7" data-reveal>
            {success ? (
              <div className="bst-form-card text-center" style={{ padding: 56 }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>💌</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Tin nhắn đã gửi!</h3>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Chúng tôi sẽ phản hồi trong vòng 24 giờ. Cảm ơn bạn!</p>
                <button className="bst-btn-primary" onClick={() => setSuccess(false)}>Gửi tin nhắn khác</button>
              </div>
            ) : (
              <div className="bst-form-card">
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Gửi tin nhắn cho chúng tôi</h3>
                {error && <div style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.3)', color: '#fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Họ & Tên <span className="bst-required">*</span></label>
                        <input className="bst-form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Số điện thoại</label>
                        <input className="bst-form-control" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Email <span className="bst-required">*</span></label>
                        <input className="bst-form-control" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Tiêu đề</label>
                        <input className="bst-form-control" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Hỏi về dịch vụ tóc, đặt lịch nhóm..." />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Nội dung <span className="bst-required">*</span></label>
                        <textarea className="bst-form-control" rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required placeholder="Để lại câu hỏi hoặc yêu cầu của bạn..." />
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="bst-btn-primary" disabled={sending} style={{ width: '100%', justifyContent: 'center' }}>
                        {sending ? 'Đang gửi...' : '💌 Gửi tin nhắn'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
