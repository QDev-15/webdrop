import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

const SERVICES = [
  { group: 'Nail Tay 💅', options: ['Sơn thường', 'Gel màu cơ bản', 'Gel màu nâng cao', 'Nail Art đơn giản', 'Nail Art phức tạp'] },
  { group: 'Nail Chân & Pedicure 🦶', options: ['Pedicure cơ bản', 'Pedicure + gel', 'Pedicure cao cấp (dưỡng ẩm)', 'Gel pedicure'] },
  { group: 'Nail Art 🎨', options: ['Vẽ tay đơn giản', 'Vẽ tay phức tạp', 'Đính đá', 'Hoa khô / foil', 'Thiết kế 3D'] },
  { group: 'Acrylic & Đắp bột 🔮', options: ['Đắp bột cơ bản', 'Đắp acrylic', 'Gia hạn móng', 'Sửa móng gãy'] },
]

const TECHNICIANS = ['Linh Nguyễn', 'Mai Trần', 'Hoa Lê', 'Châu Phạm']

const TIME_SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00']

const blank = { name: '', phone: '', service: '', technician: '', date: '', time: '', note: '' }

export default function BookingPage() {
  const { settings } = useSite()
  const s = (k: string, fb = '') => settings[k] || fb
  const [form, setForm] = useState(blank)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  function setF(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSending(true); setErr('')
    if (!form.time) { setErr('Vui lòng chọn giờ hẹn.'); setSending(false); return }
    try {
      await api.post('/public/booking', form)
      setSent(true)
    } catch (e) { setErr(e instanceof Error ? e.message : 'Đặt lịch thất bại. Vui lòng thử lại.') }
    setSending(false)
  }

  return (
    <>
      {/* Page hero */}
      <section className="ns-page-hero">
        <div className="wd-container">
          <div data-reveal>
            <div className="ns-ph-tag">Đặt lịch hẹn</div>
            <h1 className="ns-ph-title">Đặt lịch <strong>nhanh & dễ dàng</strong></h1>
            <p className="ns-ph-sub">Chọn dịch vụ, thợ nail và giờ hẹn phù hợp với bạn.</p>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-5">
            {/* Form */}
            <div className="col-lg-7" data-reveal>
              <div className="ns-booking-wrap">
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>💅</div>
                    <h3 style={{ fontWeight: 600, fontSize: 22, marginBottom: 10 }}>Đặt lịch thành công!</h3>
                    <p style={{ color: 'var(--text-2)', fontSize: 15, marginBottom: 24 }}>
                      Chúng tôi sẽ liên hệ xác nhận lịch hẹn qua điện thoại trong vòng 30 phút.
                    </p>
                    <Link to="/" className="ns-btn-primary">Về trang chủ</Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {err && <div style={{ background: '#fdf0ec', border: '1px solid var(--accent)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: 'var(--accent)', fontSize: 13 }}>{err}</div>}

                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label className="ns-form-label">Họ tên *</label>
                        <input className="ns-form-control" value={form.name} onChange={e => setF('name', e.target.value)} required placeholder="Nguyễn Thị A" />
                      </div>
                      <div className="col-sm-6">
                        <label className="ns-form-label">Số điện thoại *</label>
                        <input className="ns-form-control" type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} required placeholder="0901 234 567" />
                      </div>
                    </div>

                    <div className="row g-3 mt-1">
                      <div className="col-sm-6">
                        <label className="ns-form-label">Dịch vụ *</label>
                        <select className="ns-form-select" value={form.service} onChange={e => setF('service', e.target.value)} required>
                          <option value="">— Chọn dịch vụ —</option>
                          {SERVICES.map(group => (
                            <optgroup key={group.group} label={group.group}>
                              {group.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="ns-form-label">Chọn thợ nail</label>
                        <select className="ns-form-select" value={form.technician} onChange={e => setF('technician', e.target.value)}>
                          <option value="">Không có yêu cầu</option>
                          {TECHNICIANS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mt-1">
                      <div className="col-sm-6">
                        <label className="ns-form-label">Ngày hẹn *</label>
                        <input className="ns-form-control" type="date" value={form.date} onChange={e => setF('date', e.target.value)} required min={today} />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="ns-form-label">Giờ hẹn *</label>
                      <div className="ns-time-grid mt-2">
                        {TIME_SLOTS.map(t => (
                          <button key={t} type="button"
                            className={`ns-time-slot${form.time === t ? ' selected' : ''}`}
                            onClick={() => setF('time', t)}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="ns-form-label">Ghi chú</label>
                      <textarea className="ns-form-control" rows={3} value={form.note} onChange={e => setF('note', e.target.value)} placeholder="Yêu cầu đặc biệt, mẫu nail muốn làm..." />
                    </div>

                    <button type="submit" className="ns-btn-primary mt-4" disabled={sending} style={{ width: '100%' }}>
                      {sending ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar info */}
            <div className="col-lg-5" data-reveal data-reveal-d="d1">
              <div className="ns-booking-info">
                <div className="ns-info-title">Thông tin cần biết</div>
                <div className="ns-info-item">
                  <div className="ns-info-icon">📍</div>
                  <div className="ns-info-text">
                    <strong>Địa chỉ</strong>
                    <span>{s('site_address', 'Liên hệ để biết địa chỉ')}</span>
                  </div>
                </div>
                <div className="ns-info-item">
                  <div className="ns-info-icon">📞</div>
                  <div className="ns-info-text">
                    <strong>Điện thoại</strong>
                    <span>{s('site_phone', 'Đang cập nhật')}</span>
                  </div>
                </div>
                <div className="ns-info-item">
                  <div className="ns-info-icon">🕐</div>
                  <div className="ns-info-text">
                    <strong>Giờ mở cửa</strong>
                    <span>{s('working_hours', 'Thứ 2 – Chủ nhật: 8:00 – 19:00')}</span>
                  </div>
                </div>
                <div className="ns-info-item">
                  <div className="ns-info-icon">⚡</div>
                  <div className="ns-info-text">
                    <strong>Lưu ý khi đặt lịch</strong>
                    <span>Vui lòng đến đúng giờ. Có thể hủy lịch trước 2 tiếng.</span>
                  </div>
                </div>
              </div>

              {s('map_embed') && (
                <div className="ns-map-wrap mt-3">
                  <iframe src={s('map_embed')} width="100%" height="240" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
