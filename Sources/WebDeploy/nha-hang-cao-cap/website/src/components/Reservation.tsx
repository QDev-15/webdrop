import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../App'

interface ReservationPayload {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  menu_pkg: string
  note: string
}

const TIME_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

const PACKAGES = [
  { value: '', label: 'Chọn thực đơn (tùy chọn)' },
  { value: 'A-la-carte', label: 'À la carte' },
  { value: 'Menu-5-mon', label: 'Menu Tasting 5 món — 2.800.000₫/người' },
  { value: 'Menu-8-mon', label: 'Menu Tasting 8 món — 4.500.000₫/người' },
  { value: 'Omakase', label: 'Omakase — Liên hệ' },
]

const emptyForm: ReservationPayload = {
  name: '', phone: '', email: '', date: '', time: '19:00', guests: 2, menu_pkg: '', note: ''
}

export default function Reservation() {
  const { settings } = useSite()
  const [form, setForm] = useState<ReservationPayload>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function set<K extends keyof ReservationPayload>(k: K, v: ReservationPayload[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/public/reservation', form)
      setSuccess(true)
      setForm(emptyForm)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đặt bàn thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="dat-ban" style={{ background: 'var(--dark2)', padding: 'clamp(72px, 10vw, 128px) 0' }}>
      <div className="wd-container">
        <div className="row align-items-center g-5">
          {/* Left info panel */}
          <div className="col-lg-5">
            <div className="sec-dark">
              <div className="eyebrow">Đặt bàn</div>
              <h2 className="sec-title" style={{ marginBottom: 14 }}>
                Trải nghiệm <em>đỉnh cao</em>
              </h2>
            </div>
            <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,.4)', lineHeight: 1.8, marginBottom: 28 }}>
              {settings.reservation_section_subtitle || 'Không gian yên tĩnh, riêng tư — nơi mỗi bữa ăn trở thành ký ức đẹp không thể nào quên. Chúng tôi nhận tối đa 28 thực khách mỗi tối để đảm bảo chất lượng phục vụ tốt nhất.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '🕕', label: 'Giờ phục vụ', value: settings.working_hours || '18:00 – 22:30 (Thứ 2 – Chủ nhật)' },
                { icon: '📍', label: 'Địa chỉ', value: settings.site_address || '12 Lý Thái Tổ, Hoàn Kiếm, Hà Nội' },
                { icon: '📞', label: 'Điện thoại', value: settings.site_phone || '024 1234 5678' },
                { icon: '✉', label: 'Email', value: settings.site_email || 'reservation@lamaison.vn' },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{info.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{info.label}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', fontWeight: 400 }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(184,147,74,.08)', border: '1px solid rgba(184,147,74,.2)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Lưu ý đặt bàn</div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: 'rgba(255,255,255,.35)', lineHeight: 2, fontWeight: 300 }}>
                <li>Đặt bàn trước ít nhất 24 giờ</li>
                <li>Đặt cọc 50% cho nhóm từ 6 người trở lên</li>
                <li>Huỷ miễn phí trước 48 giờ</li>
                <li>Mang theo confirmation email khi đến</li>
              </ul>
            </div>
          </div>

          {/* Right form */}
          <div className="col-lg-7">
            {success ? (
              <div className="inline-form" style={{ textAlign: 'center', padding: '48px 32px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 500, marginBottom: 10 }}>Đặt bàn thành công!</h3>
                <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, fontWeight: 300, lineHeight: 1.8, marginBottom: 24 }}>
                  Cảm ơn bạn đã tin tưởng La Maison. Chúng tôi sẽ xác nhận đặt bàn qua điện thoại trong vòng 2 giờ.
                </p>
                <button onClick={() => setSuccess(false)} className="btn-accent">Đặt bàn khác</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="inline-form">
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 500, marginBottom: 24, letterSpacing: -.3 }}>
                  Thông tin đặt bàn
                </h3>

                {error && (
                  <div style={{ padding: '10px 14px', background: 'rgba(226,75,74,.12)', border: '1px solid rgba(226,75,74,.3)', borderRadius: 8, color: '#ff8080', fontSize: 13, marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Họ tên *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Điện thoại *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="0912 345 678"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Ngày *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.date}
                      onChange={e => set('date', e.target.value)}
                      min={today}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Giờ *</label>
                    <select className="form-control" value={form.time} onChange={e => set('time', e.target.value)} required>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Số khách *</label>
                    <select className="form-control" value={form.guests} onChange={e => set('guests', parseInt(e.target.value))}>
                      {[1,2,3,4,5,6,7,8,10,12,15,20].map(n => (
                        <option key={n} value={n}>{n} khách{n >= 15 ? ' (Private Dining)' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Thực đơn</label>
                    <select className="form-control" value={form.menu_pkg} onChange={e => set('menu_pkg', e.target.value)}>
                      {PACKAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Ghi chú thêm</label>
                    <textarea
                      className="form-control"
                      value={form.note}
                      onChange={e => set('note', e.target.value)}
                      placeholder="Dị ứng thực phẩm, yêu cầu đặc biệt, dịp đặc biệt..."
                      rows={3}
                    />
                  </div>
                  <div className="col-12" style={{ paddingTop: 4 }}>
                    <button type="submit" className="btn-accent" disabled={submitting} style={{ width: '100%', padding: '14px 0', fontSize: 14 }}>
                      {submitting ? 'Đang gửi...' : 'Xác nhận đặt bàn'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
