import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const SUBJECTS = [
  'Hỏi về dịch vụ',
  'Tư vấn kiểu tóc',
  'Hỏi về bảng giá',
  'Phản hồi dịch vụ',
  'Hợp tác / Liên kết',
  'Vấn đề khác',
]

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: SUBJECTS[0], message: '' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setResult({ ok: false, message: 'Vui lòng điền đầy đủ họ tên, số điện thoại và nội dung.' })
      return
    }
    setSending(true)
    try {
      const res = await api.post<{ message: string }>('/public/contact', form)
      setResult({ ok: true, message: res.message || 'Gửi tin nhắn thành công!' })
      setForm({ name: '', phone: '', email: '', subject: SUBJECTS[0], message: '' })
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : 'Gửi tin nhắn thất bại. Thử lại sau.' })
    } finally {
      setSending(false)
    }
  }

  const phone = settings.site_phone || '0901 234 567'
  const phoneHref = phone.replace(/\s+/g, '')
  const mapEmbed = settings.map_embed_url || settings.map_embed || ''

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5">
          {/* Left: Info + Map */}
          <div className="col-lg-5" data-reveal>
            <div className="tb-eyebrow">Thông tin</div>
            <h2 className="tb-title mb-4" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Tìm chúng tôi<br /><em>ở đây</em></h2>

            <div className="tb-info-panel mb-4">
              <div className="tb-info-row">
                <div className="tb-info-icon">📍</div>
                <div>
                  <div className="tb-info-label">Địa chỉ</div>
                  <div className="tb-info-val">{settings.site_address || 'Số nhà, Tên đường, Phường, Quận, TP'}</div>
                </div>
              </div>
              <div className="tb-info-row">
                <div className="tb-info-icon">📱</div>
                <div>
                  <div className="tb-info-label">Điện thoại / Zalo</div>
                  <div className="tb-info-val">
                    <a href={`tel:${phoneHref}`}>{phone}</a><br />
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Zalo phản hồi nhanh nhất</span>
                  </div>
                </div>
              </div>
              {settings.site_email && (
                <div className="tb-info-row">
                  <div className="tb-info-icon">✉️</div>
                  <div>
                    <div className="tb-info-label">Email</div>
                    <div className="tb-info-val"><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></div>
                  </div>
                </div>
              )}
              <div className="tb-info-row" style={{ marginBottom: 0 }}>
                <div className="tb-info-icon">🕐</div>
                <div>
                  <div className="tb-info-label">Giờ mở cửa</div>
                  <div className="tb-info-val">
                    {settings.working_hours_1 || 'Thứ 2 – Thứ 6: 8:00 – 20:00'}<br />
                    {settings.working_hours_2 || 'Thứ 7: 8:00 – 21:00'}<br />
                    {settings.working_hours_3 || 'Chủ nhật: 9:00 – 19:00'}
                  </div>
                </div>
              </div>
            </div>

            <div className="tb-info-panel mb-4">
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Theo dõi chúng tôi</div>
              <div className="d-flex flex-column gap-3">
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, color: 'var(--text-2)', textDecoration: 'none' }}>
                    <span style={{ width: 32, height: 32, background: 'rgba(255,255,255,.05)', border: '1px solid var(--border-gold)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>f</span>
                    Facebook
                  </a>
                )}
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, color: 'var(--text-2)', textDecoration: 'none' }}>
                    <span style={{ width: 32, height: 32, background: 'rgba(255,255,255,.05)', border: '1px solid var(--border-gold)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>ig</span>
                    Instagram
                  </a>
                )}
                {settings.tiktok_url && (
                  <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, color: 'var(--text-2)', textDecoration: 'none' }}>
                    <span style={{ width: 32, height: 32, background: 'rgba(255,255,255,.05)', border: '1px solid var(--border-gold)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>tt</span>
                    TikTok
                  </a>
                )}
              </div>
            </div>

            <div style={{ background: 'rgba(184,144,42,.1)', border: '1px solid var(--border-gold)', borderRadius: 10, padding: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Muốn đặt lịch nhanh?</div>
              <p style={{ fontSize: 13.5, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
                Đặt lịch online miễn phí — xác nhận trong 15 phút. Giảm {settings.booking_promo_percent || '15'}% cho khách mới.
              </p>
              <Link to="/dat-lich" className="tb-btn-gold" style={{ display: 'block', textAlign: 'center' }}>Đặt lịch ngay →</Link>
            </div>
          </div>

          {/* Right: Form + Map */}
          <div className="col-lg-7" data-reveal data-delay="1">
            <div className="tb-form-wrap mb-4">
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Gửi tin nhắn cho chúng tôi</div>
              <p style={{ fontSize: 13.5, color: 'var(--text-3)', fontWeight: 300, marginBottom: 24 }}>Chúng tôi sẽ phản hồi trong vòng 24 giờ qua email.</p>

              {result && (
                <div className={`alert ${result.ok ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 16 }}>{result.message}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Họ và tên *</label>
                    <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Số điện thoại *</label>
                    <input type="tel" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Chủ đề</label>
                    <select className="form-select" value={form.subject} onChange={e => set('subject', e.target.value)}>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Nội dung *</label>
                    <textarea className="form-control" rows={4} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả câu hỏi hoặc yêu cầu của bạn..." required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="tb-btn-gold w-100" style={{ fontSize: 14, padding: 13 }} disabled={sending}>
                      {sending ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {mapEmbed && (
              <>
                <div className="tb-map-wrap">
                  <iframe
                    src={mapEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ vị trí tiệm tóc"
                  ></iframe>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 300, marginTop: 10 }}>
                  * Nhúng bản đồ thực từ Google Maps — thay link embed bằng địa chỉ thực của tiệm.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
