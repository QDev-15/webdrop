import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const BRANCHES = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Nha Trang']
const SERVICES = ['Khám tổng quát', 'Implant nha khoa', 'Chỉnh nha niềng răng', 'Răng sứ Zirconia', 'Dán sứ Veneer', 'Tẩy trắng răng', 'Răng trẻ em']
const TIME_SLOTS = ['Sáng (8:00 - 12:00)', 'Chiều (13:00 - 17:00)', 'Tối (17:00 - 20:00)']

type Slot = typeof TIME_SLOTS[number]

export default function BookingPage() {
  const { settings } = useSite()
  const [form, setForm] = useState({
    fullname: '', phone: '', email: '', branch: '', service: '',
    pref_date: '', pref_time: '', note: '',
  })
  const [selectedSlot, setSelectedSlot] = useState<Slot>('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSlot = (slot: Slot) => {
    setSelectedSlot(slot)
    set('pref_time', slot)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullname || !form.phone) return
    setStatus('loading')
    try {
      await api.post('/public/bookings', form)
      setStatus('ok')
    } catch {
      setStatus('err')
    }
  }

  return (
    <>
      <section className="vd-page-hero">
        <div className="wd-container">
          <div className="vd-ph-inner">
            <div className="vd-ph-crumb">
              <Link to="/">Trang chủ</Link>
              <span>›</span>
              <span>Đặt lịch</span>
            </div>
            <h1 className="vd-ph-title">Đặt Lịch <em>Khám Bệnh</em></h1>
            <p className="vd-ph-sub">Điền form hoặc gọi {settings.site_phone || '1900 1234'} để được đặt lịch nhanh nhất.</p>
          </div>
        </div>
      </section>

      <section className="vd-sec-pad">
        <div className="wd-container">
          <div className="row g-5 justify-content-center">
            <div className="col-lg-7">
              {status === 'ok' ? (
                <div style={{ textAlign: 'center', padding: '60px 32px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>✓</div>
                  <h2 className="vd-h2">Đặt lịch thành công!</h2>
                  <p className="vd-lead center" style={{ marginTop: 12 }}>
                    Chúng tôi sẽ liên hệ trong vòng 30 phút để xác nhận lịch hẹn của bạn.
                  </p>
                  <div style={{ marginTop: 32 }}>
                    <Link to="/" className="vd-btn vd-btn-primary">Về trang chủ</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-reveal="true">
                  <h2 className="vd-h2" style={{ marginBottom: 8 }}>Thông Tin Đặt Lịch</h2>
                  <p className="vd-lead" style={{ marginBottom: 32, fontSize: 14 }}>Vui lòng điền đầy đủ để chúng tôi phục vụ bạn tốt nhất.</p>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="bk-name">Họ và tên *</label>
                        <input id="bk-name" className="vd-form-input" placeholder="Nguyễn Văn A" value={form.fullname} onChange={e => set('fullname', e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="bk-phone">Số điện thoại *</label>
                        <input id="bk-phone" className="vd-form-input" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="bk-email">Email</label>
                        <input id="bk-email" type="email" className="vd-form-input" placeholder="example@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="bk-branch">Chi nhánh</label>
                        <select id="bk-branch" className="vd-form-select" value={form.branch} onChange={e => set('branch', e.target.value)}>
                          <option value="">-- Chọn chi nhánh --</option>
                          {BRANCHES.map(b => <option key={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="bk-svc">Dịch vụ</label>
                        <select id="bk-svc" className="vd-form-select" value={form.service} onChange={e => set('service', e.target.value)}>
                          <option value="">-- Chọn dịch vụ --</option>
                          {SERVICES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="bk-date">Ngày mong muốn</label>
                        <input id="bk-date" type="date" className="vd-form-input" value={form.pref_date} onChange={e => set('pref_date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="vd-form-group">
                        <label className="vd-form-label">Buổi khám</label>
                        <div className="vd-form-radio-group">
                          {TIME_SLOTS.map(slot => (
                            <label key={slot} className={`vd-form-radio${selectedSlot === slot ? ' checked' : ''}`} onClick={() => handleSlot(slot)}>
                              <input type="radio" name="pref_time" value={slot} checked={selectedSlot === slot} onChange={() => handleSlot(slot)} />
                              {slot.split(' ')[0]}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="bk-note">Ghi chú thêm</label>
                        <textarea id="bk-note" className="vd-form-textarea" placeholder="Triệu chứng, tiền sử bệnh, yêu cầu đặc biệt..." value={form.note} onChange={e => set('note', e.target.value)} rows={4} />
                      </div>
                    </div>
                  </div>

                  {status === 'err' && (
                    <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
                      Có lỗi xảy ra. Vui lòng gọi <a href={`tel:${(settings.site_phone || '1900 1234').replace(/\s/g,'')}`}>{settings.site_phone || '1900 1234'}</a>.
                    </p>
                  )}

                  <button type="submit" className="vd-btn vd-btn-primary vd-btn-block vd-btn-lg" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang gửi...' : 'Xác Nhận Đặt Lịch'}
                  </button>
                  <p className="vd-form-note">Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút</p>
                </form>
              )}
            </div>

            {/* Sidebar info */}
            <div className="col-lg-4" data-reveal="true" data-delay="1">
              <div style={{ background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', padding: 32 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 20, color: 'var(--text)' }}>Thông Tin Liên Hệ</div>
                {[
                  { icon: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z', label: 'Hotline', value: settings.site_phone || '1900 1234' },
                  { icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', label: 'Email', value: settings.site_email || 'contact@vietduc.vn' },
                  { icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z', label: 'Giờ khám', value: settings.working_hours || 'T2-T7: 8:00-20:00' },
                ].map(item => (
                  <div key={item.label} className="vd-contact-info-item" style={{ padding: '14px 0' }}>
                    <div className="vd-ci-icon">
                      <svg viewBox="0 0 24 24"><path d={item.icon} /></svg>
                    </div>
                    <div>
                      <div className="vd-ci-label">{item.label}</div>
                      <div className="vd-ci-value">{item.value}</div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 20, padding: '16px', background: 'var(--accent-pale)', borderRadius: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Chi Nhánh</div>
                  {BRANCHES.map(b => (
                    <div key={b} style={{ fontSize: 13, color: 'var(--text-2)', padding: '4px 0' }}>• {b}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
