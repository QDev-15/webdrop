import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TOPICS = [
  'Tư vấn chọn sản phẩm',
  'Hỗ trợ bảo hành / đổi trả',
  'Đặt thiết kế theo yêu cầu',
  'Khác',
]

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Liên hệ — VIOLETTE Fine Jewelry',
    description: 'Liên hệ VIOLETTE Fine Jewelry để được tư vấn chọn trang sức, đặt lịch xem sản phẩm tại cửa hàng hoặc hỗ trợ bảo hành.',
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: TOPICS[0], message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm({ name: '', phone: '', email: '', subject: TOPICS[0], message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="tr-contact-wrap">
      <div className="tr-container">
        <div className="tr-breadcrumb" style={{ marginBottom: 26 }}><Link to="/">Trang chủ</Link> / <span>Liên hệ</span></div>
        <div className="tr-sec-head" data-reveal>
          <div className="tr-eyebrow">Kết nối với chúng tôi</div>
          <h1 className="tr-sec-title">Liên hệ <em>VIOLETTE</em></h1>
          <p className="tr-sec-sub">Đội ngũ tư vấn viên VIOLETTE luôn sẵn sàng hỗ trợ bạn chọn món trang sức phù hợp nhất.</p>
        </div>

        <div className="tr-contact-grid">
          {sent ? (
            <div data-reveal>
              <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Cảm ơn bạn! VIOLETTE sẽ liên hệ lại trong thời gian sớm nhất.</p>
            </div>
          ) : (
            <form data-reveal onSubmit={handleSubmit}>
              {error && <p style={{ color: 'var(--danger)', marginBottom: 16, fontSize: 13.5 }}>{error}</p>}
              <div className="tr-form-group"><label htmlFor="cName">Họ và tên</label><input type="text" id="cName" required value={form.name} onChange={e => set('name', e.target.value)} /></div>
              <div className="row">
                <div className="col-md-6"><div className="tr-form-group"><label htmlFor="cPhone">Số điện thoại</label><input type="tel" id="cPhone" required value={form.phone} onChange={e => set('phone', e.target.value)} /></div></div>
                <div className="col-md-6"><div className="tr-form-group"><label htmlFor="cEmail">Email</label><input type="email" id="cEmail" value={form.email} onChange={e => set('email', e.target.value)} /></div></div>
              </div>
              <div className="tr-form-group">
                <label htmlFor="cSubject">Chủ đề</label>
                <select id="cSubject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="tr-form-group"><label htmlFor="cMessage">Nội dung</label><textarea id="cMessage" required value={form.message} onChange={e => set('message', e.target.value)}></textarea></div>
              <button type="submit" className="tr-btn tr-btn-fill" disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi liên hệ'}</button>
            </form>
          )}

          <div data-reveal>
            <div className="tr-contact-info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <div>
                <h4>Cửa hàng trưng bày</h4>
                <p>{settings.site_address || '25 Đồng Khởi, Quận 1, TP.HCM'}</p>
                <p>{settings.site_address_hn || '15 Tràng Tiền, Hoàn Kiếm, Hà Nội'}</p>
              </div>
            </div>
            <div className="tr-contact-info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" /></svg>
              <div><h4>Điện thoại / Zalo</h4><a href={`tel:${(settings.site_phone || '19002726').replace(/\s/g, '')}`}>{settings.site_phone || '1900 2726'}</a></div>
            </div>
            <div className="tr-contact-info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <div><h4>Email</h4><a href={`mailto:${settings.site_email || 'hello@violette.vn'}`}>{settings.site_email || 'hello@violette.vn'}</a></div>
            </div>
            <div className="tr-contact-info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <div><h4>Giờ mở cửa</h4><p>{settings.working_hours || 'Thứ 2 – Chủ nhật: 9:00 – 20:00'}</p></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
