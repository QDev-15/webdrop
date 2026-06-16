import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../App'

interface ContactPayload {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const emptyForm: ContactPayload = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState<ContactPayload>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof ContactPayload>(k: K, v: ContactPayload[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.message.trim()) {
      setError('Vui lòng điền họ tên và nội dung tin nhắn.')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm(emptyForm)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="lien-he" className="sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <div className="eyebrow">Liên hệ</div>
          <h2 className="sec-title" style={{ marginBottom: 14 }}>
            Kết nối <em>với chúng tôi</em>
          </h2>
          <p className="sec-sub" style={{ margin: '0 auto' }}>
            Có thắc mắc về thực đơn, sự kiện hay muốn tổ chức bữa tiệc riêng tư? Đội ngũ chúng tôi luôn sẵn sàng hỗ trợ.
          </p>
        </div>

        <div className="row g-5">
          {/* Info */}
          <div className="col-lg-4">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                {
                  icon: '📍',
                  title: 'Địa chỉ',
                  content: settings.site_address || '12 Lý Thái Tổ, Hoàn Kiếm, Hà Nội',
                },
                {
                  icon: '📞',
                  title: 'Điện thoại',
                  content: settings.site_phone || '024 1234 5678',
                },
                {
                  icon: '✉',
                  title: 'Email',
                  content: settings.site_email || 'info@lamaison.vn',
                },
                {
                  icon: '🕕',
                  title: 'Giờ mở cửa',
                  content: settings.working_hours || 'Thứ 2 – Chủ nhật: 18:00 – 22:30',
                },
              ].map(info => (
                <div key={info.title} style={{ display: 'flex', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
                      {info.title}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6 }}>
                      {info.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Mạng xã hội</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {settings.social_facebook && (
                    <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" title="Facebook"
                      style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--text-2)', textDecoration: 'none', transition: 'all .15s' }}>
                      f
                    </a>
                  )}
                  {settings.social_instagram && (
                    <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" title="Instagram"
                      style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--text-2)', textDecoration: 'none', transition: 'all .15s' }}>
                      IG
                    </a>
                  )}
                  {settings.social_youtube && (
                    <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" title="YouTube"
                      style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--text-2)', textDecoration: 'none', transition: 'all .15s' }}>
                      YT
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="col-lg-8">
            {success ? (
              <div style={{ padding: '48px 32px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✉</div>
                <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 10 }}>Tin nhắn đã được gửi!</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.8, marginBottom: 20 }}>
                  Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                </p>
                <button onClick={() => setSuccess(false)} className="btn-ghost">Gửi tin nhắn khác</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                {error && (
                  <div className="alert alert-error">{error}</div>
                )}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Họ tên *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Điện thoại</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="0912 345 678"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Chủ đề</label>
                    <select className="form-control" value={form.subject} onChange={e => set('subject', e.target.value)}>
                      <option value="">Chọn chủ đề...</option>
                      <option value="Đặt bàn">Đặt bàn</option>
                      <option value="Sự kiện riêng">Sự kiện riêng</option>
                      <option value="Thực đơn">Thực đơn</option>
                      <option value="Hợp tác">Hợp tác</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Nội dung *</label>
                    <textarea
                      className="form-control"
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      placeholder="Nhập nội dung cần trao đổi..."
                      rows={5}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn-accent" disabled={submitting}>
                      {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Map embed */}
            {settings.google_map_embed && (
              <div style={{ marginTop: 24, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <iframe
                  src={settings.google_map_embed}
                  width="100%"
                  height="260"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
