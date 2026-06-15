import { useState, useEffect } from 'react'
import { api } from '../api/client'
import { Settings } from '../App'

interface Props {
  settings: Settings
}

export default function Contact({ settings }: Props) {
  const email = settings.site_email || 'hello@youremail.com'
  const address = settings.site_address || 'TP. Hồ Chí Minh, Việt Nam'
  const status = settings.about_status || 'Sẵn sàng nhận dự án mới'
  const linkedin = settings.social_linkedin || ''
  const github = settings.social_github || ''
  const behance = settings.social_behance || ''
  const dribbble = settings.social_dribbble || ''

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.message) { setError('Vui lòng điền họ tên và nội dung.'); return }
    setSending(true); setError('')
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="sec-pad" id="lien-he">
      <div className="wd-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <div className="eyebrow reveal">Liên hệ</div>
            <h2 className="sec-title reveal" style={{ color: '#fff' }}>Cùng tạo ra<br />điều <em>tuyệt vời.</em></h2>
            <p className="sec-sub reveal reveal-d1" style={{ color: 'rgba(255,255,255,.35)' }}>
              Tôi luôn mở cửa với những dự án thú vị. Dù là freelance hay full-time — hãy nhắn tin cho tôi.
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }} className="reveal reveal-d2">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✉</div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 2 }}>Email</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)' }}>{email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>📍</div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 2 }}>Địa điểm</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)' }}>{address}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(44,155,115,.15)', border: '1px solid rgba(44,155,115,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, color: '#4ade80' }}>●</div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 2 }}>Trạng thái</div>
                  <div style={{ fontSize: 14, color: '#4ade80' }}>{status}</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24 }} className="reveal">
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 10 }}>Mạng xã hội</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-link">in</a>}
                {github && <a href={github} target="_blank" rel="noopener noreferrer" className="social-link">gh</a>}
                {behance && <a href={behance} target="_blank" rel="noopener noreferrer" className="social-link">be</a>}
                {dribbble && <a href={dribbble} target="_blank" rel="noopener noreferrer" className="social-link">dr</a>}
              </div>
            </div>
          </div>
          <div>
            <div style={{ background: '#111009', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 'clamp(24px,4vw,40px)' }} className="reveal">
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#4ade80', marginBottom: 8 }}>Đã gửi thành công!</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,.4)' }}>Tôi sẽ phản hồi trong vòng 24h.</div>
                  <button
                    onClick={() => setSent(false)}
                    style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,.4)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div style={{ gridColumn: 'span 1' }}>
                      <label className="form-label">Tên của bạn</label>
                      <input
                        type="text" className="form-control" placeholder="Nguyễn Văn A"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                      />
                    </div>
                    <div style={{ gridColumn: 'span 1' }}>
                      <label className="form-label">Email</label>
                      <input
                        type="email" className="form-control" placeholder="email@example.com"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label className="form-label">Loại dự án</label>
                    <select
                      className="form-control"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">-- Chọn loại dự án --</option>
                      <option>UI/UX Design</option>
                      <option>Website / Landing page</option>
                      <option>Mobile App Design</option>
                      <option>Branding</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Mô tả dự án</label>
                    <textarea
                      className="form-control" placeholder="Mô tả ngắn về dự án, ngân sách và timeline dự kiến..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required
                    />
                  </div>
                  {error && (
                    <div style={{ padding: '10px 14px', background: 'rgba(226,75,74,.15)', border: '1px solid rgba(226,75,74,.3)', borderRadius: 8, fontSize: 13, color: '#f87171', marginBottom: 12 }}>
                      {error}
                    </div>
                  )}
                  <button type="submit" className="btn-accent" disabled={sending} style={{ width: '100%', textAlign: 'center', padding: 14 }}>
                    {sending ? 'Đang gửi...' : 'Gửi yêu cầu →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(min-width:992px){
          #lien-he .wd-container > div { grid-template-columns: 5fr 7fr !important; }
        }
      `}</style>
    </section>
  )
}
