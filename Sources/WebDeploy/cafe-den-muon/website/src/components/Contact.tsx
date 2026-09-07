import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const TIME_SLOTS = ['18:00 – 20:00', '20:00 – 22:00', '22:00 – 00:00', '00:00 – 02:00']
const GUEST_OPTIONS = ['1 người', '2 người', '3 – 4 người', '5 – 6 người', '7 – 8 người (phòng học nhóm)']
const AREA_OPTIONS = ['Coding Corner', 'Phòng Học Nhóm', 'Quầy Bar Espresso', 'Góc Sofa Thư Giãn']

const emptyForm = {
  name: '', phone: '', date: '', time: TIME_SLOTS[0], guests: GUEST_OPTIONS[0], area: AREA_OPTIONS[0], note: '',
}

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof typeof emptyForm>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Vui lòng điền họ tên và số điện thoại.')
      return
    }
    setSubmitting(true)
    const message = [
      form.date && `Ngày đến: ${form.date}`,
      `Giờ đến: ${form.time}`,
      `Số người: ${form.guests}`,
      `Khu vực: ${form.area}`,
      form.note && `Ghi chú: ${form.note}`,
    ].filter(Boolean).join('\n')
    try {
      await api.post('/public/contact', {
        name: form.name,
        phone: form.phone,
        subject: `Đặt bàn — ${form.area}`,
        message,
      })
      setSuccess(true)
      setForm(emptyForm)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const infos = [
    { icon: '📍', label: 'Địa chỉ', val: settings.site_address || 'Đang cập nhật' },
    { icon: '📱', label: 'Điện thoại', val: settings.site_phone || '0901 234 567' },
    { icon: '✉️', label: 'Email', val: settings.site_email || 'hello@noxcoffee.vn' },
    { icon: '🕐', label: 'Giờ mở cửa', val: settings.working_hours || '18:00 – 02:00' },
  ]

  return (
    <>
      <div className="row g-3 mb-5">
        {infos.map((info, i) => (
          <div className="col-6 col-md-3" key={info.label}>
            <div className={`contact-info-block reveal reveal-d${Math.min(i + 1, 3)}`}>
              <div className="cib-icon">{info.icon}</div>
              <div className="cib-label">{info.label}</div>
              <div className="cib-val">{info.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row align-items-start g-5">
        <div className="col-lg-5 reveal">
          <div className="eyebrow">Đặt bàn trước</div>
          <h2 className="sec-title">Giữ chỗ cho <em>ca đêm</em> của bạn</h2>
          <p className="sec-sub">Đặt trước để đảm bảo có bàn — đặc biệt vào cuối tuần và tuần thi cử. Chúng tôi xác nhận qua Zalo/điện thoại trong 15 phút.</p>
          <ul className="mt-4" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Phản hồi xác nhận trong 15 phút', 'Hủy miễn phí trước 1 tiếng', 'Giữ bàn 20 phút sau giờ đặt'].map(t => (
              <li key={t} style={{ fontSize: 13.5, color: 'var(--text-2)', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: 'var(--accent)', fontSize: 16 }}>✓</span>{t}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-lg-7 reveal reveal-d1">
          <div className="inline-booking">
            {success ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Cảm ơn bạn!</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, marginBottom: 18 }}>
                  NOX đã nhận yêu cầu đặt bàn và sẽ liên hệ xác nhận trong ít phút.
                </p>
                <button onClick={() => setSuccess(false)} className="btn-accent">Đặt bàn khác</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 22, letterSpacing: -.3 }}>Điền thông tin đặt bàn</h3>
                {error && (
                  <div style={{ padding: '10px 14px', background: 'rgba(255,90,110,.08)', border: '1px solid rgba(255,90,110,.25)', borderRadius: 8, color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
                    {error}
                  </div>
                )}
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label">Họ và tên</label>
                    <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại</label>
                    <input type="tel" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ngày đến</label>
                    <input type="date" className="form-control" value={form.date} onChange={e => set('date', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Giờ đến</label>
                    <select className="form-select" value={form.time} onChange={e => set('time', e.target.value)}>
                      {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số người</label>
                    <select className="form-select" value={form.guests} onChange={e => set('guests', e.target.value)}>
                      {GUEST_OPTIONS.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Khu vực</label>
                    <select className="form-select" value={form.area} onChange={e => set('area', e.target.value)}>
                      {AREA_OPTIONS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Ghi chú thêm</label>
                    <textarea className="form-control" rows={3} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Yêu cầu đặc biệt nếu có" />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn-accent w-100 justify-content-center" style={{ padding: 13, fontSize: 14 }} disabled={submitting}>
                      {submitting ? 'Đang gửi...' : 'Gửi yêu cầu đặt bàn'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
