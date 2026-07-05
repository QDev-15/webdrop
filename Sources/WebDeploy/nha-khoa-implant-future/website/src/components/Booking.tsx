import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
}

interface BookingFormData {
  customer_name: string
  phone: string
  email: string
  pref_service: string
  pref_date: string
  note: string
}

export default function Booking() {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState<BookingFormData>({
    customer_name: '',
    phone: '',
    email: '',
    pref_service: '',
    pref_date: '',
    note: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    api.get<Service[]>('/public/services').then(data => setServices(data)).catch(() => {})
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.phone) {
      setErrorMsg('Vui lòng điền họ tên và số điện thoại.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      await api.post('/public/bookings', form)
      setStatus('success')
      setForm({ customer_name: '', phone: '', email: '', pref_service: '', pref_date: '', note: '' })
    } catch {
      setStatus('error')
      setErrorMsg('Có lỗi xảy ra. Vui lòng thử lại hoặc gọi trực tiếp cho chúng tôi.')
    }
  }

  return (
    <div className="ft-booking-form-wrap" data-reveal>
      {status === 'success' ? (
        <div className="ft-alert ft-alert-success">
          <h3>Đặt lịch thành công!</h3>
          <p>Cảm ơn bạn đã tin tưởng Future Dental. Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 2 giờ làm việc.</p>
          <button className="ft-btn ft-btn-neon mt-3" onClick={() => setStatus('idle')}>Đặt lịch khác</button>
        </div>
      ) : (
        <form className="ft-booking-form" onSubmit={handleSubmit} noValidate>
          {status === 'error' && <div className="ft-alert ft-alert-error">{errorMsg}</div>}
          {errorMsg && status === 'idle' && <div className="ft-alert ft-alert-error">{errorMsg}</div>}

          <div className="row g-3">
            <div className="col-md-6">
              <div className="ft-form-group">
                <label htmlFor="customer_name" className="ft-form-label">Họ và tên *</label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  className="ft-form-input"
                  placeholder="Nguyễn Văn A"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="ft-form-group">
                <label htmlFor="phone" className="ft-form-label">Số điện thoại *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="ft-form-input"
                  placeholder="0901 234 567"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="ft-form-group">
                <label htmlFor="email" className="ft-form-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="ft-form-input"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="ft-form-group">
                <label htmlFor="pref_service" className="ft-form-label">Dịch vụ quan tâm</label>
                <select
                  id="pref_service"
                  name="pref_service"
                  className="ft-form-select"
                  value={form.pref_service}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  {services.length === 0 && (
                    <>
                      <option value="Implant một răng">Implant một răng</option>
                      <option value="All-on-4">All-on-4</option>
                      <option value="All-on-6">All-on-6</option>
                      <option value="Ghép xương">Ghép xương</option>
                      <option value="Implant tức thì">Implant tức thì</option>
                      <option value="Tư vấn chung">Tư vấn chung</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ft-form-group">
                <label htmlFor="pref_date" className="ft-form-label">Ngày hẹn mong muốn</label>
                <input
                  id="pref_date"
                  name="pref_date"
                  type="date"
                  className="ft-form-input"
                  value={form.pref_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="ft-form-group">
                <label htmlFor="note" className="ft-form-label">Ghi chú thêm</label>
                <textarea
                  id="note"
                  name="note"
                  className="ft-form-input ft-form-textarea"
                  placeholder="Mô tả tình trạng răng miệng hoặc yêu cầu cụ thể..."
                  rows={4}
                  value={form.note}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-12">
              <button
                type="submit"
                className="ft-btn ft-btn-neon w-100"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Đang gửi...' : 'Xác nhận đặt lịch →'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
