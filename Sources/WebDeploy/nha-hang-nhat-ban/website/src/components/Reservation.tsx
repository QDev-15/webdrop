import { useState } from 'react'
import { api } from '../api/client'

interface Props {
  embedded?: boolean
}

export default function Reservation({ embedded = false }: Props) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', date: '', time: '', guests: '2',
    menu_type: '', dietary: '', note: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setResult(null)
    try {
      const res = await api.post<{ ok: boolean; message: string }>('/public/reservation', form)
      setResult({ ok: true, msg: res.message })
      setForm({ name: '', phone: '', email: '', date: '', time: '', guests: '2', menu_type: '', dietary: '', note: '' })
    } catch (err: unknown) {
      setResult({ ok: false, msg: err instanceof Error ? err.message : 'Đặt bàn thất bại. Vui lòng thử lại.' })
    } finally { setSubmitting(false) }
  }

  const inputClass = embedded ? 'dcf-input' : 'bf-input'
  const labelClass = embedded ? 'form-label-light' : 'bf-label' + ' text-uppercase'
  const selectClass = embedded ? 'dcf-select' : 'bf-input'

  return (
    <form onSubmit={handleSubmit} className={embedded ? '' : 'booking-form'}>
      {result && (
        <div style={{ padding: '14px 18px', marginBottom: '20px', borderRadius: '4px', fontSize: '14px', fontWeight: 300, background: result.ok ? 'rgba(26,107,82,.12)' : 'rgba(220,38,38,.1)', color: result.ok ? (embedded ? '#4ade80' : 'var(--accent)') : (embedded ? '#fca5a5' : '#dc2626'), border: `1px solid ${result.ok ? (embedded ? 'rgba(74,222,128,.3)' : 'var(--accent-light)') : 'rgba(220,38,38,.2)'}` }}>
          {result.msg}
        </div>
      )}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className={labelClass}>Họ tên *</label>
          <input type="text" className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
        </div>
        <div className="col-md-6">
          <label className={labelClass}>Số điện thoại *</label>
          <input type="tel" className={inputClass} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
        </div>
        <div className="col-md-4">
          <label className={labelClass}>Ngày *</label>
          <input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="col-md-4">
          <label className={labelClass}>Giờ *</label>
          <select className={selectClass} value={form.time} onChange={e => set('time', e.target.value)} required>
            <option value="">Chọn giờ</option>
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="17:30">17:30</option>
            <option value="18:00">18:00</option>
            <option value="18:30">18:30</option>
            <option value="19:00">19:00</option>
            <option value="19:30">19:30</option>
            <option value="20:00">20:00</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className={labelClass}>Số người *</label>
          <select className={selectClass} value={form.guests} onChange={e => set('guests', e.target.value)}>
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
            <option value="4">4 người</option>
            <option value="6">5–6 người</option>
            <option value="10">7–10 người</option>
            <option value="11">10+ người</option>
          </select>
        </div>
        <div className="col-12">
          <label className={labelClass}>Loại thực đơn</label>
          <select className={selectClass} value={form.menu_type} onChange={e => set('menu_type', e.target.value)}>
            <option value="">Chưa quyết định</option>
            <option value="omakase-standard">Omakase Standard (8 món)</option>
            <option value="omakase-premium">Omakase Premium (12 món)</option>
            <option value="omakase-signature">Omakase Signature (16 món)</option>
            <option value="alacarte">À la carte (thực đơn thường)</option>
          </select>
        </div>
        <div className="col-12">
          <label className={labelClass}>Yêu cầu đặc biệt</label>
          <textarea className={inputClass} rows={3} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Dị ứng thực phẩm, sinh nhật, kỷ niệm..." />
        </div>
      </div>
      <button type="submit" className="btn-accent w-100" style={{ padding: '14px', fontSize: '15px', borderRadius: '2px' }} disabled={submitting}>
        {submitting ? 'Đang gửi...' : 'Xác nhận đặt bàn'}
      </button>
    </form>
  )
}
