import { useState, FormEvent } from 'react'
import { useSite } from '../App'

export default function Contact() {
  const { settings, apiBase } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setErrMsg('Vui lòng điền đầy đủ thông tin.'); return
    }
    setStatus('sending'); setErrMsg('')
    try {
      const res = await fetch(`${apiBase}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('ok')
      setForm({ name: '', phone: '', message: '' })
    } catch {
      setStatus('err')
      setErrMsg('Gửi tin nhắn thất bại. Vui lòng thử lại.')
    }
  }

  const infos = [
    { icon: '📍', label: 'Địa chỉ', value: settings.site_address },
    { icon: '📞', label: 'Hotline', value: settings.site_phone, href: `tel:${settings.site_phone}` },
    { icon: '✉️', label: 'Email', value: settings.site_email, href: `mailto:${settings.site_email}` },
    { icon: '🕐', label: 'Giờ làm việc', value: settings.working_hours },
  ]

  return (
    <div className="row gy-4">
      {/* Contact form */}
      <div className="col-lg-7">
        <div className="lx-form">
          <div className="lx-eyebrow" style={{ marginBottom: 16 }}>Liên hệ với chúng tôi</div>
          <h3 style={{ fontSize: 24, fontWeight: 800, textTransform: 'uppercase', marginBottom: 24, letterSpacing: '-.3px' }}>
            Gửi tin nhắn
          </h3>

          {status === 'ok' ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Đã nhận được tin nhắn của bạn!</div>
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
              <button className="lx-btn lx-btn-accent" style={{ marginTop: 20 }} onClick={() => setStatus('idle')}>Gửi tin nhắn khác</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="lx-field">
                <label htmlFor="ct-name" className="lx-label">Họ &amp; tên <em>*</em></label>
                <input id="ct-name" type="text" className="lx-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
              </div>
              <div className="lx-field">
                <label htmlFor="ct-phone" className="lx-label">Số điện thoại <em>*</em></label>
                <input id="ct-phone" type="tel" className="lx-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
              </div>
              <div className="lx-field">
                <label htmlFor="ct-message" className="lx-label">Nội dung <em>*</em></label>
                <textarea id="ct-message" className="lx-textarea" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Câu hỏi hoặc yêu cầu của bạn..." rows={4} required />
              </div>
              {errMsg && (
                <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '10px 14px', fontSize: 13, marginBottom: 16, borderLeft: '4px solid var(--danger)' }}>
                  {errMsg}
                </div>
              )}
              <button type="submit" className="lx-btn lx-btn-accent lx-form-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Info panel */}
      <div className="col-lg-5">
        <div className="lx-info-panel">
          <div className="lx-info-title">Thông tin<br /><em>Liên hệ</em></div>
          {infos.map((info, i) => (
            <div key={i} className="lx-info-item">
              <div className="lx-info-icon">{info.icon}</div>
              <div className="lx-info-text">
                <strong>{info.label}</strong>
                {info.href
                  ? <a href={info.href} style={{ color: 'rgba(255,255,255,.55)' }}>{info.value}</a>
                  : info.value
                }
              </div>
            </div>
          ))}

          {/* Socials */}
          {(settings.facebook || settings.instagram || settings.zalo) && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Mạng xã hội
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {settings.facebook && settings.facebook !== '#' && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="lx-ft-soc">fb</a>
                )}
                {settings.instagram && settings.instagram !== '#' && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="lx-ft-soc">ig</a>
                )}
                {settings.zalo && settings.zalo !== '#' && (
                  <a href={settings.zalo} target="_blank" rel="noopener noreferrer" className="lx-ft-soc">zl</a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="col-12" data-reveal>
        <div className="lx-map">
          <div className="lx-map-label">
            <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
            <span>Bản đồ — cấu hình Google Maps Embed trong Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
