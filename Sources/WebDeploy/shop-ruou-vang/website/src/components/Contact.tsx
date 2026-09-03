import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TOPICS = [
  'Tư vấn chọn rượu vang',
  'Đặt set quà tặng doanh nghiệp',
  'Hợp tác phân phối / đại lý',
  'Khiếu nại / đổi trả',
  'Khác',
]

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Liên hệ — Mộc Vang',
    description: 'Liên hệ Mộc Vang để được tư vấn chọn rượu vang, đặt hàng số lượng lớn hoặc set quà tặng doanh nghiệp.',
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
    <>
      <section className="rv-page-hero">
        <div className="rv-page-hero-bg"><img src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1600&auto=format&fit=crop&q=80" alt="" /></div>
        <div className="wd-container rv-page-hero-content">
          <div className="rv-eyebrow">Kết nối với Mộc Vang</div>
          <h1>Liên hệ</h1>
          <p>Cần tư vấn chọn vang, đặt set quà tặng doanh nghiệp hay hợp tác phân phối? Đội ngũ Mộc Vang luôn sẵn sàng hỗ trợ.</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-5" data-reveal>
              <div className="rv-eyebrow">Thông tin cửa hàng</div>
              <h2 className="rv-sec-title" style={{ fontSize: 28, marginBottom: 24 }}>Ghé thăm <span>showroom</span></h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div className="rv-trust-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg></div>
                  <div><strong style={{ display: 'block', marginBottom: 3 }}>Showroom</strong><span style={{ color: 'var(--text-2)', fontSize: 14 }}>{settings.site_address || '88 Đường Đồng Khởi, Quận 1, TP. Hồ Chí Minh'}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div className="rv-trust-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2Z" /></svg></div>
                  <div><strong style={{ display: 'block', marginBottom: 3 }}>Hotline đặt hàng</strong><span style={{ color: 'var(--text-2)', fontSize: 14 }}>{settings.site_phone || '1900 6868'} (8:00 – 21:00 hàng ngày)</span></div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div className="rv-trust-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16v16H4Z" /><path d="m4 6 8 7 8-7" /></svg></div>
                  <div><strong style={{ display: 'block', marginBottom: 3 }}>Email</strong><span style={{ color: 'var(--text-2)', fontSize: 14 }}>{settings.site_email || 'hello@mocvang.vn'}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div className="rv-trust-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 2h6" /></svg></div>
                  <div><strong style={{ display: 'block', marginBottom: 3 }}>Giờ mở cửa</strong><span style={{ color: 'var(--text-2)', fontSize: 14 }}>{settings.working_hours || 'Thứ 2 – Chủ nhật: 9:00 – 21:00'}</span></div>
                </div>
              </div>
              <div className="rv-notice-box" style={{ marginTop: 28 }}>
                <strong>Lưu ý:</strong> theo quy định, chúng tôi chỉ tư vấn và giao hàng cho khách hàng từ đủ 18 tuổi trở lên. Vui lòng chuẩn bị giấy tờ tùy thân khi nhận hàng.
              </div>
            </div>
            <div className="col-lg-7" data-reveal data-delay="1">
              {sent ? (
                <div className="rv-notice-box">
                  <strong>Cảm ơn bạn!</strong> Mộc Vang sẽ liên hệ lại trong thời gian sớm nhất.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}
                  <div className="row g-3">
                    <div className="col-md-6 rv-field">
                      <label htmlFor="cfName">Họ và tên</label>
                      <input type="text" id="cfName" required value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div className="col-md-6 rv-field">
                      <label htmlFor="cfPhone">Số điện thoại</label>
                      <input type="tel" id="cfPhone" required value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                    <div className="col-12 rv-field">
                      <label htmlFor="cfEmail">Email</label>
                      <input type="email" id="cfEmail" required value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div className="col-12 rv-field">
                      <label htmlFor="cfTopic">Chủ đề</label>
                      <select id="cfTopic" value={form.subject} onChange={e => set('subject', e.target.value)}>
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-12 rv-field">
                      <label htmlFor="cfMsg">Nội dung</label>
                      <textarea id="cfMsg" required value={form.message} onChange={e => set('message', e.target.value)}></textarea>
                    </div>
                  </div>
                  <button type="submit" className="rv-btn rv-btn-solid" disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
