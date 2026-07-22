import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface BookingForm {
  full_name: string
  phone: string
  email: string
  service_name: string
  doctor_pref: string
  pref_date: string
  pref_time: string
  message: string
}

const EMPTY: BookingForm = {
  full_name: '', phone: '', email: '',
  service_name: '', doctor_pref: '',
  pref_date: '', pref_time: '', message: '',
}

const TIME_SLOTS = [
  '8:00', '9:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
]

const SERVICES_LIST = [
  'Nâng mũi cấu trúc bằng sụn',
  'Độn cằm V-Line / Cắt gọt xương hàm',
  'Cắt mí / Tạo mắt 2 mí Hàn Quốc',
  'Tiêm Botox & Filler xóa nhăn',
  'Căng mỏng môi / Tiêm filler môi',
  'PRP / Huyết tương giàu tiểu cầu',
  'Laser CO2 Fractional tái tạo da',
  'Pico Laser xóa nám & tàn nhang',
  'HIFU 7D Ultraformer căng da',
  'Peel da hóa học & Microneedling',
  'Hút mỡ điêu khắc Body Jet',
  'Nâng ngực túi silicon',
  'Triệt lông vĩnh viễn Laser Diode',
  'Khác / Chưa quyết định',
]

const SCHEDULE = [
  { day: 'Thứ 2 – Thứ 6', time: '8:00 – 20:00', closed: false },
  { day: 'Thứ 7', time: '8:00 – 18:00', closed: false },
  { day: 'Chủ nhật', time: '9:00 – 17:00', closed: false },
]

export default function TuVanPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Đặt lịch tư vấn — ${settings.site_name || 'Thẩm Mỹ Viện Quốc Tế'}`,
    description: 'Đặt lịch tư vấn thẩm mỹ miễn phí với đội ngũ bác sĩ chuyên môn cao — chọn dịch vụ, bác sĩ và thời gian phù hợp với bạn.',
  })
  const [form, setForm]       = useState<BookingForm>(EMPTY)
  const [submitting, setSub]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')
  const [step, setStep]       = useState(1)

  const phone   = settings.site_phone   || '0901 234 567'
  const email   = settings.site_email   || 'info@thammy.vn'
  const address = settings.site_address || '123 Nguyễn Trãi, Quận 1, TP.HCM'

  const set = (k: keyof BookingForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name.trim()) { setError('Vui lòng nhập họ và tên.'); return }
    if (!form.phone.trim())     { setError('Vui lòng nhập số điện thoại.'); return }
    setSub(true); setError('')
    try {
      await api.post('/bookings', {
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        service_name: form.service_name,
        doctor_pref: form.doctor_pref,
        pref_date: form.pref_date,
        pref_time: form.pref_time,
        message: form.message,
      })
      setSuccess(true)
      setForm(EMPTY)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi yêu cầu thất bại. Vui lòng thử lại.')
    } finally { setSub(false) }
  }

  return (
    <>
      {/* Page hero */}
      <section className="tmv-page-hero">
        <div className="wd-container">
          <div data-reveal>
            <div className="tmv-ph-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Miễn phí — Không ràng buộc
            </div>
            <h1 className="tmv-ph-title">Đặt lịch <em>tư vấn</em></h1>
            <p className="tmv-ph-sub">Điền thông tin bên dưới. Đội ngũ sẽ xác nhận lịch hẹn trong vòng 30 phút trong giờ làm việc.</p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {/* Steps indicator */}
          {!success && (
            <div className="tmv-steps mb-4" data-reveal>
              {[
                { n: 1, label: 'Điền thông tin' },
                { n: 2, label: 'Chọn lịch hẹn' },
                { n: 3, label: 'Xác nhận' },
              ].map((s, i) => (
                <div key={s.n} className={`tmv-step${step >= s.n ? ' active' : ''}`}>
                  <div className="tmv-step-dot">{s.n}</div>
                  <span className="tmv-step-label">{s.label}</span>
                  {i < 2 && <div className="tmv-step-line" />}
                </div>
              ))}
            </div>
          )}

          <div className="row g-5">
            {/* Form */}
            <div className="col-12 col-lg-7" data-reveal>
              {success ? (
                <div style={{
                  background: 'var(--clinical-white)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '56px 32px', textAlign: 'center',
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--accent-light)', border: '2px solid var(--gold-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', fontSize: 28, color: 'var(--accent)',
                  }}>✓</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Đặt lịch thành công!</div>
                  <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 28 }}>
                    Cảm ơn bạn đã tin tưởng. Đội ngũ tư vấn sẽ liên hệ sớm để xác nhận lịch hẹn.<br />
                    <span style={{ color: 'var(--text-3)', fontSize: 13 }}>Hotline: <a href={`tel:${phone.replace(/\s/g,'')}`} style={{ color: 'var(--accent)' }}>{phone}</a></span>
                  </div>
                  <button
                    onClick={() => { setSuccess(false); setStep(1) }}
                    className="tmv-btn tmv-btn-gold"
                  >
                    Đặt lịch khác
                  </button>
                </div>
              ) : (
                <div style={{ background: 'var(--clinical-white)', border: '1px solid var(--border)', borderRadius: 16, padding: '36px' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Thông tin đặt lịch</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28 }}>Tất cả thông tin được bảo mật tuyệt đối</div>

                  <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                    {error && (
                      <div style={{ background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', color: '#dc2626', padding: '12px 16px', borderRadius: 8, fontSize: 13 }}>
                        {error}
                      </div>
                    )}

                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                          <label className="tmv-label-form">Họ và tên *</label>
                          <input
                            className="tmv-input"
                            value={form.full_name}
                            onChange={e => { set('full_name', e.target.value); if (step < 2) setStep(1) }}
                            placeholder="Nguyễn Thị Lan"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                          <label className="tmv-label-form">Số điện thoại *</label>
                          <input
                            className="tmv-input"
                            value={form.phone}
                            onChange={e => set('phone', e.target.value)}
                            placeholder="0901 234 567"
                            type="tel"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                          <label className="tmv-label-form">Email</label>
                          <input
                            className="tmv-input"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            placeholder="email@example.com"
                            type="email"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                          <label className="tmv-label-form">Dịch vụ quan tâm</label>
                          <select
                            className="tmv-input"
                            value={form.service_name}
                            onChange={e => set('service_name', e.target.value)}
                          >
                            <option value="">-- Chọn dịch vụ --</option>
                            {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                          <label className="tmv-label-form">Ngày mong muốn</label>
                          <input
                            className="tmv-input"
                            value={form.pref_date}
                            onChange={e => { set('pref_date', e.target.value); setStep(2) }}
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                          <label className="tmv-label-form">Giờ mong muốn</label>
                          <select
                            className="tmv-input"
                            value={form.pref_time}
                            onChange={e => set('pref_time', e.target.value)}
                          >
                            <option value="">-- Chọn giờ --</option>
                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="tmv-form-group" style={{ marginBottom: 0 }}>
                      <label className="tmv-label-form">Ghi chú / Mô tả tình trạng</label>
                      <textarea
                        className="tmv-input"
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                        placeholder="Mô tả tình trạng hoặc yêu cầu cụ thể để bác sĩ chuẩn bị tốt nhất..."
                        rows={4}
                        style={{ minHeight: 'auto' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="tmv-btn tmv-btn-gold"
                      style={{ width: '100%', justifyContent: 'center', padding: '15px 24px', fontSize: 15 }}
                    >
                      {submitting ? 'Đang gửi...' : 'Xác nhận đặt lịch tư vấn miễn phí →'}
                    </button>

                    <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', margin: 0 }}>
                      Bằng cách đặt lịch, bạn đồng ý với chính sách bảo mật của chúng tôi.
                    </p>
                  </form>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="col-12 col-lg-5" data-reveal data-delay="1">
              {/* Info card */}
              <div className="tmv-info-card" style={{ marginBottom: 20 }}>
                <div className="tmv-info-card-title">Thông tin liên hệ</div>
                <div className="tmv-info-card-sub">Liên hệ trực tiếp hoặc điền form — chúng tôi luôn sẵn sàng.</div>

                <div className="tmv-info-item">
                  <div className="tmv-info-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12.36 19.79 19.79 0 011.49 3.84 2 2 0 013.47 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 9.91a16 16 0 006.14 6.14l1.28-.8a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="tmv-info-item-label">Điện thoại & Hotline</div>
                    <div className="tmv-info-item-val">
                      <a href={`tel:${phone.replace(/\s/g,'')}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>{phone}</a>
                    </div>
                  </div>
                </div>

                <div className="tmv-info-item">
                  <div className="tmv-info-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <div className="tmv-info-item-label">Email</div>
                    <div className="tmv-info-item-val">
                      <a href={`mailto:${email}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>{email}</a>
                    </div>
                  </div>
                </div>

                <div className="tmv-info-item">
                  <div className="tmv-info-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div className="tmv-info-item-label">Địa chỉ</div>
                    <div className="tmv-info-item-val">{address}</div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="tmv-schedule">
                  <div className="tmv-schedule-title">Giờ làm việc</div>
                  {SCHEDULE.map(row => (
                    <div key={row.day} className={`tmv-schedule-row${row.closed ? ' closed' : ''}`}>
                      <span className="tmv-schedule-day">{row.day}</span>
                      <span className="tmv-schedule-time">{row.closed ? 'Nghỉ' : row.time}</span>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="tmv-info-trust">
                  {[
                    'Tư vấn miễn phí — không ràng buộc',
                    'Bảo mật thông tin tuyệt đối',
                    'Phản hồi trong vòng 30 phút (giờ hành chính)',
                    'Đội ngũ bác sĩ chuyên khoa được cấp phép',
                  ].map(t => (
                    <div key={t} className="tmv-info-trust-item">
                      <div className="tmv-info-trust-dot" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
