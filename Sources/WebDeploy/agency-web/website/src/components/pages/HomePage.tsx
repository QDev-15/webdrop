import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import RevealObserver from '../RevealObserver'

interface Service {
  id: number; name: string; icon: string; description: string; slug: string
}
interface Project {
  id: number; title: string; category: string; industry: string; description: string; image: string; client: string
}
interface Testimonial {
  id: number; author_name: string; author_title: string; author_avatar: string; content: string; rating: number
}

export default function HomePage() {
  const { settings, slides } = useSite()
  const [services, setServices]         = useState<Service[]>([])
  const [projects, setProjects]         = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  useEffect(() => {
    api.get<Service[]>('/public/services').then(s => setServices(s.slice(0, 6))).catch(() => {})
    api.get<Project[]>('/public/projects').then(p => setProjects(p.filter(x => x.image).slice(0, 3))).catch(() => {})
    api.get<Testimonial[]>('/public/testimonials').then(t => setTestimonials(t.slice(0, 3))).catch(() => {})
  }, [])

  const slide = slides[0]

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        {slide?.image && (
          <div className="hero-bg" style={{ backgroundImage: `url(${slide.image})` }} />
        )}
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="wd-container w-100 position-relative" style={{ zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 min(100%, 600px)' }}>
              {slide?.badge_text && (
                <div className="hero-badge">
                  <span className="hero-dot" />
                  {slide.badge_text}
                </div>
              )}
              <h1
                className="hero-title"
                dangerouslySetInnerHTML={{
                  __html: slide?.title || 'Chúng tôi tạo ra<br><em>kết quả</em> thực sự.'
                }}
              />
              <p className="hero-sub">
                {slide?.subtitle || settings.site_description}
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to={slide?.button_link || '/dich-vu'} className="btn-white">
                  {slide?.button_text || 'Khám phá dịch vụ →'}
                </Link>
                <Link to={slide?.button2_link || '/du-an'} className="btn-outline-white">
                  {slide?.button2_text || 'Xem dự án'}
                </Link>
              </div>
              {(slide?.stat1_num || settings.stats_projects) && (
                <div className="hero-stats">
                  <div>
                    <div className="hs-num">{slide?.stat1_num || settings.stats_projects}</div>
                    <div className="hs-label">{slide?.stat1_label || settings.stats_projects && 'Dự án hoàn thành'}</div>
                  </div>
                  <div>
                    <div className="hs-num">{slide?.stat2_num || settings.stats_years}</div>
                    <div className="hs-label">{slide?.stat2_label || 'Kinh nghiệm'}</div>
                  </div>
                  <div>
                    <div className="hs-num">{slide?.stat3_num || '98%'}</div>
                    <div className="hs-label">{slide?.stat3_label || 'Khách hàng hài lòng'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Dịch vụ</div>
            <h2 className="sec-title">Giải pháp toàn diện<br />cho <em>doanh nghiệp</em></h2>
            <p className="sec-sub">Từ thiết kế đến triển khai, chúng tôi cung cấp đầy đủ dịch vụ số cho doanh nghiệp hiện đại.</p>
          </div>
          <div className="row g-3">
            {services.map((s, i) => (
              <div key={s.id} className="col-md-4">
                <div className={`svc-card reveal${i % 3 === 1 ? ' reveal-d1' : i % 3 === 2 ? ' reveal-d2' : ''}`}>
                  <div className="svc-icon">{s.icon}</div>
                  <div className="svc-title">{s.name}</div>
                  <div className="svc-desc">{s.description}</div>
                  <Link to="/dich-vu" className="svc-link">Xem thêm →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-5 reveal">
            <div>
              <div className="eyebrow">Dự án nổi bật</div>
              <h2 className="sec-title mb-0">Công việc chúng tôi <em>tự hào</em></h2>
            </div>
            <Link to="/du-an" className="btn-ghost">Xem tất cả →</Link>
          </div>
          <div className="row g-3">
            {projects[0] && (
              <div className="col-md-7">
                <div className="pf-card reveal">
                  <img className="pf-img" src={projects[0].image} alt={projects[0].title} loading="lazy" />
                  <div className="pf-overlay" />
                  <div className="pf-info">
                    <div className="pf-cat">{projects[0].industry}</div>
                    <div className="pf-name">{projects[0].title}</div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-5">
              {projects[1] && (
                <div className="pf-card mb-3 reveal reveal-d1">
                  <img className="pf-img" src={projects[1].image} alt={projects[1].title} loading="lazy" />
                  <div className="pf-overlay" />
                  <div className="pf-info">
                    <div className="pf-cat">{projects[1].industry}</div>
                    <div className="pf-name">{projects[1].title}</div>
                  </div>
                </div>
              )}
              {projects[2] && (
                <div className="pf-card reveal reveal-d2">
                  <img className="pf-img" src={projects[2].image} alt={projects[2].title} loading="lazy" />
                  <div className="pf-overlay" />
                  <div className="pf-info">
                    <div className="pf-cat">{projects[2].industry}</div>
                    <div className="pf-name">{projects[2].title}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="row g-4 text-center">
            {[
              { num: settings.stats_projects || '120+', label: 'Dự án hoàn thành' },
              { num: settings.stats_clients || '50+',   label: 'Khách hàng dài hạn' },
              { num: settings.stats_years   || '8 năm', label: 'Kinh nghiệm thực chiến' },
              { num: settings.stats_rating  || '4.9 ★', label: 'Đánh giá trung bình' },
            ].map((s, i) => (
              <div key={i} className={`col-md-3 col-6 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                <div className="stat-num" style={{ color: '#fff' }}>{s.num}</div>
                <div className="stat-label" style={{ color: 'rgba(255,255,255,.35)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Khách hàng nói gì</div>
            <h2 className="sec-title">Niềm tin từ <em>thực tế</em></h2>
          </div>
          <div className="row g-3">
            {testimonials.map((t, i) => (
              <div key={t.id} className="col-md-4">
                <div className={`rv reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                  <div className="rv-stars">{stars(t.rating)}</div>
                  <div className="rv-text">"{t.content}"</div>
                  <div className="rv-foot">
                    {t.author_avatar && <img className="rv-av" src={t.author_avatar} alt={t.author_name} />}
                    <div>
                      <div className="rv-name">{t.author_name}</div>
                      <div className="rv-role">{t.author_title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container reveal">
          <h2 className="cta-title">{settings.cta_title || 'Bắt đầu dự án của bạn'}</h2>
          <p className="cta-sub">{settings.cta_subtitle || 'Tư vấn miễn phí. Báo giá trong 24 giờ. Không ràng buộc.'}</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Liên hệ tư vấn →</Link>
            <Link to="/du-an" className="btn-outline-white">Xem portfolio</Link>
          </div>
        </div>
      </section>

      <RevealObserver />
    </>
  )
}
