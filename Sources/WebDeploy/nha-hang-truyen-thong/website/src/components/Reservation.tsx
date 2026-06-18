import { useState, useEffect, useRef } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface FormData {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: string
  room_type: string
  note: string
}

const TIMES = ['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00']

const today = new Date().toISOString().split('T')[0]

const emptyForm: FormData = {
  name: '', phone: '', email: '', date: '', time: '',
  guests: '', room_type: '', note: '',
}

export default function Reservation() {
  const { settings: s } = useSite()
  const [form, setForm] = useState<FormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = ref.current?.querySelectorAll<Element>('.reveal:not(.visible)') ?? []
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  function set(k: keyof FormData, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const guestsNum = parseInt(form.guests.split(' ')[0]) || 2
      await api.post('/public/reservation', {
        name:     form.name,
        phone:    form.phone,
        email:    form.email,
        date:     form.date,
        time:     form.time,
        guests:   guestsNum,
        menu_pkg: form.room_type,
        note:     form.note,
      })
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đặt bàn thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }} ref={ref}>
      <div className="wd-container">
        <div className="row g-4">
          {/* Form đặt bàn */}
          <div className="col-lg-7 reveal">
            <div className="booking-card">
              <div className="booking-step">
                <div className="step-num">1</div>
                <div className="step-label">Thông tin khách đặt bàn</div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="rName">Họ và tên *</label>
                    <input id="rName" type="text" className="form-control" placeholder="Nguyễn Văn An" value={form.name} onChange={e => set('name', e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="rPhone">Số điện thoại *</label>
                    <input id="rPhone" type="tel" className="form-control" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                  </div>
                </div>

                <div className="booking-step" style={{ marginTop: 8 }}>
                  <div className="step-num">2</div>
                  <div className="step-label">Thời gian và số người</div>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="rDate">Ngày đặt bàn *</label>
                    <input id="rDate" type="date" className="form-control" min={today} value={form.date} onChange={e => set('date', e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="rTime">Giờ đến *</label>
                    <select id="rTime" className="form-control" value={form.time} onChange={e => set('time', e.target.value)} required>
                      <option value="">Chọn giờ...</option>
                      {TIMES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="rGuests">Số người *</label>
                    <select id="rGuests" className="form-control" value={form.guests} onChange={e => set('guests', e.target.value)} required>
                      <option value="">Chọn số người...</option>
                      {['1 người','2 người','3 người','4 người','5 người','6 người','7–10 người','11–20 người','Trên 20 người'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="rRoom">Loại bàn</label>
                    <select id="rRoom" className="form-control" value={form.room_type} onChange={e => set('room_type', e.target.value)}>
                      <option value="">Không yêu cầu cụ thể</option>
                      <option>Bàn thường (trong nhà)</option>
                      <option>Bàn ngoài hiên</option>
                      <option>Phòng riêng gia đình</option>
                      <option>Phòng riêng VIP</option>
                    </select>
                  </div>
                </div>

                <div className="booking-step" style={{ marginTop: 8 }}>
                  <div className="step-num">3</div>
                  <div className="step-label">Yêu cầu đặc biệt (nếu có)</div>
                </div>
                <div className="mb-4">
                  <textarea className="form-control" rows={3} placeholder="Sinh nhật, cần ghế em bé, dị ứng thực phẩm..." value={form.note} onChange={e => set('note', e.target.value)} />
                </div>

                {success && (
                  <div style={{ padding: '14px 16px', background: 'var(--accent-light)', border: '1px solid rgba(180,83,9,.2)', borderRadius: 10, color: 'var(--accent)', fontSize: 14, fontWeight: 500, textAlign: 'center', marginBottom: 16 }}>
                    ✓ Đặt bàn thành công! Chúng tôi sẽ gọi xác nhận trong vòng 30 phút. Cảm ơn bạn!
                  </div>
                )}
                {error && (
                  <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fdd', borderRadius: 10, color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
                    {error}
                  </div>
                )}
                {!success && (
                  <button type="submit" className="form-submit-btn" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Xác nhận đặt bàn →'}
                  </button>
                )}
                <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 12 }}>
                  Bằng cách đặt bàn, bạn đồng ý với điều khoản sử dụng của chúng tôi.
                </p>
              </form>
            </div>
          </div>

          {/* Thông tin nhà hàng */}
          <div className="col-lg-5 reveal reveal-d1">
            <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>Thông tin nhà hàng</div>
              {[
                { icon: '📍', label: 'Địa chỉ', value: s.site_address || 'Xem cài đặt' },
                { icon: '📱', label: 'Điện thoại', value: s.site_phone || '' },
                { icon: '🕐', label: 'Giờ mở cửa', value: s.open_hours_text || s.working_hours || '10:00 – 22:00 (Thứ Hai – Chủ Nhật)' },
                { icon: '🚗', label: 'Chỗ đỗ xe', value: s.parking_info || 'Miễn phí, bãi đỗ riêng 50 xe' },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>{info.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--dark2)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 8 }}>Cần hỗ trợ ngay?</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 4 }}>{s.site_phone || '0901 234 567'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>Hotline mở cửa 9:00 – 22:00 hàng ngày</div>
              {s.social_zalo && (
                <a href={s.social_zalo} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13, background: '#0068FF', color: '#fff', padding: '9px 20px', borderRadius: 8, fontWeight: 500 }}>
                  💬 Nhắn Zalo ngay
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
