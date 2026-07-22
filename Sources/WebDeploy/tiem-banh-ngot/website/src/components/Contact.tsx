import { useState } from 'react'
import { useSite } from '../App'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Liên hệ — La Douceur Patisserie',
    description: settings.site_address
      ? `Liên hệ La Douceur Patisserie tại ${settings.site_address}. Tư vấn đặt bánh, giờ mở cửa và thông tin liên lạc.`
      : 'Liên hệ La Douceur Patisserie để được tư vấn đặt bánh, xem giờ mở cửa và thông tin liên lạc trực tiếp.',
  })
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true); setMsg(null)
    try {
      await api.post('/public/contact', form)
      setMsg({ type: 'success', text: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 2–4 giờ.' })
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch {
      setMsg({ type: 'error', text: 'Gửi thất bại. Vui lòng thử lại hoặc liên hệ qua điện thoại.' })
    } finally { setSending(false) }
  }

  const contactCards = [
    { icon: '📍', title: 'Địa chỉ tiệm', info: settings.site_address ?? '12 Đường Thành Thái, Quận 10, TP.HCM' },
    { icon: '📞', title: 'Điện thoại', info: settings.site_phone ?? '028 1234 5678', href: `tel:${settings.site_phone ?? ''}` },
    { icon: '✉', title: 'Email', info: settings.site_email ?? 'order@ladouceur.vn', href: `mailto:${settings.site_email ?? ''}` },
    { icon: '🕐', title: 'Giờ mở cửa', info: settings.working_hours ?? 'T2–T6: 8:00–21:00 | T7–CN: 7:30–21:30' },
  ]

  return (
    <div>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Kết nối</div>
          <h1 className="ph-title">Liên hệ <em>với chúng tôi</em></h1>
          <p className="ph-sub">Chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn đặt bánh theo yêu cầu</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          {/* Contact cards */}
          <div className="row g-4 mb-5">
            {contactCards.map((c, i) => (
              <div key={c.title} className={`col-sm-6 col-lg-3 reveal reveal-d${i + 1}`} data-reveal>
                <div className="contact-card">
                  <div className="cc-icon">{c.icon}</div>
                  <div className="cc-title">{c.title}</div>
                  <div className="cc-info">
                    {c.href ? <a href={c.href}>{c.info}</a> : c.info}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-5">
            {/* Contact form */}
            <div className="col-lg-7" data-reveal>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Gửi tin nhắn cho chúng tôi</h3>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Họ tên *</label>
                    <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Số điện thoại</label>
                    <input type="tel" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div>
                  <label className="form-label">Chủ đề</label>
                  <input type="text" className="form-control" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Tư vấn đặt bánh sinh nhật..." />
                </div>
                <div>
                  <label className="form-label">Tin nhắn *</label>
                  <textarea className="form-control" rows={5} value={form.message} onChange={e => set('message', e.target.value)} required placeholder="Nội dung tin nhắn của bạn..." />
                </div>
                {msg && (
                  <div style={{
                    padding: '12px 16px', borderRadius: 10, fontSize: 14,
                    background: msg.type === 'success' ? 'var(--accent-light)' : '#fff0f0',
                    color: msg.type === 'success' ? 'var(--accent)' : 'var(--danger)',
                    border: `1px solid ${msg.type === 'success' ? 'var(--border)' : '#fdd'}`,
                  }}>
                    {msg.text}
                  </div>
                )}
                <button type="submit" className="btn-accent" disabled={sending} style={{ alignSelf: 'flex-start' }}>
                  {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
              </form>
            </div>

            {/* Map + hours */}
            <div className="col-lg-5" data-reveal>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Tìm chúng tôi</h3>
              <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 24, background: 'var(--warm)', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {settings.google_map_embed ? (
                  <iframe
                    src={settings.google_map_embed}
                    width="100%" height="280" style={{ border: 0 }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-3)' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
                    <div style={{ fontSize: 13 }}>Bản đồ Google Maps</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Cấu hình trong Settings</div>
                  </div>
                )}
              </div>

              <div style={{ background: 'var(--warm)', borderRadius: 14, padding: 24 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>🕐 Giờ mở cửa</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {[
                    ['Thứ 2 – Thứ 6', '08:00 – 21:00'],
                    ['Thứ 7', '07:30 – 21:30'],
                    ['Chủ nhật', '08:00 – 20:00'],
                  ].map(([day, hours]) => (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '7px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <span style={{ color: 'var(--text-2)' }}>{day}</span>
                      <span style={{ fontWeight: 500 }}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
