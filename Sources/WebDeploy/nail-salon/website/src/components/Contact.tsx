import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function ContactSection() {
  const { settings } = useSite()
  const s = (k: string, fb = '') => settings[k] || fb

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'general', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  function setF(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSending(true); setErr('')
    try {
      await api.post('/public/contact', form)
      setSent(true)
    } catch (e) { setErr(e instanceof Error ? e.message : 'Gửi thất bại. Vui lòng thử lại.') }
    setSending(false)
  }

  return (
    <div className="row g-4">
      {/* Contact info cards */}
      <div className="col-lg-5">
        <div className="row g-3">
          <div className="col-6">
            <div className="ns-contact-card" data-reveal>
              <div className="ns-contact-icon">📍</div>
              <div className="ns-contact-label">Địa chỉ</div>
              <div className="ns-contact-val">{s('site_address', 'Liên hệ để biết địa chỉ')}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="ns-contact-card" data-reveal data-reveal-d="d1">
              <div className="ns-contact-icon">📞</div>
              <div className="ns-contact-label">Điện thoại</div>
              <div className="ns-contact-val">
                {s('site_phone') ? <a href={`tel:${s('site_phone')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{s('site_phone')}</a> : '—'}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="ns-contact-card" data-reveal data-reveal-d="d2">
              <div className="ns-contact-icon">🕐</div>
              <div className="ns-contact-label">Giờ mở cửa</div>
              <div className="ns-contact-val">{s('working_hours', 'Thứ 2 – CN')}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="ns-contact-card" data-reveal data-reveal-d="d3">
              <div className="ns-contact-icon">💬</div>
              <div className="ns-contact-label">Mạng xã hội</div>
              <div className="ns-contact-val" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {s('facebook') && <a href={s('facebook')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13 }}>Facebook</a>}
                {s('instagram') && <a href={s('instagram')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blush)', textDecoration: 'none', fontSize: 13 }}>Instagram</a>}
                {s('zalo_number') && <a href={`https://zalo.me/${s('zalo_number')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0068FF', textDecoration: 'none', fontSize: 13 }}>Zalo</a>}
              </div>
            </div>
          </div>
        </div>

        {/* Google Map */}
        {s('map_embed') && (
          <div className="ns-map-wrap mt-3" data-reveal>
            <iframe src={s('map_embed')} width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps" />
          </div>
        )}
      </div>

      {/* Contact form */}
      <div className="col-lg-7" data-reveal data-reveal-d="d1">
        <div className="ns-booking-wrap">
          <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 20 }}>Gửi tin nhắn cho chúng tôi</h3>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Gửi thành công!</div>
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {err && <div style={{ background: '#fdf0ec', border: '1px solid var(--accent)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: 'var(--accent)', fontSize: 13 }}>{err}</div>}
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="ns-form-label">Họ tên *</label>
                  <input className="ns-form-control" value={form.name} onChange={e => setF('name', e.target.value)} required placeholder="Nguyễn Thị A" />
                </div>
                <div className="col-sm-6">
                  <label className="ns-form-label">Số điện thoại</label>
                  <input className="ns-form-control" type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="0901 234 567" />
                </div>
                <div className="col-sm-6">
                  <label className="ns-form-label">Email</label>
                  <input className="ns-form-control" type="email" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div className="col-sm-6">
                  <label className="ns-form-label">Chủ đề</label>
                  <select className="ns-form-select" value={form.subject} onChange={e => setF('subject', e.target.value)}>
                    <option value="general">Thông tin chung</option>
                    <option value="booking">Đặt lịch</option>
                    <option value="price">Bảng giá</option>
                    <option value="complaint">Phản hồi / Khiếu nại</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="ns-form-label">Tin nhắn *</label>
                  <textarea className="ns-form-control" rows={4} value={form.message} onChange={e => setF('message', e.target.value)} required placeholder="Nội dung tin nhắn..." />
                </div>
              </div>
              <button type="submit" className="ns-btn-primary mt-3" disabled={sending} style={{ width: '100%' }}>
                {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
