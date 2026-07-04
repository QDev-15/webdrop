import { useState, useEffect } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface Service { id: number; name: string }

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export default function Booking() {
  const { settings } = useSite()
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState({
    customer_name: '', phone: '', email: '',
    service_id: '', booking_date: '', time_slot: '', notes: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const phone = settings.site_phone || '0901 234 567'
  const address = settings.site_address || '123 Nguyễn Đình Chiểu, Q.3, TP.HCM'
  const hours = settings.working_hours || 'T2–T7: 8:00–20:00 · CN: 8:00–17:00'

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(setServices)
      .catch(() => { /* services list optional */ })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')
    try {
      await api.post('/public/bookings', {
        ...form,
        service_id: form.service_id ? Number(form.service_id) : null,
      })
      setStatus('success')
      setForm({ customer_name: '', phone: '', email: '', service_id: '', booking_date: '', time_slot: '', notes: '' })
    } catch (err) {
      setStatus('error')
      setErrMsg(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.')
    }
  }

  return (
    <div className="wd-container">
      <div className="st-booking-grid">
        {/* Form */}
        <div>
          <form className="st-form-panel" onSubmit={handleSubmit} noValidate>
            {status === 'success' && (
              <div className="st-alert st-alert-success">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút.
              </div>
            )}
            {status === 'error' && (
              <div className="st-alert st-alert-error">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errMsg}
              </div>
            )}

            <div className="st-form-row">
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label htmlFor="bk-name">Họ và tên *</label>
                <input
                  id="bk-name" name="customer_name" type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label htmlFor="bk-phone">Số điện thoại *</label>
                <input
                  id="bk-phone" name="phone" type="tel"
                  placeholder="0901 234 567"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="st-field">
              <label htmlFor="bk-email">Email</label>
              <input
                id="bk-email" name="email" type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="st-field">
              <label htmlFor="bk-service">Dịch vụ</label>
              <select id="bk-service" name="service_id" value={form.service_id} onChange={handleChange}>
                <option value="">-- Chọn dịch vụ --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="st-form-row">
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label htmlFor="bk-date">Ngày khám *</label>
                <input
                  id="bk-date" name="booking_date" type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.booking_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label htmlFor="bk-time">Khung giờ *</label>
                <select id="bk-time" name="time_slot" value={form.time_slot} onChange={handleChange} required>
                  <option value="">-- Chọn giờ --</option>
                  {TIME_SLOTS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="st-field">
              <label htmlFor="bk-note">Ghi chú</label>
              <textarea
                id="bk-note" name="notes"
                placeholder="Mô tả tình trạng răng hoặc yêu cầu đặc biệt..."
                rows={4}
                value={form.notes}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="st-btn st-btn-primary st-btn-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <><span className="st-spin" /> Đang gửi...</>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Xác nhận đặt lịch
                </>
              )}
            </button>
            <p className="st-form-note">
              Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 15 phút trong giờ làm việc.
            </p>
          </form>
        </div>

        {/* Side info */}
        <div className="st-booking-side">
          <div className="st-info-card" data-reveal>
            <div className="icon">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.62 1.41h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <h4>Hotline đặt lịch</h4>
              <p><a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--accent-h)' }}>{phone}</a></p>
            </div>
          </div>

          <div className="st-info-card" data-reveal data-reveal-delay="1">
            <div className="icon">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h4>Giờ làm việc</h4>
              <p>{hours}</p>
            </div>
          </div>

          <div className="st-info-card" data-reveal data-reveal-delay="2">
            <div className="icon">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <h4>Địa chỉ phòng khám</h4>
              <p>{address}</p>
            </div>
          </div>

          <div className="st-info-card" data-reveal data-reveal-delay="3">
            <div className="icon">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h4>Quy trình đặt lịch</h4>
              <p>Điền form → Nhận xác nhận SMS/Zalo → Đến đúng giờ hẹn → Được phục vụ ưu tiên.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
