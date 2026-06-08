import { useEffect, useState, type FormEvent } from 'react'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitting, setSubmit] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08 })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    setSubmit(true); setMsg('')
    try {
      await api.post('/public/contact', { ...form, subject: 'Liên hệ từ website' })
      setMsg('Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi trong vòng 24 giờ.')
      setIsError(false)
      setForm({ name: '', email: '', phone: '', service: '', message: '' })
    } catch {
      setMsg('Có lỗi xảy ra. Vui lòng thử lại sau.')
      setIsError(true)
    } finally {
      setSubmit(false)
    }
  }

  const email = settings.site_email || ''
  const phone = settings.site_phone || ''
  const address = settings.site_address || ''
  const hours = settings.working_hours || ''

  return (
    <main>
      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <div className="ag-ph-label" data-reveal>Liên hệ</div>
          <h1 className="ag-ph-title" data-reveal>
            <span className="outline">LET'S</span><br />TALK
          </h1>
          <p className="ag-ph-sub" data-reveal>Kể cho chúng tôi nghe về dự án của bạn. Mọi cuộc trò chuyện đều bắt đầu từ một ý tưởng — và đôi khi, ý tưởng đó trở thành thương hiệu đáng nhớ.</p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="ag-contact-section">
        <div className="wd-container">
          <div className="ag-contact-grid" style={{ display: 'grid', gap: 'clamp(40px,5vw,64px)', alignItems: 'start' }}>
            {/* Left info */}
            <div data-reveal>
              <h2 className="ag-contact-big-title">
                GET IN<br /><span>TOUCH.</span>
              </h2>
              {email && (
                <div className="ag-contact-detail-item">
                  <span className="ag-cd-label">Email</span>
                  <span className="ag-cd-value"><a href={`mailto:${email}`}>{email}</a></span>
                </div>
              )}
              {phone && (
                <div className="ag-contact-detail-item">
                  <span className="ag-cd-label">Điện thoại</span>
                  <span className="ag-cd-value"><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></span>
                </div>
              )}
              {address && (
                <div className="ag-contact-detail-item">
                  <span className="ag-cd-label">Địa chỉ</span>
                  <span className="ag-cd-value">{address}</span>
                </div>
              )}
              {hours && (
                <div className="ag-contact-detail-item">
                  <span className="ag-cd-label">Giờ làm việc</span>
                  <span className="ag-cd-value" style={{ fontSize: '13px', textTransform: 'none', letterSpacing: 0 }}>{hours}</span>
                </div>
              )}
            </div>

            {/* Right form */}
            <div data-reveal>
              <div className="ag-contact-form-wrap">
                <h3 className="ag-contact-form-title">Gửi tin nhắn</h3>
                {msg && (
                  <div style={{ padding: '12px 16px', marginBottom: '16px', background: isError ? '#fff0f0' : 'var(--accent-light)', color: isError ? '#e24b4a' : 'var(--accent)', borderRadius: '4px', fontSize: '13px' }}>
                    {msg}
                  </div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="ag-field">
                    <label htmlFor="c-name">Tên của bạn *</label>
                    <input type="text" id="c-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="ag-field">
                    <label htmlFor="c-email">Email</label>
                    <input type="email" id="c-email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@company.vn" />
                  </div>
                  <div className="ag-field">
                    <label htmlFor="c-phone">Số điện thoại</label>
                    <input type="tel" id="c-phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0909 xxx xxx" />
                  </div>
                  <div className="ag-field">
                    <label htmlFor="c-service">Dịch vụ quan tâm</label>
                    <select id="c-service" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                      <option value="">Chọn dịch vụ</option>
                      <option value="brand-identity">Brand Identity</option>
                      <option value="digital-design">Digital Design</option>
                      <option value="campaign">Campaign & Content</option>
                      <option value="full-package">Full Package</option>
                    </select>
                  </div>
                  <div className="ag-field">
                    <label htmlFor="c-message">Nội dung *</label>
                    <textarea id="c-message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Mô tả ngắn về dự án hoặc câu hỏi của bạn..." required></textarea>
                  </div>
                  <button type="submit" className="ag-form-submit" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
