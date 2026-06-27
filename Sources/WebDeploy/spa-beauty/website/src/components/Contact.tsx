import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function Contact() {
  const { settings: s } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Tư vấn chung', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function setF(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
    }
    setSubmitting(false)
  }

  return (
    <div className="row g-5">
      {/* Info column */}
      <div className="col-md-5" data-reveal>
        <div className="sb-eyebrow">Thông tin liên hệ</div>
        <h2 className="sb-title">Tìm chúng tôi <em>ở đây</em></h2>

        {s.site_address && (
          <div className="sb-info-item">
            <div className="sb-info-icon">📍</div>
            <div>
              <div className="sb-info-label">Địa chỉ</div>
              <div className="sb-info-val">{s.site_address}</div>
            </div>
          </div>
        )}
        {s.site_phone && (
          <div className="sb-info-item">
            <div className="sb-info-icon">📱</div>
            <div>
              <div className="sb-info-label">Điện thoại / Zalo</div>
              <div className="sb-info-val">
                <a href={`tel:${s.site_phone}`}>{s.site_phone}</a>
                <br /><span style={{ fontSize: 12, color: 'var(--text-3)' }}>Nhắn Zalo để được trả lời nhanh hơn</span>
              </div>
            </div>
          </div>
        )}
        {s.site_email && (
          <div className="sb-info-item">
            <div className="sb-info-icon">✉️</div>
            <div>
              <div className="sb-info-label">Email</div>
              <div className="sb-info-val"><a href={`mailto:${s.site_email}`}>{s.site_email}</a></div>
            </div>
          </div>
        )}
        {s.working_hours && (
          <div className="sb-info-item">
            <div className="sb-info-icon">🕐</div>
            <div>
              <div className="sb-info-label">Giờ mở cửa</div>
              <div className="sb-info-val">{s.working_hours}</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, padding: 20, background: 'var(--accent-light)', borderRadius: 14, border: '1px solid rgba(26,107,82,.12)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 8 }}>💆 Đặt lịch ngay hôm nay</div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
            Ưu đãi 20% cho lần đầu tiên. Xác nhận trong 15 phút.
          </p>
          <Link to="/dat-lich" className="sb-btn-accent" style={{ display: 'block', textAlign: 'center', padding: '10px 20px' }}>
            Đặt lịch →
          </Link>
        </div>
      </div>

      {/* Contact form */}
      <div className="col-md-7" data-reveal style={{ transitionDelay: '.12s' }}>
        <div className="sb-contact-card">
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Gửi tin nhắn cho chúng tôi</div>
          <p style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 300, marginBottom: 24 }}>Điền form — chúng tôi sẽ liên hệ lại sớm nhất.</p>

          {success ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Đã gửi tin nhắn!</div>
              <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300 }}>Chúng tôi sẽ liên hệ lại sớm nhất. Hoặc nhắn Zalo để được trả lời ngay.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="sb-form-label">Họ và tên *</label>
                  <input type="text" className="sb-form-control" placeholder="Nguyễn Thị Lan" value={form.name} onChange={e => setF('name', e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="sb-form-label">Số điện thoại / Zalo *</label>
                  <input type="tel" className="sb-form-control" placeholder="0901 234 567" value={form.phone} onChange={e => setF('phone', e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="sb-form-label">Email</label>
                  <input type="email" className="sb-form-control" placeholder="email@example.com" value={form.email} onChange={e => setF('email', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="sb-form-label">Bạn quan tâm đến dịch vụ nào?</label>
                  <select className="sb-form-select" value={form.subject} onChange={e => setF('subject', e.target.value)}>
                    <option>Tư vấn chung</option>
                    <option>Massage &amp; Thư giãn</option>
                    <option>Chăm sóc da mặt</option>
                    <option>Body Treatment</option>
                    <option>Gói dịch vụ VIP</option>
                    <option>Voucher quà tặng</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="sb-form-label">Nội dung tin nhắn *</label>
                  <textarea className="sb-form-control" rows={4} placeholder="Mô tả tình trạng da, yêu cầu đặc biệt hoặc câu hỏi của bạn..." value={form.message} onChange={e => setF('message', e.target.value)} required />
                </div>
                {error && <div className="col-12" style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</div>}
                <div className="col-12">
                  <button type="submit" className="sb-btn-accent w-100" style={{ padding: '13px', fontSize: 14 }} disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 10, fontWeight: 300 }}>
                    Chúng tôi cam kết bảo mật thông tin của bạn.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
