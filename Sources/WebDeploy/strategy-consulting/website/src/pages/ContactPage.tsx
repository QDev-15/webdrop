import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

interface FormState {
  name: string
  email: string
  phone: string
  message: string
}

const empty: FormState = { name: '', email: '', phone: '', message: '' }

export default function ContactPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Strategy & Co'}`,
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

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-label">{settings.contact_hero_eyebrow || 'Liên hệ'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.contact_hero_title || 'Hãy nói chuyện <em>với chúng tôi</em>' }} />
          <p className="ph-sub">{settings.contact_hero_sub || ''}</p>
        </div>
      </section>

      <section className="sc-sec-pad">
        <div className="wd-container" style={{ maxWidth: 700 }}>
          <div className="row">
            <div className="col-lg-6">
              <h3 className="sc-contact-form-title">Gửi tin nhắn</h3>
              {status === 'ok' ? (
                <div style={{ padding: '32px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
                  <div className="sc-feature-title" style={{ fontSize: 18, marginBottom: 8 }}>Gửi tin nhắn thành công!</div>
                  <p className="sc-sub" style={{ margin: 0 }}>Chúng tôi sẽ phản hồi bạn trong vòng 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="sc-contact-form">
                  <div className="mb-4">
                    <input type="text" placeholder="Tên của bạn" value={form.name} onChange={e => set('name', e.target.value)} required />
                  </div>
                  <div className="mb-4">
                    <input type="email" placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <input type="tel" placeholder="Số điện thoại" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <textarea placeholder="Nội dung..." rows={5} value={form.message} onChange={e => set('message', e.target.value)} required />
                  </div>
                  {status === 'err' && (
                    <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>Có lỗi xảy ra. Vui lòng thử lại.</p>
                  )}
                  <button type="submit" className="btn-sc" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang gửi...' : 'Gửi'}
                  </button>
                </form>
              )}
            </div>
            <div className="col-lg-6" style={{ paddingLeft: 40 }}>
              <h3 className="sc-contact-info-title">Thông tin</h3>
              <div className="sc-contact-info">
                <p><strong>Email:</strong><br /><a href={`mailto:${settings.site_email || ''}`}>{settings.site_email || ''}</a></p>
                <p><strong>Điện thoại:</strong><br /><a href={`tel:${settings.site_phone || ''}`}>{settings.site_phone || ''}</a></p>
                {zaloDigits && (
                  <p><strong>Zalo:</strong><br /><a href={`https://zalo.me/${zaloDigits}`} target="_blank" rel="noopener noreferrer">Chat ngay</a></p>
                )}
                {settings.working_hours && (
                  <p><strong>Giờ làm việc:</strong><br /><span style={{ whiteSpace: 'pre-line' }}>{settings.working_hours}</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
