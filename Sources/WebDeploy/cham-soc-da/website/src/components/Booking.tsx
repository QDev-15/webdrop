import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const SKIN_CONCERNS = [
  'Mụn trứng cá', 'Nám & Tàn nhang', 'Lão hóa da', 'Lỗ chân lông to', 'Da nhạy cảm', 'Sẹo & Rỗ da', 'Da dầu', 'Thâm mảng',
]

const SKIN_TYPES = [
  { value: 'normal', label: 'Da thường' },
  { value: 'oily', label: 'Da dầu' },
  { value: 'dry', label: 'Da khô' },
  { value: 'combination', label: 'Da hỗn hợp' },
  { value: 'sensitive', label: 'Da nhạy cảm' },
]

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

interface FormState {
  name: string
  phone: string
  email: string
  skin_concerns: string[]
  skin_type: string
  prev_treatment: string
  prefer_doctor: string
  appt_date: string
  appt_time: string
  note: string
}

export default function Booking() {
  const { settings } = useSite()
  const phone = settings['site_phone'] || '0901 234 567'
  const hours = settings['working_hours'] || 'Thứ 2 – Thứ 7: 8:00 – 18:00 | CN: 8:00 – 12:00'

  const [form, setForm] = useState<FormState>({
    name: '', phone: '', email: '',
    skin_concerns: [], skin_type: '', prev_treatment: 'no',
    prefer_doctor: '', appt_date: '', appt_time: '', note: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function toggleConcern(c: string) {
    setForm(f => ({
      ...f,
      skin_concerns: f.skin_concerns.includes(c)
        ? f.skin_concerns.filter(x => x !== c)
        : [...f.skin_concerns, c],
    }))
  }

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) { setError('Vui lòng điền họ tên và số điện thoại.'); return }
    setSubmitting(true); setError('')
    try {
      await api.post('/public/booking', { ...form, skin_concerns: form.skin_concerns.join(', ') })
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally { setSubmitting(false) }
  }

  if (success) return (
    <div className="csd-form-card text-center" style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Đặt lịch thành công!</h3>
      <p style={{ color: 'var(--text-2)', fontWeight: 300, marginBottom: 20 }}>Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 30 phút. Cảm ơn bạn đã tin tưởng DermaCare Clinic!</p>
      <button className="csd-btn-accent" onClick={() => { setSuccess(false); setForm({ name:'', phone:'', email:'', skin_concerns:[], skin_type:'', prev_treatment:'no', prefer_doctor:'', appt_date:'', appt_time:'', note:'' }) }}>
        Đặt lịch khác
      </button>
    </div>
  )

  return (
    <div className="row g-5 align-items-start">
      <div className="col-md-7">
        <form className="csd-form-card" onSubmit={handleSubmit}>
          <h2 className="csd-form-title">Đặt lịch khám</h2>
          <p className="csd-form-sub">Điền thông tin để chúng tôi chuẩn bị tư vấn phù hợp nhất cho bạn.</p>

          {error && <div className="csd-notice" style={{ marginBottom: 16, borderLeftColor: '#e24b4a' }}>{error}</div>}

          <div className="row g-3">
            <div className="col-md-6 csd-form-group">
              <label className="csd-label">Họ và tên *</label>
              <input type="text" className="csd-input" value={form.name} onChange={set('name')} placeholder="Nguyễn Thị Lan" required />
            </div>
            <div className="col-md-6 csd-form-group">
              <label className="csd-label">Số điện thoại *</label>
              <input type="tel" className="csd-input" value={form.phone} onChange={set('phone')} placeholder="09xx xxx xxx" required />
            </div>
          </div>

          <div className="csd-form-group">
            <label className="csd-label">Email</label>
            <input type="email" className="csd-input" value={form.email} onChange={set('email')} placeholder="email@example.com" />
          </div>

          <div className="csd-form-group">
            <label className="csd-label">Vấn đề da bạn đang gặp (chọn nhiều)</label>
            <div className="csd-checkbox-group">
              {SKIN_CONCERNS.map(c => (
                <label key={c} className={`csd-skin-opt${form.skin_concerns.includes(c) ? ' selected' : ''}`} onClick={() => toggleConcern(c)}>
                  <input type="checkbox" readOnly checked={form.skin_concerns.includes(c)} />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6 csd-form-group">
              <label className="csd-label">Loại da</label>
              <select className="csd-input" value={form.skin_type} onChange={set('skin_type')}>
                <option value="">-- Chọn loại da --</option>
                {SKIN_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="col-md-6 csd-form-group">
              <label className="csd-label">Đã từng điều trị tại phòng khám?</label>
              <div className="d-flex gap-3 mt-2">
                <label className={`csd-skin-opt${form.prev_treatment === 'yes' ? ' selected' : ''}`} onClick={() => setForm(f => ({ ...f, prev_treatment: 'yes' }))}>
                  <input type="radio" readOnly checked={form.prev_treatment === 'yes'} /> Có
                </label>
                <label className={`csd-skin-opt${form.prev_treatment === 'no' ? ' selected' : ''}`} onClick={() => setForm(f => ({ ...f, prev_treatment: 'no' }))}>
                  <input type="radio" readOnly checked={form.prev_treatment === 'no'} /> Chưa
                </label>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6 csd-form-group">
              <label className="csd-label">Ngày hẹn</label>
              <input type="date" className="csd-input" value={form.appt_date} onChange={set('appt_date')} min={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="col-md-6 csd-form-group">
              <label className="csd-label">Giờ hẹn</label>
              <select className="csd-input" value={form.appt_time} onChange={set('appt_time')}>
                <option value="">-- Chọn giờ --</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="csd-form-group">
            <label className="csd-label">Ghi chú thêm</label>
            <textarea className="csd-input" rows={3} value={form.note} onChange={set('note')} placeholder="Bạn muốn tư vấn thêm điều gì?" />
          </div>

          <button type="submit" className="csd-btn-accent w-100" disabled={submitting} style={{ marginTop: 8 }}>
            {submitting ? 'Đang gửi...' : 'Xác nhận đặt lịch →'}
          </button>
        </form>
      </div>

      <div className="col-md-5">
        <div className="csd-info-panel mb-4">
          <div className="csd-info-panel-title">Thông tin đặt lịch</div>
          <ul className="csd-info-list">
            <li>Tư vấn đầu tiên <strong>miễn phí</strong> — không cam kết mua dịch vụ.</li>
            <li>Xác nhận lịch qua SMS hoặc Zalo trong vòng 30 phút.</li>
            <li>Hủy/dời lịch trước 24 giờ không phát sinh phí.</li>
            <li>Đến trước 10 phút để hoàn thành hồ sơ bệnh nhân.</li>
          </ul>
        </div>

        <div className="csd-info-panel">
          <div className="csd-info-panel-title">Giờ làm việc</div>
          <ul className="csd-opening-hours">
            {hours.split('|').map((h, i) => (
              <li key={i} className="csd-oh-item">
                <span>{h.trim()}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>HOTLINE ĐẶT LỊCH</div>
            <a href={`tel:${phone.replace(/\s/g,'')}`} style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{phone}</a>
          </div>
        </div>
      </div>
    </div>
  )
}
