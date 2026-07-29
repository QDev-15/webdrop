import { useState } from 'react'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useSite } from '../contexts/SiteContext'

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({ title: 'Liên hệ — KidZone Shop Đồ Chơi' })

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ tất cả các trường bắt buộc')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi tin nhắn thất bại, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dc-page-wrap">
      <div className="dc-page-hero">
        <div className="dc-container">
          <h1>Liên hệ chúng tôi</h1>
          <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
        </div>
      </div>

      <div className="dc-contact-wrap" style={{ padding: '64px 0' }}>
        <div className="dc-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginBottom: 64 }}>
            <div style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>📍</div>
              <h3 style={{ marginBottom: 8 }}>Địa chỉ</h3>
              <p style={{ color: 'var(--text-2)', marginBottom: 0 }}>{settings['site_address'] || '[Địa chỉ]'}</p>
            </div>
            <div style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>📞</div>
              <h3 style={{ marginBottom: 8 }}>Điện thoại</h3>
              <p style={{ color: 'var(--text-2)', marginBottom: 0 }}>
                <a href={`tel:${settings['site_phone'] || '[0901234567]'}`} style={{ color: 'var(--accent)' }}>
                  {settings['site_phone'] || '[0901234567]'}
                </a>
              </p>
            </div>
            <div style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>✉️</div>
              <h3 style={{ marginBottom: 8 }}>Email</h3>
              <p style={{ color: 'var(--text-2)', marginBottom: 0 }}>
                <a href={`mailto:${settings['site_email'] || '[email@example.com]'}`} style={{ color: 'var(--accent)' }}>
                  {settings['site_email'] || '[email@example.com]'}
                </a>
              </p>
            </div>
          </div>

          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Gửi tin nhắn cho chúng tôi</h2>
            {error && <div style={{ padding: 12, marginBottom: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 8 }}>{error}</div>}
            {success && <div style={{ padding: 12, marginBottom: 16, background: '#dcfce7', color: '#166534', borderRadius: 8 }}>✓ Cảm ơn! Chúng tôi sẽ liên hệ bạn sớm.</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Họ tên *</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Số điện thoại *</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Chủ đề</label>
                <input type="text" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Chủ đề tin nhắn" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Tin nhắn *</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nội dung tin nhắn..." rows={5} required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'inherit' }} />
              </div>
              <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
