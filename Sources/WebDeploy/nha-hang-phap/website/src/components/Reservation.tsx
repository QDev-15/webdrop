import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../App'

interface Props {
  preview?: boolean
}

const OCCASIONS = [
  { value: 'Dîner romantique', label: 'Dîner romantique', detail: 'Tối lãng mạn đôi' },
  { value: 'Anniversaire', label: 'Anniversaire', detail: 'Sinh nhật / kỷ niệm' },
  { value: 'Business dinner', label: 'Business dinner', detail: 'Tiếp khách doanh nghiệp' },
  { value: 'Célébration familiale', label: 'Célébration familiale', detail: 'Buổi tụ họp gia đình' },
]

export default function Reservation({ preview = false }: Props) {
  const { settings } = useSite()
  const [form, setForm] = useState({
    name: '', phone: '', email: '', date: '', time: '19:00', guests: '2', occasion: 'Dîner romantique', note: ''
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function setF(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.date || !form.time) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.'); return
    }
    setSending(true); setError(''); setSuccess('')
    try {
      const res = await api.post<{ message: string }>('/public/reservation', {
        name: form.name, phone: form.phone, email: form.email,
        date: form.date, time: form.time, guests: parseInt(form.guests),
        occasion: form.occasion, note: form.note,
      })
      setSuccess(res.message)
      setForm({ name: '', phone: '', email: '', date: '', time: '19:00', guests: '2', occasion: 'Dîner romantique', note: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally { setSending(false) }
  }

  const phone = settings['site_phone'] || '0901 234 567'
  const address = settings['site_address'] || ''
  const email = settings['site_email'] || ''

  if (preview) {
    return (
      <section className="sec-pad" style={{ background: 'var(--accent-light)', borderTop: '1px solid rgba(159,18,57,.1)', borderBottom: '1px solid rgba(159,18,57,.1)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 reveal">
              <div className="eyebrow">Réservations</div>
              <h2 className="sec-title">Đặt bàn<br /><em>cho buổi tối đặc biệt</em></h2>
              <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20 }}>
                Dành cho dịp kỷ niệm, sinh nhật hay buổi tối lãng mạn — chúng tôi sẽ chuẩn bị mọi thứ để đêm đó trở nên hoàn hảo.
              </p>
              {[
                'Trang trí bàn theo yêu cầu — hoa tươi, nến, banner',
                'Thực đơn cá nhân hóa theo khẩu vị và dị ứng',
                'Sommelière tư vấn rượu vang phù hợp từng món',
                'Nhận đặt sự kiện riêng (tối thiểu 10 khách)',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-2)', fontWeight: 300, marginBottom: 8 }}>
                  <span style={{ color: 'var(--accent)', fontSize: 16 }}>✓</span> {item}
                </div>
              ))}
            </div>
            <div className="col-lg-7 reveal reveal-d1">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 2, padding: 36 }} className="elegant-form">
                <ReservationFormInner form={form} setF={setF} onSubmit={handleSubmit} sending={sending} success={success} error={error} preview />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5 justify-content-center">
          <div className="col-lg-7 reveal">
            <div className="text-center mb-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '0 auto 24px', maxWidth: 280 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
                <div style={{ width: 5, height: 5, background: 'var(--accent)', transform: 'rotate(45deg)' }}></div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', fontStyle: 'italic', maxWidth: 460, margin: '0 auto' }}>
                Vui lòng đặt bàn trước tối thiểu <strong>24 giờ</strong>. Bàn được giữ trong 15 phút sau giờ đặt.
              </p>
            </div>
            <ReservationFormInner form={form} setF={setF} onSubmit={handleSubmit} sending={sending} success={success} error={error} />
          </div>
          <div className="col-lg-4 reveal reveal-d1">
            <div style={{ position: 'sticky', top: 88 }}>
              <div style={{ background: 'var(--dark2)', borderRadius: 14, padding: 28, marginBottom: 16 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,.25)', marginBottom: 16 }}>Thông tin nhà hàng</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 2, fontWeight: 300 }}>
                  {address && <>{address}<br /></>}
                  <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--accent-mid)' }}>{phone}</a><br />
                  {email && <a href={`mailto:${email}`} style={{ color: 'var(--accent-mid)' }}>{email}</a>}
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.06)', fontSize: 13, color: 'rgba(255,255,255,.35)', fontWeight: 300, lineHeight: 1.85 }}>
                  <div style={{ marginBottom: 6, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,.2)' }}>Horaires</div>
                  Mardi – Jeudi: 18:00 – 22:30<br />
                  Vendredi – Samedi: 18:00 – 23:00<br />
                  Dimanche: 12:00 – 15:00<br />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.2)' }}>Lundi: Fermé</span>
                </div>
              </div>
              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>🌸 Dịch vụ đặc biệt</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 300 }}>
                  <li>✦ Trang trí bàn theo yêu cầu</li>
                  <li>✦ Bánh sinh nhật / kỷ niệm</li>
                  <li>✦ Menu dégustation riêng</li>
                  <li>✦ Chọn rượu vang trước</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReservationFormInner({ form, setF, onSubmit, sending, success, error, preview }: {
  form: Record<string, string>
  setF: (k: string, v: string) => void
  onSubmit: (e: React.FormEvent) => void
  sending: boolean
  success: string
  error: string
  preview?: boolean
}) {
  const formClass = preview ? 'elegant-form' : ''
  return (
    <form onSubmit={onSubmit} className={formClass}>
      {success && <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, marginBottom: 16, fontSize: 14, color: '#166534' }}>{success}</div>}
      {error && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 16, fontSize: 14, color: '#991b1b' }}>{error}</div>}
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label">Họ tên *</label>
          <input type="text" className="form-control" placeholder="Họ và tên" value={form.name} onChange={e => setF('name', e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Điện thoại *</label>
          <input type="tel" className="form-control" placeholder="0901 234 567" value={form.phone} onChange={e => setF('phone', e.target.value)} required />
        </div>
        {!preview && (
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="email@example.com" value={form.email} onChange={e => setF('email', e.target.value)} />
          </div>
        )}
        <div className={preview ? 'col-md-6' : 'col-md-6'}>
          <label className="form-label">Số khách *</label>
          <select className="form-select" value={form.guests} onChange={e => setF('guests', e.target.value)}>
            {['1','2','3','4','5','6','7','8','9','10'].map(n => <option key={n} value={n}>{n} người</option>)}
            <option value="12">Trên 10 (liên hệ)</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Ngày đặt *</label>
          <input type="date" className="form-control" value={form.date} onChange={e => setF('date', e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Giờ *</label>
          <select className="form-select" value={form.time} onChange={e => setF('time', e.target.value)}>
            {['12:00','12:30','13:00','13:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {!preview && (
          <div className="col-12">
            <label className="form-label" style={{ display: 'block', marginBottom: 12 }}>Dịp đặc biệt</label>
            <div className="occasion-grid">
              {OCCASIONS.map(oc => (
                <div key={oc.value} className={`occasion-item${form.occasion === oc.value ? ' sel' : ''}`}
                  onClick={() => setF('occasion', oc.value)}>
                  <div className="oc-name">{oc.label}</div>
                  <div className="oc-detail">{oc.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {preview && (
          <div className="col-md-6">
            <label className="form-label">Dịp đặc biệt</label>
            <select className="form-select" value={form.occasion} onChange={e => setF('occasion', e.target.value)}>
              {OCCASIONS.map(oc => <option key={oc.value} value={oc.value}>{oc.label}</option>)}
            </select>
          </div>
        )}
        <div className="col-12">
          <label className="form-label">Yêu cầu đặc biệt</label>
          <textarea className="form-control" rows={3} placeholder="Dị ứng thực phẩm, trang trí bàn, yêu cầu đặc biệt..."
            value={form.note} onChange={e => setF('note', e.target.value)} />
        </div>
        <div className="col-12">
          <button type="submit" className="btn-accent" style={{ width: '100%', border: 'none', cursor: 'pointer', padding: 14 }} disabled={sending}>
            {sending ? 'Đang gửi...' : 'Confirmer la réservation →'}
          </button>
        </div>
      </div>
    </form>
  )
}
