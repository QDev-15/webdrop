import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface BookingForm {
  name: string
  phone: string
  service_type: string
  duration: string
  therapist: string
  book_date: string
  book_time: string
  health_note: string
}

const SERVICES = [
  'Massage Thái truyền thống',
  'Massage đá nóng',
  'Massage bấm huyệt',
  'Massage thư giãn toàn thân',
  'Trị liệu cổ vai gáy',
  'Chăm sóc da mặt',
]

const DURATIONS = ['60 phút', '90 phút', '120 phút']

const TIMES = [
  '9:00', '10:00', '11:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
]

export default function Booking() {
  const { settings } = useSite()
  const phone = settings.site_phone || '028 3812 7500'

  const [form, setForm] = useState<BookingForm>({
    name: '', phone: '', service_type: '', duration: '60 phút',
    therapist: '', book_date: '', book_time: '', health_note: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const set = (k: keyof BookingForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.service_type || !form.book_date || !form.book_time) {
      setMsg('Vui lòng điền đầy đủ các trường bắt buộc.'); setStatus('error'); return
    }
    setStatus('loading'); setMsg('')
    try {
      await api.post('/public/booking', form)
      setStatus('success')
      setMsg('Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút.')
      setForm({ name: '', phone: '', service_type: '', duration: '60 phút', therapist: '', book_date: '', book_time: '', health_note: '' })
    } catch (e) {
      setStatus('error')
      setMsg(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  return (
    <section className="sec-pad" style={{ background: 'var(--cream)' }}>
      <div className="wd-container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-5" data-reveal>
            <div className="mrt-label">
              <span className="mrt-label-line" />
              Đặt lịch
            </div>
            <h2 className="mrt-heading">Đặt lịch <em>trải nghiệm</em> ngay hôm nay</h2>
            <p className="mrt-subtext" style={{ marginBottom: 32 }}>
              Chọn dịch vụ và thời gian phù hợp — chúng tôi sẽ xác nhận lịch trong vòng 30 phút.
            </p>
            <div className="mrt-contact-box">
              <div className="mrt-contact-icon">📞</div>
              <div>
                <div className="mrt-contact-label">Đặt lịch qua điện thoại</div>
                <div className="mrt-contact-val">
                  <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                </div>
              </div>
            </div>
            <div className="mrt-notice" style={{ marginTop: 16 }}>
              <strong>Lưu ý:</strong> Vui lòng đến trước 10 phút để chuẩn bị. Nếu cần hủy lịch, xin thông báo trước 2 tiếng.
            </div>
          </div>

          <div className="col-lg-7" data-reveal>
            <div className="mrt-form-card">
              <div className="mrt-form-title">Thông tin đặt lịch</div>
              <div className="mrt-form-sub">Điền đầy đủ thông tin để chúng tôi phục vụ bạn tốt nhất.</div>

              {status === 'success' && (
                <div style={{ padding: '14px 18px', background: '#f0faf5', border: '1px solid #b6dfc9', borderRadius: 8, marginBottom: 20, fontSize: 14, color: 'var(--accent)' }}>
                  {msg}
                </div>
              )}
              {status === 'error' && (
                <div style={{ padding: '14px 18px', background: '#fff0f0', border: '1px solid #fdd', borderRadius: 8, marginBottom: 20, fontSize: 14, color: 'var(--danger)' }}>
                  {msg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Họ và tên <span>*</span></label>
                      <input type="text" className="mrt-form-control" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Số điện thoại <span>*</span></label>
                      <input type="tel" className="mrt-form-control" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Loại dịch vụ <span>*</span></label>
                      <select className="mrt-form-control" value={form.service_type} onChange={e => set('service_type', e.target.value)}>
                        <option value="">-- Chọn dịch vụ --</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Thời lượng</label>
                      <select className="mrt-form-control" value={form.duration} onChange={e => set('duration', e.target.value)}>
                        {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Yêu cầu chuyên viên</label>
                      <input type="text" className="mrt-form-control" placeholder="Để trống nếu không yêu cầu" value={form.therapist} onChange={e => set('therapist', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Ngày đặt lịch <span>*</span></label>
                      <input type="date" className="mrt-form-control" value={form.book_date} min={new Date().toISOString().split('T')[0]} onChange={e => set('book_date', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Giờ <span>*</span></label>
                      <select className="mrt-form-control" value={form.book_time} onChange={e => set('book_time', e.target.value)}>
                        <option value="">-- Chọn giờ --</option>
                        {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Tình trạng sức khỏe cần lưu ý</label>
                      <textarea className="mrt-form-control" rows={3} placeholder="Ví dụ: đau lưng mãn tính, huyết áp cao, dị ứng..." value={form.health_note} onChange={e => set('health_note', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="mrt-form-submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Đang gửi...' : 'Xác nhận đặt lịch →'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
