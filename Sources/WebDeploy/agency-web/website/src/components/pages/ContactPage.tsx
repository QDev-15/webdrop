import { useEffect, useState, type FormEvent } from 'react'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Vui lòng nhập họ tên'
    if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không đúng định dạng'
    return e
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Gửi thất bại. Vui lòng thử lại.' })
    } finally {
      setSubmitting(false)
    }
  }

  const faqs = [
    { q: 'Thời gian hoàn thành một dự án là bao lâu?', a: 'Tùy theo quy mô, thông thường từ 3–7 ngày làm việc với landing page đơn giản, và 2–4 tuần với website nhiều trang. Chúng tôi sẽ cung cấp timeline cụ thể sau khi trao đổi yêu cầu.' },
    { q: 'Chi phí thiết kế website bao nhiêu?', a: 'Chi phí phụ thuộc vào số trang, tính năng và mức độ tùy chỉnh. Liên hệ để nhận báo giá miễn phí — chúng tôi có nhiều gói phù hợp với mọi ngân sách.' },
    { q: 'Tôi có thể tự chỉnh nội dung sau khi bàn giao không?', a: 'Có. Mọi dự án đều đi kèm hướng dẫn chỉnh nội dung cơ bản. Nếu cần, chúng tôi cũng hỗ trợ gói bảo trì hàng tháng.' },
    { q: 'Có hỗ trợ sau khi bàn giao không?', a: 'Có. Tất cả dự án đều được hỗ trợ miễn phí trong 30 ngày đầu. Sau đó có thể đăng ký gói bảo trì tháng nếu cần.' },
  ]
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* HERO */}
      <div style={{ padding: 'calc(62px + clamp(48px,6vw,80px)) 0 clamp(48px,6vw,72px)', background: 'var(--dark2)', textAlign: 'center' }}>
        <div className="wd-container">
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>Liên hệ với chúng tôi</div>
          <h1 style={{ fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 600, color: '#fff', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '14px' }}>
            Hãy cùng nhau <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>trao đổi</em>
          </h1>
          <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', fontWeight: 300, color: 'rgba(255,255,255,.45)', maxWidth: '500px', margin: '0 auto' }}>
            Chúng tôi luôn sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất cho bạn.
          </p>
        </div>
      </div>

      {/* CONTACT */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="contact-grid">
            {/* INFO */}
            <div className="info-panel reveal" data-reveal>
              <h2 className="info-title">Thông tin liên hệ</h2>
              <p className="info-desc">Bạn có thể liên hệ trực tiếp qua các kênh dưới đây hoặc điền form để chúng tôi chủ động liên lạc lại trong vòng 2 giờ làm việc.</p>
              {settings.site_address && (
                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div>
                    <div className="info-label">Địa chỉ</div>
                    <div className="info-val">{settings.site_address}</div>
                  </div>
                </div>
              )}
              {settings.site_phone && (
                <div className="info-item">
                  <div className="info-icon">📞</div>
                  <div>
                    <div className="info-label">Điện thoại / Zalo</div>
                    <div className="info-val"><a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a></div>
                  </div>
                </div>
              )}
              {settings.site_email && (
                <div className="info-item">
                  <div className="info-icon">✉️</div>
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-val"><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></div>
                  </div>
                </div>
              )}
              {settings.working_hours && (
                <div className="info-item">
                  <div className="info-icon">🕐</div>
                  <div>
                    <div className="info-label">Giờ làm việc</div>
                    <div className="info-val">{settings.working_hours}</div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
                {settings.social_facebook && <a href={settings.social_facebook} style={{ width: '38px', height: '38px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">f</a>}
                {settings.social_zalo && <a href={settings.social_zalo} style={{ width: '38px', height: '38px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text-2)', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">Za</a>}
                {settings.social_youtube && <a href={settings.social_youtube} style={{ width: '38px', height: '38px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">▶</a>}
              </div>
            </div>

            {/* FORM */}
            <div id="form" className="form-panel reveal reveal-d1" data-reveal>
              {success ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                  <div style={{ fontSize: '17px', fontWeight: 600, marginBottom: '6px' }}>Đã nhận yêu cầu!</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 300 }}>Chúng tôi sẽ liên hệ lại với bạn trong vòng 2 giờ làm việc.</p>
                  <button onClick={() => { setSuccess(false); setForm({ name: '', phone: '', email: '', subject: '', message: '' }) }} className="btn-accent" style={{ marginTop: '16px' }}>Gửi yêu cầu khác</button>
                </div>
              ) : (
                <>
                  <div className="fp-title">Gửi yêu cầu tư vấn</div>
                  <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <label className="form-label">Họ và tên <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input className="form-control" type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={errors.name ? { borderColor: 'var(--danger)' } : {}} />
                        {errors.name && <div style={{ fontSize: '11.5px', color: 'var(--danger)', marginTop: '4px' }}>{errors.name}</div>}
                      </div>
                      <div>
                        <label className="form-label">Số điện thoại <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input className="form-control" type="tel" placeholder="090 000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={errors.phone ? { borderColor: 'var(--danger)' } : {}} />
                        {errors.phone && <div style={{ fontSize: '11.5px', color: 'var(--danger)', marginTop: '4px' }}>{errors.phone}</div>}
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Email</label>
                      <input className="form-control" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={errors.email ? { borderColor: 'var(--danger)' } : {}} />
                      {errors.email && <div style={{ fontSize: '11.5px', color: 'var(--danger)', marginTop: '4px' }}>{errors.email}</div>}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Dịch vụ quan tâm</label>
                      <select className="form-select" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                        <option value="">— Chọn dịch vụ —</option>
                        <option>Thiết kế website</option>
                        <option>Triển khai website</option>
                        <option>Bảo trì & hỗ trợ</option>
                        <option>Tư vấn giải pháp</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Nội dung</label>
                      <textarea className="form-control" placeholder="Mô tả ngắn về dự án, yêu cầu hoặc câu hỏi của bạn..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    </div>
                    {errors.general && <div style={{ padding: '10px', background: '#fff0f0', color: 'var(--danger)', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }}>{errors.general}</div>}
                    <button type="submit" disabled={submitting} style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '9px', padding: '13px', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--sans)', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? .7 : 1 }}>
                      {submitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn →'}
                    </button>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-3)', textAlign: 'center', marginTop: '10px', lineHeight: 1.6 }}>
                      Chúng tôi sẽ phản hồi trong vòng <strong>2 giờ làm việc</strong>. Thông tin của bạn được bảo mật tuyệt đối.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* MAP */}
          {settings.google_map_embed && (
            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)', marginTop: '48px' }}>
              <iframe src={settings.google_map_embed} width="100%" height="300" style={{ border: 'none', display: 'block', filter: 'grayscale(.15) contrast(1.05)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ" />
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 0 clamp(72px,10vw,128px)' }}>
        <div className="wd-container" style={{ maxWidth: '720px' }}>
          <div className="text-center reveal" data-reveal style={{ marginBottom: '40px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Câu hỏi thường gặp</div>
            <h2 className="sec-title">Giải đáp <em>thắc mắc</em></h2>
          </div>
          <div className="reveal" data-reveal>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', color: openFaq === i ? 'var(--accent)' : 'var(--text)' }}>
                  {faq.q}
                  <span style={{ fontSize: '12px', color: 'var(--text-3)', transition: 'transform .25s', transform: openFaq === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
                </div>
                {openFaq === i && (
                  <div style={{ fontSize: '13.5px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75, paddingBottom: '16px' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
