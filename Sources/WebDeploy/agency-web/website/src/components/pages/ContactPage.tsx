import { FormEvent, useState } from 'react'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import RevealObserver from '../RevealObserver'

const FAQS = [
  { q: 'Thời gian hoàn thành một dự án là bao lâu?', a: 'Tùy theo quy mô, thông thường từ 3–7 ngày làm việc với landing page đơn giản, và 2–4 tuần với website nhiều trang. Chúng tôi sẽ cung cấp timeline cụ thể sau khi trao đổi yêu cầu.' },
  { q: 'Chi phí thiết kế website bao nhiêu?', a: 'Chi phí phụ thuộc vào số trang, tính năng và mức độ tùy chỉnh. Liên hệ để nhận báo giá miễn phí — chúng tôi có nhiều gói phù hợp với mọi ngân sách.' },
  { q: 'Tôi có thể tự chỉnh nội dung sau khi bàn giao không?', a: 'Có. Mọi dự án đều đi kèm hướng dẫn chỉnh nội dung cơ bản. Nếu cần, chúng tôi cũng hỗ trợ gói bảo trì hàng tháng.' },
  { q: 'Có hỗ trợ sau khi bàn giao không?', a: 'Có. Tất cả dự án đều được hỗ trợ miễn phí trong 30 ngày đầu. Sau đó có thể đăng ký gói bảo trì tháng nếu cần.' },
]

export default function ContactPage() {
  const { settings } = useSite()
  const [openFaq, setOpenFaq]   = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '', message: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setError('Vui lòng điền họ tên và nội dung.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/public/contact', form)
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const infoItems = [
    { icon: '📍', label: 'Địa chỉ',           value: settings.site_address },
    { icon: '📞', label: 'Điện thoại / Zalo',  value: settings.site_phone, href: `tel:${settings.site_phone}` },
    { icon: '✉️', label: 'Email',              value: settings.site_email, href: `mailto:${settings.site_email}` },
    { icon: '🕐', label: 'Giờ làm việc',       value: settings.working_hours },
  ]

  return (
    <>
      <div style={{ padding: 'calc(62px + clamp(48px,6vw,80px)) 0 clamp(48px,6vw,72px)', background: 'var(--dark2)', textAlign: 'center' }}>
        <div className="wd-container">
          <div className="ph-eyebrow">Liên hệ với chúng tôi</div>
          <h1 className="ph-title">Hãy cùng nhau <em>trao đổi</em></h1>
          <p className="ph-sub">Chúng tôi luôn sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất cho bạn.</p>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="contact-grid">
            {/* INFO */}
            <div className="reveal">
              <h2 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-.4px', marginBottom: '8px' }}>
                Thông tin liên hệ
              </h2>
              <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: '32px' }}>
                Bạn có thể liên hệ trực tiếp qua các kênh dưới đây hoặc điền form để chúng tôi chủ động liên lạc lại trong vòng 2 giờ làm việc.
              </p>

              {infoItems.map(item => item.value ? (
                <div key={item.label} className="info-item">
                  <div className="info-icon">{item.icon}</div>
                  <div>
                    <div className="info-label">{item.label}</div>
                    <div className="info-val">
                      {item.href
                        ? <a href={item.href}>{item.value}</a>
                        : item.value
                      }
                    </div>
                  </div>
                </div>
              ) : null)}

              <div className="d-flex gap-2" style={{ marginTop: '28px' }}>
                {settings.social_facebook  && <a href={settings.social_facebook}  target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'var(--text-2)', cursor: 'pointer', textDecoration: 'none' }}>f</a>}
                {settings.social_zalo      && <a href={`https://zalo.me/${settings.social_zalo}`} target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer', textDecoration: 'none' }}>Za</a>}
                {settings.social_youtube   && <a href={settings.social_youtube}   target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'var(--text-2)', cursor: 'pointer', textDecoration: 'none' }}>▶</a>}
                {settings.social_linkedin  && <a href={settings.social_linkedin}  target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'var(--text-2)', cursor: 'pointer', textDecoration: 'none' }}>in</a>}
              </div>
            </div>

            {/* FORM */}
            <div id="form" className="form-panel reveal reveal-d1">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                  <div style={{ fontSize: '17px', fontWeight: 600, marginBottom: '6px' }}>Đã nhận yêu cầu!</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 300 }}>
                    Chúng tôi sẽ liên hệ lại với bạn trong vòng 2 giờ làm việc.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-.3px', marginBottom: '20px' }}>
                    Gửi yêu cầu tư vấn
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Họ và tên <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Nguyễn Văn A"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                          className="form-control"
                          type="tel"
                          placeholder="090 000 0000"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Dịch vụ quan tâm</label>
                      <select
                        className="form-select"
                        value={form.service}
                        onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      >
                        <option value="">— Chọn dịch vụ —</option>
                        <option>Thiết kế website</option>
                        <option>Ứng dụng di động</option>
                        <option>Marketing Số</option>
                        <option>Thiết kế Thương hiệu</option>
                        <option>Hệ thống Nội bộ</option>
                        <option>Bảo trì & Hỗ trợ</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Nội dung <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <textarea
                        className="form-control"
                        placeholder="Mô tả ngắn về dự án, yêu cầu hoặc câu hỏi của bạn..."
                        rows={4}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      />
                    </div>
                    {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '8px' }}>{error}</p>}
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn →'}
                    </button>
                    <p className="form-note">
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
              <iframe
                src={settings.google_map_embed}
                style={{ width: '100%', height: '300px', display: 'block', border: 'none', filter: 'grayscale(.15) contrast(1.05)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 0 clamp(72px,10vw,128px)' }}>
        <div className="wd-container" style={{ maxWidth: '720px' }}>
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Câu hỏi thường gặp</div>
            <h2 className="sec-title">Giải đáp <em>thắc mắc</em></h2>
          </div>
          <div className="reveal">
            {FAQS.map((f, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.q}
                  <span className="faq-arrow" style={{ transform: openFaq === i ? 'rotate(180deg)' : undefined }}>▾</span>
                </button>
                {openFaq === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <RevealObserver />
    </>
  )
}
