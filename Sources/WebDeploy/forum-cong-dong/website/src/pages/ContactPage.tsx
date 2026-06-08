import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.message.trim()) {
      setError('Vui long dien ho ten va noi dung.')
      return
    }
    setSending(true)
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gui tin that bai. Vui long thu lai.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Header />
      <main style={{ padding: '40px 0 80px' }}>
        <div className="wd-container">
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h1 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 600, color: 'var(--text)', letterSpacing: '-.5px', marginBottom: 8 }}>
                Lien he voi chung toi
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 300 }}>
                Co cau hoi hay gop y? Hay lien he de chung toi ho tro ban.
              </p>
            </div>

            {settings.site_email && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 20px', fontSize: 13, color: 'var(--text-2)' }}>
                  Email: <strong>{settings.site_email}</strong>
                </div>
              </div>
            )}

            <div className="form-section">
              {success ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent)', marginBottom: 8 }}>Da gui thanh cong!</div>
                  <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Chung toi se phan hoi sớm nhat co the.</p>
                  <button
                    style={{ marginTop: 16, fontSize: 13, padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontFamily: 'var(--sans)' }}
                    onClick={() => setSuccess(false)}
                  >
                    Gui tin khac
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label className="form-label">Ho ten *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Nguyen Van A" />
                    </div>
                    <div>
                      <label className="form-label">Email</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label className="form-label">So dien thoai</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
                    </div>
                    <div>
                      <label className="form-label">Chu de</label>
                      <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Chu de lien he" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Noi dung *</label>
                    <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={5} placeholder="Noi dung can gui..." required />
                  </div>

                  {error && (
                    <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fff0f0', color: 'var(--danger)', fontSize: 13, border: '1px solid #fdd' }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all .15s' }}
                    onMouseOver={e => ((e.target as HTMLElement).style.background = 'var(--accent-h)')}
                    onMouseOut={e => ((e.target as HTMLElement).style.background = 'var(--accent)')}
                  >
                    {sending ? 'Dang gui...' : 'Gui tin nhan →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
