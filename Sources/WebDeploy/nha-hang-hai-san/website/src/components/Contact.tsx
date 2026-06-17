import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Props {
  settings: Record<string, string>
}

const emptyForm = { name: '', phone: '', email: '', subject: '', message: '' }

export default function Contact({ settings }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ro: IntersectionObserver | undefined
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal-contact]:not(.visible)')
      ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro!.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro!.observe(el))
    }, 0)
    return () => { clearTimeout(timer); ro?.disconnect() }
  }, [])

  function setField<K extends keyof typeof emptyForm>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.message.trim()) {
      setError('Vui lòng điền họ tên và nội dung liên hệ.')
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

  const phone = settings.site_phone || '0901 234 567'
  const infos = [
    { icon: '📞', label: 'Điện thoại', val: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: '📧', label: 'Email', val: settings.site_email || 'hello@vibienhaisan.vn', href: `mailto:${settings.site_email || 'hello@vibienhaisan.vn'}` },
    { icon: '📍', label: 'Địa chỉ', val: settings.site_address || '123 Đường Nguyễn Trãi, Q.1, TP.HCM', href: undefined },
    { icon: '🕐', label: 'Giờ mở cửa', val: settings.working_hours || 'Thứ 2–CN: 10:00 – 22:00', href: undefined },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5" data-reveal-contact>
          <div className="eyebrow">Liên hệ</div>
          <h2 className="sec-title">Chúng tôi <em>lắng nghe</em></h2>
          <p className="sec-sub">Có câu hỏi về thực đơn, đặt tiệc riêng hay ý kiến đóng góp? Hãy cho chúng tôi biết.</p>
        </div>

        <div className="row g-5">
          <div className="col-lg-4">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {infos.map(info => (
                <div key={info.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{info.label}</div>
                    {info.href
                      ? <a href={info.href} style={{ fontSize: 14, color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>{info.val}</a>
                      : <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{info.val}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, padding: '16px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Kết nối mạng xã hội</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'Facebook', href: settings.social_facebook || '#' },
                  { label: 'Instagram', href: settings.social_instagram || '#' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-2)',
                    textDecoration: 'none', transition: 'all .2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--warm)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                  >{s.label}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(24px, 3vw, 36px)' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Đã nhận tin nhắn!</h3>
                  <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
                    Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                  </p>
                  <button onClick={() => setSuccess(false)} className="btn-accent">Gửi tin khác</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{ padding: '10px 14px', background: 'rgba(226,75,74,.08)', border: '1px solid rgba(226,75,74,.25)', borderRadius: 8, color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
                      {error}
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Họ tên *</label>
                      <input type="text" className="form-control" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Điện thoại</label>
                      <input type="tel" className="form-control" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="0912 345 678" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="email@example.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Chủ đề</label>
                      <select className="form-control" value={form.subject} onChange={e => setField('subject', e.target.value)}>
                        <option value="">Chọn chủ đề...</option>
                        <option value="menu">Hỏi về thực đơn & giá</option>
                        <option value="party">Đặt tiệc nhóm lớn</option>
                        <option value="feedback">Góp ý chất lượng</option>
                        <option value="partner">Hợp tác kinh doanh</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Nội dung *</label>
                      <textarea className="form-control" value={form.message} onChange={e => setField('message', e.target.value)} placeholder="Nhập nội dung liên hệ..." rows={5} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn-accent" disabled={submitting} style={{ padding: '12px 32px', fontSize: 14 }}>
                        {submitting ? 'Đang gửi...' : 'Gửi liên hệ'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
