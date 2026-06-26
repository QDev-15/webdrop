import { useState, useEffect } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface Service { id: number; name: string }

type ClassType = 'mat' | 'reformer' | 'clinical' | 'prenatal' | ''

const CLASS_OPTIONS: { value: ClassType; label: string }[] = [
  { value: 'mat',      label: 'Mat Pilates' },
  { value: 'reformer', label: 'Reformer Pilates' },
  { value: 'clinical', label: 'Clinical Pilates' },
  { value: 'prenatal', label: 'Prenatal Pilates' },
]

interface FormData {
  name: string; phone: string; email: string; age: string; gender: string
  class_type: string; service_id: string; experience: string; health_notes: string; message: string
}

const emptyForm: FormData = {
  name: '', phone: '', email: '', age: '', gender: '',
  class_type: '', service_id: '', experience: 'none', health_notes: '', message: '',
}

export default function Booking() {
  const { settings } = useSite()
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm]         = useState<FormData>(emptyForm)
  const [sending, setSending]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    api.get<Service[]>('/public/services').then(setServices).catch(() => {})
  }, [])

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) { setError('Vui lòng nhập đầy đủ tên và số điện thoại.'); return }
    setSending(true); setError('')
    try {
      await api.post('/bookings', {
        ...form,
        service_id: form.service_id ? +form.service_id : null,
        age: form.age ? +form.age : null,
      })
      setSent(true)
      setForm(emptyForm)
    } catch {
      setError('Gửi đăng ký thất bại. Vui lòng thử lại hoặc gọi điện trực tiếp.')
    } finally { setSending(false) }
  }

  return (
    <section className="ps-booking sec-pad">
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-lg-5 reveal">
            <div className="ps-eyebrow">Đăng ký</div>
            <h2 className="ps-sec-title">Buổi trải nghiệm<br /><em>miễn phí.</em></h2>
            <p className="ps-sec-sub">Điền form đăng ký — nhận ngay 1 buổi học thử miễn phí để tìm lớp phù hợp nhất với bạn.</p>
            <div className="ps-booking-info">
              {settings.site_phone && (
                <div className="ps-book-contact">
                  <div className="ps-book-icon">📞</div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 2 }}>Điện thoại / Zalo</div>
                    <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`} style={{ fontWeight: 600, color: 'var(--text)' }}>{settings.site_phone}</a>
                  </div>
                </div>
              )}
              {settings.working_hours && (
                <div className="ps-book-contact">
                  <div className="ps-book-icon">⏰</div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 2 }}>Giờ mở cửa</div>
                    <div style={{ fontWeight: 500 }}>{settings.working_hours}</div>
                  </div>
                </div>
              )}
              {settings.site_address && (
                <div className="ps-book-contact">
                  <div className="ps-book-icon">📍</div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 2 }}>Địa chỉ</div>
                    <div style={{ fontWeight: 500 }}>{settings.site_address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-7 reveal reveal-d2">
            <div className="ps-booking-form-wrap">
              {sent ? (
                <div className="ps-booking-success">
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                  <h3>Đăng ký thành công!</h3>
                  <p>Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 2 giờ làm việc.</p>
                  <button className="ps-btn-solid" onClick={() => setSent(false)} style={{ marginTop: 16 }}>Đăng ký thêm</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <div className="ps-form-error">{error}</div>}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="ps-form-label">Họ tên *</label>
                      <input className="ps-form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Thị Mai" required />
                    </div>
                    <div className="col-md-6">
                      <label className="ps-form-label">Số điện thoại *</label>
                      <input className="ps-form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
                    </div>
                    <div className="col-md-6">
                      <label className="ps-form-label">Email</label>
                      <input className="ps-form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="mai@example.com" />
                    </div>
                    <div className="col-md-3">
                      <label className="ps-form-label">Tuổi</label>
                      <input className="ps-form-input" type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="28" min={10} max={99} />
                    </div>
                    <div className="col-md-3">
                      <label className="ps-form-label">Giới tính</label>
                      <select className="ps-form-input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                        <option value="">—</option>
                        <option value="female">Nữ</option>
                        <option value="male">Nam</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="ps-form-label">Loại lớp quan tâm</label>
                      <select className="ps-form-input" value={form.class_type} onChange={e => set('class_type', e.target.value)}>
                        <option value="">Chưa chắc — cần tư vấn</option>
                        {CLASS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="ps-form-label">Kinh nghiệm pilates</label>
                      <select className="ps-form-input" value={form.experience} onChange={e => set('experience', e.target.value)}>
                        <option value="none">Chưa từng tập</option>
                        <option value="beginner">Mới bắt đầu (dưới 6 tháng)</option>
                        <option value="intermediate">Trung cấp (6–18 tháng)</option>
                        <option value="advanced">Nâng cao (trên 18 tháng)</option>
                      </select>
                    </div>
                    {services.length > 0 && (
                      <div className="col-12">
                        <label className="ps-form-label">Lớp học cụ thể (tùy chọn)</label>
                        <select className="ps-form-input" value={form.service_id} onChange={e => set('service_id', e.target.value)}>
                          <option value="">Để chuyên viên tư vấn</option>
                          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="col-12">
                      <label className="ps-form-label">Tình trạng sức khỏe cần lưu ý</label>
                      <input className="ps-form-input" value={form.health_notes} onChange={e => set('health_notes', e.target.value)} placeholder="Đau lưng, chấn thương đầu gối, đang mang thai..." />
                    </div>
                    <div className="col-12">
                      <label className="ps-form-label">Ghi chú thêm</label>
                      <textarea className="ps-form-input" rows={3} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Thời gian bạn có thể tham gia, câu hỏi thêm..." />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="ps-btn-solid" disabled={sending} style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 15 }}>
                        {sending ? 'Đang gửi...' : 'Gửi đăng ký — miễn phí'}
                      </button>
                      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 10 }}>Thông tin của bạn được bảo mật hoàn toàn.</p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
