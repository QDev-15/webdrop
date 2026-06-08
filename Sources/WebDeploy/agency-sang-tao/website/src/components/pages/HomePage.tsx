import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  tags: string
  featured: number
}

interface Project {
  id: number
  title: string
  category: string
  description: string
  image: string
  tags: string
  featured: number
}

interface TeamMember {
  id: number
  name: string
  position: string
  avatar: string
  experience: string
}

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
}

export default function HomePage() {
  const { settings } = useSite()
  const [services, setServices]         = useState<Service[]>([])
  const [projects, setProjects]         = useState<Project[]>([])
  const [teamMembers, setTeamMembers]   = useState<TeamMember[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [contactForm, setContactForm]   = useState({ name: '', email: '', service: '', brief: '' })
  const [submitting, setSubmitting]     = useState(false)
  const [submitMsg, setSubmitMsg]       = useState('')
  const [countDone, setCountDone]       = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<Service[]>('/public/services'),
      api.get<Project[]>('/public/featured-projects'),
      api.get<TeamMember[]>('/public/team'),
      api.get<Testimonial[]>('/public/testimonials'),
    ]).then(([sv, pj, tm, ts]) => {
      setServices(sv)
      setProjects(pj)
      setTeamMembers(tm)
      setTestimonials(ts)
    }).catch(console.error)
  }, [])

  // Reveal animation
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
  }, [services, projects, teamMembers, testimonials])

  // Counter animation
  useEffect(() => {
    if (countDone) return
    const els = document.querySelectorAll<HTMLElement>('[data-counter]')
    if (els.length === 0) return
    els.forEach(el => {
      const target = parseInt(el.dataset['counter'] || '0', 10)
      const suffix = el.dataset['suffix'] || ''
      const cro = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          let cur = 0
          const step = Math.ceil(target / 60)
          const t = setInterval(() => {
            cur = Math.min(cur + step, target)
            el.textContent = cur + suffix
            if (cur >= target) { clearInterval(t); setCountDone(true) }
          }, 25)
          cro.disconnect()
        }
      }, { threshold: 0.5 })
      cro.observe(el)
    })
  }, [settings, countDone])

  const siteName     = settings.site_name || 'Agency Sáng Tạo'
  const heroTagline  = settings.hero_tagline || `${siteName} · TP.HCM`
  const heroYear     = settings.hero_year || 'Branding · Design · Digital'
  const heroLine1    = settings.hero_line1 || 'WE BUILD'
  const heroLine2    = settings.hero_line2 || 'BRANDS'
  const heroLine3    = settings.hero_line3 || '& STORIES'
  const statProjects = settings.stat_projects || '120+'
  const statClients  = settings.stat_clients || '80+'
  const statYears    = settings.stat_years || '8'
  const teamImage    = settings.about_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop'
  const teamTitle    = settings.team_hero_title || 'The Team Behind The Work'
  const teamSub      = settings.team_hero_sub || '15 chuyên gia sáng tạo với hơn 8 năm kinh nghiệm'
  const siteEmail    = settings.site_email || 'hello@agency.vn'
  const sitePhone    = settings.site_phone || '0909 xxx xxx'
  const siteZalo     = settings.social_zalo || sitePhone

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.brief) return
    setSubmitting(true)
    try {
      await api.post('/public/contact', {
        name: contactForm.name,
        email: contactForm.email,
        service: contactForm.service,
        message: contactForm.brief,
        subject: 'Brief dự án',
      })
      setSubmitMsg('Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi trong 24 giờ.')
      setContactForm({ name: '', email: '', service: '', brief: '' })
    } catch {
      setSubmitMsg('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const featuredServices = services.filter(s => s.featured)

  return (
    <main>
      {/* HERO */}
      <section className="ag-hero">
        <div className="ag-hero-topbar">
          <div className="wd-container">
            <span className="ag-hero-tagline">{heroTagline}</span>
            <span className="ag-hero-year">{heroYear}</span>
          </div>
        </div>
        <div className="ag-hero-body wd-container">
          <h1 className="ag-hero-headline" data-reveal>
            <span className="hl-white">{heroLine1}</span>
            <span className="hl-outline">{heroLine2}</span>
            <span className="hl-accent">{heroLine3}</span>
          </h1>
          <div className="ag-hero-bottom">
            <div className="ag-hero-stats" data-reveal>
              <div className="ag-hero-stat">
                <div className="ag-hero-stat-num"
                  data-counter={parseInt(statProjects, 10)}
                  data-suffix={statProjects.includes('+') ? '+' : ''}
                >{statProjects}</div>
                <div className="ag-hero-stat-label">Dự án hoàn thành</div>
              </div>
              <div className="ag-hero-stat">
                <div className="ag-hero-stat-num"
                  data-counter={parseInt(statClients, 10)}
                  data-suffix={statClients.includes('+') ? '+' : ''}
                >{statClients}</div>
                <div className="ag-hero-stat-label">Khách hàng tin tưởng</div>
              </div>
              <div className="ag-hero-stat">
                <div className="ag-hero-stat-num"
                  data-counter={parseInt(statYears, 10)}
                  data-suffix=""
                >{statYears}</div>
                <div className="ag-hero-stat-label">Năm kinh nghiệm</div>
              </div>
            </div>
            <div className="ag-hero-scroll" aria-hidden="true">
              <span className="ag-scroll-label">Scroll</span>
              <div className="ag-scroll-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <div className="ag-ticker-wrap" aria-hidden="true">
        <div className="ag-ticker-track">
          {['Brand Identity','Visual Design','Digital Marketing','Campaign Creative','Content Strategy',
            'Brand Identity','Visual Design','Digital Marketing','Campaign Creative','Content Strategy'].map((item, i) => (
            <span key={i} className="ag-ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* FEATURED WORK */}
      <section className="ag-work-section">
        <div className="wd-container">
          <div className="ag-work-header" data-reveal>
            <div>
              <div className="ag-section-label">Featured Work</div>
              <h2 className="ag-section-title">Dự án <em>nổi bật</em></h2>
            </div>
            <Link to="/du-an" className="ag-view-all">Xem tất cả &rarr;</Link>
          </div>
        </div>
        <div className="ag-work-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridAutoRows: '300px', gap: '4px' }}>
          {projects.slice(0, 5).map((proj, idx) => (
            <article
              key={proj.id}
              className="ag-work-item"
              data-reveal
              style={idx === 0 || idx === 3 ? { gridColumn: 'span 2' } : {}}
            >
              {proj.image && <img src={proj.image} alt={proj.title} loading="lazy" />}
              <div className="ag-work-overlay">
                <span className="ag-work-cat">{proj.category}</span>
                <span className="ag-work-name">{proj.title}</span>
              </div>
              <div className="ag-work-arrow" aria-hidden="true">&#8599;</div>
            </article>
          ))}
          {projects.length === 0 && [1,2,3,4,5].map((_, idx) => (
            <article
              key={idx}
              className="ag-work-item"
              data-reveal
              style={idx === 0 || idx === 3 ? { gridColumn: 'span 2' } : {}}
            >
              <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,.05)' }} />
            </article>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="ag-services-section">
        <div className="wd-container">
          <div className="ag-services-header" data-reveal>
            <div className="ag-section-label">Dịch vụ của chúng tôi</div>
            <h2 className="ag-section-title">Chúng tôi <em>làm gì</em></h2>
          </div>
          {featuredServices.map((svc, idx) => (
            <div key={svc.id} className="ag-service-strip" data-reveal>
              <span className="ag-svc-num">{String(idx + 1).padStart(2, '0')}</span>
              <div className="ag-svc-body">
                <h3 className="ag-svc-name">{svc.name}</h3>
                <p className="ag-svc-desc">{svc.description}</p>
                {svc.tags && (
                  <div className="ag-svc-tags">
                    {svc.tags.split(',').map((tag, i) => (
                      <span key={i} className="ag-svc-tag">{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="ag-svc-arrow" aria-hidden="true">&#8599;</span>
            </div>
          ))}
          {featuredServices.length === 0 && (
            <div style={{ color: 'rgba(255,255,255,.3)', padding: '40px 0', textAlign: 'center', fontFamily: 'var(--sans)' }}>
              Đang tải dịch vụ...
            </div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="ag-process-section">
        <div className="wd-container">
          <div className="ag-process-header" data-reveal>
            <div className="ag-section-label">Quy trình làm việc</div>
            <h2 className="ag-section-title">Cách chúng tôi <em>làm việc</em></h2>
          </div>
        </div>
        <div className="ag-process-track" role="list">
          {[
            { num: '01', name: 'Discovery', desc: 'Lắng nghe và phân tích sâu về thương hiệu, thị trường, đối thủ và mục tiêu kinh doanh. Giai đoạn nền tảng quyết định thành công của toàn bộ dự án.' },
            { num: '02', name: 'Strategy', desc: 'Xây dựng chiến lược thương hiệu và định vị rõ ràng. Xác định tone of voice, personality và hướng thiết kế phù hợp với mục tiêu.' },
            { num: '03', name: 'Design', desc: 'Hiện thực hóa chiến lược thành hình ảnh trực quan sống động. Từ sketching đến polished design — luôn song hành cùng khách hàng.' },
            { num: '04', name: 'Launch & Scale', desc: 'Triển khai và hỗ trợ đưa thương hiệu ra thị trường. Theo dõi hiệu quả và tối ưu liên tục để thương hiệu ngày càng mạnh hơn.' },
          ].map((step) => (
            <div key={step.num} className="ag-process-step" role="listitem">
              <div className="ag-step-num">{step.num}</div>
              <div>
                <h3 className="ag-step-name">{step.name}</h3>
                <p className="ag-step-desc">{step.desc}</p>
              </div>
              <div className="ag-step-dot" aria-hidden="true"></div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="ag-team-section">
        <div className="wd-container">
          <div data-reveal>
            <div className="ag-section-label">Đội ngũ</div>
            <h2 className="ag-section-title" style={{ marginBottom: '32px' }}>Con người làm nên <em>sự khác biệt</em></h2>
          </div>
        </div>
        <div className="ag-team-hero-wrap" data-reveal>
          <img src={teamImage} alt={`Đội ngũ ${siteName}`} />
          <div className="ag-team-hero-caption">
            <h3 className="ag-team-hero-title">{teamTitle}</h3>
            <span className="ag-team-hero-sub">{teamSub}</span>
          </div>
        </div>
        <div className="wd-container">
          <div className="ag-team-members">
            {teamMembers.map((member, i) => {
              const extraProps: Record<string, string | undefined> = {}
              if (i === 1) extraProps['data-reveal-d1'] = ''
              if (i === 2) extraProps['data-reveal-d2'] = ''
              return (
              <div key={member.id} className="ag-member-card" data-reveal {...extraProps}>
                {member.avatar && (
                  <img className="ag-member-photo" src={member.avatar} alt={member.name} loading="lazy" />
                )}
                <div className="ag-member-role">{member.position}</div>
                <div className="ag-member-name">{member.name}</div>
                {member.experience && <div className="ag-member-exp">{member.experience}</div>}
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="ag-testimonial-section">
        <div className="wd-container">
          <span className="ag-section-label" data-reveal>Khách hàng nói gì</span>
          <div className="ag-testimonials-grid">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="ag-blockquote" data-reveal>
                <span className="ag-quote-mark" aria-hidden="true">"</span>
                <p className="ag-quote-text">"{t.content}"</p>
                <div className="ag-quote-source">
                  {t.author_avatar && (
                    <img className="ag-quote-avatar" src={t.author_avatar} alt={t.author_name} />
                  )}
                  <div className="ag-quote-info">
                    <div className="ag-quote-name">{t.author_name}</div>
                    <div className="ag-quote-company">{t.author_title}</div>
                  </div>
                </div>
              </blockquote>
            ))}
            {testimonials.length === 0 && (
              <blockquote className="ag-blockquote">
                <p className="ag-quote-text" style={{ color: 'rgba(255,255,255,.3)' }}>Đang tải đánh giá...</p>
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ag-cta-section">
        <div className="wd-container">
          <div className="ag-cta-grid">
            <div data-reveal>
              <div className="ag-cta-label">Sẵn sàng chưa?</div>
              <h2 className="ag-cta-title">LET'S START YOUR<br/>NEXT PROJECT</h2>
              <p className="ag-cta-desc">Kể cho chúng tôi nghe về thương hiệu và mục tiêu của bạn. Chúng tôi sẽ lên kế hoạch sáng tạo phù hợp nhất trong vòng 24 giờ.</p>
              <div className="ag-cta-contacts">
                {siteEmail && <div className="ag-contact-item"><span>Email</span>{siteEmail}</div>}
                {sitePhone && <div className="ag-contact-item"><span>Phone</span>{sitePhone}</div>}
                {siteZalo && <div className="ag-contact-item"><span>Zalo</span>{siteZalo}</div>}
              </div>
            </div>
            <div data-reveal>
              <form className="ag-cta-form" onSubmit={handleContactSubmit} noValidate>
                <div className="ag-form-title">Gửi brief ngay</div>
                {submitMsg && (
                  <div style={{ padding: '10px 14px', marginBottom: '16px', background: submitMsg.includes('lỗi') ? 'rgba(239,68,68,.15)' : 'rgba(245,158,11,.15)', color: submitMsg.includes('lỗi') ? '#ef4444' : '#111', borderRadius: '4px', fontSize: '13px' }}>
                    {submitMsg}
                  </div>
                )}
                <div className="ag-field">
                  <label htmlFor="cta-name">Tên của bạn</label>
                  <input type="text" id="cta-name" value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" required />
                </div>
                <div className="ag-field">
                  <label htmlFor="cta-email">Email</label>
                  <input type="email" id="cta-email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="email@company.vn" />
                </div>
                <div className="ag-field">
                  <label htmlFor="cta-service">Dịch vụ quan tâm</label>
                  <select id="cta-service" value={contactForm.service} onChange={e => setContactForm(f => ({ ...f, service: e.target.value }))}>
                    <option value="">Chọn dịch vụ</option>
                    {services.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ag-field">
                  <label htmlFor="cta-brief">Mô tả ngắn về dự án</label>
                  <textarea id="cta-brief" value={contactForm.brief} onChange={e => setContactForm(f => ({ ...f, brief: e.target.value }))} placeholder="Mô tả về thương hiệu và mong muốn của bạn..." required></textarea>
                </div>
                <button type="submit" className="ag-form-submit" disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi brief →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
