import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'AMI Mobile'}`,
    description: `Liên hệ ${settings.site_name || 'AMI Mobile'} để được tư vấn điện thoại, tai nghe, phụ kiện — hotline, Zalo, địa chỉ cửa hàng.`,
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))
  const phoneDigits = (settings.site_phone || '').replace(/\D/g, '')
  const zaloNumber = settings.zalo_number || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi tin nhắn thất bại, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-page-hero">
        <div className="mb-container">
          <div className="mb-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span><span>Liên hệ</span>
          </div>
          <div className="mb-label mb-page-hero-label">Liên hệ</div>
          <h1>Chúng tôi ở <em>đây</em></h1>
          <p>Tư vấn miễn phí · Hỗ trợ 7 ngày/tuần</p>
        </div>
      </div>

      <section className="mb-sec" style={{ padding: '48px 0 72px' }}>
        <div className="mb-container">
          <div className="row g-4 g-lg-5">
            <div className="col-lg-5" data-reveal>
              <div className="mb-label">Thông tin</div>
              <h2 className="mb-sec-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Liên hệ <em>trực tiếp</em></h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 32 }}>
                {settings.contact_intro || 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn chọn chiếc điện thoại phù hợp nhất với nhu cầu và ngân sách.'}
              </p>

              <div className="mb-contact-items">
                {settings.site_address && (
                  <div className="mb-contact-item">
                    <div className="mb-contact-icon">📍</div>
                    <div>
                      <div className="mb-contact-label">Địa chỉ</div>
                      <div className="mb-contact-val">{settings.site_address}</div>
                    </div>
                  </div>
                )}
                {settings.site_phone && (
                  <div className="mb-contact-item">
                    <div className="mb-contact-icon">📞</div>
                    <div>
                      <div className="mb-contact-label">Hotline</div>
                      <div className="mb-contact-val"><a href={`tel:${phoneDigits}`} style={{ color: 'var(--accent)' }}>{settings.site_phone}</a></div>
                    </div>
                  </div>
                )}
                {settings.site_email && (
                  <div className="mb-contact-item">
                    <div className="mb-contact-icon">✉️</div>
                    <div>
                      <div className="mb-contact-label">Email</div>
                      <div className="mb-contact-val"><a href={`mailto:${settings.site_email}`} style={{ color: 'var(--accent)' }}>{settings.site_email}</a></div>
                    </div>
                  </div>
                )}
                {settings.working_hours && (
                  <div className="mb-contact-item">
                    <div className="mb-contact-icon">🕐</div>
                    <div>
                      <div className="mb-contact-label">Giờ làm việc</div>
                      <div className="mb-contact-val">{settings.working_hours}</div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 32 }}>
                {zaloNumber && <a href={`https://zalo.me/${zaloNumber}`} className="mb-btn" target="_blank" rel="noopener noreferrer" style={{ marginRight: 12 }}>Chat Zalo</a>}
                {settings.site_phone && <a href={`tel:${phoneDigits}`} className="mb-btn mb-btn-outline">Gọi ngay</a>}
              </div>
            </div>

            <div className="col-lg-7" data-reveal>
              <div className="mb-contact-form-wrap">
                <h3 className="mb-contact-form-title">Gửi tin nhắn cho chúng tôi</h3>
                <form className="mb-contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="mb-form-label" htmlFor="contactName">Họ và tên *</label>
                      <input id="contactName" type="text" className="mb-form-input" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div className="col-sm-6">
                      <label className="mb-form-label" htmlFor="contactPhone">Số điện thoại *</label>
                      <input id="contactPhone" type="tel" className="mb-form-input" placeholder="0900 000 000" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                    </div>
                    <div className="col-12">
                      <label className="mb-form-label" htmlFor="contactEmail">Email</label>
                      <input id="contactEmail" type="email" className="mb-form-input" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="mb-form-label" htmlFor="contactSubject">Chủ đề</label>
                      <select id="contactSubject" className="mb-form-input" value={form.subject} onChange={e => set('subject', e.target.value)}>
                        <option value="">Chọn chủ đề...</option>
                        <option>Tư vấn mua điện thoại</option>
                        <option>Hỏi về sản phẩm</option>
                        <option>Đặt hàng &amp; giao hàng</option>
                        <option>Bảo hành &amp; đổi trả</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="mb-form-label" htmlFor="contactMsg">Nội dung *</label>
                      <textarea id="contactMsg" className="mb-form-input mb-form-textarea" rows={5} placeholder="Bạn cần hỗ trợ gì?" value={form.message} onChange={e => set('message', e.target.value)} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="mb-btn" style={{ width: '100%' }} disabled={submitting}>
                        {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                      </button>
                    </div>
                  </div>
                  {error && <div className="mb-form-success" style={{ background: 'var(--danger-light)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>{error}</div>}
                  {success && <div className="mb-form-success">Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-map-placeholder">
        <div className="mb-map-inner">
          <div className="mb-map-icon">🗺️</div>
          <div className="mb-map-text">Bản đồ cửa hàng</div>
          <div className="mb-map-sub">{settings.site_address}</div>
        </div>
      </div>
    </>
  )
}
