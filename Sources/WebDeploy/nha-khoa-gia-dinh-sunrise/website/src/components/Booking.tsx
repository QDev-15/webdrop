import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface BookingBody {
  fullname: string
  phone: string
  email: string
  service: string
  member_count: string
  date: string
  time: string
  note: string
}

const SERVICES = [
  'Khám tổng quát & tư vấn',
  'Nha khoa trẻ em',
  'Trám răng Composite',
  'Điều trị tủy răng',
  'Nhổ răng khôn',
  'Niềng răng',
  'Tẩy trắng răng',
  'Dán sứ Veneer',
  'Cấy ghép Implant',
  'Khác (mô tả trong ghi chú)',
]

const TIMES = ['8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '19:00 - 20:00']

const EMPTY: BookingBody = { fullname: '', phone: '', email: '', service: '', member_count: '1', date: '', time: '', note: '' }

export default function Booking() {
  const { settings } = useSite()
  const [form, setForm] = useState<BookingBody>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const phone   = settings.site_phone    || '0900 000 000'
  const email   = settings.site_email    || 'contact@sunrise-dental.vn'
  const address = settings.site_address  || '123 Đường Gia Đình, Quận 1, TP.HCM'
  const hours   = settings.working_hours || 'Thứ 2 - Chủ nhật: 8:00 - 20:00'

  const set = (k: keyof BookingBody, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullname || !form.phone) { setError('Vui lòng nhập họ tên và số điện thoại.'); return }
    setSaving(true); setError('')
    try {
      await api.post('/public/bookings', form)
      setSuccess(true)
      setForm(EMPTY)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại hoặc gọi điện trực tiếp.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
      {/* Form */}
      <div className="sr-form-panel">
        {success && (
          <div className="sr-form-success show">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút.</span>
          </div>
        )}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid var(--danger)', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px', fontSize: '14px', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="sr-form-row">
            <div className="sr-field">
              <label htmlFor="bk-fullname">Họ tên <span className="req">*</span></label>
              <input id="bk-fullname" className="sr-input" value={form.fullname} onChange={e => set('fullname', e.target.value)} placeholder="Nguyễn Văn A" required />
            </div>
            <div className="sr-field">
              <label htmlFor="bk-phone">Số điện thoại <span className="req">*</span></label>
              <input id="bk-phone" className="sr-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0912 345 678" required />
            </div>
          </div>

          <div className="sr-form-row">
            <div className="sr-field">
              <label htmlFor="bk-email">Email</label>
              <input id="bk-email" className="sr-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="sr-field">
              <label htmlFor="bk-service">Dịch vụ muốn khám</label>
              <select id="bk-service" className="sr-select" value={form.service} onChange={e => set('service', e.target.value)}>
                <option value="">-- Chọn dịch vụ --</option>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="sr-form-row">
            <div className="sr-field">
              <label htmlFor="bk-date">Ngày muốn khám</label>
              <input id="bk-date" className="sr-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="sr-field">
              <label htmlFor="bk-time">Khung giờ</label>
              <select id="bk-time" className="sr-select" value={form.time} onChange={e => set('time', e.target.value)}>
                <option value="">-- Chọn giờ --</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="sr-form-row">
            <div className="sr-field">
              <label htmlFor="bk-members">Số thành viên khám</label>
              <select id="bk-members" className="sr-select" value={form.member_count} onChange={e => set('member_count', e.target.value)}>
                <option value="1">1 người</option>
                <option value="2">2 người</option>
                <option value="3">3 người</option>
                <option value="4+">4+ người</option>
              </select>
            </div>
          </div>

          <div className="sr-field">
            <label htmlFor="bk-note">Ghi chú thêm</label>
            <textarea id="bk-note" className="sr-textarea" value={form.note} onChange={e => set('note', e.target.value)} placeholder="Bác có tiền sử bệnh, dị ứng thuốc, hoặc yêu cầu đặc biệt..." style={{ minHeight: '90px' }} />
          </div>

          <button type="submit" className="sr-btn sr-btn-primary sr-btn-block" disabled={saving}>
            {saving ? 'Đang gửi...' : 'Gửi yêu cầu đặt lịch'}
          </button>
          <p className="sr-form-note" style={{ textAlign: 'center', marginTop: '14px' }}>
            Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút trong giờ làm việc.
          </p>
        </form>
      </div>

      {/* Sidebar info */}
      <div className="sr-info-card">
        <div className="sr-info-title">Thông tin liên hệ</div>

        <div className="sr-info-item">
          <div className="sr-info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <div className="sr-info-label">Điện thoại</div>
            <div className="sr-info-value">
              <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit' }}>{phone}</a>
            </div>
          </div>
        </div>

        <div className="sr-info-item">
          <div className="sr-info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M4 6l8 6 8-6"/></svg>
          </div>
          <div>
            <div className="sr-info-label">Email</div>
            <div className="sr-info-value">
              <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>
            </div>
          </div>
        </div>

        <div className="sr-info-item">
          <div className="sr-info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <div className="sr-info-label">Địa chỉ</div>
            <div className="sr-info-value">{address}</div>
          </div>
        </div>

        <div className="sr-info-item">
          <div className="sr-info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
          </div>
          <div>
            <div className="sr-info-label">Giờ làm việc</div>
            <div className="sr-info-value">{hours}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
