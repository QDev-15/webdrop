import { useState } from 'react'
import { api } from '../api/client'

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
]

const SERVICES_LIST = [
  'Khám định kỳ',
  'Trám răng sữa',
  'Nhổ răng sữa',
  'Trám bít hố rãnh (Sealant)',
  'Điều trị tủy răng sữa',
  'Chỉnh nha sớm',
  'Lấy cao răng',
  'Tư vấn',
]

export default function Booking() {
  const [form, setForm] = useState({
    parent_name: '',
    phone: '',
    email: '',
    child_name: '',
    child_age: '',
    service: '',
    date: '',
    time: '',
    note: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.parent_name || !form.phone || !form.child_name || !form.date) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/bookings', form)
      setSuccess(true)
      setForm({
        parent_name: '', phone: '', email: '', child_name: '',
        child_age: '', service: '', date: '', time: '', note: '',
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="ks-form-wrap" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }} aria-hidden="true">🎉</div>
        <h3 style={{ fontSize: 22, fontWeight: 600, fontStyle: 'normal', marginBottom: 12 }}>Đặt lịch thành công!</h3>
        <p style={{ color: 'var(--text-2)', fontWeight: 300, marginBottom: 24 }}>
          Cảm ơn bạn đã đặt lịch tại KidSmile. Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 30 phút.
        </p>
        <button
          className="ks-btn ks-btn-primary"
          onClick={() => setSuccess(false)}
        >
          Đặt lịch khác
        </button>
      </div>
    )
  }

  return (
    <form className="ks-form-wrap" onSubmit={handleSubmit} noValidate aria-label="Form đặt lịch khám">
      {error && (
        <div role="alert" style={{
          background: '#fff0f2', color: 'var(--danger)',
          borderRadius: 12, padding: '12px 18px', marginBottom: 20, fontSize: 13.5, fontWeight: 500,
        }}>
          {error}
        </div>
      )}

      {/* Parent info */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-h)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 16 }}>
          Thông tin phụ huynh
        </div>
        <div className="ks-form-row">
          <div className="ks-form-group">
            <label htmlFor="bk-parent-name" className="ks-form-label">
              Họ tên phụ huynh <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id="bk-parent-name"
              type="text"
              className="ks-form-control"
              placeholder="Nguyễn Thị Hoa"
              value={form.parent_name}
              onChange={e => set('parent_name', e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="ks-form-group">
            <label htmlFor="bk-phone" className="ks-form-label">
              Số điện thoại <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id="bk-phone"
              type="tel"
              className="ks-form-control"
              placeholder="0901 234 567"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              required
              aria-required="true"
            />
          </div>
        </div>
        <div className="ks-form-group">
          <label htmlFor="bk-email" className="ks-form-label">Email</label>
          <input
            id="bk-email"
            type="email"
            className="ks-form-control"
            placeholder="email@example.com"
            value={form.email}
            onChange={e => set('email', e.target.value)}
          />
        </div>
      </div>

      {/* Child info */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--mint-accent-h)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 16 }}>
          Thông tin bé
        </div>
        <div className="ks-form-row">
          <div className="ks-form-group">
            <label htmlFor="bk-child-name" className="ks-form-label">
              Tên bé <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id="bk-child-name"
              type="text"
              className="ks-form-control"
              placeholder="Nguyễn Bảo An"
              value={form.child_name}
              onChange={e => set('child_name', e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="ks-form-group">
            <label htmlFor="bk-child-age" className="ks-form-label">Tuổi của bé</label>
            <input
              id="bk-child-age"
              type="text"
              className="ks-form-control"
              placeholder="5 tuổi"
              value={form.child_age}
              onChange={e => set('child_age', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Appointment info */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 16 }}>
          Thông tin lịch hẹn
        </div>
        <div className="ks-form-group">
          <label htmlFor="bk-service" className="ks-form-label">Dịch vụ muốn đặt</label>
          <select
            id="bk-service"
            className="ks-form-control"
            value={form.service}
            onChange={e => set('service', e.target.value)}
          >
            <option value="">Chọn dịch vụ (tùy chọn)</option>
            {SERVICES_LIST.map(svc => (
              <option key={svc} value={svc}>{svc}</option>
            ))}
          </select>
        </div>
        <div className="ks-form-row">
          <div className="ks-form-group">
            <label htmlFor="bk-date" className="ks-form-label">
              Ngày khám <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id="bk-date"
              type="date"
              className="ks-form-control"
              min={new Date().toISOString().split('T')[0]}
              value={form.date}
              onChange={e => set('date', e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="ks-form-group">
            <label htmlFor="bk-time" className="ks-form-label">Giờ khám</label>
            <select
              id="bk-time"
              className="ks-form-control"
              value={form.time}
              onChange={e => set('time', e.target.value)}
            >
              <option value="">Chọn giờ</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="ks-form-group">
          <label htmlFor="bk-note" className="ks-form-label">Ghi chú thêm</label>
          <textarea
            id="bk-note"
            className="ks-form-control"
            rows={3}
            placeholder="Bé có vấn đề đặc biệt cần lưu ý, hoặc yêu cầu khác..."
            value={form.note}
            onChange={e => set('note', e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="ks-btn ks-btn-primary ks-btn-block"
        disabled={submitting}
      >
        {submitting ? 'Đang gửi...' : '✨ Xác nhận đặt lịch'}
      </button>

      <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 14, fontWeight: 300 }}>
        Sau khi đặt lịch, chúng tôi sẽ liên hệ xác nhận qua điện thoại trong vòng 30 phút.
      </p>
    </form>
  )
}
