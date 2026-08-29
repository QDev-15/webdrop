import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { IconPin, IconPhone, IconMail, IconZalo } from '../components/icons'

export default function ContactPage() {
  useDocumentMeta({
    title: 'Liên hệ Nhà Đất Việt — Tư vấn mua bán, cho thuê bất động sản',
    description: 'Liên hệ Nhà Đất Việt để được tư vấn miễn phí về mua bán, cho thuê bất động sản hoặc ký gửi tin đăng. Hotline 1900 6789, văn phòng tại Quận 1, TP.HCM.',
  })
  const { settings } = useSite()
  const bannerImg = settings.banner_contact || 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=1600&auto=format&fit=crop&q=80'
  const zalo = settings.zalo_phone || '0909888777'

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('Tìm mua bất động sản')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim() || !message.trim()) { setError('Vui lòng điền đầy đủ thông tin bắt buộc.'); return }
    setSending(true)
    try {
      await api.post('/public/contact', { name, phone, email, subject, message })
      setSuccess(true)
      setName(''); setPhone(''); setEmail(''); setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi yêu cầu thất bại.')
    } finally { setSending(false) }
  }

  return (
    <>
      <section className="ndv-page-header" style={{ backgroundImage: `url('${bannerImg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="ndv-container ndv-page-header-in">
          <div className="ndv-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Liên hệ</span></div>
          <h1>Liên hệ với {settings.site_name || 'Nhà Đất Việt'}</h1>
          <p>Gửi yêu cầu tư vấn mua bán, cho thuê hoặc ký gửi bất động sản — chúng tôi phản hồi trong vòng 30 phút giờ hành chính.</p>
        </div>
      </section>

      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-contact-grid">
            <div data-reveal="">
              <div className="ndv-eyebrow">Thông tin liên hệ</div>
              <h2 className="ndv-title" style={{ fontSize: 26 }}>Nhiều cách để kết nối với chúng tôi</h2>
              <div style={{ marginTop: 24 }}>
                <div className="ndv-contact-info-item">
                  <div className="ndv-contact-icon"><IconPin /></div>
                  <div><h4>Văn phòng chính</h4><p>{settings.site_address}</p></div>
                </div>
                <div className="ndv-contact-info-item">
                  <div className="ndv-contact-icon"><IconPhone /></div>
                  <div><h4>Hotline</h4><p>{settings.site_phone} — {settings.site_phone2} ({settings.working_hours})</p></div>
                </div>
                <div className="ndv-contact-info-item">
                  <div className="ndv-contact-icon"><IconMail /></div>
                  <div><h4>Email</h4><p>{settings.site_email}</p></div>
                </div>
                <div className="ndv-contact-info-item">
                  <div className="ndv-contact-icon"><IconZalo /></div>
                  <div><h4>Zalo</h4><p><a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>zalo.me/{zalo}</a></p></div>
                </div>
              </div>
            </div>

            <div className="ndv-contact-form-card" data-reveal="" data-delay="1">
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 20 }}>Gửi yêu cầu tư vấn</h3>
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-error" style={{ marginBottom: 14 }}>{error}</div>}
                <div className="ndv-form-row2">
                  <div className="ndv-form-group">
                    <label htmlFor="cfName">Họ và tên *</label>
                    <input type="text" id="cfName" required placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="ndv-form-group">
                    <label htmlFor="cfPhone">Số điện thoại *</label>
                    <input type="tel" id="cfPhone" required placeholder="09xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="ndv-form-group">
                  <label htmlFor="cfEmail">Email</label>
                  <input type="email" id="cfEmail" placeholder="email@vidu.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="ndv-form-group">
                  <label htmlFor="cfSubject">Nhu cầu</label>
                  <select id="cfSubject" value={subject} onChange={e => setSubject(e.target.value)}>
                    <option>Tìm mua bất động sản</option>
                    <option>Tìm thuê bất động sản</option>
                    <option>Ký gửi bán/cho thuê</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="ndv-form-group">
                  <label htmlFor="cfMessage">Nội dung *</label>
                  <textarea id="cfMessage" rows={4} required placeholder="Cho chúng tôi biết nhu cầu cụ thể của bạn..." value={message} onChange={e => setMessage(e.target.value)} />
                </div>
                <button type="submit" className="ndv-btn ndv-btn-primary ndv-btn-block" disabled={sending}>{sending ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
                {success && <div className="ndv-form-success show">Cảm ơn bạn đã liên hệ! {settings.site_name || 'Nhà Đất Việt'} sẽ phản hồi trong thời gian sớm nhất.</div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
