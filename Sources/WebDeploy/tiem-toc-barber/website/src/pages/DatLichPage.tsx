import { useState, useEffect, useMemo } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface Category {
  id: number
  name: string
  slug: string
}

interface Service {
  id: number
  category_id: number
  name: string
  price_text: string
}

interface TeamMember {
  id: number
  name: string
  role: string
}

const TIME_SLOTS = [
  '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '18:00', '18:30', '19:00',
]

export default function DatLichPage() {
  const { settings } = useSite()
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])

  const [serviceId, setServiceId] = useState('')
  const [stylist, setStylist] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
      api.get<TeamMember[]>('/public/team'),
    ]).then(([cats, svcs, tm]) => {
      setCategories(cats)
      setServices(svcs)
      setTeam(tm)
    }).catch(() => {})
  }, [])

  const minDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  const grouped = categories.map(cat => ({
    cat,
    items: services.filter(s => s.category_id === cat.id),
  })).filter(g => g.items.length > 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    if (!fullName.trim() || !phone.trim()) {
      setResult({ ok: false, message: 'Vui lòng nhập họ tên và số điện thoại.' })
      return
    }
    const serviceName = services.find(s => String(s.id) === serviceId)?.name || ''
    setSending(true)
    try {
      const res = await api.post<{ message: string }>('/public/booking', {
        full_name: fullName,
        phone,
        service_name: serviceName,
        stylist_pref: stylist,
        pref_date: date,
        pref_time: time,
        note,
      })
      setResult({ ok: true, message: res.message || 'Đặt lịch thành công!' })
      setFullName(''); setPhone(''); setNote(''); setServiceId(''); setStylist(''); setDate(''); setTime('')
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : 'Đặt lịch thất bại. Thử lại sau.' })
    } finally {
      setSending(false)
    }
  }

  const phoneDisplay = settings.site_phone || '0901 234 567'
  const phoneHref = phoneDisplay.replace(/\s+/g, '')

  return (
    <>
      <section className="tb-page-hero">
        <div className="wd-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="tb-ph-tag">Đặt lịch hẹn</div>
          <h1 className="tb-ph-title">Chọn lịch &amp; <em>Đặt ngay</em></h1>
          <p className="tb-ph-sub">{settings.booking_confirm_note || 'Chúng tôi xác nhận lịch hẹn qua Zalo trong vòng 15 phút. Hủy lịch miễn phí trước 2 tiếng.'}</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-7" data-reveal>
              <div className="tb-form-wrap">
                {result && (
                  <div className={`alert ${result.ok ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>{result.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="tb-step-badge">1</span>
                      <span className="tb-step-label">Chọn dịch vụ &amp; Stylist</span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Loại dịch vụ</label>
                      <select className="form-select" value={serviceId} onChange={e => setServiceId(e.target.value)}>
                        <option value="">-- Chọn dịch vụ --</option>
                        {grouped.map(g => (
                          <optgroup label={g.cat.name} key={g.cat.id}>
                            {g.items.map(s => (
                              <option key={s.id} value={s.id}>{s.name} — {s.price_text}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Stylist (tùy chọn)</label>
                      <select className="form-select" value={stylist} onChange={e => setStylist(e.target.value)}>
                        <option value="">Không có yêu cầu đặc biệt</option>
                        {team.map(m => (
                          <option key={m.id} value={m.name}>{m.name} — {m.role}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="tb-step-badge">2</span>
                      <span className="tb-step-label">Chọn ngày &amp; giờ</span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ngày muốn đến</label>
                      <input type="date" className="form-control" min={minDate} value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Giờ muốn đến</label>
                      <div className="d-flex flex-wrap gap-2">
                        {TIME_SLOTS.map(slot => (
                          <span
                            key={slot}
                            className={`tb-time-slot${time === slot ? ' selected' : ''}`}
                            onClick={() => setTime(slot)}
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="tb-step-badge">3</span>
                      <span className="tb-step-label">Thông tin của bạn</span>
                    </div>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label className="form-label">Họ và tên *</label>
                        <input type="text" className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nguyễn Văn A" required />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Số điện thoại / Zalo *</label>
                        <input type="tel" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0901 234 567" required />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Ghi chú thêm (tùy chọn)</label>
                        <textarea className="form-control" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Ví dụ: tóc đang bị hư do tẩy, muốn giữ phần dài trên, tham khảo theo ảnh..." />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="tb-btn-gold w-100" style={{ fontSize: 14, padding: 14 }} disabled={sending}>
                    {sending ? 'Đang gửi...' : 'Xác nhận đặt lịch →'}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 12, fontWeight: 300 }}>
                    Bằng cách đặt lịch, bạn đồng ý với chính sách hủy lịch của chúng tôi.
                  </p>
                </form>
              </div>
            </div>

            <div className="col-lg-5" data-reveal data-delay="1">
              <div className="tb-info-panel mb-4">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 20, letterSpacing: '.3px' }}>Thông tin tiệm</div>
                <div className="tb-info-row">
                  <div className="tb-info-icon">📍</div>
                  <div>
                    <div className="tb-info-label">Địa chỉ</div>
                    <div className="tb-info-val">{settings.site_address || 'Số nhà, Tên đường, Phường, Quận, TP'}</div>
                  </div>
                </div>
                <div className="tb-info-row">
                  <div className="tb-info-icon">📱</div>
                  <div>
                    <div className="tb-info-label">Điện thoại / Zalo</div>
                    <div className="tb-info-val">
                      <a href={`tel:${phoneHref}`}>{phoneDisplay}</a><br />
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Nhắn Zalo để được trả lời nhanh hơn</span>
                    </div>
                  </div>
                </div>
                <div className="tb-info-row">
                  <div className="tb-info-icon">🕐</div>
                  <div>
                    <div className="tb-info-label">Giờ mở cửa</div>
                    <div className="tb-info-val">
                      T2–T6: {settings.working_hours_1?.split(': ')[1] || '8:00 – 20:00'}<br />
                      T7: {settings.working_hours_2?.split(': ')[1] || '8:00 – 21:00'}<br />
                      CN: {settings.working_hours_3?.split(': ')[1] || '9:00 – 19:00'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="tb-info-panel mb-4">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18 }}>Chính sách đặt lịch</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <div style={{ fontSize: 13.5, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6 }}>Xác nhận lịch hẹn qua Zalo trong <strong style={{ color: 'var(--text)' }}>15 phút</strong></div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <div style={{ fontSize: 13.5, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6 }}>Hủy lịch miễn phí trước <strong style={{ color: 'var(--text)' }}>2 tiếng</strong> không mất phí</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <div style={{ fontSize: 13.5, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6 }}>Giá cuối xác nhận sau khi stylist kiểm tra tình trạng tóc</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <div style={{ fontSize: 13.5, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6 }}>Đến đúng giờ để được phục vụ ưu tiên</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(184,144,42,.1)', border: '1px solid var(--border-gold)', borderRadius: 10, padding: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Ưu đãi khách mới</div>
                <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
                  Giảm <strong style={{ color: 'var(--accent-bright)' }}>{settings.booking_promo_percent || '15'}%</strong> cho lần đặt lịch đầu tiên. Nhập code <strong style={{ color: '#fff', fontStyle: 'italic' }}>{settings.booking_promo_code || 'NEWCUT'}</strong> trong phần ghi chú.
                </p>
                <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 300 }}>* Áp dụng cho dịch vụ từ 150.000đ trở lên</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
