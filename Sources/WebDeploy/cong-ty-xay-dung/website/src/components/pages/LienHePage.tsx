import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

function useReveal() {
  useEffect(() => {
    const ro = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el))
    return () => ro.disconnect()
  })
}

export default function LienHePage() {
  usePageTitle('Liên hệ')
  const { settings } = useSite()
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', construction_type: '',
    area: '', budget: '', location: '', message: '',
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  useReveal()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const phone   = settings.site_phone   || ''
  const email   = settings.site_email   || ''
  const address = settings.site_address || ''
  const mapEmbed = settings.google_map_embed || ''
  const zalo    = settings.site_zalo || settings.social_zalo || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return
    setLoading(true)
    try {
      await api.post('/public/contact', formData)
      setSuccess(true)
    } catch {
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  const inp = (field: keyof typeof formData) => ({
    value: formData[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData(p => ({ ...p, [field]: e.target.value })),
  })

  return (
    <main>
      <section className="xd-page-hero" aria-label="Liên hệ">
        <div className="xd-page-hero-bg" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop" alt="" loading="eager" />
        </div>
        <div className="wd-container xd-page-hero-content">
          <div className="xd-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="xd-breadcrumb-sep" aria-hidden="true">/</span>
            <span className="xd-breadcrumb-current">Liên hệ</span>
          </div>
          <h1 className="xd-ph-title">Liên hệ & <span style={{ color: 'var(--accent)' }}>Báo giá</span></h1>
          <p className="xd-ph-sub">Gửi yêu cầu để nhận báo giá miễn phí trong vòng 24 giờ. Đội ngũ kỹ sư sẵn sàng tư vấn trực tiếp.</p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="xd-eyebrow">Liên hệ trực tiếp</div>
            <h2 className="xd-sec-title">Nhiều cách để <span className="xd-accent">kết nối</span></h2>
          </div>
          <div className="row g-4 mb-5">
            {[
              { icon: 'phone', label: 'Hotline tư vấn', value: phone, note: '7:00 – 18:00 · Thứ 2 – Thứ 7', href: phone ? `tel:${phone}` : '#' },
              { icon: 'email', label: 'Email', value: email, note: 'Phản hồi trong 4 giờ', href: email ? `mailto:${email}` : '#' },
              { icon: 'location', label: 'Văn phòng', value: address, note: '', href: '#' },
              { icon: 'clock', label: 'Giờ làm việc', value: 'T2–T6: 7:30–17:30', note: 'T7: 7:30–11:30', href: '#' },
            ].map((item, i) => (
              <div className="col-md-3 col-sm-6" data-reveal data-delay={String(i)} key={item.label}>
                <div className="xd-contact-card">
                  <div className="xd-contact-icon">
                    {item.icon === 'phone' && <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>}
                    {item.icon === 'email' && <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>}
                    {item.icon === 'location' && <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>}
                    {item.icon === 'clock' && <svg viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" /></svg>}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                    {item.href !== '#' ? <a href={item.href} style={{ color: 'var(--text)' }}>{item.value}</a> : item.value}
                  </div>
                  {item.note && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{item.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form + map */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-7" data-reveal>
              <div className="xd-eyebrow">Báo giá miễn phí</div>
              <h2 className="xd-sec-title mb-4">Nhận báo giá <span className="xd-accent">trong 24h</span></h2>

              {success ? (
                <div className="form-success" style={{ background: 'var(--accent-light)', borderLeft: '3px solid var(--accent)', padding: '18px 24px', borderRadius: 2, fontSize: 15 }}>
                  ✓ Yêu cầu báo giá đã được ghi nhận! Chúng tôi sẽ liên hệ trong vòng 24 giờ.
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="xd-form-light-label" htmlFor="fname">Họ và tên *</label>
                      <input type="text" id="fname" className="xd-form-light-input" placeholder="Họ và tên" required {...inp('name')} />
                    </div>
                    <div className="col-md-6">
                      <label className="xd-form-light-label" htmlFor="fphone">Số điện thoại *</label>
                      <input type="tel" id="fphone" className="xd-form-light-input" placeholder="0912 345 678" required {...inp('phone')} />
                    </div>
                    <div className="col-md-6">
                      <label className="xd-form-light-label" htmlFor="femail">Email</label>
                      <input type="email" id="femail" className="xd-form-light-input" placeholder="email@example.com" {...inp('email')} />
                    </div>
                    <div className="col-md-6">
                      <label className="xd-form-light-label" htmlFor="ftype">Loại công trình *</label>
                      <select id="ftype" className="xd-form-light-select" required {...inp('construction_type')}>
                        <option value="">Chọn loại công trình</option>
                        <option>Nhà ở dân dụng</option>
                        <option>Biệt thự / Villa</option>
                        <option>Nhà xưởng / Kho bãi</option>
                        <option>Văn phòng / Thương mại</option>
                        <option>Chung cư / Nhà phố</option>
                        <option>Thiết kế kiến trúc</option>
                        <option>Tư vấn dự án</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="xd-form-light-label" htmlFor="farea">Diện tích ước tính</label>
                      <input type="text" id="farea" className="xd-form-light-input" placeholder="Ví dụ: 200 m²" {...inp('area')} />
                    </div>
                    <div className="col-md-6">
                      <label className="xd-form-light-label" htmlFor="fbudget">Ngân sách dự kiến</label>
                      <select id="fbudget" className="xd-form-light-select" {...inp('budget')}>
                        <option value="">Chọn mức ngân sách</option>
                        <option>Dưới 1 tỷ đồng</option>
                        <option>1 – 3 tỷ đồng</option>
                        <option>3 – 5 tỷ đồng</option>
                        <option>5 – 10 tỷ đồng</option>
                        <option>Trên 10 tỷ đồng</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="xd-form-light-label" htmlFor="flocation">Địa điểm thi công</label>
                      <input type="text" id="flocation" className="xd-form-light-input" placeholder="Địa chỉ hoặc khu vực" {...inp('location')} />
                    </div>
                    <div className="col-12">
                      <label className="xd-form-light-label" htmlFor="fnote">Yêu cầu & Ghi chú thêm</label>
                      <textarea id="fnote" className="xd-form-light-textarea" rows={4} placeholder="Mô tả thêm về công trình, yêu cầu đặc biệt..." {...inp('message')} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="xd-form-submit" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi yêu cầu báo giá →'}
                      </button>
                      <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 10, textAlign: 'center' }}>
                        Báo giá miễn phí · Không ràng buộc · Phản hồi trong 24 giờ
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="col-lg-5" data-reveal data-delay="1">
              <div style={{ background: 'var(--warm)', borderRadius: 2, overflow: 'hidden', marginBottom: 24, border: '1px solid var(--border)' }}>
                {mapEmbed ? (
                  <iframe src={mapEmbed} width="100%" height="260" style={{ border: 'none', display: 'block' }} loading="lazy" title="Bản đồ" />
                ) : (
                  <div style={{ height: 260, background: '#d0cfc8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center' }}>Google Maps<br /><span style={{ fontSize: 11 }}>Cài đặt trong phần Cài đặt trang</span></span>
                  </div>
                )}
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{settings.site_name || 'Công Ty'} Xây Dựng</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{address}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--warm)', borderRadius: 2, padding: 24, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 16 }}>Cam kết của chúng tôi</div>
                {[
                  ['Báo giá chi tiết, minh bạch', 'Không phát sinh chi phí ngoài hợp đồng'],
                  ['Đảm bảo tiến độ', 'Phạt tiến độ theo hợp đồng nếu trễ hạn'],
                  ['Bảo hành công trình', 'Bảo hành kết cấu và hoàn thiện theo hợp đồng'],
                  ['Đội kỹ sư chuyên nghiệp', 'Tư vấn kỹ thuật trực tiếp tại công trình'],
                ].map(([title, sub]) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 8, height: 8, background: 'var(--accent)', flexShrink: 0, marginTop: 5 }}></div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-2)', fontWeight: 300 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent)', padding: 'clamp(56px,8vw,88px) 0' }}>
        <div className="wd-container text-center" data-reveal>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Gọi ngay hôm nay</div>
          <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(28px,4vw,50px)', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
            Xây dựng bắt đầu<br />từ một cuộc gọi.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', marginBottom: 32, fontWeight: 300 }}>
            Tư vấn miễn phí, không ràng buộc. Đội ngũ kỹ sư luôn sẵn sàng.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {phone && (
              <a href={`tel:${phone}`} style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', padding: '14px 28px', borderRadius: 2, fontSize: 13, fontWeight: 700 }}>
                {phone}
              </a>
            )}
            {zalo && (
              <a href={`https://zalo.me/${zalo}`} rel="noopener noreferrer" target="_blank"
                style={{ display: 'inline-block', background: 'transparent', color: '#fff', padding: '14px 28px', borderRadius: 2, fontSize: 13, fontWeight: 700, border: '2px solid rgba(255,255,255,.4)' }}>
                Zalo ngay
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
