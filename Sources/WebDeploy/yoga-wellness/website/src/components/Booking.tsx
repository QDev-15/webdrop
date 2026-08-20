import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
}

interface BookingForm {
  name: string
  email: string
  phone: string
  service_id: string
  experience_level: string
  preferred_time: string
  start_date: string
  package: string
  health_note: string
  goal: string
  how_know: string
}

export default function Booking() {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState<BookingForm>({
    name: '', email: '', phone: '', service_id: '', experience_level: '', preferred_time: '',
    start_date: '', package: '', health_note: '', goal: '', how_know: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Service[]>('/public/services').then(data => {
      setServices(data)
      if (data.length > 0) setForm(f => ({ ...f, service_id: String(data[0].id) }))
    }).catch(() => {})
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/public/bookings', form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', service_id: services[0]?.id.toString() || '', experience_level: '', preferred_time: '', start_date: '', package: '', health_note: '', goal: '', how_know: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError((err as Error).message || 'Lỗi khi đăng ký')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="sec-pad yw-strip" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-lg-6">
            <div data-reveal>
              <h2 className="yw-title mb-3">Đăng ký lớp học <em>ngay hôm nay</em></h2>
              <p className="yw-sub mb-4">Điền biểu mẫu bên cạnh và chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận đăng ký.</p>
              <div className="yw-features">
                {[{ icon: '🧘', title: 'Linh hoạt', desc: 'Chọn lớp phù hợp với lịch của bạn' },
                  { icon: '👥', title: 'Cộng đồng', desc: 'Tham gia nhóm những người yêu yoga' },
                  { icon: '🎯', title: 'Hướng dẫn', desc: 'Giáo viên chuyên nghiệp hỗ trợ' }].map((f, i) => (
                  <div key={i} className="yw-feature mb-4">
                    <div className="yw-feature-icon" style={{ fontSize: '28px', background: 'transparent', border: 'none' }}>{f.icon}</div>
                    <h4 className="yw-feature-title">{f.title}</h4>
                    <p className="yw-feature-desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="yw-form-box" data-reveal>
              <h3 className="yw-form-title">Thông tin đăng ký</h3>
              <p className="yw-form-sub">Bắt buộc (đánh dấu *)</p>
              {success && <div className="alert alert-success" style={{ marginBottom: '16px' }}>✓ Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.</div>}
              {error && <div className="alert alert-danger" style={{ marginBottom: '16px' }}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="yw-form-label">Họ tên *</label>
                  <input type="text" className="yw-form-control" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="yw-form-label">Email *</label>
                    <input type="email" className="yw-form-control" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="yw-form-label">Điện thoại *</label>
                    <input type="tel" className="yw-form-control" name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="yw-form-label">Lớp học muốn tham gia *</label>
                  <select className="yw-form-select" name="service_id" value={form.service_id} onChange={handleChange} required>
                    <option value="">-- Chọn lớp --</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="yw-form-label">Trình độ kinh nghiệm</label>
                    <select className="yw-form-select" name="experience_level" value={form.experience_level} onChange={handleChange}>
                      <option value="">-- Chọn --</option>
                      <option value="beginner">Người mới</option>
                      <option value="intermediate">Trung cấp</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="yw-form-label">Ngày bắt đầu</label>
                    <input type="date" className="yw-form-control" name="start_date" value={form.start_date} onChange={handleChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="yw-form-label">Ghi chú sức khỏe / Chấn thương</label>
                  <textarea className="yw-form-control" name="health_note" value={form.health_note} onChange={handleChange} placeholder="Ví dụ: đau lưng, mang thai..." />
                </div>
                <button type="submit" className="yw-btn w-100" disabled={loading}>{loading ? 'Đang gửi...' : 'Đăng ký ngay'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
