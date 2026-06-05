import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import RevealObserver from '../RevealObserver'
import { usePageTitle } from '../../hooks/usePageTitle'

interface ContactForm {
  name: string
  email: string
  service: string
  brief: string
}

export default function HomePage() {
  usePageTitle()
  const { settings, services, projects, team, testimonials, processSteps } = useSite()
  const mainServices = services.filter(s => s.number !== '').slice(0, 3)
  const featuredProjects = projects.filter(p => p.featured === 1).slice(0, 5)
  const mainTeam = team.slice(0, 3)
  const mainTestimonials = testimonials.slice(0, 2)

  const [form, setForm] = useState<ContactForm>({ name: '', email: '', service: '', brief: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMsg, setSubmitMsg] = useState('')

  // Counter animation
  useEffect(() => {
    const counters = document.querySelectorAll('[data-counter]')
    if (!counters.length) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        counters.forEach((el) => {
          const target = +(el as HTMLElement).dataset.counter!
          const suffix = (el as HTMLElement).dataset.suffix || ''
          let cur = 0
          const step = Math.ceil(target / 60)
          const t = setInterval(() => {
            cur = Math.min(cur + step, target)
            el.textContent = cur + suffix
            if (cur >= target) clearInterval(t)
          }, 25)
        })
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (counters[0]) obs.observe(counters[0])
    return () => obs.disconnect()
  }, [settings])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.brief) return
    setSubmitting(true)
    try {
      const result = await api.post<{ ok: boolean; message: string }>('/public/contact', {
        name: form.name,
        email: form.email,
        service: form.service,
        message: form.brief,
      })
      if (result.ok) {
        setSubmitStatus('success')
        setSubmitMsg(result.message || 'Brief đã được gửi thành công!')
        setForm({ name: '', email: '', service: '', brief: '' })
      }
    } catch (err) {
      setSubmitStatus('error')
      setSubmitMsg('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp.')
    } finally {
      setSubmitting(false)
    }
  }

  const workItems = featuredProjects.length > 0 ? featuredProjects : [
    { id: 1, title: 'Brand Identity Project', category: 'Brand Identity', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop', featured: 1, slug: '', description: '', client: '', tags: '' },
    { id: 2, title: 'Digital Design Project', category: 'Digital Design', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop', featured: 1, slug: '', description: '', client: '', tags: '' },
    { id: 3, title: 'Campaign Project', category: 'Campaign', image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80&auto=format&fit=crop', featured: 1, slug: '', description: '', client: '', tags: '' },
    { id: 4, title: 'Social Media Project', category: 'Social Media', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop', featured: 1, slug: '', description: '', client: '', tags: '' },
    { id: 5, title: 'Event Branding', category: 'Event Branding', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop', featured: 0, slug: '', description: '', client: '', tags: '' },
  ]

  const displayTeam = mainTeam.length > 0 ? mainTeam : [
    { id: 1, name: 'Nguyễn Minh Quân', position: 'Founder & Creative Director', experience: '10 năm kinh nghiệm · Brand & Strategy', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 1 },
    { id: 2, name: 'Trần Thị Bảo Châu', position: 'Lead Visual Designer', experience: '7 năm kinh nghiệm · Visual & UI', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 2 },
    { id: 3, name: 'Lê Hoàng Phúc', position: 'Digital & Campaign Lead', experience: '6 năm kinh nghiệm · Marketing & Content', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 3 },
  ]

  const displayTestimonials = mainTestimonials.length > 0 ? mainTestimonials : [
    { id: 1, author_name: 'Trần Quốc Bảo', author_title: 'CEO · Minh Phát Group', author_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80&auto=format&fit=crop', content: 'NOVA. đã hoàn toàn thay đổi cách thương hiệu chúng tôi được nhìn nhận trên thị trường. Từ một brand mờ nhạt, chúng tôi trở thành cái tên mọi người nhớ đến đầu tiên trong ngành.', rating: 5 },
    { id: 2, author_name: 'Nguyễn Thị Lan Phương', author_title: 'CMO · TechViet Corporation', author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&auto=format&fit=crop', content: 'Đội ngũ không chỉ thiết kế đẹp — họ thực sự hiểu business của chúng tôi và tạo ra chiến lược thương hiệu dài hạn mang lại kết quả đo lường được.', rating: 5 },
  ]

  const displayServices = mainServices.length > 0 ? mainServices : [
    { id: 1, name: 'Brand Identity', number: '01', description: 'Xây dựng bộ nhận diện thương hiệu toàn diện — từ logo, bộ màu sắc, typography đến toàn bộ brand guidelines.', tags: 'Logo Design,Brand Guidelines,Visual Identity,Brand Strategy', featured: 1, slug: '', sort_order: 1 },
    { id: 2, name: 'Digital Design', number: '02', description: 'Thiết kế giao diện website, ứng dụng và các tài sản kỹ thuật số. Mỗi pixel đều có mục đích rõ ràng.', tags: 'UI/UX Design,Web Design,App Design,Prototype', featured: 1, slug: '', sort_order: 2 },
    { id: 3, name: 'Campaign & Content', number: '03', description: 'Lên ý tưởng và triển khai chiến dịch truyền thông sáng tạo. Nội dung chạm đến cảm xúc và thúc đẩy hành động.', tags: 'Campaign Strategy,Content Creation,Social Media,Video Concept', featured: 1, slug: '', sort_order: 3 },
  ]

  const displayProcess = processSteps.length > 0 ? processSteps : [
    { id: 1, number: '01', name: 'Discovery', description: 'Lắng nghe và phân tích sâu về thương hiệu, thị trường, đối thủ và mục tiêu kinh doanh.', sort_order: 1 },
    { id: 2, number: '02', name: 'Strategy', description: 'Xây dựng chiến lược thương hiệu và định vị rõ ràng. Xác định tone of voice, personality và hướng thiết kế.', sort_order: 2 },
    { id: 3, number: '03', name: 'Design', description: 'Hiện thực hóa chiến lược thành hình ảnh trực quan sống động. Luôn song hành cùng khách hàng.', sort_order: 3 },
    { id: 4, number: '04', name: 'Launch & Scale', description: 'Triển khai và hỗ trợ đưa thương hiệu ra thị trường. Theo dõi và tối ưu liên tục.', sort_order: 4 },
  ]

  return (
    <>
      <RevealObserver />

      {/* HERO */}
      <section className="ag-hero">
        <div className="ag-hero-topbar">
          <div className="wd-container">
            <span className="ag-hero-tagline">
              {settings.hero_tagline || 'Agency Sáng Tạo · Hồ Chí Minh · Est. 2016'}
            </span>
            <span className="ag-hero-year">
              {settings.hero_tagline_right || 'Branding · Design · Digital'}
            </span>
          </div>
        </div>

        <div className="ag-hero-body wd-container">
          <h1 className="ag-hero-headline" data-reveal>
            <span className="hl-white">{settings.hero_line1 || 'WE BUILD'}</span>
            <span className="hl-outline">{settings.hero_line2 || 'BRANDS'}</span>
            <span className="hl-accent">{settings.hero_line3 || '& STORIES'}</span>
          </h1>

          <div className="ag-hero-bottom">
            <div className="ag-hero-stats" data-reveal>
              <div className="ag-hero-stat">
                <div
                  className="ag-hero-stat-num"
                  data-counter={settings.hero_stat1_num || '120'}
                  data-suffix={settings.hero_stat1_suffix || '+'}
                >
                  {settings.hero_stat1_num || '120'}{settings.hero_stat1_suffix || '+'}
                </div>
                <div className="ag-hero-stat-label">{settings.hero_stat1_label || 'Dự án hoàn thành'}</div>
              </div>
              <div className="ag-hero-stat">
                <div
                  className="ag-hero-stat-num"
                  data-counter={settings.hero_stat2_num || '80'}
                  data-suffix={settings.hero_stat2_suffix || '+'}
                >
                  {settings.hero_stat2_num || '80'}{settings.hero_stat2_suffix || '+'}
                </div>
                <div className="ag-hero-stat-label">{settings.hero_stat2_label || 'Khách hàng tin tưởng'}</div>
              </div>
              <div className="ag-hero-stat">
                <div
                  className="ag-hero-stat-num"
                  data-counter={settings.hero_stat3_num || '8'}
                  data-suffix={settings.hero_stat3_suffix || ''}
                >
                  {settings.hero_stat3_num || '8'}{settings.hero_stat3_suffix || ''}
                </div>
                <div className="ag-hero-stat-label">{settings.hero_stat3_label || 'Năm kinh nghiệm'}</div>
              </div>
            </div>
            <div className="ag-hero-scroll" aria-hidden="true">
              <span className="ag-scroll-label">Scroll</span>
              <div className="ag-scroll-line" />
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ag-ticker-wrap" aria-hidden="true">
        <div className="ag-ticker-track">
          {['Brand Identity', 'Visual Design', 'Digital Marketing', 'Campaign Creative', 'Content Strategy',
            'Brand Identity', 'Visual Design', 'Digital Marketing', 'Campaign Creative', 'Content Strategy'].map((item, i) => (
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

        <div className="ag-work-grid">
          {workItems.slice(0, 5).map((item) => (
            <article key={item.id} className="ag-work-item" data-reveal>
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="ag-work-overlay">
                <span className="ag-work-cat">{item.category}</span>
                <span className="ag-work-name">{item.title}</span>
              </div>
              <div className="ag-work-arrow" aria-hidden="true">&#8599;</div>
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

          {displayServices.map((svc) => (
            <div key={svc.id} className="ag-service-strip" data-reveal>
              <span className="ag-svc-num">{svc.number}</span>
              <div className="ag-svc-body">
                <h3 className="ag-svc-name">{svc.name}</h3>
                <p className="ag-svc-desc">{svc.description}</p>
                <div className="ag-svc-tags">
                  {svc.tags.split(',').map((tag, i) => (
                    <span key={i} className="ag-svc-tag">{tag.trim()}</span>
                  ))}
                </div>
              </div>
              <span className="ag-svc-arrow" aria-hidden="true">&#8599;</span>
            </div>
          ))}
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
          {displayProcess.map((step) => (
            <div key={step.id} className="ag-process-step" role="listitem">
              <div className="ag-step-num">{step.number}</div>
              <div>
                <h3 className="ag-step-name">{step.name}</h3>
                <p className="ag-step-desc">{step.description}</p>
              </div>
              <div className="ag-step-dot" aria-hidden="true" />
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
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop"
            alt="Đội ngũ agency làm việc sáng tạo"
          />
          <div className="ag-team-hero-caption">
            <h3 className="ag-team-hero-title">The Team<br />Behind<br />The Work</h3>
            <span className="ag-team-hero-sub">
              {team.length > 0 ? `${team.length}` : '15'} chuyên gia sáng tạo với hơn 8 năm kinh nghiệm
            </span>
          </div>
        </div>

        <div className="wd-container">
          <div className="ag-team-members">
            {displayTeam.map((member) => (
              <div key={member.id} className="ag-member-card" data-reveal>
                <img
                  className="ag-member-photo"
                  src={member.avatar}
                  alt={member.name}
                />
                <div className="ag-member-role">{member.position}</div>
                <div className="ag-member-name">{member.name}</div>
                <div className="ag-member-exp">{member.experience}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="ag-testimonial-section">
        <div className="wd-container">
          <span className="ag-section-label" data-reveal>Khách hàng nói gì</span>
          <div className="ag-testimonials-grid">
            {displayTestimonials.map((t) => (
              <blockquote key={t.id} className="ag-blockquote" data-reveal>
                <span className="ag-quote-mark" aria-hidden="true">"</span>
                <p className="ag-quote-text">"{t.content}"</p>
                <div className="ag-quote-source">
                  <img className="ag-quote-avatar" src={t.author_avatar} alt={t.author_name} />
                  <div className="ag-quote-info">
                    <div className="ag-quote-name">{t.author_name}</div>
                    <div className="ag-quote-company">{t.author_title}</div>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ag-cta-section">
        <div className="wd-container">
          <div className="ag-cta-grid">
            <div data-reveal>
              <div className="ag-cta-label">{settings.cta_label || 'Sẵn sàng chưa?'}</div>
              <h2 className="ag-cta-title">
                {(settings.cta_title || "LET'S START YOUR\nNEXT PROJECT").split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h2>
              <p className="ag-cta-desc">
                {settings.cta_desc || 'Kể cho chúng tôi nghe về thương hiệu và mục tiêu của bạn. Chúng tôi sẽ lên kế hoạch sáng tạo phù hợp nhất trong vòng 24 giờ.'}
              </p>
              <div className="ag-cta-contacts">
                {settings.site_email && (
                  <div className="ag-contact-item"><span>Email</span>{settings.site_email}</div>
                )}
                {settings.site_phone && (
                  <div className="ag-contact-item"><span>Phone</span>{settings.site_phone}</div>
                )}
                {settings.social_zalo && (
                  <div className="ag-contact-item"><span>Zalo</span>{settings.social_zalo}</div>
                )}
              </div>
            </div>

            <div data-reveal>
              <form className="ag-cta-form" onSubmit={handleSubmit} noValidate>
                <div className="ag-form-title">Gửi brief ngay</div>

                <div className="ag-field">
                  <label htmlFor="cta-name">Tên của bạn</label>
                  <input
                    type="text" id="cta-name" name="name"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required autoComplete="name"
                  />
                </div>
                <div className="ag-field">
                  <label htmlFor="cta-email">Email</label>
                  <input
                    type="email" id="cta-email" name="email"
                    placeholder="email@company.vn"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    autoComplete="email"
                  />
                </div>
                <div className="ag-field">
                  <label htmlFor="cta-service">Dịch vụ quan tâm</label>
                  <select
                    id="cta-service" name="service"
                    value={form.service}
                    onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                  >
                    <option value="">Chọn dịch vụ</option>
                    <option value="brand-identity">Brand Identity</option>
                    <option value="digital-design">Digital Design</option>
                    <option value="campaign">Campaign &amp; Content</option>
                    <option value="full-package">Full Package</option>
                  </select>
                </div>
                <div className="ag-field">
                  <label htmlFor="cta-brief">Mô tả ngắn về dự án</label>
                  <textarea
                    id="cta-brief" name="brief"
                    placeholder="Mô tả về thương hiệu và mong muốn của bạn..."
                    value={form.brief}
                    onChange={e => setForm(f => ({ ...f, brief: e.target.value }))}
                    required
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="ag-form-success">{submitMsg}</div>
                )}
                {submitStatus === 'error' && (
                  <div className="ag-form-error">{submitMsg}</div>
                )}

                <button type="submit" className="ag-form-submit" disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi brief →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
