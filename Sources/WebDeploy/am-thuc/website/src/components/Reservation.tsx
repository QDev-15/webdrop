import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface ReservationForm {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: string
  area: string
  note: string
}

const TIMES = ['10:00','10:30','11:00','11:30','12:00','12:30','13:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00']

const AREAS = [
  { key: 'trong-nha', icon: '🪑', title: 'Trong nhà', desc: 'Điều hoà mát' },
  { key: 'san-vuon', icon: '🌿', title: 'Sân vườn', desc: 'View cây xanh' },
  { key: 'phong-rieng', icon: '🏠', title: 'Phòng riêng', desc: 'Từ 8 người' },
  { key: 'tang-thuong', icon: '🌆', title: 'Tầng thượng', desc: 'View đẹp' },
]

export default function Reservation() {
  const { settings } = useSite()
  const s = settings
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState<ReservationForm>({
    name: '', phone: '', email: '', date: '', time: '', guests: '2', area: 'trong-nha', note: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setError('')
    if (!form.name || !form.phone || !form.date || !form.time) {
      setError('Vui lòng điền đầy đủ thông tin đặt bàn.')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/public/reservation', { ...form, guests: parseInt(form.guests) })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt bàn thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmNote = s.reservation_confirm_note || 'Xác nhận qua điện thoại trong 30 phút · Miễn phí hủy trước 2 giờ'
  const parkingInfo = s.parking_info || 'Miễn phí · 50 chỗ · Có bảo vệ'

  return (
    <div className="row g-5">
      <div className="col-lg-7">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(24px,4vw,40px)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Đặt bàn thành công!</h3>
              <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>Chúng tôi sẽ gọi điện xác nhận trong 30 phút. Hẹn gặp bạn tại nhà hàng!</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', date: '', time: '', guests: '2', area: 'trong-nha', note: '' }) }} className="btn-accent">Đặt bàn khác</button>
            </div>
          ) : (
            <>
              {/* Step 1: Area */}
              <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                  Chọn khu vực
                </div>
                <div className="row g-2">
                  {AREAS.map(area => (
                    <div key={area.key} className="col-md-4" style={{ width: '25%' }}>
                      <div
                        className={`area-card${form.area === area.key ? ' selected' : ''}`}
                        onClick={() => setForm(p => ({ ...p, area: area.key }))}
                      >
                        <div className="area-icon">{area.icon}</div>
                        <div className="area-title">{area.title}</div>
                        <div className="area-desc">{area.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Date/Time/Guests */}
              <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                  Ngày, giờ & số lượng
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Ngày *</label>
                    <input type="date" className="form-control" min={today} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Giờ *</label>
                    <select className="form-control form-select" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
                      <option value="">-- Chọn giờ --</option>
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Số người *</label>
                    <select className="form-control form-select" value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}>
                      {[1,2,3,4,5,6,7,8,10,15,20].map(n => <option key={n} value={n}>{n} người</option>)}
                      <option value="30">Trên 20 người</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Contact */}
              <div className="mb-4">
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                  Thông tin khách hàng
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Họ và tên *</label>
                    <input type="text" className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại *</label>
                    <input type="tel" className="form-control" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="0901 234 567" />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Yêu cầu đặc biệt (tùy chọn)</label>
                    <textarea className="form-control" rows={3} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Dịp đặc biệt, yêu cầu về chỗ ngồi, dị ứng thực phẩm..." />
                  </div>
                </div>
              </div>

              {error && <div className="alert-error" style={{ marginBottom: 14 }}>{error}</div>}

              <button onClick={handleSubmit} className="btn-accent w-100" style={{ padding: 14, fontSize: 15 }} disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Xác nhận đặt bàn →'}
              </button>
              <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 12, fontWeight: 300 }}>{confirmNote}</p>
            </>
          )}
        </div>
      </div>

      <div className="col-lg-5">
        <div className="info-box mb-3 reveal">
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>🕐 Giờ phục vụ</div>
          <div style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.8 }}>
            {(s.working_hours || 'Trưa: 10:00 – 14:00 | Tối: 17:30 – 22:00').split('|').map((h, i) => (
              <div key={i}>{h.trim()}</div>
            ))}
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Mở cửa hàng ngày, kể cả ngày lễ</div>
          </div>
        </div>
        <div className="info-box mb-3 reveal reveal-d1">
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>🎉 Tiệc & Sự kiện</div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 12 }}>Chúng tôi nhận tổ chức sinh nhật, kỷ niệm, họp mặt gia đình, tiệc công ty.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Phòng riêng từ 8 đến 50 người', 'Trang trí theo yêu cầu', 'Menu đặc biệt cho tiệc'].map(item => (
              <div key={item} style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--accent)' }}>✓</span>{item}
              </div>
            ))}
          </div>
        </div>
        <div className="info-box reveal reveal-d2">
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>📍 Vị trí & Bãi đỗ xe</div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7 }}>
            {s.site_address || '[Địa chỉ nhà hàng đầy đủ]'}<br />
            {parkingInfo}
          </p>
        </div>
      </div>
    </div>
  )
}
