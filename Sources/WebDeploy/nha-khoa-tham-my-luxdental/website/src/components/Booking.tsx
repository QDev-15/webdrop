import { useEffect, useState, FormEvent } from 'react'
import { useSite } from '../App'

interface Service {
  id: number
  name: string
}

export default function Booking() {
  const { apiBase } = useSite()
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState({ fullname: '', phone: '', email: '', service: '', date: '', time: '', note: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30', '17:30']

  useEffect(() => {
    fetch(`${apiBase}/public/services`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(res => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
  }, [apiBase])

  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.fullname.trim() || !form.phone.trim()) {
      setErrMsg('Vui lòng nhập họ tên và số điện thoại.'); return
    }
    setStatus('sending'); setErrMsg('')
    try {
      const res = await fetch(`${apiBase}/public/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('ok')
      setForm({ fullname: '', phone: '', email: '', service: '', date: '', time: '', note: '' })
    } catch {
      setStatus('err')
      setErrMsg('Gửi đặt lịch thất bại. Vui lòng thử lại hoặc gọi hotline.')
    }
  }

  return (
    <div className="lx-form">
      {status === 'ok' ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
            Đặt lịch thành công!
          </div>
          <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>
            Chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút.
          </p>
          <button className="lx-btn lx-btn-accent" onClick={() => setStatus('idle')}>
            Đặt lịch mới
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="row gy-3">
            <div className="col-md-6">
              <div className="lx-field">
                <label htmlFor="bk-fullname" className="lx-label">Họ &amp; tên <em>*</em></label>
                <input id="bk-fullname" type="text" className="lx-input" value={form.fullname} onChange={e => set('fullname', e.target.value)} placeholder="Nguyễn Văn A" required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="lx-field">
                <label htmlFor="bk-phone" className="lx-label">Số điện thoại <em>*</em></label>
                <input id="bk-phone" type="tel" className="lx-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="lx-field">
                <label htmlFor="bk-email" className="lx-label">Email</label>
                <input id="bk-email" type="email" className="lx-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="lx-field">
                <label htmlFor="bk-service" className="lx-label">Dịch vụ quan tâm</label>
                <select id="bk-service" className="lx-select" value={form.service} onChange={e => set('service', e.target.value)}>
                  <option value="">— Chọn dịch vụ —</option>
                  {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="lx-field">
                <label htmlFor="bk-date" className="lx-label">Ngày mong muốn</label>
                <input id="bk-date" type="date" className="lx-input" value={form.date} onChange={e => set('date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="lx-field">
                <label htmlFor="bk-time" className="lx-label">Giờ mong muốn</label>
                <select id="bk-time" className="lx-select" value={form.time} onChange={e => set('time', e.target.value)}>
                  <option value="">— Chọn giờ —</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="col-12">
              <div className="lx-field">
                <label htmlFor="bk-note" className="lx-label">Ghi chú thêm</label>
                <textarea id="bk-note" className="lx-textarea" value={form.note} onChange={e => set('note', e.target.value)} placeholder="Tình trạng răng, yêu cầu đặc biệt..." rows={3} />
              </div>
            </div>
          </div>

          {errMsg && (
            <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '10px 14px', fontSize: 13, marginBottom: 16, borderLeft: '4px solid var(--danger)' }}>
              {errMsg}
            </div>
          )}

          <button type="submit" className="lx-btn lx-btn-accent lx-form-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Đang gửi...' : 'Đặt lịch ngay'}
            {status !== 'sending' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            )}
          </button>
          <p className="lx-form-note">
            Tư vấn miễn phí · Xác nhận qua điện thoại trong 15 phút · Không mất phí đặt lịch
          </p>
        </form>
      )}
    </div>
  )
}
