import { useState } from 'react'
import { api } from '../api/client'

const TIME_SLOTS = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']

const SERVICES = [
  'Khám tổng quát',
  'Tẩy trắng răng',
  'Niềng răng trong suốt (Invisalign)',
  'Niềng răng mắc cài',
  'Trồng răng Implant',
  'Răng sứ thẩm mỹ',
  'Nhổ răng khôn',
  'Điều trị tủy răng',
  'Cắm xương niềng răng',
  'Khám răng trẻ em',
]

interface BookingForm {
  fullname: string
  phone: string
  email: string
  service: string
  pref_date: string
  pref_time: string
  pref_doctor: string
  note: string
}

const EMPTY: BookingForm = {
  fullname: '',
  phone: '',
  email: '',
  service: '',
  pref_date: '',
  pref_time: '',
  pref_doctor: '',
  note: '',
}

export default function Booking() {
  const [form, setForm] = useState<BookingForm>(EMPTY)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof BookingForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullname.trim() || !form.phone.trim()) {
      setError('Vui lòng nhập họ tên và số điện thoại.'); return
    }
    setSending(true); setError('')
    try {
      await api.post('/public/bookings', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch {
      setError('Có lỗi xảy ra, vui lòng gọi trực tiếp hoặc thử lại sau.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="nc-form-wrap">
      {success ? (
        <div className="nc-form-success">
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Đặt lịch thành công!</div>
          <p>Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút (trong giờ làm việc). Cảm ơn bạn đã tin tưởng Nụ Cười Xưa!</p>
          <button className="nc-btn" style={{ marginTop: '20px' }} onClick={() => setSuccess(false)}>
            Đặt lịch khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Step 1: Contact */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <span className="nc-step-badge">1</span>
            <span className="nc-step-label">Thông tin liên hệ</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label htmlFor="bk-fullname">Họ và tên <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                id="bk-fullname"
                type="text"
                value={form.fullname}
                onChange={e => set('fullname', e.target.value)}
                placeholder="Nguyễn Thị Mai"
                required
              />
            </div>
            <div>
              <label htmlFor="bk-phone">Số điện thoại <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                id="bk-phone"
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="0901 234 567"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label htmlFor="bk-email">Email (tùy chọn)</label>
            <input
              id="bk-email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          {/* Step 2: Appointment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <span className="nc-step-badge">2</span>
            <span className="nc-step-label">Chọn dịch vụ và thời gian</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="bk-service">Dịch vụ muốn khám</label>
            <select id="bk-service" value={form.service} onChange={e => set('service', e.target.value)}>
              <option value="">-- Chọn dịch vụ --</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label htmlFor="bk-date">Ngày muốn khám</label>
              <input
                id="bk-date"
                type="date"
                value={form.pref_date}
                onChange={e => set('pref_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label htmlFor="bk-doctor">Bác sĩ yêu cầu (tùy chọn)</label>
              <input
                id="bk-doctor"
                type="text"
                value={form.pref_doctor}
                onChange={e => set('pref_doctor', e.target.value)}
                placeholder="Để trống nếu không có yêu cầu"
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label>Khung giờ muốn hẹn</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {TIME_SLOTS.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`nc-time-slot${form.pref_time === t ? ' selected' : ''}`}
                  onClick={() => set('pref_time', form.pref_time === t ? '' : t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="bk-note">Ghi chú thêm (triệu chứng, tình trạng răng...)</label>
            <textarea
              id="bk-note"
              rows={3}
              value={form.note}
              onChange={e => set('note', e.target.value)}
              placeholder="Ví dụ: Răng tôi bị ê khi uống nước lạnh từ 3 ngày nay..."
            />
          </div>

          {error && <div className="nc-form-error">{error}</div>}

          <button type="submit" className="nc-btn" style={{ width: '100%' }} disabled={sending}>
            {sending ? 'Đang gửi...' : 'Gửi yêu cầu đặt lịch'}
          </button>
        </form>
      )}
    </div>
  )
}
