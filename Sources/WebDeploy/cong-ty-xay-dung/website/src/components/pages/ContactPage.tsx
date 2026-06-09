import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'

export default function ContactPage() {
  const { settings } = useSite()
  const s = settings
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '', message: '' })
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true); setMsg(null)
    try {
      await api.post('/public/contact', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        subject: 'Yêu cầu báo giá',
        message: form.message || `Loại công trình: ${form.type}`,
        project_type: form.type,
      })
      setMsg({ type: 'success', text: 'Yêu cầu của bạn đã được ghi nhận! Chúng tôi sẽ liên hệ sớm nhất.' })
      setForm({ name: '', phone: '', email: '', type: '', message: '' })
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div className="xd-page-hero">
        <div className="wd-container">
          <div className="xd-page-hero-content">
            <div className="xd-breadcrumb">
              <Link to="/" style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Trang chủ</Link>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', margin: '0 6px' }}>/</span>
              <span style={{ fontSize: 12, color: 'var(--accent)' }}>Liên hệ</span>
            </div>
            <div className="xd-ph-eyebrow">Liên hệ & Báo giá</div>
            <h1 className="xd-ph-title">Nhận báo giá<br /><span style={{ color: 'var(--accent)' }}>miễn phí</span></h1>
            <p className="xd-ph-sub">Đội ngũ tư vấn sẽ liên hệ trong vòng 24 giờ.</p>
          </div>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-5">
            {/* Form */}
            <div className="col-12 col-md-7" data-reveal>
              <div className="xd-contact-form-wrap">
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, letterSpacing: -.5 }}>Gửi yêu cầu báo giá</h2>
                {msg && (
                  <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14,
                    background: msg.type === 'success' ? '#e8f4ef' : '#fff0f0',
                    color: msg.type === 'success' ? 'var(--accent)' : '#e24b4a',
                    border: `1px solid ${msg.type === 'success' ? '#c0ddd2' : '#fdd'}` }}>
                    {msg.text}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="xd-form-light-label">Họ và tên *</label>
                      <input className="xd-form-light-input" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="xd-form-light-label">Số điện thoại *</label>
                      <input className="xd-form-light-input" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="xd-form-light-label">Email</label>
                      <input className="xd-form-light-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="xd-form-light-label">Loại công trình</label>
                      <select className="xd-form-light-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                        <option value="">-- Chọn loại --</option>
                        <option>Nhà ở dân dụng</option>
                        <option>Biệt thự / Nhà phố</option>
                        <option>Nhà xưởng / Kho bãi</option>
                        <option>Văn phòng / Thương mại</option>
                        <option>Công trình khác</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="xd-form-light-label">Mô tả yêu cầu</label>
                      <textarea className="xd-form-light-textarea" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Mô tả sơ bộ công trình..." rows={4} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="xd-form-submit" disabled={sending}>
                        {sending ? 'Đang gửi...' : 'Gửi yêu cầu báo giá'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact info */}
            <div className="col-12 col-md-5" data-reveal data-delay="1">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {s['site_address'] && (
                  <div className="xd-contact-card">
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Địa chỉ</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{s['site_address']}</div>
                    {s['working_hours'] && <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}>{s['working_hours']}</div>}
                  </div>
                )}
                {s['site_phone'] && (
                  <div className="xd-contact-card">
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Hotline</div>
                    <a href={`tel:${s['site_phone'].replace(/\s/g, '')}`} className="xd-hotline" style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', letterSpacing: -1, display: 'block' }}>{s['site_phone']}</a>
                  </div>
                )}
                {s['site_email'] && (
                  <div className="xd-contact-card">
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Email</div>
                    <a href={`mailto:${s['site_email']}`} style={{ fontSize: 15, color: 'var(--accent)', fontWeight: 500 }}>{s['site_email']}</a>
                  </div>
                )}
              </div>

              {s['google_map_embed'] && (
                <div style={{ marginTop: 20, borderRadius: 2, overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: s['google_map_embed'] }} />
              )}
            </div>
          </div>
        </div>
      </section>

      {s['social_zalo'] && (
        <a href={`https://zalo.me/${s['social_zalo']}`} className="zalo-float" target="_blank" rel="noopener noreferrer">
          <div className="zalo-float-pulse" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" width="30" height="30" />
        </a>
      )}
    </>
  )
}
