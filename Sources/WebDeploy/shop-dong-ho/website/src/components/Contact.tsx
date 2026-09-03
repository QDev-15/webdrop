import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Liên hệ — MERIDIAN',
    description: 'Liên hệ MERIDIAN — đồng hồ chính hãng đa thương hiệu. Showroom tại TP.HCM, Hà Nội, Đà Nẵng, phản hồi trong 30 phút giờ hành chính.',
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Tư vấn sản phẩm', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const phone = settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'
  const email = settings.site_email || '[EMAIL]'
  const address = settings.site_address || '[ĐỊA CHỈ SHOWROOM]'
  const mapUrl = settings.map_embed_url || 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed'

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
      setError('Gửi liên hệ thất bại, vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="dh-catalog-header">
        <div className="dh-container">
          <div className="dh-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Liên hệ</span></div>
          <h1>Liên hệ với MERIDIAN</h1>
          <p>Chúng tôi luôn sẵn sàng tư vấn — phản hồi trong vòng 30 phút giờ hành chính</p>
        </div>
      </section>

      <section className="dh-sec">
        <div className="dh-container">
          <div className="dh-contact-wrap">
            <div className="dh-contact-form" data-reveal>
              <h3 style={{ fontSize: 22, marginBottom: 22 }}>Gửi câu hỏi cho chúng tôi</h3>
              {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
              {success && <p style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 14 }}>✓ Gửi liên hệ thành công! MERIDIAN sẽ phản hồi sớm nhất.</p>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="dhName">Họ và tên</label>
                    <input type="text" className="form-control" id="dhName" value={form.name} onChange={e => set('name', e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dhPhone">Số điện thoại</label>
                    <input type="tel" className="form-control" id="dhPhone" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="dhEmail">Email</label>
                    <input type="email" className="form-control" id="dhEmail" value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="dhSubject">Chủ đề</label>
                    <select className="form-select" id="dhSubject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                      <option>Tư vấn sản phẩm</option>
                      <option>Chính sách bảo hành</option>
                      <option>Khiếu nại / đổi trả</option>
                      <option>Hợp tác kinh doanh</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="dhMessage">Nội dung</label>
                    <textarea className="form-control" id="dhMessage" rows={5} value={form.message} onChange={e => set('message', e.target.value)} required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="dh-btn dh-btn-solid" style={{ width: '100%' }} disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi liên hệ'}</button>
                  </div>
                </div>
              </form>
            </div>

            <div data-reveal data-reveal-d1>
              <div className="dh-contact-info-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <div><h5>Showroom TP.HCM</h5><p>{address}</p></div>
              </div>
              <div className="dh-contact-info-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                <div><h5>Hotline</h5><p>{phone} (7:30 - 21:00 hằng ngày)</p></div>
              </div>
              <div className="dh-contact-info-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" /></svg>
                <div><h5>Email</h5><p>{email}</p></div>
              </div>
              <div className="dh-contact-info-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                <div><h5>Giờ làm việc</h5><p>{settings.working_hours || 'Thứ 2 - Chủ nhật: 8:00 - 21:00'}</p></div>
              </div>
              <div style={{ height: 280, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
                <iframe src={mapUrl} loading="lazy" title="Bản đồ showroom MERIDIAN" style={{ width: '100%', height: '100%', border: 0 }}></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
