import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function Contact() {
  const { settings } = useSite()
  const s = settings
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Đặt bàn', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.message) { setError('Vui lòng điền họ tên và nội dung.'); return }
    setSubmitting(true)
    try {
      await api.post('/public/contact', form)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="row g-5">
      <div className="col-md-5 reveal">
        <div className="eyebrow">Thông tin</div>
        <h2 className="sec-title mb-4">Ghé thăm <em>chúng tôi</em></h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { icon: '📍', label: 'Địa chỉ', value: s.site_address || '[Địa chỉ nhà hàng]' },
            { icon: '📱', label: 'Điện thoại', value: [s.site_phone, s.site_phone_2].filter(Boolean).join(' · ') },
            { icon: '✉️', label: 'Email', value: s.site_email },
            { icon: '🕐', label: 'Giờ mở cửa', value: s.working_hours || 'Trưa: 10:00 – 14:00 | Tối: 17:30 – 22:00' },
            { icon: '🚗', label: 'Bãi đỗ xe', value: s.parking_info || 'Miễn phí · 50 chỗ · Có bảo vệ' },
          ].filter(item => item.value).map(item => (
            <div key={item.label} style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 300, lineHeight: 1.6 }}>
                  {item.value?.split('|').map((v, i) => <span key={i}>{i > 0 && <br />}{v.trim()}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-md-7 reveal reveal-d1">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(24px,4vw,36px)' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.4px', marginBottom: 4 }}>Gửi tin nhắn</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 300, marginBottom: 22 }}>Hỏi về thực đơn, tiệc nhóm, hay bất kỳ điều gì — chúng tôi trả lời trong 1 giờ.</div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Đã gửi!</div>
              <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300 }}>Chúng tôi sẽ liên hệ lại trong 1 giờ làm việc.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Họ và tên *</label>
                  <input type="text" className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nguyễn Văn A" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Số điện thoại *</label>
                  <input type="tel" className="form-control" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="0901 234 567" />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Loại yêu cầu</label>
                  <select className="form-control form-select" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                    <option>Đặt bàn</option>
                    <option>Hỏi về thực đơn</option>
                    <option>Tiệc nhóm / sự kiện</option>
                    <option>Phản hồi dịch vụ</option>
                    <option>Hợp tác</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Nội dung</label>
                  <textarea className="form-control" rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Mô tả yêu cầu của bạn..." required />
                </div>
                {error && <div className="col-md-12"><div className="alert-error">{error}</div></div>}
                <div className="col-md-12">
                  <button type="submit" className="btn-accent w-100" style={{ padding: '13px', fontSize: 14 }} disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
