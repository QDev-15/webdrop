import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const EMPTY: ContactForm = { name: '', email: '', phone: '', subject: '', message: '' }

const HOURS = [
  { day: 'Thứ 2', time: '8:00 – 20:00' },
  { day: 'Thứ 3', time: '8:00 – 20:00' },
  { day: 'Thứ 4', time: '8:00 – 20:00' },
  { day: 'Thứ 5', time: '8:00 – 20:00' },
  { day: 'Thứ 6', time: '8:00 – 20:00' },
  { day: 'Thứ 7', time: '8:00 – 18:00' },
  { day: 'Chủ nhật', time: '9:00 – 17:00' },
]

export default function LienHePage() {
  const today = new Date().getDay() // 0=Sun,1=Mon,...6=Sat
  const todayIdx = today === 0 ? 6 : today - 1
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Thẩm Mỹ Viện Quốc Tế'}`,
    description: 'Liên hệ Thẩm Mỹ Viện Quốc Tế để được tư vấn và đặt lịch hẹn — địa chỉ, số điện thoại, giờ làm việc và bản đồ chỉ đường.',
  })
  const [form, setForm]       = useState<ContactForm>(EMPTY)
  const [submitting, setSub]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const phone   = settings.site_phone   || '0901 234 567'
  const email   = settings.site_email   || 'info@thammy.vn'
  const address = settings.site_address || '123 Nguyễn Trãi, Quận 1, TP.HCM'
  const fb      = settings.facebook_url || ''
  const ig      = settings.instagram_url|| ''
  const yt      = settings.youtube_url  || ''

  const set = (k: keyof ContactForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim())    { setError('Vui lòng nhập họ tên.'); return }
    if (!form.message.trim()) { setError('Vui lòng nhập nội dung.'); return }
    setSub(true); setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally { setSub(false) }
  }

  return (
    <>
      {/* Page hero */}
      <section className="tmv-page-hero">
        <div className="wd-container">
          <div data-reveal>
            <div className="tmv-ph-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12.36 19.79 19.79 0 011.49 3.84 2 2 0 013.47 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 9.91a16 16 0 006.14 6.14l1.28-.8a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Chúng tôi luôn sẵn sàng
            </div>
            <h1 className="tmv-ph-title">Liên hệ <em>với chúng tôi</em></h1>
            <p className="tmv-ph-sub">Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ bạn về mọi vấn đề. Đừng ngần ngại liên hệ!</p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            {/* Left: contact info + map */}
            <div className="col-12 col-lg-7" data-reveal>
              {/* Contact cards */}
              <div className="row g-3 mb-4">
                {[
                  {
                    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12.36 19.79 19.79 0 011.49 3.84 2 2 0 013.47 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 9.91a16 16 0 006.14 6.14l1.28-.8a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
                    label: 'Điện thoại',
                    value: phone,
                    href: `tel:${phone.replace(/\s/g,'')}`,
                  },
                  {
                    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
                    label: 'Email',
                    value: email,
                    href: `mailto:${email}`,
                  },
                  {
                    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
                    label: 'Địa chỉ',
                    value: address,
                    href: '',
                  },
                ].map((c, i) => (
                  <div key={i} className="col-12">
                    <div style={{
                      display: 'flex', gap: 16, padding: '16px 20px',
                      background: 'var(--clinical-white)', border: '1px solid var(--border)',
                      borderRadius: 12, alignItems: 'center',
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: 'var(--accent-light)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }} dangerouslySetInnerHTML={{ __html: c.icon }} />
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
                          {c.label}
                        </div>
                        {c.href ? (
                          <a href={c.href} style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', textDecoration: 'none' }}>{c.value}</a>
                        ) : (
                          <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-2)' }}>{c.value}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="tmv-map-wrap" data-reveal>
                <div className="tmv-map-placeholder">
                  <div className="tmv-map-grid-lines" />
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div className="tmv-map-pin">
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className="tmv-map-placeholder-label">Vị trí thẩm mỹ viện</div>
                    <div className="tmv-map-placeholder-addr">{address}</div>
                  </div>
                </div>
                <div className="tmv-map-cta">
                  <div className="tmv-map-cta-addr">{address}</div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tmv-map-cta-btn"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                    </svg>
                    Xem trên Google Maps
                  </a>
                </div>
              </div>

              {/* Social channels */}
              {(fb || ig || yt) && (
                <div className="tmv-socials-row" data-reveal>
                  {fb && (
                    <a href={fb} target="_blank" rel="noopener noreferrer" className="tmv-soc-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                      Facebook
                    </a>
                  )}
                  {ig && (
                    <a href={ig} target="_blank" rel="noopener noreferrer" className="tmv-soc-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>
                      Instagram
                    </a>
                  )}
                  {yt && (
                    <a href={yt} target="_blank" rel="noopener noreferrer" className="tmv-soc-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                      YouTube
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right: hours + form */}
            <div className="col-12 col-lg-5" data-reveal data-delay="1">
              {/* Hours table */}
              <div className="tmv-hours-card" style={{ marginBottom: 24 }}>
                <div className="tmv-hours-header">
                  <div className="tmv-hours-header-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div className="tmv-hours-header-title">Giờ làm việc</div>
                </div>
                {HOURS.map((h, i) => (
                  <div key={h.day} className={`tmv-hours-row${i === todayIdx ? ' today' : ''}`}>
                    <div className="tmv-hours-day">{h.day}</div>
                    <div className="tmv-hours-time">{h.time}</div>
                  </div>
                ))}
              </div>

              {/* Short contact form */}
              <div className="tmv-short-form">
                <div className="tmv-short-form-title">Gửi tin nhắn</div>
                <div className="tmv-short-form-sub">Chúng tôi sẽ phản hồi sớm nhất có thể trong giờ làm việc.</div>

                {success ? (
                  <div className="tmv-form-success-dark show">
                    <div className="tmv-form-success-dark-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                    <div className="tmv-form-success-dark-title">Đã nhận được tin nhắn!</div>
                    <div className="tmv-form-success-dark-sub">Chúng tôi sẽ phản hồi sớm nhất.</div>
                    <button
                      onClick={() => setSuccess(false)}
                      style={{ marginTop: 16, background: 'none', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)', padding: '8px 16px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}
                    >
                      Gửi tin khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
                    {error && (
                      <div style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.25)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 7, fontSize: 13 }}>
                        {error}
                      </div>
                    )}
                    <div className="tmv-form-group-dark">
                      <label className="tmv-label-dark">Họ và tên *</label>
                      <input
                        className="tmv-input-dark"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="Nguyễn Thị Lan"
                      />
                    </div>
                    <div className="tmv-form-group-dark">
                      <label className="tmv-label-dark">Số điện thoại</label>
                      <input
                        className="tmv-input-dark"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        placeholder="0901 234 567"
                        type="tel"
                      />
                    </div>
                    <div className="tmv-form-group-dark">
                      <label className="tmv-label-dark">Nội dung *</label>
                      <textarea
                        className="tmv-input-dark"
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                        placeholder="Câu hỏi hoặc yêu cầu của bạn..."
                        rows={4}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="tmv-submit-dark"
                    >
                      {submitting ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
