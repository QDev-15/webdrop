import { useState, type FormEvent } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const phone   = settings.site_phone   || '028 3822 XXXX'
  const email   = settings.site_email   || 'lienhe@chinhnhasaigon.vn'
  const address = settings.site_address || '123 Nguyễn Văn Trỗi, P.12, Q. Phú Nhuận, TP.HCM'
  const hours   = settings.working_hours|| 'T2–T7: 8:00–20:00 · CN: 8:00–12:00'
  const mapEmbed= settings.map_embed    || ''

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.message) { setError('Vui lòng nhập họ tên và nội dung.'); return }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Info cards */}
      <div className="cn-info-grid" data-reveal>
        <div className="cn-info-card">
          <div className="cn-info-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <div className="cn-info-title">Địa chỉ</div>
            <div className="cn-info-text">{address}</div>
          </div>
        </div>
        <div className="cn-info-card">
          <div className="cn-info-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
          </div>
          <div>
            <div className="cn-info-title">Điện thoại</div>
            <div className="cn-info-text"><a href={`tel:${phone.replace(/\s/g,'')}`} style={{ color: 'var(--accent)' }}>{phone}</a></div>
          </div>
        </div>
        <div className="cn-info-card">
          <div className="cn-info-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
          </div>
          <div>
            <div className="cn-info-title">Giờ làm việc</div>
            <div className="cn-info-text">{hours}</div>
          </div>
        </div>
      </div>

      {/* Form + map */}
      <div className="cn-form-wrap" data-reveal>
        <div className="cn-form-side">
          <div className="cn-form-side-inner">
            <h3 className="cn-form-side-title">Gửi tin nhắn cho chúng tôi</h3>
            <p className="cn-form-side-text">Có thắc mắc về dịch vụ hoặc cần tư vấn? Điền form bên cạnh, đội ngũ sẽ phản hồi trong vòng 2–4 giờ làm việc.</p>
            <div className="cn-form-info-item">
              <div className="cn-form-info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M4 6l8 6 8-6"/></svg>
              </div>
              <div>
                <div className="cn-form-info-label">Email</div>
                <div className="cn-form-info-value">{email}</div>
              </div>
            </div>
          </div>
        </div>

        {success ? (
          <div className="cn-form-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '36px', color: 'var(--accent)' }}>✓</div>
            <h4 style={{ fontWeight: 700 }}>Gửi thành công!</h4>
            <p style={{ color: 'var(--text-2)', textAlign: 'center' }}>Chúng tôi sẽ phản hồi bạn sớm nhất có thể.</p>
          </div>
        ) : (
          <form className="cn-form-main" onSubmit={handleSubmit}>
            {error && <div style={{ background: '#fef2f2', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '3px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
            <div className="cn-form-row">
              <div className="cn-form-group">
                <label className="cn-form-label" htmlFor="ct-name">Họ tên <span style={{ color: 'var(--accent)' }}>*</span></label>
                <input id="ct-name" className="cn-form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="cn-form-group">
                <label className="cn-form-label" htmlFor="ct-phone">Số điện thoại</label>
                <input id="ct-phone" className="cn-form-control" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div className="cn-form-group">
              <label className="cn-form-label" htmlFor="ct-email">Email</label>
              <input id="ct-email" className="cn-form-control" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="cn-form-group">
              <label className="cn-form-label" htmlFor="ct-subject">Chủ đề</label>
              <input id="ct-subject" className="cn-form-control" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Tư vấn Invisalign..." />
            </div>
            <div className="cn-form-group">
              <label className="cn-form-label" htmlFor="ct-message">Nội dung <span style={{ color: 'var(--accent)' }}>*</span></label>
              <textarea id="ct-message" className="cn-form-control" rows={4} value={form.message} onChange={e => set('message', e.target.value)} required />
            </div>
            <button type="submit" className="cn-btn cn-btn-primary cn-btn-block" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        )}
      </div>

      {/* Map */}
      {mapEmbed && (
        <div className="cn-map-wrap" style={{ marginTop: '40px' }} data-reveal>
          <iframe src={mapEmbed} width="100%" height="380" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" title="Bản đồ" />
        </div>
      )}
    </>
  )
}
