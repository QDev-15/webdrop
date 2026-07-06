import { useState } from 'react'
import { api } from '../api/client'

export default function Contact() {

  const [form, setForm] = useState({ name: '', phone: '', email: '', topic: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) { setError('Vui lòng điền đầy đủ thông tin bắt buộc'); return }
    setSending(true); setError('')
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm({ name: '', phone: '', email: '', topic: '', message: '' })
    } catch {
      setError('Gửi thất bại, vui lòng thử lại sau.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="sb-contact-form">
      <h3>Gửi tin nhắn</h3>
      {sent ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Cảm ơn bạn!</p>
          <p style={{ color: 'var(--text-2)', fontWeight: 300 }}>Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
          <button className="sb-btn sb-btn-outline" style={{ marginTop: 24 }} onClick={() => setSent(false)}>Gửi tin nhắn khác</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 14 }}>{error}</div>}
          <div className="sb-form-row">
            <div className="sb-form-group">
              <label htmlFor="ct-name">Họ tên *</label>
              <input id="ct-name" type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
            </div>
            <div className="sb-form-group">
              <label htmlFor="ct-phone">Số điện thoại *</label>
              <input id="ct-phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
            </div>
          </div>
          <div className="sb-form-group">
            <label htmlFor="ct-email">Email</label>
            <input id="ct-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="sb-form-group">
            <label htmlFor="ct-topic">Chủ đề</label>
            <select id="ct-topic" value={form.topic} onChange={e => set('topic', e.target.value)}>
              <option value="">-- Chọn chủ đề --</option>
              <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
              <option value="Theo dõi đơn hàng">Theo dõi đơn hàng</option>
              <option value="Đổi trả hàng">Đổi trả hàng</option>
              <option value="Mua sỉ">Mua sỉ</option>
              <option value="Vấn đề khác">Vấn đề khác</option>
            </select>
          </div>
          <div className="sb-form-group">
            <label htmlFor="ct-msg">Nội dung *</label>
            <textarea id="ct-msg" rows={4} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nhập nội dung cần tư vấn..." required />
          </div>
          <button type="submit" className="sb-submit-btn" disabled={sending}>
            {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
          </button>
        </form>
      )}
    </div>
  )
}
