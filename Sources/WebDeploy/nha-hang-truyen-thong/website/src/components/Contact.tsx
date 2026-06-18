import { useState, useEffect, useRef } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function Contact() {
  const { settings: s } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = ref.current?.querySelectorAll<Element>('.reveal:not(.visible)') ?? []
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await api.post('/public/contact', {
        name:    form.name,
        phone:   form.phone,
        message: form.message,
        subject: 'Liên hệ từ website',
      })
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }} ref={ref}>
      <div className="wd-container">
        {/* Info grid */}
        <div className="row g-3 mb-5">
          {[
            { icon: '📍', label: 'Địa chỉ', value: s.site_address || '', sub: '' },
            { icon: '📱', label: 'Điện thoại', value: s.site_phone || '0901 234 567', sub: 'Hotline 9:00 – 22:00' },
            { icon: '✉️', label: 'Email', value: s.site_email || '', sub: 'Phản hồi trong 4–8 giờ' },
            { icon: '🕐', label: 'Giờ mở cửa', value: '10:00 – 22:00', sub: 'Thứ Hai đến Chủ Nhật' },
          ].map(info => (
            <div key={info.label} className="col-md-3 col-sm-6 reveal">
              <div className="contact-info-item">
                <div className="ci-icon">{info.icon}</div>
                <div>
                  <div className="ci-label">{info.label}</div>
                  <div className="ci-value">{info.value}</div>
                  {info.sub && <div className="ci-sub">{info.sub}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Map */}
          <div className="col-lg-8 reveal">
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 16, letterSpacing: '-.4px' }}>Bản đồ chỉ đường</h3>
            <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 14, aspectRatio: '16/7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {s.google_map_embed ? (
                <div dangerouslySetInnerHTML={{ __html: s.google_map_embed }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: 40 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
                  <div style={{ fontSize: 14, fontWeight: 300 }}>{s.site_address || 'Xem địa chỉ trong phần cài đặt'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Contact form */}
          <div className="col-lg-4 reveal reveal-d1">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Gửi tin nhắn</div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input type="text" className="form-control" placeholder="Tên của bạn" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input type="tel" className="form-control" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nội dung</label>
                  <textarea className="form-control" rows={4} placeholder="Câu hỏi hoặc yêu cầu của bạn..." value={form.message} onChange={e => set('message', e.target.value)} required />
                </div>

                {success && (
                  <div style={{ padding: '10px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--accent)', marginBottom: 12, fontWeight: 500 }}>
                    ✓ Đã gửi! Chúng tôi sẽ liên hệ lại sớm nhất.
                  </div>
                )}
                {error && (
                  <div style={{ padding: '10px', background: '#fff0f0', borderRadius: 8, fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{error}</div>
                )}
                {!success && (
                  <button type="submit" disabled={sending}
                    style={{ padding: '13px 32px', fontSize: 14, fontWeight: 500, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all .2s', opacity: sending ? .7 : 1 }}>
                    {sending ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
