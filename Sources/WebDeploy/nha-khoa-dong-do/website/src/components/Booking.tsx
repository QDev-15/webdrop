import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Doctor { id: number; name: string }

export default function Booking() {
  const [form, setForm] = useState({
    customer_name: '', phone: '', email: '',
    pref_service: '', pref_doctor: '',
    pref_date: '', pref_time: '', note: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors').then(setDoctors).catch(() => {})
  }, [])

  // Min date = tomorrow
  const minDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  })()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.phone || !form.pref_service || !form.pref_date || !form.pref_time) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (*).')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/public/bookings', form)
      setSubmitted(true)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại hoặc gọi trực tiếp hotline.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="dd-form-success show">
        Cảm ơn bạn đã đặt lịch! Đội ngũ Nha Khoa Đông Đô sẽ liên hệ xác nhận trong vòng 2 giờ làm việc.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="dd-form-grid">
        <div className="dd-field">
          <label htmlFor="fullName">Họ và tên *</label>
          <input type="text" id="fullName" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="Nguyễn Văn An" required autoComplete="name" />
        </div>
        <div className="dd-field">
          <label htmlFor="phone">Số điện thoại *</label>
          <input type="tel" id="phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required autoComplete="tel" />
        </div>
        <div className="dd-field full">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" autoComplete="email" />
        </div>
        <div className="dd-field">
          <label htmlFor="service">Dịch vụ quan tâm *</label>
          <select id="service" value={form.pref_service} onChange={e => set('pref_service', e.target.value)} required>
            <option value="" disabled>Chọn dịch vụ</option>
            <option value="implant">Trồng răng Implant</option>
            <option value="veneer">Bọc sứ thẩm mỹ</option>
            <option value="whitening">Tẩy trắng răng Laser</option>
            <option value="periodontal">Điều trị nha chu</option>
            <option value="invisalign">Chỉnh nha Invisalign</option>
            <option value="wisdom">Nhổ răng khôn</option>
            <option value="other">Khác / Tư vấn tổng quát</option>
          </select>
        </div>
        <div className="dd-field">
          <label htmlFor="doctor">Bác sĩ mong muốn</label>
          <select id="doctor" value={form.pref_doctor} onChange={e => set('pref_doctor', e.target.value)}>
            <option value="">Không yêu cầu cụ thể</option>
            {doctors.map(d => (
              <option key={d.id} value={String(d.id)}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="dd-field">
          <label htmlFor="prefDate">Ngày hẹn mong muốn *</label>
          <input type="date" id="prefDate" value={form.pref_date} onChange={e => set('pref_date', e.target.value)} min={minDate} required />
        </div>
        <div className="dd-field">
          <label htmlFor="prefTime">Khung giờ *</label>
          <select id="prefTime" value={form.pref_time} onChange={e => set('pref_time', e.target.value)} required>
            <option value="" disabled>Chọn khung giờ</option>
            <option value="morning">Sáng (08:00 – 11:30)</option>
            <option value="afternoon">Chiều (13:30 – 17:30)</option>
            <option value="evening">Tối (18:00 – 20:00)</option>
          </select>
        </div>
        <div className="dd-field full">
          <label htmlFor="note">Ghi chú thêm</label>
          <textarea id="note" value={form.note} onChange={e => set('note', e.target.value)} rows={4} placeholder="Ví dụ: tiền sử bệnh lý, tình trạng răng miệng hiện tại..." />
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: '14px', marginTop: '16px' }}>{error}</p>}

      <button type="submit" className="dd-btn dd-btn-fill" style={{ marginTop: '32px' }} disabled={loading}>
        {loading ? 'Đang gửi...' : 'Gửi yêu cầu đặt lịch'}
        {!loading && <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </button>
      <p className="dd-form-note">Bằng việc gửi form, bạn đồng ý để Nha Khoa Đông Đô liên hệ tư vấn.</p>
    </form>
  )
}
