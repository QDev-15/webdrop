import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderTitle } from '../utils/text'
import { api } from '../api/client'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const emptyForm: FormState = { name: '', email: '', subject: 'Câu hỏi chung', message: '' }

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'La Bàn Tài Chính'}`,
    description: settings.contact_page_sub,
  })

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSent(false)
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Họ tên, email và nội dung không được để trống.')
      return
    }
    setSending(true)
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <header className="btc-page-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=1600&auto=format&fit=crop&q=60')" }}>
        <div className="wd-container btc-page-header-in">
          <div className="btc-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Liên hệ</span></div>
          <div className="btc-tag">{settings.contact_page_tag || 'Luôn sẵn sàng lắng nghe'}</div>
          <h1>{renderTitle(settings.contact_page_title || 'Liên hệ với *chúng tôi*')}</h1>
          <p>{settings.contact_page_sub}</p>
        </div>
      </header>

      <section className="btc-sec">
        <div className="wd-container">
          <div className="btc-contact-grid">
            <div data-reveal>
              <div className="btc-contact-info-item">
                <span className="btc-contact-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg></span>
                <div><div className="btc-contact-info-label">Email</div><div className="btc-contact-info-value"><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></div></div>
              </div>
              <div className="btc-contact-info-item">
                <span className="btc-contact-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
                <div><div className="btc-contact-info-label">Điện thoại</div><div className="btc-contact-info-value"><a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`}>{settings.site_phone}</a></div></div>
              </div>
              <div className="btc-contact-info-item">
                <span className="btc-contact-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                <div><div className="btc-contact-info-label">Địa chỉ</div><div className="btc-contact-info-value">{settings.site_address}</div></div>
              </div>
              <div className="btc-contact-info-item">
                <span className="btc-contact-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
                <div><div className="btc-contact-info-label">Thời gian phản hồi</div><div className="btc-contact-info-value">{settings.contact_response_time}</div></div>
              </div>
              {settings.contact_disclaimer && (
                <div className="btc-disclaimer" style={{ marginTop: 30 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                  <div>{settings.contact_disclaimer}</div>
                </div>
              )}
            </div>

            <div className="btc-form-box" data-reveal data-delay="1">
              <h3 style={{ marginBottom: 22 }}>Gửi lời nhắn cho chúng tôi</h3>
              {sent && <div className="alert alert-success" style={{ marginBottom: 16 }}>Đã gửi — cảm ơn bạn! Chúng tôi sẽ phản hồi sớm.</div>}
              {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6 btc-field">
                    <label htmlFor="btcCName">Họ và tên</label>
                    <input type="text" id="btcCName" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="col-md-6 btc-field">
                    <label htmlFor="btcCEmail">Email</label>
                    <input type="email" id="btcCEmail" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@domain.com" required />
                  </div>
                  <div className="col-12 btc-field">
                    <label htmlFor="btcCSubject">Chủ đề</label>
                    <select id="btcCSubject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                      <option>Câu hỏi chung</option>
                      <option>Đóng góp bài viết</option>
                      <option>Hợp tác quảng cáo / tài trợ</option>
                      <option>Báo lỗi công cụ tính toán</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className="col-12 btc-field">
                    <label htmlFor="btcCMessage">Nội dung</label>
                    <textarea id="btcCMessage" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nội dung bạn muốn chia sẻ..." required />
                  </div>
                </div>
                <button type="submit" className="btc-btn btc-btn-primary btc-btn-block" style={{ marginTop: 8 }} disabled={sending}>
                  {sending ? 'Đang gửi...' : 'Gửi lời nhắn'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
