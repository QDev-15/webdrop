import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'

export default function LienHe() {
  const { settings } = useSite()

  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', size: '', interest: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [error, setError]           = useState('')

  const [demo, setDemo] = useState({ name: '', email: '', phone: '', time_pref: '' })
  const [demoSubmitting, setDemoSubmitting] = useState(false)
  const [demoSubmitted, setDemoSubmitted]   = useState(false)
  const [demoError, setDemoError]           = useState('')

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  })

  const setF = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))
  const setD = (k: keyof typeof demo, v: string) => setDemo(d => ({ ...d, [k]: v }))

  const handleContact = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/public/contact', { name: form.name, email: form.email, phone: form.phone, company: form.company, subject: form.interest, message: form.message || `Quy mô: ${form.size}` })
      setSubmitted(true)
    } catch (err) { setError(err instanceof Error ? err.message : 'Có lỗi xảy ra') }
    finally { setSubmitting(false) }
  }

  const handleDemo = async (e: FormEvent) => {
    e.preventDefault()
    setDemoError('')
    setDemoSubmitting(true)
    try {
      await api.post('/public/demo', demo)
      setDemoSubmitted(true)
    } catch (err) { setDemoError(err instanceof Error ? err.message : 'Có lỗi xảy ra') }
    finally { setDemoSubmitting(false) }
  }

  return (
    <>
      <section className="st-page-hero" aria-labelledby="lh-heading">
        <div className="wd-container">
          <div className="st-ph-inner">
            <div className="st-ph-badge"><span aria-hidden="true">💬</span> Liên hệ &amp; Demo</div>
            <h1 className="st-ph-title" id="lh-heading">
              Hãy cùng nhau<br />tìm <em>giải pháp</em> phù hợp
            </h1>
            <p className="st-ph-sub">Đội ngũ tư vấn của {settings.site_name} sẵn sàng lắng nghe và đề xuất giải pháp tối ưu nhất cho doanh nghiệp của bạn.</p>
          </div>
        </div>
      </section>

      {/* CONTACT MAIN */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }} aria-labelledby="contact-main-heading">
        <div className="wd-container">
          <div className="row g-5">
            {/* Form */}
            <div className="col-lg-7" data-reveal>
              <div className="st-section-badge"><span aria-hidden="true">📝</span> Gửi tin nhắn</div>
              <h2 className="st-section-title" id="contact-main-heading">
                Để lại thông tin,<br />chúng tôi liên hệ <span className="st-grad-text">ngay</span>
              </h2>
              <p className="st-section-sub mb-4">Điền form bên dưới — đội sales sẽ liên hệ trong vòng 2 giờ làm việc để tư vấn giải pháp phù hợp với doanh nghiệp của bạn.</p>

              {submitted ? (
                <div className="contact-success">
                  Cảm ơn! Yêu cầu của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc.
                </div>
              ) : (
                <form className="st-contact-form" onSubmit={handleContact} aria-label="Form liên hệ">
                  {error && <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--danger)' }}>{error}</div>}
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="st-form-group">
                        <label className="st-form-label" htmlFor="fullname">Họ và tên <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input type="text" id="fullname" className="st-form-control" value={form.name} onChange={e => setF('name', e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="st-form-group">
                        <label className="st-form-label" htmlFor="company">Công ty / Tổ chức</label>
                        <input type="text" id="company" className="st-form-control" value={form.company} onChange={e => setF('company', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="st-form-group">
                        <label className="st-form-label" htmlFor="email">Email công ty <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input type="email" id="email" className="st-form-control" value={form.email} onChange={e => setF('email', e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="st-form-group">
                        <label className="st-form-label" htmlFor="phone">Số điện thoại</label>
                        <input type="tel" id="phone" className="st-form-control" value={form.phone} onChange={e => setF('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="st-form-group">
                        <label className="st-form-label" htmlFor="size">Quy mô doanh nghiệp</label>
                        <select id="size" className="st-form-control" value={form.size} onChange={e => setF('size', e.target.value)}>
                          <option value="" disabled>Chọn quy mô...</option>
                          <option value="1-10">1–10 nhân viên (Startup)</option>
                          <option value="11-50">11–50 nhân viên (SME nhỏ)</option>
                          <option value="51-200">51–200 nhân viên (SME vừa)</option>
                          <option value="201-500">201–500 nhân viên</option>
                          <option value="500+">500+ nhân viên (Enterprise)</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="st-form-group">
                        <label className="st-form-label" htmlFor="interest">Bạn quan tâm đến</label>
                        <select id="interest" className="st-form-control" value={form.interest} onChange={e => setF('interest', e.target.value)}>
                          <option value="" disabled>Chọn mục tiêu...</option>
                          <option value="trial">Dùng thử miễn phí</option>
                          <option value="demo">Xem demo sản phẩm</option>
                          <option value="pro">Tư vấn gói Professional</option>
                          <option value="enterprise">Tư vấn gói Enterprise</option>
                          <option value="integration">Tích hợp hệ thống riêng</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="st-form-group">
                        <label className="st-form-label" htmlFor="message">Mô tả nhu cầu / Câu hỏi</label>
                        <textarea id="message" className="st-form-control" rows={4} value={form.message} onChange={e => setF('message', e.target.value)}></textarea>
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="st-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 28px', fontSize: 15 }} disabled={submitting}>
                        {submitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Info column */}
            <div className="col-lg-5" data-reveal>
              <div className="st-section-badge"><span aria-hidden="true">📍</span> Thông tin liên hệ</div>
              <h2 className="st-section-title" style={{ fontSize: 'clamp(22px,2.5vw,32px)' }}>
                Nhiều cách để <span className="st-grad-text">kết nối</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
                {settings.site_email && (
                  <div className="st-info-card">
                    <div className="st-info-icon" aria-hidden="true">📧</div>
                    <div>
                      <div className="st-info-title">Email</div>
                      <div className="st-info-text">
                        <a href={`mailto:${settings.site_email}`} style={{ color: 'var(--accent-mid)' }}>{settings.site_email}</a><br />
                        Phản hồi trong 2 giờ làm việc
                      </div>
                    </div>
                  </div>
                )}
                {settings.site_phone && (
                  <div className="st-info-card">
                    <div className="st-info-icon" aria-hidden="true">📞</div>
                    <div>
                      <div className="st-info-title">Hotline hỗ trợ</div>
                      <div className="st-info-text">
                        <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`} style={{ color: 'var(--accent-mid)' }}>{settings.site_phone}</a><br />
                        {settings.working_hours?.split('\n')[0] || 'Thứ 2 – Thứ 6, 8:00 – 18:00'}
                      </div>
                    </div>
                  </div>
                )}
                {settings.social_zalo && (
                  <div className="st-info-card">
                    <div className="st-info-icon" aria-hidden="true">💬</div>
                    <div>
                      <div className="st-info-title">Zalo OA</div>
                      <div className="st-info-text">
                        Nhắn tin trực tiếp qua Zalo<br />
                        <a href={`https://zalo.me/${settings.social_zalo}`} style={{ color: 'var(--accent-mid)' }} target="_blank" rel="noopener noreferrer">Mở Zalo ngay →</a>
                      </div>
                    </div>
                  </div>
                )}
                {settings.site_address && (
                  <div className="st-info-card">
                    <div className="st-info-icon" aria-hidden="true">🏢</div>
                    <div>
                      <div className="st-info-title">Văn phòng</div>
                      <div className="st-info-text">{settings.site_address}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO REQUEST */}
      <section style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }} aria-labelledby="demo-heading">
        <div className="wd-container sec-pad">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-reveal>
              <div className="st-section-badge"><span aria-hidden="true">🎯</span> Demo trực tiếp</div>
              <h2 className="st-section-title" id="demo-heading">
                Xem {settings.site_name} hoạt động<br />với <em>dữ liệu thật</em> của bạn
              </h2>
              <p className="st-section-sub mb-4">Đặt lịch demo 30 phút 1-1 với chuyên gia sản phẩm — chúng tôi sẽ demo đúng với quy trình và nhu cầu đặc thù của ngành bạn đang hoạt động.</p>
              <ul className="st-feat-list">
                <li>Demo tùy chỉnh theo ngành và quy mô doanh nghiệp bạn</li>
                <li>Giải đáp mọi câu hỏi kỹ thuật trực tiếp với chuyên gia</li>
                <li>Đánh giá ROI cụ thể cho trường hợp của bạn</li>
                <li>Nhận đề xuất lộ trình triển khai chi tiết</li>
              </ul>
            </div>
            <div className="col-lg-6" data-reveal>
              <div className="st-contact-form">
                <div className="st-section-badge" style={{ marginBottom: 20 }}><span aria-hidden="true">📅</span> Đặt lịch demo miễn phí</div>
                {demoSubmitted ? (
                  <div className="contact-success">Đăng ký demo thành công! Chúng tôi sẽ liên hệ để sắp xếp lịch phù hợp.</div>
                ) : (
                  <form onSubmit={handleDemo} aria-label="Form đặt lịch demo">
                    {demoError && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{demoError}</div>}
                    <div className="st-form-group">
                      <label className="st-form-label" htmlFor="demo-name">Họ và tên <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <input type="text" id="demo-name" className="st-form-control" value={demo.name} onChange={e => setD('name', e.target.value)} required />
                    </div>
                    <div className="st-form-group">
                      <label className="st-form-label" htmlFor="demo-email">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <input type="email" id="demo-email" className="st-form-control" value={demo.email} onChange={e => setD('email', e.target.value)} required />
                    </div>
                    <div className="st-form-group">
                      <label className="st-form-label" htmlFor="demo-phone">Số điện thoại</label>
                      <input type="tel" id="demo-phone" className="st-form-control" value={demo.phone} onChange={e => setD('phone', e.target.value)} />
                    </div>
                    <div className="st-form-group">
                      <label className="st-form-label" htmlFor="demo-time">Thời gian phù hợp</label>
                      <select id="demo-time" className="st-form-control" value={demo.time_pref} onChange={e => setD('time_pref', e.target.value)}>
                        <option value="" disabled>Chọn khung giờ...</option>
                        <option value="morning">Buổi sáng (8:00 – 12:00)</option>
                        <option value="afternoon">Buổi chiều (13:00 – 17:00)</option>
                        <option value="flexible">Linh hoạt, team sales liên hệ sắp xếp</option>
                      </select>
                    </div>
                    <button type="submit" className="st-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 28px' }} disabled={demoSubmitting}>
                      {demoSubmitting ? 'Đang gửi...' : 'Đặt lịch demo ngay'}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }} aria-labelledby="why-heading">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="st-section-badge"><span aria-hidden="true">🌟</span> Tại sao chọn chúng tôi</div>
            <h2 className="st-section-title" id="why-heading">
              Không chỉ là phần mềm —<br />là <span className="st-grad-text">đối tác chiến lược</span>
            </h2>
          </div>
          <div className="row g-4">
            {[
              { icon: '🇻🇳', title: 'Hiểu thị trường Việt Nam', desc: 'Được xây dựng bởi người Việt cho doanh nghiệp Việt — hiểu văn hóa, quy trình và thách thức đặc thù.' },
              { icon: '🔧', title: 'Tùy chỉnh linh hoạt', desc: 'Không phải template cứng nhắc — mọi quy trình, dashboard và báo cáo đều có thể cấu hình theo nhu cầu riêng.' },
              { icon: '📈', title: 'ROI rõ ràng, đo lường được', desc: 'Khách hàng trung bình tiết kiệm 10 tiếng/tuần và tăng 30% doanh thu trong 3 tháng đầu sử dụng.' },
              { icon: '🤝', title: 'Đồng hành dài hạn', desc: 'Không phải bán xong rồi thôi — đội Customer Success chủ động theo dõi và tối ưu kết quả cho bạn.' },
            ].map((item, i) => (
              <div key={i} className="col-md-3 text-center" data-reveal>
                <div style={{ fontSize: 36, marginBottom: 16 }} aria-hidden="true">{item.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
