import { useState } from 'react'
import { api } from '../api/client'

interface Props {
  settings: Record<string, string>
  fullPage?: boolean
}

const TIME_SLOTS = ['10:00', '11:00', '11:30', '12:00', '12:30', '13:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

const emptyForm = { name: '', phone: '', email: '', date: '', time: '18:00', guests: 2, note: '' }

export default function Reservation({ settings, fullPage = false }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function setField<K extends keyof typeof emptyForm>(k: K, v: (typeof emptyForm)[K]) {
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

  const formEl = success ? (
    <div style={{ textAlign: 'center', padding: '48px 32px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Đặt bàn thành công!</h3>
      <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
        Cảm ơn bạn đã tin tưởng! Chúng tôi sẽ xác nhận qua điện thoại trong vòng 30 phút.
      </p>
      <button onClick={() => setSuccess(false)} className="btn-accent">Đặt bàn khác</button>
    </div>
  ) : (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(226,75,74,.08)', border: '1px solid rgba(226,75,74,.25)', borderRadius: 8, color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Họ tên *</label>
          <input type="text" className="form-control" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Nguyễn Văn A" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Điện thoại *</label>
          <input type="tel" className="form-control" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="0912 345 678" required />
        </div>
        <div className="col-12">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="email@example.com" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Ngày *</label>
          <input type="date" className="form-control" value={form.date} onChange={e => setField('date', e.target.value)} min={today} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Giờ *</label>
          <select className="form-control" value={form.time} onChange={e => setField('time', e.target.value)} required>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Số khách *</label>
          <select className="form-control" value={form.guests} onChange={e => { const n = Number(e.target.value); if (!isNaN(n) && n > 0) setField('guests', n) }}>
            {[1,2,3,4,5,6,7,8,10,12,15,20].map(n => <option key={n} value={n}>{n} khách{n >= 10 ? ' (nhóm lớn)' : ''}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Ghi chú</label>
          <textarea className="form-control" value={form.note} onChange={e => setField('note', e.target.value)} placeholder="Loại hải sản muốn đặt trước, yêu cầu đặc biệt..." rows={3} />
        </div>
        <div className="col-12">
          <button type="submit" className="btn-accent w-100" disabled={submitting} style={{ padding: '13px 0', fontSize: 14 }}>
            {submitting ? 'Đang gửi...' : 'Xác nhận đặt bàn'}
          </button>
        </div>
      </div>
    </form>
  )

  if (fullPage) return formEl

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <div className="eyebrow">Đặt bàn</div>
            <h2 className="sec-title">Giữ chỗ <em>hải sản tươi</em></h2>
            <p className="sec-sub mb-4" style={{ margin: '0 0 28px' }}>Đặt trước để chúng tôi chuẩn bị những con hải sản tươi ngon nhất và bàn đẹp nhất cho bạn.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '🕐', label: 'Giờ phục vụ', val: settings.working_hours || '10:00 – 22:00 hàng ngày' },
                { icon: '📍', label: 'Địa chỉ', val: settings.site_address || 'Liên hệ để biết địa chỉ' },
                { icon: '📞', label: 'Điện thoại', val: settings.site_phone || 'Liên hệ để biết số điện thoại' },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{info.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{info.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{info.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: '14px 18px', background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Ưu đãi đặt trước</div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
                Đặt bàn trước 2 giờ — tặng đĩa sashimi cá hồi Na Uy cho bàn từ 4 người trở lên.
              </p>
            </div>
          </div>
          <div className="col-lg-7">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(24px, 3vw, 36px)' }}>
              {formEl}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
