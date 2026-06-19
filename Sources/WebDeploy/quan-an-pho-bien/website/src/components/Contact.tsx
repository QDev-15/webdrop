import { useState } from 'react'
import { api } from '../api/client'

interface FormData {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: '', phone: '', email: '', subject: 'Đặt món / Hỏi thông tin', message: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.message.trim()) { setError('Vui lòng điền tên và nội dung.'); return }
    setSending(true)
    try {
      await api.post('/public/contact', form)
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div style={{ padding: '48px 32px', textAlign: 'center', background: 'var(--accent-light)', border: '1px solid rgba(217,119,6,.2)', borderRadius: 16 }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Gửi thành công!</h3>
        <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300 }}>Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.</p>
        <button onClick={() => { setDone(false); setForm({ name: '', phone: '', email: '', subject: 'Đặt món / Hỏi thông tin', message: '' }) }} className="btn-accent" style={{ marginTop: 16, fontSize: 13 }}>Gửi thêm</button>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-.4px', marginBottom: 4 }}>Nhắn tin cho quán</h3>
      <p style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 300, marginBottom: 20 }}>Đặt món, hỏi giá, hoặc bất kỳ điều gì — chúng tôi luôn sẵn sàng phản hồi.</p>

      {error && (
        <div style={{ padding: '10px 14px', background: '#fff0f0', border: '1px solid #fdd', borderRadius: 8, fontSize: 13, color: 'var(--danger)', marginBottom: 16 }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-6">
            <label className="form-label">Họ tên *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
          </div>
          <div className="col-6">
            <label className="form-label">Số điện thoại</label>
            <input type="tel" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
          </div>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="col-12">
            <label className="form-label">Chủ đề</label>
            <select className="form-select" value={form.subject} onChange={e => set('subject', e.target.value)}>
              <option>Đặt món / Hỏi thông tin</option>
              <option>Đặt chỗ ăn nhóm</option>
              <option>Hợp tác / Giao hàng</option>
              <option>Góp ý / Phản hồi</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Nội dung *</label>
            <textarea className="form-control" rows={4} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nhập nội dung tin nhắn..." required />
          </div>
          <div className="col-12">
            <button type="submit" className="btn-accent w-100" disabled={sending}>
              {sending ? 'Đang gửi...' : 'Gửi tin nhắn →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
