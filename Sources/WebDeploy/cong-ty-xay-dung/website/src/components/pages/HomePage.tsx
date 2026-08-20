import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

export default function HomePage() {
  const { settings, slides, services, projects, testimonials } = useSite()
  const s = settings

  useDocumentMeta({
    title: 'Công Ty Xây Dựng Hoàng Gia — Tổng Thầu Uy Tín TP.HCM',
    description: 'Tổng thầu xây dựng dân dụng, công nghiệp, thiết kế kiến trúc tại TP.HCM. Hơn 18 năm kinh nghiệm, hơn 350 công trình hoàn thành.',
  })

  // Contact form state
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLSelectElement>(null)
  const msgRef = useRef<HTMLParagraphElement>(null)

  // Reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            ro.unobserve(e.target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [services, projects, testimonials])

  async function handleContact(e: React.FormEvent) {
    e.preventDefault()
    const name = nameRef.current?.value || ''
    const phone = phoneRef.current?.value || ''
    const projectType = typeRef.current?.value || ''
    try {
      await api.post('/public/contact', {
        name, phone,
        message: `Yêu cầu báo giá loại công trình: ${projectType}`,
        project_type: projectType
      })
      if (msgRef.current) {
        msgRef.current.style.display = 'block'
        msgRef.current.textContent = 'Yêu cầu của bạn đã được gửi! Chúng tôi sẽ liên hệ sớm nhất.'
      }
      if (nameRef.current) nameRef.current.value = ''
      if (phoneRef.current) phoneRef.current.value = ''
    } catch {
      if (msgRef.current) {
        msgRef.current.style.display = 'block'
        msgRef.current.textContent = 'Gửi thất bại. Vui lòng thử lại.'
        msgRef.current.style.color = '#e24b4a'
      }
    }
  }

  const heroSlide = slides[0] || {
    title: 'Xây dựng tầm nhìn của bạn.',
    subtitle: 'Tổng thầu xây dựng uy tín tại TP.HCM, chuyên thi công dân dụng, công nghiệp và thiết kế kiến trúc.',
    button_text: 'Nhận báo giá ngay',
    button_link: '/lien-he',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop',
  }

  const featuredProjects = projects.filter(p => p.featured).slice(0, 5)
  const displayProjects = featuredProjects.length >= 5 ? featuredProjects : projects.slice(0, 5)

  const statProjects = s['stat_projects'] || '350'
  const statYears = s['stat_years'] || '18'
  const statStaff = s['stat_staff'] || '280'
  const statProvinces = s['stat_provinces'] || '24'

  return (
    <>
      {/* HERO */}
      <section className="xd-hero">
        <div className="xd-hero-img-wrap">
          {heroSlide.image && <img src={heroSlide.image} alt="Hero" loading="eager" />}
        </div>
        <div className="wd-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="xd-hero-content">
            <div className="xd-hero-badge" data-reveal>
              <div className="xd-hero-badge-dot" />
              <span>Tổng Thầu Xây Dựng · Uy Tín Hơn {statYears} Năm</span>
            </div>
            <h1 className="xd-hero-heading" data-reveal data-delay="1">
              {heroSlide.title.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>
            <p className="xd-hero-sub" data-reveal data-delay="2">{heroSlide.subtitle}</p>
            <div className="xd-hero-btns" data-reveal data-delay="3">
              <Link to="/lien-he" className="xd-btn-solid">{heroSlide.button_text || 'Nhận báo giá ngay'}</Link>
              <Link to="/du-an" className="xd-btn-ghost-dark">Xem dự án</Link>
            </div>
          </div>
        </div>
        <div className="xd-scroll-ind">
          <span>Cuộn xuống</span>
          <div className="xd-scroll-arrow" />
        </div>
      </section>

      {/* STATS */}
      <section className="xd-stats-bar">
        <div className="wd-container">
          <div className="row g-0 align-items-center justify-content-between">
            {[
              { num: statProjects + '+', label: 'Công trình hoàn thành' },
              { num: statYears + '+', label: 'Năm kinh nghiệm' },
              { num: statStaff + '+', label: 'Nhân sự chuyên nghiệp' },
              { num: statProvinces, label: 'Tỉnh thành hoạt động' },
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3" data-reveal data-delay={i.toString()}>
                <div className="xd-stat-item py-2">
                  <span className="xd-stat-num">{stat.num}</span>
                  <span className="xd-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DỊCH VỤ */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="text-center mb-5">
            <div className="xd-eyebrow" data-reveal>Lĩnh vực chuyên môn</div>
            <h2 className="xd-sec-title" data-reveal data-delay="1">
              Dịch vụ <span className="xd-accent">xây dựng</span> toàn diện
            </h2>
            <p className="xd-sec-sub mx-auto" data-reveal data-delay="2">
              Từ thiết kế đến thi công và bàn giao, chúng tôi cung cấp giải pháp xây dựng đồng bộ cho mọi quy mô công trình.
            </p>
          </div>
          <div className="row g-4">
            {(services.length > 0 ? services : FALLBACK_SERVICES).map((svc, i) => (
              <div key={svc.id || i} className="col-12 col-md-6 col-lg-3" data-reveal data-delay={(i % 4).toString()}>
                <div className="xd-service-card">
                  <div className="xd-svc-icon-wrap">
                    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.8" fill="none" /></svg>
                  </div>
                  <span className="xd-svc-num">0{i + 1}</span>
                  <h3 className="xd-svc-title">{svc.name}</h3>
                  <p className="xd-svc-body">{svc.description}</p>
                  <Link to="/dich-vu" className="xd-svc-arrow">
                    Xem chi tiết
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DỰ ÁN TIÊU BIỂU */}
      <section className="xd-project-section">
        <div className="wd-container">
          <div className="row align-items-end mb-0">
            <div className="col-md-7">
              <div className="xd-eyebrow xd-sec-dark" data-reveal style={{ color: 'var(--accent-mid)' }}>
                <div style={{ width: 24, height: 3, background: 'var(--accent-mid)', display: 'inline-block', marginRight: 10, verticalAlign: 'middle' }} />
                Công trình tiêu biểu
              </div>
              <h2 className="xd-sec-title xd-sec-dark" data-reveal data-delay="1" style={{ color: '#fff' }}>
                Những gì chúng tôi<br /><span className="xd-accent">đã xây dựng</span>
              </h2>
            </div>
            <div className="col-md-5 text-md-end" data-reveal data-delay="2">
              <Link to="/du-an" className="xd-btn-solid">Xem tất cả dự án</Link>
            </div>
          </div>

          <div className="xd-project-grid" data-reveal data-delay="1">
            {displayProjects.map((p, i) => (
              <Link key={p.id} to={`/du-an/${p.slug}`} className="xd-project-item">
                <img src={p.image} alt={p.name} loading={i === 0 ? 'eager' : 'lazy'} />
                <div className="xd-project-overlay">
                  <div className="xd-proj-cat">{CATEGORY_LABELS[p.category] || p.category}</div>
                  <div className="xd-proj-name">{p.name}</div>
                  <div className="xd-proj-loc">{p.location}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT STRIPS */}
      <section>
        <div className="xd-strip">
          <div className="wd-container">
            <div className="row align-items-center g-5">
              <div className="col-md-6" data-reveal>
                <div className="xd-strip-img">
                  <img
                    src={s['about_image'] || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop'}
                    alt="Đội ngũ kỹ sư"
                    loading="lazy"
                    style={{ width: '100%', height: 380, objectFit: 'cover' }}
                  />
                  <div className="xd-strip-img-badge">
                    <svg viewBox="0 0 24 24" style={{ fill: 'rgba(255,255,255,.7)', width: 20, height: 20, flexShrink: 0 }}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <span>{statStaff}+ Kỹ sư & Chuyên gia có chứng chỉ hành nghề</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6" data-reveal data-delay="1">
                <div className="xd-strip-content">
                  <div className="xd-eyebrow">Đội ngũ nhân sự</div>
                  <h2 className="xd-sec-title">{s['about_title'] || 'Kỹ sư giàu kinh nghiệm'}</h2>
                  <p className="xd-sec-sub mb-4">{s['about_content'] || 'Đội ngũ kỹ sư xây dựng, kiến trúc sư và chuyên gia kỹ thuật được đào tạo bài bản, nhiều năm thực chiến trên công trường.'}</p>
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
      </section>

      {/* TESTIMONIALS */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="text-center mb-5">
            <div className="xd-eyebrow" data-reveal>Khách hàng nói gì</div>
            <h2 className="xd-sec-title" data-reveal data-delay="1">
              Đánh giá từ <span className="xd-accent">chủ đầu tư</span>
            </h2>
          </div>
          <div className="row g-4">
            {(testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS).map((t, i) => (
              <div key={t.id || i} className="col-12 col-md-4" data-reveal data-delay={(i % 3).toString()}>
                <div className="xd-testi-card">
                  <div className="xd-testi-stars">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => <span key={j}>★</span>)}
                  </div>
                  <p className="xd-testi-quote">{t.content}</p>
                  <div className="xd-testi-author">
                    {t.author_avatar ? (
                      <div className="xd-testi-avatar"><img src={t.author_avatar} alt={t.author_name} /></div>
                    ) : (
                      <div className="xd-testi-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d84315', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                        {t.author_name[0]}
                      </div>
                    )}
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

      {/* CTA + CONTACT */}
      <section className="xd-cta-section">
        <div className="wd-container">
          <div className="row g-5 align-items-start">
            <div className="col-md-6" data-reveal>
              <div className="xd-eyebrow xd-sec-dark" style={{ color: 'var(--accent-mid)' }}>
                <div style={{ width: 24, height: 3, background: 'var(--accent-mid)', display: 'inline-block', marginRight: 10, verticalAlign: 'middle' }} />
                Báo giá miễn phí
              </div>
              <h2 className="xd-sec-title xd-sec-dark" style={{ color: '#fff' }} data-reveal data-delay="1">
                Nhận báo giá<br /><span className="xd-accent">trong 24 giờ</span>
              </h2>
              <p className="xd-sec-sub mb-4" style={{ color: 'rgba(255,255,255,.45)' }} data-reveal data-delay="2">
                Mô tả sơ lược yêu cầu công trình của bạn, đội ngũ tư vấn sẽ liên hệ và gửi báo giá chi tiết miễn phí.
              </p>
              <div className="xd-cta-form-wrap" data-reveal data-delay="2">
                <form onSubmit={handleContact}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="xd-form-label">Họ và tên</label>
                      <input ref={nameRef} className="xd-form-input" type="text" placeholder="Nguyễn Văn A" required />
                    </div>
                    <div className="col-12">
                      <label className="xd-form-label">Số điện thoại</label>
                      <input ref={phoneRef} className="xd-form-input" type="tel" placeholder="0912 345 678" required />
                    </div>
                    <div className="col-12">
                      <label className="xd-form-label">Loại công trình</label>
                      <select ref={typeRef} className="xd-form-input xd-form-select">
                        <option value="">-- Chọn loại công trình --</option>
                        <option>Nhà ở dân dụng</option>
                        <option>Biệt thự / Nhà phố</option>
                        <option>Nhà xưởng / Kho bãi</option>
                        <option>Văn phòng / Thương mại</option>
                        <option>Công trình khác</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="xd-form-btn">Gửi yêu cầu báo giá</button>
                    </div>
                  </div>
                </form>
                <p ref={msgRef} style={{ display: 'none', marginTop: 12, fontSize: 13, color: '#4ade80' }}></p>
              </div>
            </div>

            <div className="col-md-6" data-reveal data-delay="1">
              {s['google_map_embed'] ? (
                <div className="xd-map-placeholder mb-4" dangerouslySetInnerHTML={{ __html: s['google_map_embed'] }} />
              ) : (
                <div className="xd-map-placeholder mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.3)' }}>
                  Bản đồ chưa được cấu hình
                </div>
              )}
              <div className="xd-contact-detail">
                {s['site_address'] && (
                  <div className="xd-contact-row">
                    <div className="xd-contact-icon"><svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'var(--accent)', fill: 'none', strokeWidth: 2 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
                    <div><div className="xd-contact-label">Địa chỉ văn phòng</div><div className="xd-contact-val">{s['site_address']}</div></div>
                  </div>
                )}
                {s['site_phone'] && (
                  <div className="xd-contact-row">
                    <div className="xd-contact-icon"><svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'var(--accent)', fill: 'none', strokeWidth: 2 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.13 1.18 2 2 0 012.11.01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.65-.65a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg></div>
                    <div><div className="xd-contact-label">Hotline tư vấn</div><div className="xd-hotline">{s['site_phone']}</div></div>
                  </div>
                )}
                {s['site_email'] && (
                  <div className="xd-contact-row">
                    <div className="xd-contact-icon"><svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'var(--accent)', fill: 'none', strokeWidth: 2 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                    <div><div className="xd-contact-label">Email</div><div className="xd-contact-val">{s['site_email']}</div></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZALO FLOAT */}
      {s['social_zalo'] && (
        <a href={`https://zalo.me/${s['social_zalo']}`} className="zalo-float" target="_blank" rel="noopener noreferrer">
          <div className="zalo-float-pulse" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" width="30" height="30" />
        </a>
      )}
    </>
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  'dan-dung': 'Dân dụng',
  'cong-nghiep': 'Công nghiệp',
  'thuong-mai': 'Thương mại',
  'biet-thu': 'Biệt thự',
}

const FALLBACK_SERVICES = [
  { id: 1, name: 'Thi Công Dân Dụng', description: 'Xây dựng nhà ở, biệt thự, chung cư, văn phòng. Thi công trọn gói từ móng đến hoàn thiện nội thất.' },
  { id: 2, name: 'Thi Công Công Nghiệp', description: 'Xây dựng nhà xưởng, kho bãi, khu công nghiệp. Đảm bảo tiêu chuẩn kỹ thuật và an toàn lao động.' },
  { id: 3, name: 'Thiết Kế Kiến Trúc', description: 'Tư vấn và thiết kế kiến trúc, kết cấu, nội thất. Hồ sơ thiết kế đầy đủ theo tiêu chuẩn xây dựng.' },
  { id: 4, name: 'Tư Vấn Dự Án', description: 'Tư vấn lập dự án đầu tư, thẩm tra thiết kế, giám sát thi công. Hỗ trợ thủ tục pháp lý từ A đến Z.' },
]

const FALLBACK_TESTIMONIALS = [
  { id: 1, author_name: 'Nguyễn Văn Hùng', author_title: 'Giám đốc, Công Ty TNHH TechPro VN', author_avatar: '', content: 'Kết quả vượt mong đợi — tiến độ đúng hẹn, chất lượng bê tông đạt chuẩn, an toàn lao động được đảm bảo tuyệt đối.', rating: 5 },
  { id: 2, author_name: 'Trần Thị Minh', author_title: 'Chủ đầu tư biệt thự', author_avatar: '', content: 'Đội ngũ rất chuyên nghiệp, lắng nghe ý kiến và giải thích kỹ càng từng phần kỹ thuật.', rating: 5 },
  { id: 3, author_name: 'Hoàng Đức Thắng', author_title: 'Trưởng phòng Dự án', author_avatar: '', content: 'Minh bạch trong báo giá và cam kết bảo hành. Sau bàn giao, mọi vấn đề đều được xử lý nhanh chóng.', rating: 5 },
]
