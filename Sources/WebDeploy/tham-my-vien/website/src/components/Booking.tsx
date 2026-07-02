import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface BookingForm {
  full_name: string
  phone: string
  email: string
  service_name: string
  preferred_date: string
  preferred_time: string
  note: string
}

const EMPTY: BookingForm = {
  full_name: '', phone: '', email: '',
  service_name: '', preferred_date: '',
  preferred_time: '', note: '',
}

const TIME_SLOTS = ['8:00', '9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

export default function Booking() {
  const { settings } = useSite()
  const [form, setForm]       = useState<BookingForm>(EMPTY)
  const [submitting, setSub]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const phone   = settings.site_phone   || '0901 234 567'
  const email   = settings.site_email   || 'info@thammy.vn'
  const address = settings.site_address || '123 Nguyễn Trãi, Quận 1, TP.HCM'
  const hours   = settings.working_hours|| 'T2–T7: 8:00 – 20:00 | CN: 9:00 – 17:00'

  const set = (k: keyof BookingForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name.trim()) { setError('Vui lòng nhập họ tên.'); return }
    if (!form.phone.trim()) { setError('Vui lòng nhập số điện thoại.'); return }
    setSub(true); setError('')
    try {
      await api.post('/bookings', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gửi yêu cầu thất bại. Vui lòng thử lại.')
    } finally { setSub(false) }
  }

  return (
    <section id="dat-lich" className="sec-pad" style={{ background: 'var(--dark2)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="tmv-label" style={{ color: 'var(--accent)' }}>Đặt lịch</div>
          <h2 className="tmv-h2" style={{ color: '#fff' }}>Tư vấn miễn phí — <em>không ràng buộc</em></h2>
          <p className="tmv-lead center" style={{ color: 'rgba(255,255,255,.45)' }}>
            Đội ngũ tư vấn sẽ liên hệ trong vòng 30 phút trong giờ làm việc.
          </p>
        </div>

        <div className="row g-5">
          {/* Form */}
          <div className="col-12 col-lg-7" data-reveal>
            {success ? (
              <div style={{
                background: 'rgba(201,169,110,.1)', border: '1px solid var(--gold-border)',
                borderRadius: 16, padding: '48px 32px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 10 }}>Đặt lịch thành công!</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>
                  Cảm ơn bạn đã tin tưởng chúng tôi. Đội ngũ tư vấn sẽ liên hệ sớm để xác nhận lịch hẹn.
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  className="tmv-btn tmv-btn-gold"
                  style={{ marginTop: 24 }}
                >
                  Đặt lịch khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                {error && (
                  <div style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.3)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>
                    {error}
                  </div>
                )}
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                      <label className="tmv-label-form" style={{ color: 'rgba(255,255,255,.5)' }}>Họ và tên *</label>
                      <input className="tmv-input" value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Nguyễn Thị Lan" style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)', color: '#fff' }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                      <label className="tmv-label-form" style={{ color: 'rgba(255,255,255,.5)' }}>Số điện thoại *</label>
                      <input className="tmv-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" type="tel" style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)', color: '#fff' }} />
                    </div>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                      <label className="tmv-label-form" style={{ color: 'rgba(255,255,255,.5)' }}>Email</label>
                      <input className="tmv-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" type="email" style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)', color: '#fff' }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                      <label className="tmv-label-form" style={{ color: 'rgba(255,255,255,.5)' }}>Dịch vụ quan tâm</label>
                      <input className="tmv-input" value={form.service_name} onChange={e => set('service_name', e.target.value)} placeholder="VD: Nâng mũi, trẻ hóa da..." style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)', color: '#fff' }} />
                    </div>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                      <label className="tmv-label-form" style={{ color: 'rgba(255,255,255,.5)' }}>Ngày mong muốn</label>
                      <input className="tmv-input" value={form.preferred_date} onChange={e => set('preferred_date', e.target.value)} type="date" style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)', color: '#fff' }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                      <label className="tmv-label-form" style={{ color: 'rgba(255,255,255,.5)' }}>Giờ mong muốn</label>
                      <select className="tmv-input" value={form.preferred_time} onChange={e => set('preferred_time', e.target.value)} style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)', color: '#fff' }}>
                        <option value="">-- Chọn giờ --</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                  <label className="tmv-label-form" style={{ color: 'rgba(255,255,255,.5)' }}>Ghi chú thêm</label>
                  <textarea className="tmv-input" value={form.note} onChange={e => set('note', e.target.value)} placeholder="Mô tả tình trạng hoặc yêu cầu cụ thể..." rows={3} style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)', color: '#fff', minHeight: 'auto' }} />
                </div>
                <button type="submit" disabled={submitting} className="tmv-btn tmv-btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px' }}>
                  {submitting ? 'Đang gửi...' : 'Đặt lịch tư vấn miễn phí'}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="col-12 col-lg-5" data-reveal data-delay="1">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ padding: '28px 24px', background: 'rgba(201,169,110,.06)', border: '1px solid var(--gold-border)', borderRadius: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 20 }}>Thông tin liên hệ</div>
                {[
                  { icon: '📞', label: 'Điện thoại', value: phone, href: `tel:${phone.replace(/\s/g,'')}` },
                  { icon: '✉', label: 'Email', value: email, href: `mailto:${email}` },
                  { icon: '📍', label: 'Địa chỉ', value: address, href: '' },
                  { icon: '⏱', label: 'Giờ làm việc', value: hours, href: '' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,169,110,.12)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', fontWeight: 300 }}>{item.value}</a>
                      ) : (
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', fontWeight: 300, lineHeight: 1.5 }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '20px 24px', background: 'rgba(201,169,110,.06)', border: '1px solid var(--gold-border)', borderRadius: 14, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>✓</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Cam kết của chúng tôi</div>
                  {['Tư vấn miễn phí, không ràng buộc', 'Bảo mật thông tin tuyệt đối', 'Phản hồi trong vòng 30 phút', 'Đội ngũ bác sĩ chuyên khoa'].map((c, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', fontWeight: 300, marginBottom: 4 }}>• {c}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
