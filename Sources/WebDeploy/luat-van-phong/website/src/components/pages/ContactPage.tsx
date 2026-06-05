import { useState } from 'react'
import { useSite } from '../../contexts/SiteContext'
import Reveal from '../Reveal'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

const FIELDS = [
  'Luật Doanh Nghiệp & M&A',
  'Luật Lao Động',
  'Luật Bất Động Sản & Xây Dựng',
  'Tranh Tụng & Giải Quyết Tranh Chấp',
  'Sở Hữu Trí Tuệ',
  'Tư Vấn Cá Nhân & Gia Đình',
  'Lĩnh vực khác',
]

const TIMES = [
  'Buổi sáng (8:00 – 12:00)',
  'Buổi chiều (13:00 – 17:30)',
  'Buổi tối (18:00 – 21:00)',
  'Linh hoạt, bất kỳ lúc nào',
]

const FAQS = [
  { q: 'Buổi tư vấn đầu tiên có mất phí không?', a: 'Không. Buổi tư vấn đầu tiên hoàn toàn miễn phí và không ràng buộc — thời lượng từ 30 đến 60 phút. Chỉ khi cả hai bên đồng ý hợp tác, chúng tôi mới ký hợp đồng dịch vụ pháp lý và thống nhất phí dịch vụ.' },
  { q: 'Thông tin của tôi có được bảo mật không?', a: 'Tuyệt đối. Nghĩa vụ bảo mật thông tin thân chủ là một trong những nguyên tắc đạo đức nghề nghiệp cao nhất của luật sư, được quy định trong Luật Luật Sư 2012. Mọi thông tin bạn cung cấp chỉ được sử dụng để phục vụ vụ việc của bạn.' },
  { q: 'Phí dịch vụ được tính như thế nào?', a: 'Phí dịch vụ được thỏa thuận rõ ràng và minh bạch trước khi ký hợp đồng. Chúng tôi có thể áp dụng phí trọn gói theo vụ việc, phí theo giờ, hoặc kết hợp cả hai. Không có bất kỳ khoản phí nào phát sinh ngoài những gì đã thỏa thuận bằng văn bản.' },
  { q: 'Tôi có thể tư vấn từ xa (online/điện thoại) được không?', a: 'Có. Chúng tôi cung cấp dịch vụ tư vấn trực tuyến qua Zoom, Google Meet hoặc điện thoại. Tuy nhiên, đối với các vụ việc phức tạp cần xem xét hồ sơ pháp lý, cuộc gặp trực tiếp sẽ mang lại hiệu quả tốt hơn.' },
  { q: 'Khi nào thì nên tìm luật sư?', a: 'Càng sớm càng tốt. Lý tưởng nhất là tìm kiếm tư vấn pháp lý ngay khi bắt đầu có dấu hiệu tranh chấp, ký kết hợp đồng quan trọng, hay đối mặt với bất kỳ tình huống pháp lý không rõ ràng nào.' },
]

export default function ContactPage() {
  usePageTitle('Liên hệ & Tư vấn')
  const { settings } = useSite()
  const phone    = settings.site_phone    || '0900 000 000'
  const phone2   = settings.site_phone_2  || '0800 000 000'
  const email    = settings.site_email    || ''
  const address  = settings.site_address  || ''
  const hours    = settings.working_hours || "Thứ Hai – Thứ Sáu: 8:00 – 17:30\nThứ Bảy: 8:00 – 12:00\nChủ Nhật: Theo đặt hẹn"
  const mapEmbed = settings.google_map_embed || ''
  const zalo     = settings.social_zalo || ''

  const [form, setForm] = useState({ name: '', phone: '', email: '', field: '', message: '', time_pref: '' })
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      setStatus('error'); setMsg('Vui lòng điền đầy đủ thông tin bắt buộc'); return
    }
    setStatus('loading')
    try {
      await api.post('/public/consultation', { ...form, source: 'contact' })
      setStatus('success'); setMsg('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc.')
      setForm({ name: '', phone: '', email: '', field: '', message: '', time_pref: '' })
    } catch {
      setStatus('error'); setMsg('Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline.')
    }
  }

  const contactItems = [
    { icon: 'T', label: 'Điện thoại & Hotline', content: `${phone}\n${phone2} (Hỗ trợ 24/7)` },
    { icon: '@', label: 'Email', content: email },
    { icon: 'A', label: 'Địa chỉ văn phòng', content: address },
    { icon: 'G', label: 'Giờ làm việc', content: hours },
  ]

  return (
    <>
      {/* PAGE HERO */}
      <section className="lv-page-hero">
        <div className="wd-container">
          <Reveal><div className="lv-ph-kicker">Tư vấn ban đầu miễn phí</div></Reveal>
          <Reveal delay={1}><h1 className="lv-ph-title">Liên Hệ <em>&amp; Tư Vấn</em></h1></Reveal>
          <Reveal delay={2}><p className="lv-ph-sub">Chúng tôi lắng nghe — mỗi vụ việc được tiếp cận với sự tôn trọng, bảo mật và cam kết tìm ra giải pháp tốt nhất.</p></Reveal>
        </div>
      </section>

      {/* CONTACT MAIN */}
      <section className="lv-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="lv-contact-grid">
            <Reveal>
              <h2 className="lv-contact-info-title">Gặp gỡ chúng tôi<br/><em>ngay hôm nay.</em></h2>
              <p className="lv-contact-info-sub">Tư vấn ban đầu hoàn toàn miễn phí và không ràng buộc. Mọi thông tin bạn chia sẻ đều được bảo mật tuyệt đối.</p>
              {contactItems.map((item, i) => (
                item.content && (
                  <div key={i} className="lv-contact-item">
                    <div className="lv-contact-item-icon">{item.icon}</div>
                    <div>
                      <div className="lv-contact-item-label">{item.label}</div>
                      <div className="lv-contact-item-value">
                        {item.content.split('\n').map((line, j) => (
                          <span key={j}>{line}{j < item.content.split('\n').length - 1 && <br/>}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              ))}
              <div style={{ marginTop: '32px', padding: '20px', background: 'var(--accent-light)', border: '1px solid rgba(139,105,20,.2)' }}>
                <p style={{ fontFamily: 'var(--body-font)', fontSize: '13px', fontWeight: 300, color: 'var(--text-2)', lineHeight: '1.75', margin: 0 }}>
                  <strong style={{ fontWeight: 500, color: 'var(--accent)' }}>Cam kết bảo mật:</strong> Mọi thông tin trao đổi giữa thân chủ và luật sư đều được bảo vệ theo Luật Luật Sư 2012.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="lv-contact-form">
                <h3 className="lv-form-title">Đặt lịch tư vấn</h3>
                <p className="lv-form-sub">Điền thông tin bên dưới — chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc.</p>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="lv-form-row">
                        <label className="lv-form-label" htmlFor="c-name">Họ và tên *</label>
                        <input className="lv-form-input" type="text" id="c-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="lv-form-row">
                        <label className="lv-form-label" htmlFor="c-phone">Số điện thoại *</label>
                        <input className="lv-form-input" type="tel" id="c-phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                  <div className="lv-form-row">
                    <label className="lv-form-label" htmlFor="c-email">Email</label>
                    <input className="lv-form-input" type="email" id="c-email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="lv-form-row">
                    <label className="lv-form-label" htmlFor="c-field">Lĩnh vực cần tư vấn *</label>
                    <select className="lv-form-select" id="c-field" value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))}>
                      <option value="">-- Chọn lĩnh vực --</option>
                      {FIELDS.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="lv-form-row">
                    <label className="lv-form-label" htmlFor="c-message">Mô tả vụ việc *</label>
                    <textarea className="lv-form-textarea" id="c-message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Mô tả ngắn gọn vụ việc của bạn..." required />
                  </div>
                  <div className="lv-form-row">
                    <label className="lv-form-label" htmlFor="c-time">Thời gian liên hệ phù hợp</label>
                    <select className="lv-form-select" id="c-time" value={form.time_pref} onChange={e => setForm(f => ({ ...f, time_pref: e.target.value }))}>
                      <option value="">-- Chọn khung giờ --</option>
                      {TIMES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="lv-form-submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang gửi...' : 'Gửi Yêu Cầu Tư Vấn'}
                  </button>
                  {status !== 'idle' && (
                    <div className={status === 'success' ? 'form-success' : 'form-error'} style={{ marginTop: '16px' }}>{msg}</div>
                  )}
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MAP */}
      {mapEmbed && (
        <section style={{ background: 'var(--dark)' }}>
          <div style={{ width: '100%', height: '320px' }} dangerouslySetInnerHTML={{ __html: mapEmbed }} />
        </section>
      )}

      {/* FAQ */}
      <section style={{ background: 'var(--warm)', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="wd-container">
          <Reveal className="text-center" style={{ marginBottom: 'clamp(36px,5vw,52px)' }}>
            <span className="lv-section-label">Câu hỏi thường gặp</span>
            <h2 className="lv-section-title">Bạn muốn biết <em>thêm gì?</em></h2>
          </Reveal>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <Reveal key={i} style={{ border: '1px solid var(--border)', borderRadius: 0, marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', background: 'var(--surface)', padding: '20px 24px', border: 'none', cursor: 'pointer', fontFamily: 'var(--heading-font)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {faq.q}
                  <span style={{ fontFamily: 'var(--body-font)', fontSize: '20px', color: 'var(--accent-mid)', marginLeft: '12px', flexShrink: 0 }}>{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '16px 24px 24px', fontFamily: 'var(--body-font)', fontSize: '14px', fontWeight: 300, color: 'var(--text-2)', lineHeight: '1.8' }}>
                    {faq.a}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{ background: 'var(--dark2)', padding: 'clamp(40px,5vw,64px) 0' }}>
        <div className="wd-container">
          <Reveal style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: 'var(--body-font)', fontSize: '11px', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: '8px' }}>Khẩn cấp? Gọi ngay</p>
              <a href={`tel:${phone.replace(/\s/g,'')}`} style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, color: 'var(--accent-mid)', letterSpacing: '.5px' }}>{phone}</a>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {zalo && <a href={`https://zalo.me/${zalo}`} className="lv-btn-ghost-gold" target="_blank" rel="noopener noreferrer">Chat Zalo</a>}
              <a href="#" className="lv-btn-ghost-white" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Đặt Lịch Online</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
