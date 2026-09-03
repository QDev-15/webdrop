import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Liên hệ — MỘC AN',
    description: 'Liên hệ MỘC AN — tư vấn nội thất, đặt lịch xem showroom, hỗ trợ đo đạc tận nhà. Showroom tại TP.HCM, giao hàng toàn quốc.',
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Tư vấn sản phẩm', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const phone = settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'
  const email = settings.site_email || '[EMAIL]'
  const address = settings.site_address || '[ĐỊA CHỈ SHOWROOM]'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
      setForm({ name: '', phone: '', email: '', subject: 'Tư vấn sản phẩm', message: '' })
      setTimeout(() => setSuccess(false), 4000)
    } catch {
      setError('Gửi thất bại, vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="nt-sec" style={{ paddingTop: 'calc(var(--topbar-h) + var(--nav-h) + 56px)' }}>
      <div className="nt-container">
        <div className="nt-sec-head">
          <div className="nt-eyebrow">Liên hệ</div>
          <h1 className="nt-sec-title">Cùng trò chuyện về <em>không gian của bạn</em></h1>
          <p className="nt-sec-sub">Ghé thăm showroom hoặc để lại lời nhắn — đội ngũ tư vấn MỘC AN sẽ phản hồi trong vòng 24 giờ.</p>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 22, height: 22, color: 'var(--accent)', flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <div><strong>Showroom chính</strong><p style={{ color: 'var(--text-2)', marginTop: 4 }}>{address}</p></div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 22, height: 22, color: 'var(--accent)', flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
              <div><strong>Hotline</strong><p style={{ color: 'var(--text-2)', marginTop: 4 }}><a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit' }}>{phone}</a> (8:30 – 20:00 mỗi ngày)</p></div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 22, height: 22, color: 'var(--accent)', flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <div><strong>Email hỗ trợ</strong><p style={{ color: 'var(--text-2)', marginTop: 4 }}><a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a></p></div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 22, height: 22, color: 'var(--accent)', flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <div><strong>Giờ mở cửa showroom</strong><p style={{ color: 'var(--text-2)', marginTop: 4 }}>{settings.working_hours || 'Thứ 2 – Chủ nhật: 8:30 – 20:00'}</p></div>
            </div>
          </div>

          <div className="col-lg-7">
            <form onSubmit={handleSubmit}>
              {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
              <div className="row g-3">
                <div className="col-sm-6 nt-field"><label htmlFor="ctName">Họ và tên</label><input type="text" id="ctName" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
                <div className="col-sm-6 nt-field"><label htmlFor="ctPhone">Số điện thoại</label><input type="tel" id="ctPhone" value={form.phone} onChange={e => set('phone', e.target.value)} required /></div>
              </div>
              <div className="nt-field"><label htmlFor="ctEmail">Email</label><input type="email" id="ctEmail" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
              <div className="nt-field">
                <label htmlFor="ctSubject">Chủ đề</label>
                <select id="ctSubject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                  <option>Tư vấn sản phẩm</option>
                  <option>Đặt lịch xem showroom</option>
                  <option>Hỗ trợ đo đạc tận nhà</option>
                  <option>Khiếu nại / bảo hành</option>
                  <option>Khác</option>
                </select>
              </div>
              <div className="nt-field"><label htmlFor="ctMsg">Nội dung</label><textarea id="ctMsg" value={form.message} onChange={e => set('message', e.target.value)} required /></div>
              <button type="submit" className="nt-btn" disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi liên hệ'}</button>
              {success && <p style={{ display: 'block', color: 'var(--ok)', fontSize: 13, marginTop: 14 }}>✓ Cảm ơn bạn! Đội ngũ MỘC AN sẽ liên hệ lại trong vòng 24 giờ.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
