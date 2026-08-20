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
    title: `Liên hệ — ${settings.site_name || 'Digital Innovation'}`,
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
          <div className="ph-eyebrow">{settings.contact_hero_eyebrow || 'Liên hệ'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.contact_hero_title || 'Hãy <em>Nói chuyện</em> với chúng tôi' }} />
          <p className="ph-sub">{settings.contact_hero_sub || ''}</p>
        </div>
      </section>

      <section className="di-sec-pad">
        <div className="wd-container" style={{ maxWidth: 700 }}>
          {status === 'ok' ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
              <div className="di-feature-title" style={{ fontSize: 20, marginBottom: 8 }}>Gửi tin nhắn thành công!</div>
              <p className="di-sub" style={{ margin: '0 auto' }}>Chúng tôi sẽ phản hồi bạn trong vòng 24h.</p>
            </div>
          ) : (
            <form className="di-contact-form" onSubmit={handleSubmit} style={{ marginBottom: 48 }}>
              <div className="mb-4">
                <input type="text" placeholder="Tên của bạn" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="mb-4">
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="mb-4">
                <input type="tel" placeholder="Số điện thoại" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="mb-4">
                <textarea placeholder="Nội dung..." rows={6} value={form.message} onChange={e => set('message', e.target.value)} required />
              </div>
              {status === 'err' && (
                <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>Có lỗi xảy ra. Vui lòng thử lại.</p>
              )}
              <button type="submit" className="btn-di-primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Đang gửi...' : 'Gửi'}
              </button>
            </form>
          )}

          <div className="di-contact-info" style={{ borderTop: '1px solid var(--border)', paddingTop: 48 }}>
            <h3>Thông tin</h3>
            <p><strong>Email:</strong> {settings.site_email || ''}</p>
            <p><strong>Phone:</strong> {settings.site_phone || ''}</p>
            {zaloDigits && (
              <p><strong>Zalo:</strong> <a href={`https://zalo.me/${zaloDigits}`} target="_blank" rel="noopener noreferrer">Chat ngay</a></p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
