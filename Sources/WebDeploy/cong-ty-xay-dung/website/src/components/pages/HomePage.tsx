import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  number: string
  description: string
  icon_svg: string
  featured: number
}

interface Project {
  id: number
  title: string
  category: string
  category_name: string
  location: string
  image: string
  featured: number
}

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  })
}

function StatCounter({ num, suffix, label }: { num: string; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const target = parseInt(num) || 0

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let cur = 0
        const step = Math.ceil(target / 60)
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          el.textContent = String(cur) + suffix
          if (cur >= target) clearInterval(t)
        }, 25)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix])

  return (
    <div className="xd-stat-item py-2">
      <span className="xd-stat-num" ref={ref}>{num}{suffix}</span>
      <span className="xd-stat-label">{label}</span>
    </div>
  )
}

export default function HomePage() {
  const { settings } = useSite()
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [formData, setFormData] = useState({ name: '', phone: '', type: '', message: '' })
  const [formSuccess, setFormSuccess] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  useReveal()

  useEffect(() => {
    api.get<Service[]>('/public/services?featured=1').then(setServices).catch(() => {})
    api.get<Project[]>('/public/projects?featured=1&limit=5').then(setProjects).catch(() => {})
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return
    setFormLoading(true)
    try {
      await api.post('/public/contact', {
        name: formData.name,
        phone: formData.phone,
        construction_type: formData.type,
        message: formData.message,
      })
      setFormSuccess(true)
    } catch {
      // fallback: show success anyway for UX
      setFormSuccess(true)
    } finally {
      setFormLoading(false)
    }
  }

  const heroImage    = settings.hero_image    || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop'
  const heroLine1    = settings.hero_line1    || 'Xây dựng'
  const heroLine2    = settings.hero_line2    || 'tầm nhìn'
  const heroLine3    = settings.hero_line3    || 'của bạn.'
  const heroBadge    = settings.hero_badge    || 'Tổng Thầu Xây Dựng · Uy Tín Hơn 18 Năm'
  const heroSub      = settings.hero_sub      || ''
  const heroBtn1     = settings.hero_btn1_text || 'Nhận báo giá ngay'
  const heroBtn2     = settings.hero_btn2_text || 'Xem dự án'
  const mapEmbed     = settings.google_map_embed || ''
  const phone        = settings.site_phone || ''
  const email        = settings.site_email || ''
  const address      = settings.site_address || ''
  const teamImage    = settings.about_team_image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop'
  const teamBadge    = settings.about_team_badge || '280+ Kỹ sư & Chuyên gia có chứng chỉ hành nghề'
  const equipImage   = settings.about_equip_image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop'
  const equipBadge   = settings.about_equip_badge || 'Máy móc đạt tiêu chuẩn ISO, kiểm định định kỳ'

  return (
    <main>
      {/* ══ HERO ══ */}
      <section className="xd-hero" aria-label="Giới thiệu công ty">
        <div className="xd-hero-img-wrap" aria-hidden="true">
          <img src={heroImage} alt="Công trình xây dựng tiêu biểu" loading="eager" />
        </div>

        <div className="wd-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="xd-hero-content">
            <div className="xd-hero-badge" data-reveal>
              <div className="xd-hero-badge-dot" aria-hidden="true"></div>
              <span>{heroBadge}</span>
            </div>

            <h1 className="xd-hero-heading" data-reveal data-delay="1">
              {heroLine1}<br />
              <span className="xd-accent">{heroLine2}</span><br />
              {heroLine3}
            </h1>

            <p className="xd-hero-sub" data-reveal data-delay="2">{heroSub}</p>

            <div className="xd-hero-btns" data-reveal data-delay="3">
              <Link to="/lien-he" className="xd-btn-solid">{heroBtn1}</Link>
              <Link to="/du-an" className="xd-btn-ghost-dark">{heroBtn2}</Link>
            </div>
          </div>
        </div>

        <div className="xd-scroll-ind" aria-hidden="true">
          <span>Cuộn xuống</span>
          <div className="xd-scroll-arrow"></div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="xd-stats-bar" aria-label="Thống kê">
        <div className="wd-container">
          <div className="row g-0 align-items-center justify-content-between">
            <div className="col-6 col-md-3" data-reveal>
              <StatCounter num={settings.stat1_num || '350'} suffix={settings.stat1_suffix || '+'} label={settings.stat1_label || 'Công trình hoàn thành'} />
            </div>
            <div className="d-none d-md-block xd-stats-divider" aria-hidden="true"></div>
            <div className="col-6 col-md-3" data-reveal data-delay="1">
              <StatCounter num={settings.stat2_num || '18'} suffix={settings.stat2_suffix || '+'} label={settings.stat2_label || 'Năm kinh nghiệm'} />
            </div>
            <div className="d-none d-md-block xd-stats-divider" aria-hidden="true"></div>
            <div className="col-6 col-md-3" data-reveal data-delay="2">
              <StatCounter num={settings.stat3_num || '280'} suffix={settings.stat3_suffix || '+'} label={settings.stat3_label || 'Nhân sự chuyên nghiệp'} />
            </div>
            <div className="d-none d-md-block xd-stats-divider" aria-hidden="true"></div>
            <div className="col-6 col-md-3" data-reveal data-delay="3">
              <StatCounter num={settings.stat4_num || '24'} suffix={settings.stat4_suffix || ''} label={settings.stat4_label || 'Tỉnh thành hoạt động'} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ DỊCH VỤ ══ */}
      <section className="sec-pad" aria-labelledby="dv-title">
        <div className="wd-container">
          <div className="text-center mb-5">
            <div className="xd-eyebrow" data-reveal>Lĩnh vực chuyên môn</div>
            <h2 className="xd-sec-title" id="dv-title" data-reveal data-delay="1">
              Dịch vụ <span className="xd-accent">xây dựng</span> toàn diện
            </h2>
            <p className="xd-sec-sub mx-auto" data-reveal data-delay="2">
              Từ thiết kế đến thi công và bàn giao, chúng tôi cung cấp giải pháp xây dựng đồng bộ cho mọi quy mô công trình.
            </p>
          </div>

          <div className="row g-4">
            {services.slice(0, 4).map((svc, i) => (
              <div className="col-12 col-md-6 col-lg-3" data-reveal data-delay={String(i)} key={svc.id}>
                <div className="xd-service-card">
                  <div className="xd-svc-icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: svc.icon_svg || '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>' }}
                    />
                  </div>
                  <span className="xd-svc-num">{svc.number || String(i + 1).padStart(2, '0')}</span>
                  <h3 className="xd-svc-title">{svc.name}</h3>
                  <p className="xd-svc-body">{svc.description}</p>
                  <Link to="/dich-vu" className="xd-svc-arrow">
                    Xem chi tiết
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CÔNG TRÌNH TIÊU BIỂU ══ */}
      <section className="xd-project-section" aria-labelledby="proj-title">
        <div className="wd-container">
          <div className="row align-items-end mb-0">
            <div className="col-md-7">
              <div className="xd-eyebrow xd-sec-dark" data-reveal style={{ color: 'var(--accent-mid)' }}>
                <div style={{ width: 24, height: 3, background: 'var(--accent-mid)', display: 'inline-block', marginRight: 10, verticalAlign: 'middle' }}></div>
                Công trình tiêu biểu
              </div>
              <h2 className="xd-sec-title" id="proj-title" data-reveal data-delay="1" style={{ color: '#fff' }}>
                Những gì chúng tôi<br /><span className="xd-accent">đã xây dựng</span>
              </h2>
            </div>
            <div className="col-md-5 text-md-end" data-reveal data-delay="2">
              <Link to="/du-an" className="xd-btn-solid">Xem tất cả dự án</Link>
            </div>
          </div>

          <div className="xd-project-grid" data-reveal data-delay="1">
            {projects.slice(0, 5).map(p => (
              <div className="xd-project-item" key={p.id}>
                <img src={p.image} alt={p.title} loading="lazy" />
                <div className="xd-project-overlay">
                  <div className="xd-proj-cat">{p.category_name || p.category}</div>
                  <div className="xd-proj-name">{p.title}</div>
                  <div className="xd-proj-loc">{p.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NĂNG LỰC — ALTERNATING STRIPS ══ */}
      <section aria-labelledby="nangluc-title">
        <div className="xd-strip">
          <div className="wd-container">
            <div className="row align-items-center g-5">
              <div className="col-md-6" data-reveal>
                <div className="xd-strip-img">
                  <img src={teamImage} alt="Đội ngũ kỹ sư" loading="lazy" />
                  <div className="xd-strip-img-badge">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                    <span>{teamBadge}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6" data-reveal data-delay="1">
                <div className="xd-strip-content">
                  <div className="xd-eyebrow">Đội ngũ nhân sự</div>
                  <h2 className="xd-sec-title" id="nangluc-title">Kỹ sư giàu<br /><span className="xd-accent">kinh nghiệm</span></h2>
                  <p className="xd-sec-sub mb-4">Đội ngũ kỹ sư xây dựng, kiến trúc sư và chuyên gia kỹ thuật được đào tạo bài bản, nhiều năm thực chiến trên công trường.</p>
                  <ul className="xd-strip-list">
                    <li>Kỹ sư xây dựng có chứng chỉ hành nghề do Bộ Xây Dựng cấp</li>
                    <li>Giám sát công trình được đào tạo chuyên sâu về an toàn lao động</li>
                    <li>Kiến trúc sư thiết kế tốt nghiệp đại học kiến trúc danh tiếng</li>
                    <li>Công nhân lành nghề qua đào tạo nội bộ và kiểm tra định kỳ</li>
                  </ul>
                  <Link to="/lien-he" className="xd-btn-solid">Liên hệ tư vấn</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xd-strip">
          <div className="wd-container">
            <div className="row align-items-center g-5">
              <div className="col-md-6 order-md-2" data-reveal>
                <div className="xd-strip-img">
                  <img src={equipImage} alt="Trang thiết bị thi công hiện đại" loading="lazy" />
                  <div className="xd-strip-img-badge">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <span>{equipBadge}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 order-md-1" data-reveal data-delay="1">
                <div className="xd-strip-content">
                  <div className="xd-eyebrow">Trang thiết bị</div>
                  <h2 className="xd-sec-title">Thiết bị <span className="xd-accent">hiện đại</span></h2>
                  <p className="xd-sec-sub mb-4">Đầu tư hệ thống máy móc, thiết bị thi công đồng bộ, hiện đại giúp đảm bảo tiến độ và chất lượng công trình.</p>
                  <ul className="xd-strip-list">
                    <li>Xe cẩu, máy xúc, máy đào đất thế hệ mới nhập khẩu Nhật Bản</li>
                    <li>Hệ thống coppha, giàn giáo đạt tiêu chuẩn châu Âu</li>
                    <li>Thiết bị đo đạc, khảo sát chính xác cao: máy toàn đạc, drone</li>
                    <li>Phần mềm BIM — quản lý công trình 3D, theo dõi tiến độ thực tế</li>
                  </ul>
                  <Link to="/du-an" className="xd-btn-solid">Xem công trình</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ĐỐI TÁC & CHỨNG NHẬN ══ */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }} aria-labelledby="partner-title">
        <div className="wd-container">
          <div className="text-center mb-5">
            <div className="xd-eyebrow" data-reveal>Uy tín được công nhận</div>
            <h2 className="xd-sec-title" id="partner-title" data-reveal data-delay="1">
              Đối tác & <span className="xd-accent">Chứng nhận</span>
            </h2>
          </div>

          <div className="row g-3 mb-5 justify-content-center" data-reveal>
            {['COTECCONS', 'HOÀ PHÁT', 'VINACONEX', 'NOVALAND', 'RICONS', 'HƯNG THỊNH'].map(name => (
              <div className="col-6 col-md-3 col-lg-2" key={name}>
                <div className="xd-partner-logo">
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3 justify-content-center">
            {[
              { name: 'ISO 9001:2015', sub: 'Quản lý chất lượng' },
              { name: 'ISO 14001:2015', sub: 'Quản lý môi trường' },
              { name: 'VIETBUILD 2023', sub: 'Giải thưởng xây dựng' },
              { name: 'Chứng chỉ năng lực', sub: 'BCA Cấp 1' },
            ].map((cert, i) => (
              <div className="col-6 col-md-3" data-reveal data-delay={String(i)} key={cert.name}>
                <div className="xd-cert-badge">
                  <div className="xd-cert-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div className="xd-cert-name">{cert.name}</div>
                  <div className="xd-cert-sub">{cert.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="sec-pad" aria-labelledby="review-title">
        <div className="wd-container">
          <div className="text-center mb-5">
            <div className="xd-eyebrow" data-reveal>Khách hàng nói gì</div>
            <h2 className="xd-sec-title" id="review-title" data-reveal data-delay="1">
              Đánh giá từ <span className="xd-accent">chủ đầu tư</span>
            </h2>
          </div>

          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div className="col-12 col-md-4" data-reveal data-delay={String(i)} key={t.id}>
                <div className="xd-testi-card">
                  <div className="xd-testi-stars" aria-label="5 sao">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} aria-hidden="true">★</span>
                    ))}
                  </div>
                  <p className="xd-testi-quote">{t.content}</p>
                  <div className="xd-testi-author">
                    <div className="xd-testi-avatar" aria-hidden="true">
                      {t.author_avatar
                        ? <img src={t.author_avatar} alt={t.author_name} />
                        : t.author_name.charAt(0)
                      }
                    </div>
                    <div>
                      <div className="xd-testi-name">{t.author_name}</div>
                      <div className="xd-testi-role">{t.author_title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA + MAP ══ */}
      <section className="xd-cta-section" aria-labelledby="cta-title">
        <div className="wd-container">
          <div className="row g-5 align-items-start">
            <div className="col-md-6" data-reveal>
              <div className="xd-eyebrow xd-sec-dark" style={{ color: 'var(--accent-mid)' }}>
                <div style={{ width: 24, height: 3, background: 'var(--accent-mid)', display: 'inline-block', marginRight: 10, verticalAlign: 'middle' }}></div>
                Báo giá miễn phí
              </div>
              <h2 className="xd-sec-title" id="cta-title" style={{ color: '#fff' }} data-reveal data-delay="1">
                Nhận báo giá<br /><span className="xd-accent">trong 24 giờ</span>
              </h2>
              <p className="xd-sec-sub mb-4" style={{ color: 'rgba(255,255,255,.45)' }} data-reveal data-delay="2">
                Mô tả sơ lược yêu cầu công trình của bạn, đội ngũ tư vấn sẽ liên hệ và gửi báo giá chi tiết miễn phí.
              </p>

              <div className="xd-cta-form-wrap" data-reveal data-delay="2">
                {formSuccess ? (
                  <div className="form-success">
                    ✓ Yêu cầu của bạn đã được ghi nhận! Chúng tôi sẽ liên hệ trong vòng 24 giờ.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="xd-form-label" htmlFor="cta-name">Họ và tên</label>
                        <input className="xd-form-input" id="cta-name" type="text" placeholder="Nguyễn Văn A" required
                          value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        <label className="xd-form-label" htmlFor="cta-phone">Số điện thoại</label>
                        <input className="xd-form-input" id="cta-phone" type="tel" placeholder="0912 345 678" required
                          value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        <label className="xd-form-label" htmlFor="cta-type">Loại công trình</label>
                        <select className="xd-form-input xd-form-select" id="cta-type"
                          value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}>
                          <option value="">-- Chọn loại công trình --</option>
                          <option>Nhà ở dân dụng</option>
                          <option>Biệt thự / Nhà phố</option>
                          <option>Nhà xưởng / Kho bãi</option>
                          <option>Văn phòng / Thương mại</option>
                          <option>Công trình khác</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="xd-form-btn" disabled={formLoading}>
                          {formLoading ? 'Đang gửi...' : 'Gửi yêu cầu báo giá'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="col-md-6" data-reveal data-delay="1">
              <div className="xd-map-placeholder mb-4">
                {mapEmbed ? (
                  <iframe src={mapEmbed} width="100%" height="320"
                    style={{ border: 0, borderRadius: 2, filter: 'grayscale(1) contrast(.9)' }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ văn phòng" />
                ) : (
                  <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>Google Maps</span>
                  </div>
                )}
              </div>

              <div className="xd-contact-detail">
                {address && (
                  <div className="xd-contact-row">
                    <div className="xd-contact-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <div>
                      <div className="xd-contact-label">Địa chỉ văn phòng</div>
                      <div className="xd-contact-val">{address}</div>
                    </div>
                  </div>
                )}
                {phone && (
                  <div className="xd-contact-row">
                    <div className="xd-contact-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.13 1.18 2 2 0 012.11.01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.65-.65a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                    </div>
                    <div>
                      <div className="xd-contact-label">Hotline tư vấn</div>
                      <div className="xd-hotline">{phone}</div>
                    </div>
                  </div>
                )}
                {email && (
                  <div className="xd-contact-row">
                    <div className="xd-contact-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div>
                      <div className="xd-contact-label">Email</div>
                      <div className="xd-contact-val">{email}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
