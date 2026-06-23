import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../App'

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function setF(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) { setError('Vui lòng điền đầy đủ thông tin.'); return }
    setSending(true); setError(''); setSuccess('')
    try {
      const res = await api.post<{ message: string }>('/public/contact', {
        name: form.name, email: form.email, message: form.message, subject: 'Liên hệ từ website',
      })
      setSuccess(res.message)
      setForm({ name: '', email: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.')
    } finally { setSending(false) }
  }

  const phone = settings['site_phone'] || '0901 234 567'
  const address = settings['contact_address'] || (settings['site_address'] || '')
  const email = settings['site_email'] || ''
  const mapEmbed = settings['contact_map_embed'] || ''
  const fb = settings['facebook'] || ''
  const ig = settings['instagram'] || ''

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-lg-5 reveal">
            <div className="eyebrow">Thông tin</div>
            <h2 className="sec-title" style={{ fontSize: 'clamp(22px,3vw,34px)', marginBottom: 32 }}>Liên hệ <em>&amp; tìm đường</em></h2>
            <div>
              <div className="contact-elegant">
                <span className="ce-label">Adresse</span>
                <span className="ce-value">{address || '15 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'}</span>
              </div>
              <div className="contact-elegant">
                <span className="ce-label">Téléphone</span>
                <span className="ce-value"><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></span>
              </div>
              {email && (
                <div className="contact-elegant">
                  <span className="ce-label">Email</span>
                  <span className="ce-value"><a href={`mailto:${email}`}>{email}</a></span>
                </div>
              )}
              <div className="contact-elegant">
                <span className="ce-label">Horaires</span>
                <span className="ce-value">
                  Thứ 3–5: 18:00 – 22:30<br />
                  Thứ 6–7: 18:00 – 23:00<br />
                  CN: 12:00–15:00 &amp; 18:00–22:30<br />
                  <em style={{ fontSize: 12.5, color: 'var(--text-3)' }}>Thứ 2: Fermé</em>
                </span>
              </div>
              {(fb || ig) && (
                <div className="contact-elegant">
                  <span className="ce-label">Réseaux</span>
                  <span className="ce-value">
                    {fb && <><a href={fb} target="_blank" rel="noopener noreferrer">Facebook</a><br /></>}
                    {ig && <a href={ig} target="_blank" rel="noopener noreferrer">Instagram</a>}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-7 reveal reveal-d1">
            {/* Map */}
            <div style={{ background: 'var(--warm2)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
              {mapEmbed ? (
                <div dangerouslySetInnerHTML={{ __html: mapEmbed }} style={{ lineHeight: 0 }} />
              ) : (
                <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 32 }}>📍</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center' }}>
                    Google Maps embed<br /><span style={{ fontSize: 11 }}>Cấu hình trong trang Cài đặt → Liên hệ</span>
                  </div>
                </div>
              )}
              <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{settings['site_name'] || 'Le Bistro Français'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{address}</div>
                </div>
                {address && (
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 500 }}>Chỉ đường →</a>
                )}
              </div>
            </div>

            {/* Message form */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 18, fontStyle: 'italic' }}>Envoyer un message</div>
              {success && <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, marginBottom: 16, fontSize: 14, color: '#166534' }}>{success}</div>}
              {error && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 16, fontSize: 14, color: '#991b1b' }}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7, display: 'block' }}>Nom *</label>
                    <input type="text" className="form-control" placeholder="Họ tên" value={form.name} onChange={e => setF('name', e.target.value)} required
                      style={{ fontSize: 14, fontFamily: 'var(--sans)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7, display: 'block' }}>Email *</label>
                    <input type="email" className="form-control" placeholder="email@example.com" value={form.email} onChange={e => setF('email', e.target.value)} required
                      style={{ fontSize: 14, fontFamily: 'var(--sans)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div className="col-12">
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7, display: 'block' }}>Message</label>
                    <textarea className="form-control" rows={3} placeholder="Câu hỏi, phản hồi, hoặc yêu cầu đặc biệt..." value={form.message} onChange={e => setF('message', e.target.value)}
                      style={{ fontSize: 14, fontFamily: 'var(--sans)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn-ghost" style={{ width: '100%' }} disabled={sending}>
                      {sending ? 'Đang gửi...' : 'Envoyer le message'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
