import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import Contact from '../components/Contact'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên hệ – ${String(settings.site_name || 'Shop Đồ Gia Dụng')}`,
    description: 'Liên hệ với chúng tôi để được tư vấn sản phẩm, hỗ trợ đặt hàng hoặc giải đáp mọi thắc mắc.',
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setStatus('error'); setErrMsg('Vui lòng điền họ tên và nội dung liên hệ.'); return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', phone: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error'); setErrMsg('Gửi thất bại. Vui lòng thử lại sau.')
      }
    } catch {
      setStatus('error'); setErrMsg('Không thể kết nối. Vui lòng kiểm tra internet.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (status === 'error') setStatus('idle')
  }

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">Kết nối</p>
          <h1 className="dg-page-hero__title">Liên hệ với chúng tôi</h1>
          <p className="dg-page-hero__sub">Chúng tôi luôn sẵn sàng hỗ trợ bạn từ thứ 2 đến chủ nhật</p>
        </div>
      </div>

      <section className="dg-section">
        <div className="dg-container">
          <div className="dg-contact-grid">
            {/* Info */}
            <div data-reveal>
              <h2 className="dg-contact-info__title">Thông tin liên lạc</h2>
              <p className="dg-contact-info__sub">
                Bạn có câu hỏi về sản phẩm, đơn hàng hay cần tư vấn? Đừng ngần ngại liên hệ với chúng tôi qua các kênh bên dưới.
              </p>
              <Contact />

              {/* Map placeholder */}
              {settings.contact_map_embed ? (
                <div style={{ marginTop: 24, borderRadius: 'var(--radius-card)', overflow: 'hidden', height: 220 }}
                  dangerouslySetInnerHTML={{ __html: String(settings.contact_map_embed) }}
                />
              ) : (
                <div style={{ marginTop: 24, borderRadius: 'var(--radius-card)', overflow: 'hidden', height: 220, background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 32, opacity: .4 }}>🗺️</span>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="dg-contact-form" data-reveal data-delay="1">
              <h3 className="dg-form-title">Gửi tin nhắn cho chúng tôi</h3>

              {status === 'success' && (
                <div className="dg-form-success">
                  ✅ Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                </div>
              )}
              {status === 'error' && (
                <div className="dg-form-error">⚠️ {errMsg}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="dg-form-row">
                  <div className="dg-form-group">
                    <label className="dg-form-label">Họ và tên *</label>
                    <input
                      className="dg-form-input"
                      type="text"
                      name="name"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="dg-form-group">
                    <label className="dg-form-label">Số điện thoại</label>
                    <input
                      className="dg-form-input"
                      type="tel"
                      name="phone"
                      placeholder="0900 000 000"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="dg-form-group">
                  <label className="dg-form-label">Email</label>
                  <input
                    className="dg-form-input"
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="dg-form-group">
                  <label className="dg-form-label">Chủ đề</label>
                  <select className="dg-form-select" name="subject" value={form.subject} onChange={handleChange}>
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="tu-van-san-pham">Tư vấn sản phẩm</option>
                    <option value="ho-tro-don-hang">Hỗ trợ đơn hàng</option>
                    <option value="doi-tra-hang">Đổi trả hàng</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>

                <div className="dg-form-group">
                  <label className="dg-form-label">Nội dung *</label>
                  <textarea
                    className="dg-form-textarea"
                    name="message"
                    placeholder="Nhập nội dung cần liên hệ..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="dg-btn dg-btn--primary dg-btn--lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
