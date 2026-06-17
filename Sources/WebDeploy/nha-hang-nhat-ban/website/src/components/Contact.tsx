import { useState } from 'react'
import { api } from '../api/client'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Hỏi về đặt bàn', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setResult(null)
    try {
      const res = await api.post<{ ok: boolean; message: string }>('/public/contact', form)
      setResult({ ok: true, msg: res.message })
      setForm({ name: '', phone: '', email: '', subject: 'Hỏi về đặt bàn', message: '' })
    } catch (err: unknown) {
      setResult({ ok: false, msg: err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.' })
    } finally { setSubmitting(false) }
  }

  return (
    <div className="contact-form">
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-1px', marginBottom: '6px' }}>Gửi tin nhắn</h3>
        <p style={{ fontSize: '13px', fontWeight: 300, color: 'var(--text-3)', margin: 0 }}>Chúng tôi sẽ phản hồi trong vòng 4 giờ làm việc.</p>
      </div>
      <form onSubmit={handleSubmit}>
        {result && (
          <div style={{ padding: '12px 16px', marginBottom: '16px', borderRadius: '4px', fontSize: '13px', background: result.ok ? 'var(--accent-light)' : '#fff0f0', color: result.ok ? 'var(--accent)' : '#dc2626', border: `1px solid ${result.ok ? '#c7e9d9' : '#fca5a5'}` }}>
            {result.msg}
          </div>
        )}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="cf-label">Họ và tên</label>
            <input type="text" className="cf-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
          </div>
          <div className="col-md-6">
            <label className="cf-label">Số điện thoại</label>
            <input type="tel" className="cf-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
          </div>
          <div className="col-12">
            <label className="cf-label">Email</label>
            <input type="email" className="cf-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="col-12">
            <label className="cf-label">Chủ đề</label>
            <select className="cf-input" style={{ appearance: 'none', cursor: 'pointer' }} value={form.subject} onChange={e => set('subject', e.target.value)}>
              <option>Hỏi về đặt bàn</option>
              <option>Hỏi về Omakase</option>
              <option>Sự kiện riêng / Private dining</option>
              <option>Hỏi về thực đơn</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="col-12">
            <label className="cf-label">Nội dung</label>
            <textarea className="cf-input" rows={5} style={{ resize: 'vertical' }} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nội dung tin nhắn của bạn..." required />
          </div>
          <div className="col-12">
            <button type="submit" className="btn-accent" style={{ padding: '13px 32px', borderRadius: '2px' }} disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
