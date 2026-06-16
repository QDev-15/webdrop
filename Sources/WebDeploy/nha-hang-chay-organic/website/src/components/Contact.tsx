import { useState, FormEvent } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface ContactForm {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState<ContactForm>({ name: '', phone: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function set(k: keyof ContactForm, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setResult(null)
    setSending(true)
    try {
      const r = await api.post<{ message: string }>('/public/contact', form)
      setResult({ type: 'success', text: r.message || 'Cảm ơn bạn đã liên hệ!' })
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch (err: unknown) {
      setResult({ type: 'error', text: err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.' })
    } finally {
      setSending(false)
    }
  }

  const phone   = (settings.site_phone) || '0901 234 567'
  const address = (settings.site_address) || '123 Đường Lá Xanh, Quận 3, TP.HCM'
  const email   = (settings.site_email) || 'info@laxanhchay.vn'
  const hours   = (settings.working_hours) || 'Thứ 2 – Thứ 6: 10:00 – 21:00 | Thứ 7 – CN: 9:00 – 21:30'

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-lg-7 reveal">
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '22px', letterSpacing: '-.4px' }}>Đặt bàn &amp; Liên hệ</h3>
            {result && (
              <div style={{
                padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
                background: result.type === 'success' ? 'var(--accent-light)' : '#fff0f0',
                color: result.type === 'success' ? 'var(--accent)' : 'var(--danger)',
                border: `1px solid ${result.type === 'success' ? 'var(--border)' : '#fdd'}`,
                fontSize: '14px',
              }}>
                {result.text}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Họ và tên *</label>
                  <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tên của bạn" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Số điện thoại</label>
                  <input type="tel" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Chủ đề</label>
                  <input type="text" className="form-control" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Đặt bàn, góp ý..." />
                </div>
                <div className="col-12">
                  <label className="form-label">Tin nhắn *</label>
                  <textarea className="form-control" rows={4} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nội dung tin nhắn của bạn..." required />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn-accent" style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 600 }} disabled={sending}>
                    {sending ? 'Đang gửi...' : '🌿 Gửi tin nhắn'}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-5 reveal reveal-d1">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '18px' }}>Thông tin liên hệ</div>
              {[
                { icon: '📍', label: 'Địa chỉ', value: address },
                { icon: '📱', label: 'Điện thoại', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
                { icon: '✉️', label: 'Email', value: email, href: `mailto:${email}` },
                { icon: '🕐', label: 'Giờ mở cửa', value: hours.replace(/\|/g, '\n') },
              ].map(item => (
                <div key={item.label} className="contact-item">
                  <div className="ci-icon">{item.icon}</div>
                  <div>
                    <div className="ci-label">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="ci-value" style={{ color: 'var(--accent)' }}>{item.value}</a>
                    ) : (
                      <div className="ci-value" style={{ whiteSpace: 'pre-line' }}>{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px', marginTop: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>🌱 Lưu ý khi đặt bàn</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-2)', fontWeight: 300 }}>
                <li>✓ Menu thực đơn thay đổi theo mùa và theo nguyên liệu có sẵn</li>
                <li>✓ Vui lòng thông báo dị ứng thực phẩm khi đặt bàn</li>
                <li>✓ Đặt bàn nhóm 7+ người: liên hệ trực tiếp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
