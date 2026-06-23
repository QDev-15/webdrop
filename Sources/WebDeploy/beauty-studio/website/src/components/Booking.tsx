import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface BookingForm {
  name: string; phone: string; service_group: string; service_detail: string
  stylist: string; book_date: string; book_time: string; note: string
}

const empty: BookingForm = { name: '', phone: '', service_group: '', service_detail: '', stylist: '', book_date: '', book_time: '', note: '' }
const SERVICE_GROUPS = ['Tóc', 'Nail', 'Makeup', 'Skincare', 'Combo']
const STYLISTS = ['Không chọn (hệ thống phân công)', 'Nguyễn Hoa Linh', 'Trần Bích Thuỷ', 'Lê Minh Châu', 'Phạm Thu Hằng']

export default function Booking() {
  const { settings } = useSite()
  const [form, setForm]     = useState<BookingForm>(empty)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]   = useState('')

  function set<K extends keyof BookingForm>(k: K, v: string) {
    setForm(p => ({ ...p, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.service_group || !form.book_date || !form.book_time) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc (*).')
      return
    }
    setSending(true); setError('')
    try {
      await api.post('/public/booking', form)
      setSuccess(true); setForm(empty)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt lịch thất bại. Vui lòng thử lại.')
    } finally { setSending(false) }
  }

  return (
    <section id="dat-lich" className="sec-pad" style={{ background: 'var(--bg-soft)' }}>
      <div className="wd-container">
        <div className="row align-items-start g-5">
          {/* Left info */}
          <div className="col-lg-4">
            <div data-reveal>
              <div className="bst-eyebrow">Đặt lịch</div>
              <h2 className="bst-title">{settings.booking_title || 'Đặt lịch ngay hôm nay'}</h2>
              <p className="bst-sub">{settings.booking_subtitle || 'Chỉ mất 30 giây — nhận xác nhận trong vòng 1 giờ.'}</p>
            </div>

            <div style={{ marginTop: 32 }} data-reveal data-delay="1">
              {settings.site_phone && (
                <div className="bst-info-item">
                  <div className="bst-info-icon">📞</div>
                  <div>
                    <div className="bst-info-label">Hotline</div>
                    <div className="bst-info-value"><a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a></div>
                  </div>
                </div>
              )}
              {settings.working_hours && (
                <div className="bst-info-item">
                  <div className="bst-info-icon">🕐</div>
                  <div>
                    <div className="bst-info-label">Giờ phục vụ</div>
                    <div className="bst-info-value">{settings.working_hours}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="col-lg-8" data-reveal>
            {success ? (
              <div className="bst-form-card text-center" style={{ padding: 56 }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>✨</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Đặt lịch thành công!</h3>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Chúng tôi sẽ liên hệ xác nhận trong vòng 1 giờ. Cảm ơn bạn!</p>
                <button className="bst-btn-primary" onClick={() => setSuccess(false)}>Đặt lịch khác</button>
              </div>
            ) : (
              <div className="bst-form-card">
                {error && <div style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.3)', color: '#fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Họ & Tên <span className="bst-required">*</span></label>
                        <input className="bst-form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Thị Hoa" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Số điện thoại <span className="bst-required">*</span></label>
                        <input className="bst-form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" type="tel" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Nhóm dịch vụ <span className="bst-required">*</span></label>
                        <select className="bst-form-control bst-form-select" value={form.service_group} onChange={e => set('service_group', e.target.value)} required>
                          <option value="">-- Chọn nhóm --</option>
                          {SERVICE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Dịch vụ cụ thể</label>
                        <input className="bst-form-control" value={form.service_detail} onChange={e => set('service_detail', e.target.value)} placeholder="vd: Nhuộm highlight, Gel nail Pháp" />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Chọn Stylist / Artist</label>
                        <select className="bst-form-control bst-form-select" value={form.stylist} onChange={e => set('stylist', e.target.value)}>
                          {STYLISTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Ngày hẹn <span className="bst-required">*</span></label>
                        <input className="bst-form-control" type="date" value={form.book_date} onChange={e => set('book_date', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Giờ hẹn <span className="bst-required">*</span></label>
                        <select className="bst-form-control bst-form-select" value={form.book_time} onChange={e => set('book_time', e.target.value)} required>
                          <option value="">-- Chọn giờ --</option>
                          {['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bst-form-group">
                        <label className="bst-form-label">Ghi chú thêm</label>
                        <textarea className="bst-form-control" rows={3} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Yêu cầu đặc biệt, dị ứng hóa chất, phong cách mong muốn..." />
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="bst-btn-primary" disabled={sending} style={{ width: '100%', justifyContent: 'center' }}>
                        {sending ? 'Đang gửi...' : '✨ Xác nhận đặt lịch'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
