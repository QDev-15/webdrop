import { useState, type ChangeEvent, type FormEvent, type CSSProperties } from 'react'
import { api } from '../../api/client'
import { useSite } from '../../contexts/SiteContext'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ContactPage() {
  const { settings } = useSite()
  usePageTitle('Liên hệ', `Liên hệ với ${settings.site_name || 'chúng tôi'} — góp ý, hợp tác hoặc trao đổi về bài viết.`)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const res = await api.post<{ message: string }>('/public/contact', form)
      setSuccess(res.message)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '60vh' }}>
      <div className="wd-container" style={{ maxWidth: '720px' }}>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: '600', letterSpacing: '-.5px', marginBottom: '8px' }}>
          Liên hệ
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '15px', fontWeight: '300', marginBottom: '40px' }}>
          Có câu hỏi hay ý kiến gì? Gửi tin nhắn cho tôi.
        </p>

        {settings.site_email && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '20px' }}>✉️</span>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '2px' }}>Email</div>
              <a href={`mailto:${settings.site_email}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '500' }}>
                {settings.site_email}
              </a>
            </div>
          </div>
        )}

        {success ? (
          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--accent)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <p style={{ color: 'var(--accent)', fontWeight: '500', fontSize: '15px' }}>{success}</p>
            <button
              onClick={() => setSuccess('')}
              style={{ marginTop: '16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: '500' }}
            >
              Gửi tin nhắn khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', marginBottom: '6px' }}>
                  Họ tên <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Nguyễn Văn A"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', marginBottom: '6px' }}>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', marginBottom: '6px' }}>Số điện thoại</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0912 345 678"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', marginBottom: '6px' }}>Chủ đề</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Chủ đề tin nhắn"
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', marginBottom: '6px' }}>
                Nội dung <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Nội dung tin nhắn..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
              />
            </div>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fff0f0', color: 'var(--danger)', fontSize: '13px', border: '1px solid #fdd' }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn-accent" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
              {submitting ? 'Đang gửi...' : 'Gửi tin nhắn →'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

const inputStyle: CSSProperties = {
  width: '100%',
  fontFamily: 'var(--sans)',
  fontSize: '14px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '9px 12px',
  background: 'var(--surface)',
  color: 'var(--text)',
  outline: 'none',
  transition: 'border-color .2s',
}
