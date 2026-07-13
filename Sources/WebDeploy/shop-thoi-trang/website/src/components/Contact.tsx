import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const TOPICS = [
  { value: 'order', label: 'Hỏi về đơn hàng' },
  { value: 'product', label: 'Tư vấn sản phẩm' },
  { value: 'return', label: 'Đổi trả — Hoàn tiền' },
  { value: 'wholesale', label: 'Mua sỉ / Đại lý' },
  { value: 'collab', label: 'Hợp tác — Collab' },
  { value: 'other', label: 'Khác' },
]

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc (*)')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/public/contact', { ...form, topic: form.subject })
      setSuccess(true)
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="st-sec" aria-label="Thông tin liên hệ">
      <div className="st-container">
        <div className="st-contact-layout">

          <div>
            <div className="st-eyebrow" data-reveal>Gửi Tin Nhắn</div>
            <h2 className="st-sec-title" data-reveal data-delay="1">Chúng Tôi<br />Lắng Nghe Bạn</h2>
            <p className="st-sec-sub" style={{ marginBottom: 36 }} data-reveal data-delay="2">
              Điền thông tin vào form bên dưới, chúng tôi sẽ liên hệ lại trong vòng 24 giờ làm việc
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="st-form-row" data-reveal data-delay="2">
                <div className="st-form-group">
                  <label className="st-form-label" htmlFor="ctName">Họ và tên *</label>
                  <input type="text" id="ctName" className="st-form-input" placeholder="Nguyễn Văn A" required autoComplete="name"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="st-form-group">
                  <label className="st-form-label" htmlFor="ctPhone">Số điện thoại *</label>
                  <input type="tel" id="ctPhone" className="st-form-input" placeholder="0901 234 567" required autoComplete="tel"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>

              <div className="st-form-group" data-reveal data-delay="3">
                <label className="st-form-label" htmlFor="ctEmail">Email</label>
                <input type="email" id="ctEmail" className="st-form-input" placeholder="email@example.com" autoComplete="email"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>

              <div className="st-form-group" data-reveal data-delay="3">
                <label className="st-form-label" htmlFor="ctSubject">Chủ đề</label>
                <select id="ctSubject" className="st-form-select" value={form.subject} onChange={e => set('subject', e.target.value)}>
                  <option value="">Chọn chủ đề...</option>
                  {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className="st-form-group" data-reveal data-delay="4">
                <label className="st-form-label" htmlFor="ctMessage">Nội dung *</label>
                <textarea id="ctMessage" className="st-form-input" placeholder="Nhập nội dung tin nhắn của bạn..." required rows={5}
                  value={form.message} onChange={e => set('message', e.target.value)} />
              </div>

              {error && (
                <div style={{ marginBottom: 20, padding: '14px 18px', background: 'var(--sale-light)', borderLeft: '4px solid var(--sale)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--sale)', margin: 0 }}>{error}</p>
                </div>
              )}

              <div data-reveal data-delay="5">
                <button type="submit" className="st-btn st-btn-primary st-btn-lg" disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi Tin Nhắn'} <i className="bi bi-send" />
                </button>
              </div>

              {success && (
                <div style={{ display: 'block', marginTop: 20, padding: '16px 20px', background: 'var(--accent-light)', borderLeft: '4px solid var(--accent)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
                    <i className="bi bi-check-circle me-2" /> Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                  </p>
                </div>
              )}
            </form>
          </div>

          <div>
            <div className="st-eyebrow mb-3" data-reveal>Thông Tin</div>

            <div className="st-contact-info-item" data-reveal data-delay="1">
              <div className="st-ci-icon"><i className="bi bi-geo-alt-fill" /></div>
              <div>
                <div className="st-ci-label">Địa Chỉ Cửa Hàng</div>
                <div className="st-ci-val">{settings.site_address}</div>
              </div>
            </div>

            <div className="st-contact-info-item" data-reveal data-delay="2">
              <div className="st-ci-icon"><i className="bi bi-telephone-fill" /></div>
              <div>
                <div className="st-ci-label">Điện Thoại &amp; Zalo</div>
                <div className="st-ci-val">
                  {settings.site_phone && <a href={`tel:+84${settings.site_phone.replace(/\D/g, '').replace(/^0/, '')}`} style={{ display: 'block' }}>{settings.site_phone}</a>}
                  {settings.site_phone2 && <a href={`tel:+84${settings.site_phone2.replace(/\D/g, '').replace(/^0/, '')}`} style={{ display: 'block', color: 'var(--text-3)', fontSize: 14, marginTop: 2 }}>{settings.site_phone2} — Hỗ trợ online</a>}
                </div>
              </div>
            </div>

            <div className="st-contact-info-item" data-reveal data-delay="3">
              <div className="st-ci-icon"><i className="bi bi-envelope-fill" /></div>
              <div>
                <div className="st-ci-label">Email</div>
                <div className="st-ci-val">
                  {settings.site_email && <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>}
                </div>
              </div>
            </div>

            <div className="st-contact-info-item" data-reveal data-delay="4">
              <div className="st-ci-icon"><i className="bi bi-clock-fill" /></div>
              <div>
                <div className="st-ci-label">Giờ Làm Việc</div>
                <div className="st-ci-val" style={{ fontSize: 14 }}>
                  {settings.working_hours}<br />
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Chat online 7/7 qua Zalo</span>
                </div>
              </div>
            </div>

            <div style={{ padding: 28, background: 'var(--dark)', marginTop: 8 }} data-reveal>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>
                Theo Dõi Chúng Tôi
              </div>
              <div className="d-flex gap-3 flex-wrap">
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.65)' }} aria-label="Facebook">
                    <i className="bi bi-facebook" style={{ fontSize: 18, color: '#1877f2' }} /> Facebook
                  </a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.65)' }} aria-label="Instagram">
                    <i className="bi bi-instagram" style={{ fontSize: 18, color: '#e1306c' }} /> Instagram
                  </a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.65)' }} aria-label="TikTok">
                    <i className="bi bi-tiktok" style={{ fontSize: 18, color: '#fff' }} /> TikTok
                  </a>
                )}
              </div>
            </div>

            {settings.map_embed ? (
              <div className="st-map-box" style={{ padding: 0, border: 'none' }} data-reveal>
                <iframe src={settings.map_embed} width="100%" height="100%" style={{ border: 0, display: 'block' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ cửa hàng" />
              </div>
            ) : (
              <div className="st-map-box" data-reveal>
                <div style={{ textAlign: 'center' }}>
                  <i className="bi bi-map" style={{ fontSize: 40, display: 'block', marginBottom: 10, color: 'var(--text-3)' }} />
                  Bản đồ cửa hàng
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
