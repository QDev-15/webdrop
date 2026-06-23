import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface ReservationForm {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: string
  table_type: string
  note: string
}

const emptyForm: ReservationForm = {
  name: '', phone: '', email: '', date: '', time: '', guests: '2 người', table_type: 'Bàn thường', note: '',
}

export default function Reservation() {
  const { settings } = useSite()
  const s = settings
  const [form, setForm] = useState<ReservationForm>(emptyForm)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [tableType, setTableType] = useState('Bàn thường')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      const els = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      if (!els?.length) return
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [])

  function set(key: keyof ReservationForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc (Tên, SĐT, Ngày, Giờ).')
      return
    }
    setSending(true); setError(''); setSuccess('')
    try {
      const res = await api.post<{ ok: boolean; message: string }>('/public/reservation', {
        ...form,
        table_type: tableType,
        guests: parseInt(form.guests) || 2,
      })
      setSuccess(res.message || 'Đặt bàn thành công! Chúng tôi sẽ gọi xác nhận trong 15 phút.')
      setForm(emptyForm)
      setTableType('Bàn thường')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại hoặc gọi điện trực tiếp.')
    } finally { setSending(false) }
  }

  const phone = s.site_phone || '0901 234 567'

  return (
    <div ref={ref}>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Đặt bàn</div>
          <h1 className="ph-title">Đặt Bàn <em>Dễ Dàng</em></h1>
          <p className="ph-sub">Điền thông tin bên dưới — chúng tôi xác nhận trong 15 phút qua điện thoại hoặc Zalo.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-7">
              <div className="booking-card" data-reveal>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Thông tin đặt bàn</h2>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>Vui lòng điền đầy đủ để chúng tôi chuẩn bị tốt nhất cho bạn.</p>

                {success && <div className="form-success">{success}</div>}
                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Họ và tên *</label>
                      <input type="text" className="form-control" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Số điện thoại *</label>
                      <input type="tel" className="form-control" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Ngày đặt bàn *</label>
                      <input type="date" className="form-control" value={form.date} onChange={e => set('date', e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Giờ đến *</label>
                      <select className="form-select" value={form.time} onChange={e => set('time', e.target.value)} required>
                        <option value="">Chọn giờ...</option>
                        {['17:00 – 17:30','17:30 – 18:00','18:00 – 18:30','18:30 – 19:00','19:00 – 19:30','19:30 – 20:00','20:00 – 20:30','20:30 – 21:00','21:00 – 21:30'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Số người *</label>
                    <select className="form-select" value={form.guests} onChange={e => set('guests', e.target.value)}>
                      {['2 người','3 người','4 người','5–6 người','7–8 người','9–12 người','13–20 người','20+ người (tiệc — gọi tư vấn)'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Chọn loại bàn</label>
                    <div className="row g-3">
                      {[
                        { type: 'Bàn thường', icon: '🪑', price: 'Không cần cọc' },
                        { type: 'Bàn nhóm', icon: '👥', price: 'Cọc 100k' },
                        { type: 'Phòng VIP', icon: '👑', price: 'Cọc 300–500k' },
                      ].map(t => (
                        <div key={t.type} className="col-4">
                          <div
                            className={`table-type-card${tableType === t.type ? ' selected' : ''}`}
                            onClick={() => setTableType(t.type)}
                          >
                            <div className="table-type-icon">{t.icon}</div>
                            <div className="table-type-name">{t.type}</div>
                            <div className="table-type-price">{t.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Yêu cầu đặc biệt (tuỳ chọn)</label>
                    <textarea className="form-control" rows={3} placeholder="Sinh nhật cần nến/bong bóng? Dị ứng thực phẩm? Yêu cầu riêng?" value={form.note} onChange={e => set('note', e.target.value)} />
                  </div>

                  <button type="submit" className="btn-accent" style={{ width: '100%', textAlign: 'center', fontSize: 15, padding: 14 }} disabled={sending}>
                    {sending ? 'Đang gửi...' : 'Gửi yêu cầu đặt bàn →'}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 10 }}>Chúng tôi sẽ gọi điện xác nhận trong vòng 15 phút.</p>
                </form>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="booking-card" data-reveal style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>🕐 Giờ mở cửa</div>
                <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}><span>Thứ 2 – Thứ 6</span><span style={{ fontWeight: 600, color: 'var(--text)' }}>17:00 – 23:00</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}><span>Thứ 7</span><span style={{ fontWeight: 600, color: 'var(--text)' }}>11:00 – 23:00</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Chủ nhật</span><span style={{ fontWeight: 600, color: 'var(--text)' }}>11:00 – 22:00</span></div>
                </div>
              </div>

              <div className="booking-card" data-reveal style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>💰 Bảng giá đặt cọc</div>
                {[
                  ['Bàn thường (2–4 người)', 'Miễn phí'],
                  ['Bàn nhóm (4–8 người)', '100.000đ'],
                  ['Phòng VIP nhỏ (6–10 người)', '300.000đ'],
                  ['Phòng VIP lớn (12–20 người)', '500.000đ'],
                ].map(([label, price], i, arr) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none', fontSize: 13.5 }}>
                    <span style={{ color: 'var(--text-2)' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{price}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>Cọc được trừ vào bill khi thanh toán. Hủy trước 2 tiếng được hoàn cọc 100%.</div>
              </div>

              <div className="booking-card" data-reveal>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>📞 Liên hệ trực tiếp</div>
                <div className="contact-item">
                  <div className="ci-icon">📱</div>
                  <div>
                    <div className="ci-label">Điện thoại</div>
                    <div className="ci-value"><a href={`tel:${phone.replace(/\s/g,'')}`} style={{ color: 'var(--text)' }}>{phone}</a></div>
                    <div className="ci-sub">Gọi 17:00 – 23:00 hàng ngày</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon">💬</div>
                  <div>
                    <div className="ci-label">Zalo</div>
                    <div className="ci-value">Nhắn Zalo {phone}</div>
                    <div className="ci-sub">Phản hồi trong 5 phút</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
