import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: 'Liên hệ', description: 'Liên hệ với Shop Thể Thao để được hỗ trợ' })

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ họ tên, email và nội dung')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/public/contacts', form)
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError('Gửi thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tt-page-wrap">
      {/* Page Hero */}
      <div className="tt-page-hero" style={{ background: 'var(--dark2)', color: 'white', padding: '60px 0' }}>
        <div className="tt-container">
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>Liên hệ</h1>
          <p style={{ fontSize: 16, opacity: 0.8 }}>Chúng tôi phản hồi trong vòng 30 phút trong giờ làm việc</p>
        </div>
      </div>

      {/* Contact Layout */}
      <section className="tt-sec" style={{ padding: '60px 0' }}>
        <div className="tt-container">
          <div className="tt-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginBottom: 40 }}>
            {/* Contact info */}
            <div className="tt-contact-info" data-reveal>
              <h2 className="tt-sec-title" style={{ marginBottom: 32 }}>Tìm chúng tôi</h2>

              <div className="tt-contact-item" style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <div className="tt-contact-icon" style={{ minWidth: 40, color: 'var(--accent)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <strong style={{ fontSize: 15 }}>Cửa hàng</strong>
                  <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
                    {settings?.site_address || '[ĐỊA CHỈ CỬA HÀNG]'}<br />TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              <div className="tt-contact-item" style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <div className="tt-contact-icon" style={{ minWidth: 40, color: 'var(--accent)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <strong style={{ fontSize: 15 }}>Điện thoại / Zalo</strong>
                  <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
                    <a href={`tel:${settings?.site_phone || '[SỐ_ĐIỆN_THOẠI]'}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      {settings?.site_phone || '[SỐ_ĐIỆN_THOẠI]'}
                    </a>
                    <br />
                    <span style={{ fontSize: 13 }}>T2–T7: 8:00–21:00 | CN: 9:00–18:00</span>
                  </p>
                </div>
              </div>

              <div className="tt-contact-item" style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <div className="tt-contact-icon" style={{ minWidth: 40, color: 'var(--accent)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <strong style={{ fontSize: 15 }}>Email</strong>
                  <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
                    <a href={`mailto:${settings?.site_email || '[EMAIL@SPORTTHETAO.VN]'}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      {settings?.site_email || '[EMAIL@SPORTTHETAO.VN]'}
                    </a>
                    <br />
                    <span style={{ fontSize: 13 }}>Phản hồi trong 2–4 giờ</span>
                  </p>
                </div>
              </div>

              <div className="tt-contact-item" style={{ display: 'flex', gap: 16 }}>
                <div className="tt-contact-icon" style={{ minWidth: 40, color: 'var(--accent)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <strong style={{ fontSize: 15 }}>Giờ làm việc</strong>
                  <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
                    Thứ 2 – Thứ 7: 8:00 – 21:00<br />
                    Chủ nhật: 9:00 – 18:00<br />
                    <span style={{ fontSize: 13 }}>Nghỉ Tết Nguyên Đán (thông báo trước)</span>
                  </p>
                </div>
              </div>

              {/* Social buttons */}
              <div className="tt-contact-socials" style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href={settings?.facebook || '#'}
                  className="tt-contact-social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    textDecoration: 'none',
                    color: 'var(--text)',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all .2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--warm)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </a>
                <a
                  href={`https://zalo.me/${settings?.site_phone?.replace(/\D/g, '') || ''}`}
                  className="tt-contact-social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: '#0068FF',
                    borderColor: '#0068FF',
                    borderRadius: 6,
                    textDecoration: 'none',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all .2s',
                    cursor: 'pointer',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.18 1.88 5.81L2.5 21.5l3.8-1.35A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                  Chat Zalo
                </a>
                <a
                  href={settings?.instagram || '#'}
                  className="tt-contact-social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    textDecoration: 'none',
                    color: 'var(--text)',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all .2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--warm)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div className="tt-contact-form-wrap" data-reveal data-reveal-d2>
              <h2 className="tt-sec-title" style={{ marginBottom: 24 }}>Gửi tin nhắn</h2>
              <form className="tt-contact-form" id="ttContactForm" onSubmit={handleSubmit} noValidate>
                {submitted && (
                  <div style={{ padding: 12, background: 'rgba(255,77,41,.08)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                    ✓ Cảm ơn! Chúng tôi sẽ sớm liên hệ lại với bạn.
                  </div>
                )}
                {error && (
                  <div style={{ padding: 12, background: 'rgba(255,77,41,.15)', border: '1px solid var(--danger)', color: '#fff', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                    {error}
                  </div>
                )}

                <div className="tt-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="tt-form-group">
                    <label htmlFor="ttContactName" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                      Họ và tên <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="ttContactName"
                      name="name"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Nguyễn Văn A"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        borderRadius: 6,
                        fontFamily: 'var(--sans)',
                        fontSize: 14,
                        outline: 'none',
                      }}
                      required
                    />
                  </div>

                  <div className="tt-form-group">
                    <label htmlFor="ttContactPhone" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                      Số điện thoại <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="ttContactPhone"
                      name="phone"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="0901 234 567"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        borderRadius: 6,
                        fontFamily: 'var(--sans)',
                        fontSize: 14,
                        outline: 'none',
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="tt-form-group" style={{ marginBottom: 16 }}>
                  <label htmlFor="ttContactEmail" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>Email</label>
                  <input
                    type="email"
                    id="ttContactEmail"
                    name="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="email@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      borderRadius: 6,
                      fontFamily: 'var(--sans)',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>

                <div className="tt-form-group" style={{ marginBottom: 16 }}>
                  <label htmlFor="ttContactSubject" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>Chủ đề</label>
                  <select
                    id="ttContactSubject"
                    name="subject"
                    value={form.subject}
                    onChange={e => set('subject', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      borderRadius: 6,
                      fontFamily: 'var(--sans)',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  >
                    <option value="tu-van">Tư vấn chọn sản phẩm</option>
                    <option value="doi-tra">Đổi trả / Bảo hành</option>
                    <option value="don-hang">Tra cứu đơn hàng</option>
                    <option value="hop-tac">Hợp tác / Sỉ lẻ</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>

                <div className="tt-form-group" style={{ marginBottom: 20 }}>
                  <label htmlFor="ttContactMessage" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                    Nội dung <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <textarea
                    id="ttContactMessage"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      borderRadius: 6,
                      fontFamily: 'var(--sans)',
                      fontSize: 14,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  id="ttContactSubmit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all .2s',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                </button>

                <div id="ttContactResult" style={{ marginTop: 16, display: submitted || error ? 'block' : 'none' }} />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
