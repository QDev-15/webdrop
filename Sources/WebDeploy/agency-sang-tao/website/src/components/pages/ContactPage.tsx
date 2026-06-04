import { useState } from 'react'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import RevealObserver from '../RevealObserver'

interface ContactForm {
  name: string
  company: string
  email: string
  phone: string
  service: string
  budget: string
  message: string
}

const FAQS = [
  {
    q: 'Thời gian thực hiện một dự án brand identity là bao lâu?',
    a: 'Tùy thuộc vào scope của dự án. Một brand starter pack thường mất 2-3 tuần. Full brand identity mất 4-8 tuần. Chúng tôi luôn thống nhất timeline cụ thể trước khi bắt đầu.',
  },
  {
    q: 'Quy trình thanh toán như thế nào?',
    a: 'Chúng tôi chia thanh toán thành 2-3 đợt: 50% khi ký hợp đồng, 50% còn lại khi bàn giao. Với dự án lớn có thể chia thêm đợt giữa theo milestone.',
  },
  {
    q: 'Tôi có thể yêu cầu sửa đổi bao nhiêu lần?',
    a: 'Mỗi phase thiết kế bao gồm 2-3 vòng feedback/revision. Revision thêm ngoài phạm vi sẽ được tính phí theo giờ, đã thông báo rõ trong hợp đồng.',
  },
  {
    q: 'Tôi có được nhận file gốc (source file) không?',
    a: 'Có — chúng tôi bàn giao đầy đủ file gốc (AI, PSD, Figma...) cùng file xuất (PDF, PNG, SVG) ở mọi kích thước cần thiết.',
  },
  {
    q: 'Agency có hỗ trợ sau khi bàn giao dự án không?',
    a: 'Có — chúng tôi hỗ trợ miễn phí trong 30 ngày sau bàn giao cho các điều chỉnh nhỏ. Với nhu cầu dài hạn, chúng tôi có gói retainer hàng tháng.',
  },
]

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState<ContactForm>({
    name: '', company: '', email: '', phone: '', service: '', budget: '', message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMsg, setSubmitMsg] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.message) return
    setSubmitting(true)
    try {
      const result = await api.post<{ ok: boolean; message: string }>('/public/contact', {
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        service: form.service,
        budget: form.budget,
        message: form.message,
      })
      if (result.ok) {
        setSubmitStatus('success')
        setSubmitMsg(result.message || 'Brief đã được gửi thành công!')
        setForm({ name: '', company: '', email: '', phone: '', service: '', budget: '', message: '' })
      }
    } catch (err) {
      setSubmitStatus('error')
      setSubmitMsg('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp.')
    } finally {
      setSubmitting(false)
    }
  }

  const siteName = settings.site_name || 'NOVA.'

  return (
    <>
      <RevealObserver />

      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <div className="ag-ph-label" data-reveal>Liên hệ với chúng tôi</div>
          <h1 className="ag-ph-title" data-reveal>
            LET'S<br /><span className="outline">TALK</span>
          </h1>
          <p className="ag-ph-sub" data-reveal>
            Chia sẻ về dự án của bạn — chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc. Mọi cuộc tư vấn ban đầu đều miễn phí.
          </p>
        </div>
      </section>

      {/* CONTACT INFO BAR */}
      <div className="ag-stat-bar" style={{ background: 'var(--accent)' }}>
        <div className="wd-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }} data-reveal>
            <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(0,0,0,.1)' }}>
              <div className="ag-stat-name">Email</div>
              <a href={`mailto:${settings.site_email || 'hello@nova.vn'}`} className="ag-stat-number" style={{ fontSize: 'clamp(14px,2vw,20px)', letterSpacing: '-0.5px', color: 'var(--dark)', textDecoration: 'none' }}>
                {settings.site_email || 'hello@nova.vn'}
              </a>
            </div>
            <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(0,0,0,.1)' }}>
              <div className="ag-stat-name">Điện thoại / Zalo</div>
              <a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`} className="ag-stat-number" style={{ fontSize: 'clamp(14px,2vw,20px)', letterSpacing: '-0.5px', color: 'var(--dark)', textDecoration: 'none' }}>
                {settings.site_phone || '0909 123 456'}
              </a>
            </div>
            <div style={{ padding: '24px 32px' }}>
              <div className="ag-stat-name">Giờ làm việc</div>
              <span className="ag-stat-number" style={{ fontSize: 'clamp(14px,2vw,20px)', letterSpacing: '-0.5px' }}>
                {settings.working_hours || 'T2-T6 · 8:00 – 18:00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTACT */}
      <section className="ag-contact-section">
        <div className="wd-container">
          <div className="ag-contact-grid">
            {/* Left: info */}
            <div>
              <h2 className="ag-contact-big-title" data-reveal>
                LIÊN<br />HỆ<br /><span>{siteName}</span>
              </h2>

              <div data-reveal>
                <div className="ag-contact-detail-item">
                  <span className="ag-cd-label">Địa chỉ văn phòng</span>
                  <span className="ag-cd-value">{settings.site_address || '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'}</span>
                </div>
                <div className="ag-contact-detail-item">
                  <span className="ag-cd-label">Email</span>
                  <span className="ag-cd-value">
                    <a href={`mailto:${settings.site_email || 'hello@nova.vn'}`}>
                      {settings.site_email || 'hello@nova.vn'}
                    </a>
                  </span>
                </div>
                <div className="ag-contact-detail-item">
                  <span className="ag-cd-label">Điện thoại</span>
                  <span className="ag-cd-value">
                    <a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`}>
                      {settings.site_phone || '0909 123 456'}
                    </a>
                  </span>
                </div>
                {settings.social_zalo && (
                  <div className="ag-contact-detail-item">
                    <span className="ag-cd-label">Zalo</span>
                    <span className="ag-cd-value">
                      <a href={`https://zalo.me/${settings.social_zalo.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        {settings.social_zalo}
                      </a>
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '32px' }} data-reveal>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Theo dõi chúng tôi</div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {settings.social_facebook && <a href={settings.social_facebook} className="ag-btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }} target="_blank" rel="noopener noreferrer">Facebook</a>}
                  {settings.social_instagram && <a href={settings.social_instagram} className="ag-btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }} target="_blank" rel="noopener noreferrer">Instagram</a>}
                  {settings.social_behance && <a href={settings.social_behance} className="ag-btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }} target="_blank" rel="noopener noreferrer">Behance</a>}
                  {settings.social_linkedin && <a href={settings.social_linkedin} className="ag-btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                  {!settings.social_facebook && !settings.social_instagram && !settings.social_behance && !settings.social_linkedin && (
                    <>
                      <a href="#" className="ag-btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }}>Facebook</a>
                      <a href="#" className="ag-btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }}>Instagram</a>
                      <a href="#" className="ag-btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }}>Behance</a>
                      <a href="#" className="ag-btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }}>LinkedIn</a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div data-reveal>
              <div className="ag-contact-form-wrap">
                <h3 className="ag-contact-form-title">Gửi brief cho chúng tôi</h3>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="ag-field">
                        <label htmlFor="lh-name">Họ và tên *</label>
                        <input type="text" id="lh-name" name="name" placeholder="Nguyễn Văn A" required autoComplete="name"
                          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="ag-field">
                        <label htmlFor="lh-company">Công ty / Thương hiệu</label>
                        <input type="text" id="lh-company" name="company" placeholder="Tên công ty" autoComplete="organization"
                          value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="ag-field">
                        <label htmlFor="lh-email">Email *</label>
                        <input type="email" id="lh-email" name="email" placeholder="email@company.vn" required autoComplete="email"
                          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="ag-field">
                        <label htmlFor="lh-phone">Số điện thoại</label>
                        <input type="tel" id="lh-phone" name="phone" placeholder="0909 xxx xxx" autoComplete="tel"
                          value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <div className="ag-field">
                    <label htmlFor="lh-service">Dịch vụ quan tâm *</label>
                    <select id="lh-service" name="service" required value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                      <option value="">Chọn dịch vụ bạn cần</option>
                      <option value="brand-identity">Brand Identity (Logo, Visual Identity)</option>
                      <option value="brand-strategy">Brand Strategy</option>
                      <option value="digital-design">Digital Design (Web, App, UI/UX)</option>
                      <option value="campaign">Campaign &amp; Content</option>
                      <option value="full-package">Full Package (Brand + Digital + Campaign)</option>
                      <option value="other">Khác / Cần tư vấn thêm</option>
                    </select>
                  </div>
                  <div className="ag-field">
                    <label htmlFor="lh-budget">Ngân sách dự kiến</label>
                    <select id="lh-budget" name="budget" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}>
                      <option value="">Chọn mức ngân sách</option>
                      <option value="under-50">Dưới 50 triệu</option>
                      <option value="50-100">50 – 100 triệu</option>
                      <option value="100-300">100 – 300 triệu</option>
                      <option value="above-300">Trên 300 triệu</option>
                      <option value="unknown">Chưa xác định</option>
                    </select>
                  </div>
                  <div className="ag-field">
                    <label htmlFor="lh-brief">Mô tả dự án *</label>
                    <textarea id="lh-brief" name="brief" placeholder="Kể cho chúng tôi nghe về thương hiệu của bạn, mục tiêu dự án, timeline mong muốn..." style={{ height: '140px' }} required
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>

                  {submitStatus === 'success' && <div className="ag-form-success">{submitMsg}</div>}
                  {submitStatus === 'error' && <div className="ag-form-error">{submitMsg}</div>}

                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                    * Thông tin bắt buộc. Chúng tôi cam kết bảo mật thông tin của bạn.
                  </div>
                  <button type="submit" className="ag-form-submit" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi brief ngay →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      {settings.google_map_embed && (
        <div style={{ width: '100%', height: '320px', background: 'var(--warm2)', overflow: 'hidden' }}>
          <iframe
            src={settings.google_map_embed}
            title="Bản đồ vị trí"
            style={{ width: '100%', height: '100%', border: 'none', filter: 'grayscale(40%) contrast(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {/* FAQ */}
      <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-4" data-reveal>
              <div className="ag-section-label" style={{ marginBottom: '12px' }}>FAQ</div>
              <h2 className="ag-section-title">Câu hỏi<br /><em>thường gặp</em></h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.8, marginTop: '16px' }}>
                Không tìm thấy câu trả lời bạn cần? Liên hệ trực tiếp — chúng tôi luôn sẵn sàng giải đáp.
              </p>
            </div>
            <div className="col-lg-8" data-reveal>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
                  <div
                    style={{ fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: openFaq === i ? '10px' : 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '20px', flexShrink: 0 }}>
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </div>
                  {openFaq === i && (
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 400, color: 'var(--text-2)', lineHeight: 1.75, margin: 0 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
