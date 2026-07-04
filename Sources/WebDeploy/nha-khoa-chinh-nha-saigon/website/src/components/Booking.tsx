import { useState, useEffect, type FormEvent } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface Service {
  id: number
  name: string
}

interface Props {
  showSideInfo?: boolean
}

export default function Booking({ showSideInfo = true }: Props) {
  const { settings } = useSite()
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    pref_service: '',
    pref_date: '',
    pref_time: '',
    note: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Service[]>('/public/services').then(setServices).catch(() => {})
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.phone) { setError('Vui lòng nhập họ tên và số điện thoại.'); return }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/bookings', form)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '3px' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--accent)' }}>✓</div>
        <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>Đặt lịch thành công!</h3>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>Chúng tôi sẽ liên hệ xác nhận lịch hẹn của bạn trong vòng 30 phút.</p>
      </div>
    )
  }

  return (
    <div className="cn-form-wrap">
      {showSideInfo && (
        <div className="cn-form-side">
          <div className="cn-form-side-inner">
            <h3 className="cn-form-side-title">Đặt lịch tư vấn miễn phí</h3>
            <p className="cn-form-side-text">Điền thông tin bên cạnh, chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 30 phút trong giờ làm việc.</p>
            <div className="cn-form-info-item">
              <div className="cn-form-info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              </div>
              <div>
                <div className="cn-form-info-label">Thời gian xác nhận</div>
                <div className="cn-form-info-value">Trong vòng 30 phút</div>
              </div>
            </div>
            <div className="cn-form-info-item">
              <div className="cn-form-info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              </div>
              <div>
                <div className="cn-form-info-label">Giờ làm việc</div>
                <div className="cn-form-info-value">T2–T7: 8:00–20:00 · CN: 8:00–12:00</div>
              </div>
            </div>
            <div className="cn-form-info-item">
              <div className="cn-form-info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
              </div>
              <div>
                <div className="cn-form-info-label">Hotline</div>
                <div className="cn-form-info-value">{settings.site_phone || '028 3822 XXXX'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <form className="cn-form-main" onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: '#fef2f2', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '3px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        <div className="cn-form-row">
          <div className="cn-form-group">
            <label className="cn-form-label" htmlFor="bk-name">Họ tên <span className="req" style={{ color: 'var(--accent)' }}>*</span></label>
            <input id="bk-name" className="cn-form-control" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} required placeholder="Nguyễn Văn A" />
          </div>
          <div className="cn-form-group">
            <label className="cn-form-label" htmlFor="bk-phone">Số điện thoại <span className="req" style={{ color: 'var(--accent)' }}>*</span></label>
            <input id="bk-phone" className="cn-form-control" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="0901 234 567" />
          </div>
        </div>
        <div className="cn-form-group">
          <label className="cn-form-label" htmlFor="bk-email">Email</label>
          <input id="bk-email" className="cn-form-control" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="example@email.com" />
        </div>
        <div className="cn-form-group">
          <label className="cn-form-label" htmlFor="bk-service">Dịch vụ quan tâm</label>
          <select id="bk-service" className="cn-form-control" value={form.pref_service} onChange={e => set('pref_service', e.target.value)}>
            <option value="">-- Chọn dịch vụ --</option>
            {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div className="cn-form-row">
          <div className="cn-form-group">
            <label className="cn-form-label" htmlFor="bk-date">Ngày muốn hẹn</label>
            <input id="bk-date" className="cn-form-control" type="date" value={form.pref_date} onChange={e => set('pref_date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="cn-form-group">
            <label className="cn-form-label" htmlFor="bk-time">Giờ muốn hẹn</label>
            <select id="bk-time" className="cn-form-control" value={form.pref_time} onChange={e => set('pref_time', e.target.value)}>
              <option value="">-- Chọn giờ --</option>
              {['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="cn-form-group">
          <label className="cn-form-label" htmlFor="bk-note">Ghi chú thêm</label>
          <textarea id="bk-note" className="cn-form-control" rows={3} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Tình trạng răng, câu hỏi muốn tư vấn..." />
        </div>
        <button type="submit" className="cn-btn cn-btn-primary cn-btn-block" disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Đặt lịch tư vấn'}
        </button>
      </form>
    </div>
  )
}
