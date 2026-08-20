import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

interface Service {
  id: number; name: string; description: string; icon: string; featured: number; status: string
}
interface Project {
  id: number; title: string; slug: string; description: string; image: string; category: string; featured: number; client: string
}
interface Testimonial {
  id: number; author_name: string; author_title: string; author_avatar: string; content: string; rating: number
}

function useReveal(deps: unknown[]) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default function HomePage() {
  usePageTitle()
  const { settings, slides } = useSite()
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<Service[]>('/public/services'),
      api.get<Project[]>('/public/projects'),
      api.get<Testimonial[]>('/public/testimonials'),
    ]).then(([s, p, t]) => {
      setServices(s)
      setProjects(p)
      setTestimonials(t)
    }).catch(console.error)
  }, [])

  useReveal([services, projects, testimonials])

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [slides])

  const slide = slides[currentSlide]
  const siteName = settings.site_name || 'Agency Web'

  const featuredProjects = projects.filter(p => p.featured === 1).slice(0, 3)
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: 'var(--dark2)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '62px',
      }}>
        {slide?.image && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: .08,
          }} />
        )}
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,107,82,.22) 0%,transparent 68%)', top: '-100px', right: '-50px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,155,115,.12) 0%,transparent 68%)', bottom: '-80px', left: '-80px', pointerEvents: 'none' }} />
        <div className="wd-container w-100 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', fontWeight: 500, color: 'rgba(255,255,255,.45)', border: '1px solid rgba(255,255,255,.1)', padding: '6px 14px', borderRadius: '20px', marginBottom: '28px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                {settings.about_tagline || 'Đối tác chiến lược của doanh nghiệp'}
              </div>
              <h1 style={{ fontSize: 'clamp(42px,6vw,80px)', fontWeight: 600, color: '#fff', lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '20px' }}>
                {slide ? (
                  <span dangerouslySetInnerHTML={{ __html: slide.title.replace(/\n/g, '<br>') }} />
                ) : (
                  <>Chúng tôi tạo ra<br /><em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>kết quả</em> thực sự.</>
                )}
              </h1>
              <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', fontWeight: 300, color: 'rgba(255,255,255,.45)', lineHeight: 1.75, maxWidth: '520px', marginBottom: '36px' }}>
                {slide?.subtitle || `Từ chiến lược đến thực thi — ${siteName} đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số toàn diện, bền vững.`}
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/dich-vu" className="btn-white">{slide?.button_text || 'Khám phá dịch vụ'} →</Link>
                <Link to="/du-an" className="btn-outline-white">Xem dự án</Link>
              </div>
              <div style={{ display: 'flex', gap: '36px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,.08)', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{settings.stat_projects || '120+'}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.3)', marginTop: '4px' }}>Dự án hoàn thành</div>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{settings.stat_years || '8 năm'}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.3)', marginTop: '4px' }}>Kinh nghiệm</div>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{settings.stat_satisfaction || '98%'}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.3)', marginTop: '4px' }}>Khách hàng hài lòng</div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              {slide?.image && (
                <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', aspectRatio: '4/5', position: 'relative' }}>
                  <img src={slide.image} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .85 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(26,107,82,.2) 0%,transparent 50%)' }} />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Slide dots */}
        {slides.length > 1 && (
          <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: i === currentSlide ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === currentSlide ? '#fff' : 'rgba(255,255,255,.3)', border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />
            ))}
          </div>
        )}
      </section>

      {/* CLIENTS STRIP */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '28px 0' }}>
        <div className="wd-container">
          <p className="text-center" style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px' }}>Tin tưởng bởi</p>
          <div className="d-flex gap-5 justify-content-center align-items-center flex-wrap" style={{ opacity: .35, filter: 'grayscale(100%)' }}>
            <svg width="90" height="28" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Viettel"><rect x="0" y="8" width="4" height="12" rx="2" fill="currentColor"/><rect x="7" y="4" width="4" height="20" rx="2" fill="currentColor"/><rect x="14" y="8" width="4" height="12" rx="2" fill="currentColor"/><text x="24" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="13" fill="currentColor">VIETTEL</text></svg>
            <svg width="80" height="28" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vingroup"><circle cx="10" cy="14" r="8" fill="currentColor"/><text x="22" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="12" fill="currentColor">VINGROUP</text></svg>
            <svg width="64" height="28" viewBox="0 0 64 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="FPT"><rect x="0" y="4" width="12" height="20" rx="3" fill="currentColor"/><rect x="2" y="10" width="8" height="2.5" rx="1" fill="white"/><text x="16" y="19" fontFamily="DM Sans,sans-serif" fontWeight="800" fontSize="14" fill="currentColor">FPT</text></svg>
            <svg width="96" height="28" viewBox="0 0 96 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Masan Group"><polygon points="6,4 12,14 6,24 0,14" fill="currentColor"/><text x="16" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="12" fill="currentColor">MASAN GRP</text></svg>
            <svg width="84" height="28" viewBox="0 0 84 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="VNG Corp"><rect x="0" y="6" width="10" height="10" rx="2" fill="currentColor"/><rect x="2" y="14" width="10" height="10" rx="2" fill="currentColor"/><text x="16" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="13" fill="currentColor">VNG CORP</text></svg>
            <svg width="78" height="28" viewBox="0 0 78 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Techcombank"><path d="M6 4 L12 14 L6 24 L0 14Z" fill="currentColor"/><path d="M10 4 L16 14 L10 24 L4 14Z" fill="currentColor" opacity=".5"/><text x="20" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="11" fill="currentColor">TECHCOM</text></svg>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="eyebrow">Dịch vụ</div>
            <h2 className="sec-title">Giải pháp toàn diện<br />cho <em>doanh nghiệp</em></h2>
            <p className="sec-sub">Từ thiết kế đến triển khai, chúng tôi cung cấp đầy đủ dịch vụ số cho doanh nghiệp hiện đại.</p>
          </div>
          <div className="row g-3">
            {services.slice(0, 6).map((svc, i) => (
              <div key={svc.id} className="col-md-4">
                <div className={`svc-card reveal${i % 3 === 1 ? ' reveal-d1' : i % 3 === 2 ? ' reveal-d2' : ''}`} data-reveal>
                  <div className="svc-icon">{svc.icon || '🌐'}</div>
                  <div className="svc-title">{svc.name}</div>
                  <div className="svc-desc">{svc.description}</div>
                  <Link to="/dich-vu" className="svc-link">Xem thêm →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      {displayProjects.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-5" data-reveal>
              <div>
                <div className="eyebrow">Dự án nổi bật</div>
                <h2 className="sec-title mb-0">Công việc chúng tôi <em>tự hào</em></h2>
              </div>
              <Link to="/du-an" className="btn-ghost">Xem tất cả →</Link>
            </div>
            <div className="row g-3">
              {displayProjects[0] && (
                <div className="col-md-7">
                  <Link to={`/du-an/${displayProjects[0].slug}`} className="pf-card" data-reveal>
                    <img className="pf-img" src={displayProjects[0].image} alt={displayProjects[0].title} loading="lazy" />
                    <div className="pf-overlay" />
                    <div className="pf-info">
                      <div className="pf-cat">{displayProjects[0].category}</div>
                      <div className="pf-name">{displayProjects[0].title}</div>
                    </div>
                  </Link>
                </div>
              )}
              <div className="col-md-5">
                {displayProjects[1] && (
                  <Link to={`/du-an/${displayProjects[1].slug}`} className="pf-card" style={{ marginBottom: '12px' }} data-reveal>
                    <img className="pf-img" src={displayProjects[1].image} alt={displayProjects[1].title} loading="lazy" />
                    <div className="pf-overlay" />
                    <div className="pf-info">
                      <div className="pf-cat">{displayProjects[1].category}</div>
                      <div className="pf-name">{displayProjects[1].title}</div>
                    </div>
                  </Link>
                )}
                {displayProjects[2] && (
                  <Link to={`/du-an/${displayProjects[2].slug}`} className="pf-card" data-reveal>
                    <img className="pf-img" src={displayProjects[2].image} alt={displayProjects[2].title} loading="lazy" />
                    <div className="pf-overlay" />
                    <div className="pf-info">
                      <div className="pf-cat">{displayProjects[2].category}</div>
                      <div className="pf-name">{displayProjects[2].title}</div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="row g-4 text-center">
            {[
              { num: settings.stat_projects || '120+', label: 'Dự án hoàn thành' },
              { num: settings.stat_clients  || '50+',  label: 'Khách hàng dài hạn' },
              { num: settings.stat_years    || '8 năm',label: 'Kinh nghiệm thực chiến' },
              { num: '4.9 ★',                           label: 'Đánh giá trung bình' },
            ].map((s, i) => (
              <div key={i} className={`col-6 col-md-3 reveal${i > 0 ? ` reveal-d${i}` : ''}`} data-reveal>
                <div className="stat-num" style={{ color: '#fff' }}>{s.num}</div>
                <div className="stat-label" style={{ color: 'rgba(255,255,255,.35)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="text-center mb-5" data-reveal>
              <div className="eyebrow">Khách hàng nói gì</div>
              <h2 className="sec-title">Niềm tin từ <em>thực tế</em></h2>
            </div>
            <div className="row g-3">
              {testimonials.slice(0, 3).map((t, i) => (
                <div key={t.id} className="col-md-4">
                  <div className={`rv reveal${i === 1 ? ' reveal-d1' : i === 2 ? ' reveal-d2' : ''}`} data-reveal>
                    <div className="rv-stars">{'★'.repeat(Math.min(t.rating, 5))}</div>
                    <div className="rv-text">{t.content}</div>
                    <div className="rv-foot">
                      {t.author_avatar && <img className="rv-av" src={t.author_avatar} alt={t.author_name} loading="lazy" />}
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
      )}

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container" data-reveal>
          <h2 className="cta-title">Bắt đầu dự án của bạn</h2>
          <p className="cta-sub">Tư vấn miễn phí. Báo giá trong 24 giờ. Không ràng buộc.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Liên hệ tư vấn →</Link>
            <Link to="/du-an" className="btn-outline-white">Xem portfolio</Link>
          </div>
        </div>
      </section>
    </>
  )
}
