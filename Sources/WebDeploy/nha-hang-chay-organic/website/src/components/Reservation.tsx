import { useState, FormEvent } from 'react'
import { api } from '../api/client'

interface ReservationForm {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: string
  occasion: string
  note: string
}

export default function Reservation() {
  const [form, setForm] = useState<ReservationForm>({
    name: '', phone: '', email: '', date: '', time: '12:00', guests: '2', occasion: '', note: ''
  })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function set(k: keyof ReservationForm, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setResult(null)
    setSending(true)
    try {
      const r = await api.post<{ message: string }>('/public/reservation', form)
      setResult({ type: 'success', text: r.message || 'Đặt bàn thành công!' })
      setForm({ name: '', phone: '', email: '', date: '', time: '12:00', guests: '2', occasion: '', note: '' })
    } catch (err: unknown) {
      setResult({ type: 'error', text: err instanceof Error ? err.message : 'Đặt bàn thất bại. Vui lòng thử lại.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="reveal">
      <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '22px', letterSpacing: '-.4px' }}>Đặt bàn ngay</h3>
      {result && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
          background: result.type === 'success' ? 'var(--accent-light)' : '#fff0f0',
          color: result.type === 'success' ? 'var(--accent)' : 'var(--danger)',
          border: `1px solid ${result.type === 'success' ? 'var(--border)' : '#fdd'}`,
          fontSize: '14px',
        }}>
          {result.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Họ và tên *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tên của bạn" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Số điện thoại *</label>
            <input type="tel" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Ngày đặt bàn *</label>
            <input type="date" className="form-control" value={form.date} onChange={e => set('date', e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Giờ *</label>
            <select className="form-select" value={form.time} onChange={e => set('time', e.target.value)}>
              {['10:00','11:00','12:00','13:00','17:00','18:00','19:00','20:00'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Số người *</label>
            <select className="form-select" value={form.guests} onChange={e => set('guests', e.target.value)}>
              {['1','2','3','4','5','6','7','8+'].map(g => (
                <option key={g} value={g}>{g} người</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Dịp đặc biệt?</label>
            <select className="form-select" value={form.occasion} onChange={e => set('occasion', e.target.value)}>
              <option value="">Bữa ăn thường ngày</option>
              <option value="Sinh nhật">Sinh nhật</option>
              <option value="Kỷ niệm">Kỷ niệm</option>
              <option value="Gặp mặt bạn bè">Gặp mặt bạn bè</option>
              <option value="Thiền & ẩm thực">Thiền &amp; ẩm thực</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Yêu cầu đặc biệt / Dị ứng</label>
            <textarea className="form-control" rows={3} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Dị ứng thực phẩm, yêu cầu dinh dưỡng cụ thể..." />
          </div>
          <div className="col-12">
            <button type="submit" className="btn-accent" style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 600 }} disabled={sending}>
              {sending ? 'Đang gửi...' : '🌿 Đặt bàn ngay'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
