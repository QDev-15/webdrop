import { useState } from 'react'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ContactPage() {
  usePageTitle('Liên hệ & Đặt chỗ')
  const { settings } = useSite()
  const [form, setForm] = useState({
    name: '', phone: '', email: '', purpose: '',
    date: '', time: '', guests: '2 người', area: 'Không cần thiết', message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const phone   = settings.site_phone   || '0901 234 567'
  const address = settings.site_address || 'Địa chỉ quán'
  const email   = settings.site_email   || 'hello@caphethogian.vn'
  const fbLink  = settings.social_facebook  || '#'
  const igLink  = settings.social_instagram || '#'
  const ttLink  = settings.social_tiktok    || '#'
  const mapEmbed = settings.google_map_embed || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.post('/public/reservation', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        date: form.date,
        time: form.time,
        guests: form.guests,
        area: form.area,
        purpose: form.purpose,
        note: form.message,
      })
      setStatus('ok')
      setForm({ name: '', phone: '', email: '', purpose: '', date: '', time: '', guests: '2 người', area: 'Không cần thiết', message: '' })
    } catch {
      setStatus('err')
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Liên hệ</div>
          <h1 className="ph-title">Gặp chúng tôi <em>mỗi ngày</em></h1>
          <p className="ph-sub">Đặt chỗ, hỏi thông tin hoặc chỉ đơn giản là ghé thăm — chúng tôi luôn chào đón bạn.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            {/* Info */}
            <div className="col-lg-4">
              <div className="reveal">
                <div className="eyebrow">Thông tin</div>
                <h2 className="sec-title" style={{ fontSize: 'clamp(22px,2.8vw,32px)' }}>Tìm <em>chúng tôi</em></h2>
              </div>
              <div className="d-flex flex-column gap-3 mt-4">
                <div className="contact-info-block reveal reveal-d1">
                  <div className="cib-icon">📍</div>
                  <div className="cib-label">Địa chỉ</div>
                  <div className="cib-val">{address}</div>
                </div>
                <div className="contact-info-block reveal reveal-d2">
                  <div className="cib-icon">📱</div>
                  <div className="cib-label">Điện thoại & Zalo</div>
                  <div className="cib-val"><a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--accent)' }}>{phone}</a></div>
                </div>
                <div className="contact-info-block reveal reveal-d3">
                  <div className="cib-icon">✉️</div>
                  <div className="cib-label">Email</div>
                  <div className="cib-val"><a href={`mailto:${email}`} style={{ color: 'var(--accent)' }}>{email}</a></div>
                </div>
                <div className="contact-info-block reveal">
                  <div className="cib-icon">🕐</div>
                  <div className="cib-label">Giờ mở cửa</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text)' }}>
                      <span>Thứ 2 – Thứ 6</span><span style={{ fontWeight: 500 }}>7:00 – 22:00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text)' }}>
                      <span>Thứ 7 – Chủ nhật</span><span style={{ fontWeight: 500 }}>6:30 – 23:00</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Không nghỉ lễ</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 reveal">
                <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Theo dõi chúng tôi</div>
                <div className="d-flex gap-3 flex-wrap">
                  <a href={fbLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--text-2)' }}>Facebook</a>
                  <a href={igLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--text-2)' }}>Instagram</a>
                  <a href={ttLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--text-2)' }}>TikTok</a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="col-lg-8">
              <div className="inline-booking reveal reveal-d1">
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px', letterSpacing: '-.4px' }}>Đặt chỗ hoặc gửi tin nhắn</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-2)', marginBottom: '24px', fontWeight: 300 }}>Điền form bên dưới — chúng tôi sẽ phản hồi trong vòng 15 phút trong giờ mở cửa.</p>
                {status === 'ok' ? (
                  <div style={{ padding: '24px', background: 'var(--accent-light)', borderRadius: '10px', color: 'var(--accent)', fontWeight: 500, textAlign: 'center', fontSize: '15px' }}>
                    Cảm ơn bạn! Chúng tôi sẽ liên hệ xác nhận sớm nhất.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Họ và tên *</label>
                        <input type="text" className="form-control" placeholder="Nguyễn Văn A" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Số điện thoại *</label>
                        <input type="tel" className="form-control" placeholder="0901 234 567" required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" placeholder="email@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Mục đích</label>
                        <select className="form-select" value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}>
                          <option value="">-- Chọn loại --</option>
                          <option>Đặt chỗ ngồi thông thường</option>
                          <option>Đặt phòng riêng</option>
                          <option>Tổ chức sự kiện</option>
                          <option>Hỏi thông tin</option>
                          <option>Hợp tác kinh doanh</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Ngày</label>
                        <input type="date" className="form-control" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Giờ</label>
                        <select className="form-select" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
                          <option value="">-- Chọn giờ --</option>
                          {['7:00 – 9:00','9:00 – 11:00','11:00 – 13:00','13:00 – 15:00','15:00 – 17:00','17:00 – 19:00','19:00 – 22:00'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Số người</label>
                        <select className="form-select" value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}>
                          {['1 người','2 người','3 – 4 người','5 – 6 người','7 – 8 người (phòng riêng)','Trên 8 người (sự kiện)'].map(g => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Khu vực mong muốn</label>
                        <select className="form-select" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))}>
                          {['Không cần thiết','Tầng 1 — Main Hall','Sân Vườn','Phòng Riêng'].map(a => <option key={a}>{a}</option>)}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Ghi chú thêm</label>
                        <textarea className="form-control" rows={3} placeholder="Sinh nhật, dị ứng thực phẩm, yêu cầu đặc biệt..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        {status === 'err' && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '8px' }}>Có lỗi xảy ra, vui lòng thử lại.</p>}
                        <button type="submit" className="btn-accent" style={{ padding: '13px 32px', fontSize: '14px' }} disabled={status === 'sending'}>
                          {status === 'sending' ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                        <span style={{ fontSize: '12px', color: 'var(--text-3)', marginLeft: '14px' }}>Phản hồi trong 15 phút</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section style={{ background: 'var(--warm)' }}>
        <div className="wd-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="reveal">
            <div className="eyebrow mb-3">Bản đồ</div>
            {mapEmbed ? (
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}
                dangerouslySetInnerHTML={{ __html: mapEmbed }} />
            ) : (
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '16/6', background: 'var(--warm2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-3)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-2)' }}>{address}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Bản đồ sẽ hiển thị sau khi cấu hình Google Maps embed</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
