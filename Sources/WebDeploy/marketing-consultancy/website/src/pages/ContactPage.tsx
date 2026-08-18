import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

interface FormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const empty: FormState = { name: '', email: '', phone: '', subject: '', message: '' }

export default function ContactPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Markco'}`,
    description: settings.contact_hero_sub,
  })

  const [form, setForm] = useState<FormState>(empty)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return
    setStatus('loading')
    try {
      await api.post('/public/contact', form)
      setStatus('ok')
      setForm(empty)
    } catch {
      setStatus('err')
    }
  }

  const zaloDigits = (settings.zalo || '').replace(/\D/g, '')
  const addressLines = (settings.site_address || '').split('\n').filter(Boolean)
  const hoursLines = (settings.working_hours || '').split('\n').filter(Boolean)

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">{settings.contact_hero_eyebrow || 'Hãy liên hệ'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.contact_hero_title || 'Chúng tôi sẵn sàng <em>giúp bạn</em>' }} />
          <p className="ph-sub">{settings.contact_hero_sub || ''}</p>
        </div>
      </section>

      <section className="mc-sec-pad">
        <div className="wd-container">
          <div className="row">
            <div className="col-lg-6">
              <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', marginBottom: 28 }}>Gửi tin nhắn cho chúng tôi</h3>

              {status === 'ok' ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Gửi tin nhắn thành công!</div>
                  <p style={{ color: 'var(--text-2)' }}>Chúng tôi sẽ liên lạc lại với bạn trong vòng 24h.</p>
                </div>
              ) : (
                <form className="mc-contact-form" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
                  <div className="mb-4">
                    <label htmlFor="name">Tên của bạn</label>
                    <input type="text" id="name" placeholder="Nhập tên của bạn" value={form.name} onChange={e => set('name', e.target.value)} required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input type="tel" id="phone" placeholder="0123456789" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="subject">Chủ đề</label>
                    <input type="text" id="subject" placeholder="Chủ đề liên hệ" value={form.subject} onChange={e => set('subject', e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message">Tin nhắn</label>
                    <textarea id="message" placeholder="Viết tin nhắn của bạn..." rows={6} value={form.message} onChange={e => set('message', e.target.value)} required />
                  </div>
                  {status === 'err' && (
                    <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>Có lỗi xảy ra. Vui lòng thử lại.</p>
                  )}
                  <button type="submit" className="btn-mc-primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang gửi...' : 'Gửi tin nhắn'}
                  </button>
                </form>
              )}
            </div>

            <div className="col-lg-6">
              <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', marginBottom: 28 }}>Thông tin liên lạc</h3>

              <div className="mc-contact-info-block">
                <h4>📍 Địa chỉ</h4>
                <p>{addressLines.map((line, i) => <span key={i}>{line}{i < addressLines.length - 1 && <br />}</span>)}</p>
              </div>

              <div className="mc-contact-info-block">
                <h4>📞 Điện thoại</h4>
                <p><a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`}>{settings.site_phone}</a></p>
              </div>

              <div className="mc-contact-info-block">
                <h4>✉️ Email</h4>
                <p><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></p>
              </div>

              {zaloDigits && (
                <div className="mc-contact-info-block">
                  <h4>💬 Zalo</h4>
                  <p><a href={`https://zalo.me/${zaloDigits}`} target="_blank" rel="noopener noreferrer">Chat với chúng tôi trên Zalo</a></p>
                </div>
              )}

              <div className="mc-contact-info-block">
                <h4>🕐 Giờ làm việc</h4>
                <p>{hoursLines.map((line, i) => <span key={i}>{line}{i < hoursLines.length - 1 && <br />}</span>)}</p>
              </div>

              <div className="mc-free-consult-box">
                <h4>{settings.contact_free_consult_title || '🎁 Tư vấn miễn phí'}</h4>
                <p>{settings.contact_free_consult_desc || ''}</p>
                <a href="#lien-he">{settings.contact_free_consult_button || 'Đặt lịch ngay →'}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
