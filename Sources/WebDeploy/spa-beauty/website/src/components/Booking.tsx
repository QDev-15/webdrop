import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00']

export default function Booking() {
  const { settings: s, services, team } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', service: '', therapist: '', date: '', time: '', note: '' })
  const [selectedTime, setSelectedTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function setF(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.service) { setError('Vui lòng chọn dịch vụ.'); return }
    if (!selectedTime) { setError('Vui lòng chọn khung giờ.'); return }
    if (!form.name || !form.phone) { setError('Vui lòng điền họ tên và số điện thoại.'); return }

    setSubmitting(true); setError('')
    try {
      await api.post('/public/booking', { ...form, time: selectedTime })
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="sb-booking-wrap" style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
        <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>Đặt lịch thành công!</h3>
        <p style={{ fontSize: 15, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 24 }}>
          {s.booking_note || 'Chúng tôi sẽ xác nhận qua Zalo trong vòng 15 phút. Cảm ơn bạn đã tin tưởng!'}
        </p>
        <button className="sb-btn-accent" onClick={() => { setSuccess(false); setForm({ name:'',phone:'',service:'',therapist:'',date:'',time:'',note:'' }); setSelectedTime('') }}>
          Đặt thêm lịch
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <div className="row g-5">
        <div className="col-lg-7">
          <div className="sb-booking-wrap">
            {/* Step 1: Service */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className="sb-step-badge">1</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Chọn dịch vụ</span>
              </div>
              <div className="mb-3">
                <label className="sb-form-label">Loại dịch vụ *</label>
                <select className="sb-form-select" value={form.service} onChange={e => setF('service', e.target.value)} required>
                  <option value="">— Chọn dịch vụ —</option>
                  {services.map(svc => (
                    <option key={svc.id} value={svc.name}>{svc.name} {svc.price ? `— ${svc.price}` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="sb-form-label">Chuyên viên (tùy chọn)</label>
                <select className="sb-form-select" value={form.therapist} onChange={e => setF('therapist', e.target.value)}>
                  <option value="">Không có yêu cầu đặc biệt</option>
                  {team.map(m => (
                    <option key={m.id} value={m.name}>{m.name} — {m.role}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className="sb-step-badge">2</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Chọn ngày &amp; giờ</span>
              </div>
              <div className="mb-3">
                <label className="sb-form-label">Ngày muốn đến *</label>
                <input type="date" className="sb-form-control" min={today} value={(form.date) || today} onChange={e => setF('date', e.target.value)} required />
              </div>
              <div>
                <label className="sb-form-label">Chọn khung giờ *</label>
                <div className="sb-time-grid" style={{ marginTop: 8 }}>
                  {TIME_SLOTS.map(t => (
                    <button
                      type="button" key={t}
                      className={`sb-time-slot${selectedTime === t ? ' selected' : ''}`}
                      onClick={() => setSelectedTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8, fontWeight: 300 }}>Chọn khung giờ phù hợp với bạn</p>
              </div>
            </div>

            {/* Step 3: Contact */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className="sb-step-badge">3</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Thông tin liên hệ</span>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="sb-form-label">Họ và tên *</label>
                  <input type="text" className="sb-form-control" placeholder="Nguyễn Thị Lan" value={form.name} onChange={e => setF('name', e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="sb-form-label">Số điện thoại / Zalo *</label>
                  <input type="tel" className="sb-form-control" placeholder="0901 234 567" value={form.phone} onChange={e => setF('phone', e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="sb-form-label">Ghi chú (tùy chọn)</label>
                  <textarea className="sb-form-control" rows={3} placeholder="Dị ứng, yêu cầu đặc biệt, tình trạng sức khỏe cần lưu ý..." value={form.note} onChange={e => setF('note', e.target.value)} />
                </div>
              </div>
            </div>

            {error && <div style={{ marginTop: 16, color: 'var(--danger)', fontSize: 14 }}>{error}</div>}

            <button type="submit" className="sb-btn-accent w-100" style={{ marginTop: 20, padding: 14, fontSize: 15 }} disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Xác nhận đặt lịch →'}
            </button>
            <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 12, fontWeight: 300 }}>
              {s.booking_note || 'Chúng tôi sẽ xác nhận qua Zalo trong 15 phút. Miễn phí hủy trước 2 giờ.'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-5">
          <div className="sb-info-card mb-3" data-reveal>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>📍 Địa chỉ &amp; Giờ mở cửa</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.8 }}>
              {s.site_address  && <div><strong style={{ color: 'var(--text)', fontWeight: 500 }}>Địa chỉ:</strong> {s.site_address}</div>}
              {s.working_hours && <div><strong style={{ color: 'var(--text)', fontWeight: 500 }}>Giờ mở cửa:</strong> {s.working_hours}</div>}
              {s.site_phone    && <div><strong style={{ color: 'var(--text)', fontWeight: 500 }}>Điện thoại:</strong> {s.site_phone}</div>}
              {s.zalo_number   && <div><strong style={{ color: 'var(--text)', fontWeight: 500 }}>Zalo:</strong> {s.zalo_number}</div>}
            </div>
          </div>

          <div className="sb-info-card mb-3" data-reveal style={{ transitionDelay: '.1s' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>✨ Ưu đãi đặc biệt</div>
            {[1,2,3].map(i => {
              const title = s[`booking_promo${i}_title`]
              const desc  = s[`booking_promo${i}_desc`]
              if (!title && !desc) return null
              return (
                <div key={i} className="sb-promo-item">
                  {title && <div className="sb-promo-title">{title}</div>}
                  {desc  && <div className="sb-promo-desc">{desc}</div>}
                </div>
              )
            })}
          </div>

          {s.zalo_number && (
            <div className="sb-info-card" data-reveal style={{ transitionDelay: '.2s' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>💬 Hỗ trợ nhanh</div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
                Có câu hỏi? Nhắn Zalo để được tư vấn ngay — chúng tôi thường trả lời trong 5 phút.
              </p>
              <a href={`https://zalo.me/${s.zalo_number}`} target="_blank" rel="noopener noreferrer" className="sb-btn-accent" style={{ display: 'block', textAlign: 'center' }}>
                💬 Chat Zalo ngay
              </a>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
