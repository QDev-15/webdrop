import { useState } from 'react'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  useDocumentMeta({ title: 'Liên hệ', description: 'Liên hệ với Shop Thể Thao để được hỗ trợ' })

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ họ tên, email và nội dung')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/public/contacts', form)
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError('Gửi thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tt-page-wrap">
      <div className="tt-container" style={{ padding: '60px 0' }}>
        <h1 style={{ marginBottom: 12 }}>Liên hệ với chúng tôi</h1>
        <p style={{ marginBottom: 40, color: 'var(--text-2)' }}>Chúng tôi sẽ trả lời bạn trong vòng 24 giờ</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1000 }}>
          {/* Contact info */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Thông tin liên hệ</h2>
            <div style={{ marginBottom: 32 }}>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>📍 Địa chỉ</div>
              <div style={{ color: 'var(--text-2)', fontSize: 14 }}>[ĐỊA CHỈ CỬA HÀNG]</div>
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>📞 Điện thoại</div>
              <a href="tel:[SỐ_ĐIỆN_THOẠI]" style={{ color: 'var(--accent)', fontSize: 14 }}>[SỐ_ĐIỆN_THOẠI]</a>
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>✉️ Email</div>
              <a href="mailto:[EMAIL@SPORTTHETAO.VN]" style={{ color: 'var(--accent)', fontSize: 14 }}>[EMAIL@SPORTTHETAO.VN]</a>
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>🕐 Giờ làm việc</div>
              <div style={{ color: 'var(--text-2)', fontSize: 14 }}>T2–T7: 8:00–21:00</div>
              <div style={{ color: 'var(--text-2)', fontSize: 14 }}>CN: 9:00–18:00</div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <form onSubmit={handleSubmit}>
              {submitted && (
                <div style={{ padding: 12, background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                  ✓ Cảm ơn! Chúng tôi sẽ sớm liên hệ lại với bạn.
                </div>
              )}
              {error && (
                <div style={{ padding: 12, background: '#8b1a00', color: '#ff9999', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>Họ tên *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Nguyễn Văn A"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: 6,
                    fontFamily: 'var(--sans)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="email@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: 6,
                    fontFamily: 'var(--sans)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>Số điện thoại</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="0901 234 567"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: 6,
                    fontFamily: 'var(--sans)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>Chủ đề</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                  placeholder="Tư vấn sản phẩm"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: 6,
                    fontFamily: 'var(--sans)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>Nội dung *</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Nội dung tin nhắn..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: 6,
                    fontFamily: 'var(--sans)',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
