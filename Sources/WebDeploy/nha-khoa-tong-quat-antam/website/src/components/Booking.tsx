import { useEffect, useState, FormEvent } from 'react'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
}

interface Doctor {
  id: number
  name: string
}

interface BookingForm {
  fullname: string
  phone: string
  email: string
  service: string
  doctor: string
  date: string
  time: string
  note: string
}

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '19:00',
]

const EMPTY: BookingForm = {
  fullname: '', phone: '', email: '',
  service: '', doctor: '', date: '', time: '', note: '',
}

export default function Booking() {
  const [form, setForm] = useState<BookingForm>(EMPTY)
  const [services, setServices] = useState<Service[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Service[]>('/public/services').then(setServices).catch(() => {})
    api.get<Doctor[]>('/public/doctors').then(setDoctors).catch(() => {})
  }, [])

  function set<K extends keyof BookingForm>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.fullname.trim() || !form.phone.trim()) {
      setError('Vui lòng nhập họ tên và số điện thoại.')
      return
    }
    setLoading(true)
    try {
      await api.post('/public/bookings', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="at-booking-card" style={{ textAlign: 'center', padding: 'clamp(48px,6vw,80px)' }}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>✓</div>
        <h3 className="at-booking-title" style={{ marginBottom: 12 }}>Đặt lịch thành công!</h3>
        <p className="at-booking-sub" style={{ marginBottom: 28 }}>
          Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 2 giờ làm việc.
        </p>
        <button onClick={() => setSuccess(false)} className="at-btn at-btn-accent">
          Đặt lịch khác
        </button>
      </div>
    )
  }

  return (
    <div className="at-booking-card">
      <h2 className="at-booking-title">Đặt lịch khám</h2>
      <p className="at-booking-sub">Điền thông tin bên dưới, chúng tôi sẽ xác nhận lịch sớm nhất.</p>

      {error && <div className="at-alert-error" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="at-form-grid-2">
          <div className="at-form-row">
            <label htmlFor="bk-fullname" className="at-form-label">Họ và tên *</label>
            <input
              id="bk-fullname"
              type="text"
              className="at-form-control"
              value={form.fullname}
              onChange={e => set('fullname', e.target.value)}
              placeholder="Nguyễn Văn A"
              required
              autoComplete="name"
            />
          </div>
          <div className="at-form-row">
            <label htmlFor="bk-phone" className="at-form-label">Số điện thoại *</label>
            <input
              id="bk-phone"
              type="tel"
              className="at-form-control"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="09x xxx xxxx"
              required
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="at-form-row">
          <label htmlFor="bk-email" className="at-form-label">Email</label>
          <input
            id="bk-email"
            type="email"
            className="at-form-control"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="email@example.com"
            autoComplete="email"
          />
        </div>

        <div className="at-form-divider" />

        <div className="at-form-grid-2">
          <div className="at-form-row">
            <label htmlFor="bk-service" className="at-form-label">Dịch vụ</label>
            <select
              id="bk-service"
              className="at-form-select"
              value={form.service}
              onChange={e => set('service', e.target.value)}
            >
              <option value="">— Chọn dịch vụ —</option>
              {services.map(svc => (
                <option key={svc.id} value={svc.name}>{svc.name}</option>
              ))}
            </select>
          </div>
          <div className="at-form-row">
            <label htmlFor="bk-doctor" className="at-form-label">Bác sĩ</label>
            <select
              id="bk-doctor"
              className="at-form-select"
              value={form.doctor}
              onChange={e => set('doctor', e.target.value)}
            >
              <option value="">— Bất kỳ bác sĩ —</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.name}>{doc.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="at-form-grid-2">
          <div className="at-form-row">
            <label htmlFor="bk-date" className="at-form-label">Ngày hẹn</label>
            <input
              id="bk-date"
              type="date"
              className="at-form-control"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="at-form-row">
            <label htmlFor="bk-time" className="at-form-label">Giờ hẹn</label>
            <select
              id="bk-time"
              className="at-form-select"
              value={form.time}
              onChange={e => set('time', e.target.value)}
            >
              <option value="">— Chọn giờ —</option>
              {TIME_SLOTS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="at-form-row">
          <label htmlFor="bk-note" className="at-form-label">Ghi chú thêm</label>
          <textarea
            id="bk-note"
            className="at-form-control"
            value={form.note}
            onChange={e => set('note', e.target.value)}
            placeholder="Triệu chứng, yêu cầu đặc biệt..."
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          className="at-btn at-btn-accent at-btn-lg"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? 'Đang gửi...' : 'Xác nhận đặt lịch'}
          {!loading && <span aria-hidden="true">→</span>}
        </button>

        <p className="at-form-note">
          Chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc để xác nhận lịch hẹn.
          Mọi thông tin cá nhân được bảo mật tuyệt đối.
        </p>
      </form>
    </div>
  )
}
