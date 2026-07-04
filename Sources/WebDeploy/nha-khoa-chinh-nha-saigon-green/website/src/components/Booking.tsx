import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface BookingForm {
  full_name: string
  phone: string
  email: string
  service_name: string
  pref_date: string
  pref_time: string
  message: string
}

const EMPTY: BookingForm = {
  full_name:    '',
  phone:        '',
  email:        '',
  service_name: '',
  pref_date:    '',
  pref_time:    '',
  message:      '',
}

const TIME_SLOTS = ['8:00', '9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

export default function Booking() {
  const { settings } = useSite()
  const [form, setForm]       = useState<BookingForm>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState('')

  const phone   = settings.site_phone   || '028 3822 0000'
  const address = settings.site_address || '123 Nguyễn Văn Trỗi, P.12, Q. Phú Nhuận, TP.HCM'
  const hours   = settings.working_hours|| 'T2–T7: 8:00–20:00 | CN: 8:00–12:00'

  const set = (k: keyof BookingForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name.trim()) { setError('Vui lòng nhập họ tên.'); return }
    if (!form.phone.trim()) { setError('Vui lòng nhập số điện thoại.'); return }
    setSubmitting(true); setError('')
    try {
      await api.post('/bookings', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch {
      setError('Đặt lịch không thành công. Vui lòng thử lại hoặc gọi trực tiếp.')
    } finally { setSubmitting(false) }
  }

  return (
    <section className="cn-booking sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 52 }} data-reveal>
          <div className="cn-eyebrow">Đặt lịch tư vấn</div>
          <h2 className="cn-title">Bắt đầu hành trình <em>niềng răng</em></h2>
          <p className="cn-sub" style={{ margin: '0 auto' }}>
            Đặt lịch tư vấn và scan 3D miễn phí — không mất thêm chi phí.
          </p>
        </div>

        <div className="cn-booking-wrap">
          {/* Form */}
          <div className="cn-booking-form" data-reveal>
            <div className="cn-booking-title">Đặt lịch tư vấn</div>
            <div className="cn-booking-sub">Điền thông tin bên dưới, chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút.</div>

            {success ? (
              <div className="cn-form-success show">
                <div className="cn-form-success-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div className="cn-form-success-title">Đặt lịch thành công!</div>
                <div className="cn-form-success-sub">Cảm ơn bạn. Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong thời gian sớm nhất.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '12px 16px', marginBottom: 18, color: '#c53030', fontSize: 13 }}>
                    {error}
                  </div>
                )}
                <div className="cn-form-grid-2">
                  <div className="cn-form-group">
                    <label className="cn-form-label" htmlFor="bk-name">Họ tên *</label>
                    <input id="bk-name" className="cn-form-control" value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Nguyễn Thị An" required />
                  </div>
                  <div className="cn-form-group">
                    <label className="cn-form-label" htmlFor="bk-phone">Điện thoại *</label>
                    <input id="bk-phone" className="cn-form-control" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
                  </div>
                </div>
                <div className="cn-form-group">
                  <label className="cn-form-label" htmlFor="bk-email">Email</label>
                  <input id="bk-email" className="cn-form-control" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div className="cn-form-group">
                  <label className="cn-form-label" htmlFor="bk-service">Dịch vụ quan tâm</label>
                  <select id="bk-service" className="cn-form-control" value={form.service_name} onChange={e => set('service_name', e.target.value)}>
                    <option value="">-- Chọn dịch vụ (tuỳ chọn) --</option>
                    <option>Mắc cài kim loại</option>
                    <option>Mắc cài sứ thẩm mỹ</option>
                    <option>Mắc cài tự buộc</option>
                    <option>Mắc cài mặt trong</option>
                    <option>Invisalign</option>
                    <option>Khay trong suốt nội địa</option>
                    <option>Thăm khám & Scan 3D</option>
                    <option>Tư vấn chung</option>
                  </select>
                </div>
                <div className="cn-form-grid-2">
                  <div className="cn-form-group">
                    <label className="cn-form-label" htmlFor="bk-date">Ngày mong muốn</label>
                    <input id="bk-date" className="cn-form-control" type="date" value={form.pref_date} onChange={e => set('pref_date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="cn-form-group">
                    <label className="cn-form-label" htmlFor="bk-time">Khung giờ</label>
                    <select id="bk-time" className="cn-form-control" value={form.pref_time} onChange={e => set('pref_time', e.target.value)}>
                      <option value="">-- Chọn giờ --</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="cn-form-group">
                  <label className="cn-form-label" htmlFor="bk-msg">Ghi chú thêm</label>
                  <textarea id="bk-msg" className="cn-form-control" rows={3} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả tình trạng răng hoặc yêu cầu đặc biệt..." />
                </div>
                <button type="submit" disabled={submitting} className="cn-submit">
                  {submitting ? 'Đang gửi...' : '✓ Đặt lịch tư vấn miễn phí'}
                </button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="cn-booking-info" data-reveal data-delay="1">
            <div className="cn-info-title">Thông tin phòng khám</div>
            <div className="cn-info-sub">Chúng tôi luôn sẵn sàng tư vấn và giải đáp mọi thắc mắc về niềng răng.</div>
            <div className="cn-info-item">
              <div className="cn-info-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <div className="cn-info-label">Điện thoại</div>
                <div className="cn-info-val">
                  <a href={`tel:${phone.replace(/\s/g,'')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{phone}</a>
                </div>
              </div>
            </div>
            <div className="cn-info-item">
              <div className="cn-info-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div className="cn-info-label">Địa chỉ</div>
                <div className="cn-info-val">{address}</div>
              </div>
            </div>
            <div className="cn-info-item">
              <div className="cn-info-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <div className="cn-info-label">Giờ làm việc</div>
                <div className="cn-info-val">{hours}</div>
              </div>
            </div>
            <div className="cn-info-item">
              <div className="cn-info-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid)" strokeWidth="2"><path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z"/></svg>
              </div>
              <div>
                <div className="cn-info-label">Tư vấn & Scan 3D</div>
                <div className="cn-info-val">Miễn phí cho lần khám đầu tiên — không ràng buộc điều trị</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
