import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let cur = 0
      const step = Math.ceil(target / 60) || 1
      const interval = setInterval(() => {
        cur = Math.min(cur + step, target)
        setValue(cur)
        if (cur >= target) clearInterval(interval)
      }, 25)
      io.disconnect()
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return <div className="mc-stat-number" ref={ref}>{value}{suffix}</div>
}

export default function HomePage() {
  const { settings, services, testimonials } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'Marketing Consultancy — Chiến lược & Giải pháp Marketing',
    description: settings.meta_description,
  })

  const stats = [1, 2, 3, 4].map(i => ({
    number: parseInt(settings[`stat${i}_number`] || '0', 10),
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  }))

  const processSteps = [1, 2, 3, 4].map(i => ({
    title: settings[`process${i}_title`] || '',
    desc: settings[`process${i}_desc`] || '',
  }))

  return (
    <>
      <HeroSlider />

      {/* SERVICES (FEATURES) */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div data-reveal="true" className="mc-eyebrow">{settings.home_services_eyebrow || 'Dịch vụ chính'}</div>
            <h2 data-reveal="true" className="mc-title" dangerouslySetInnerHTML={{ __html: settings.home_services_title || 'Giải pháp Marketing <em>Toàn Diện</em>' }} />
            <p data-reveal="true" className="mc-sub" style={{ margin: '0 auto' }}>{settings.home_services_sub || ''}</p>
          </div>

          <div className="mc-feature-grid">
            {services.map(s => (
              <div key={s.id} data-reveal="true" className="mc-feature-card">
                <div className="mc-feature-icon">{s.icon}</div>
                <h3 className="mc-feature-title">{s.title}</h3>
                <p className="mc-feature-desc">{s.short_desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mc-stats">
        <div className="wd-container">
          <div className="mc-stats-grid">
            {stats.map((s, i) => (
              <div data-reveal="true" key={i} className="mc-stat-item">
                <Counter target={s.number} suffix={s.suffix} />
                <div className="mc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS/STEPS */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div data-reveal="true" className="mc-eyebrow">{settings.home_process_eyebrow || 'Quy trình làm việc'}</div>
            <h2 data-reveal="true" className="mc-title" dangerouslySetInnerHTML={{ __html: settings.home_process_title || 'Cách chúng tôi <em>hợp tác</em>' }} />
            <p data-reveal="true" className="mc-sub" style={{ margin: '0 auto' }}>{settings.home_process_sub || ''}</p>
          </div>

          <div className="mc-process-steps">
            {processSteps.map((step, i) => (
              <div data-reveal="true" key={i} className="mc-step-card">
                <div className="mc-step-number">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mc-step-title">{step.title}</h3>
                <p className="mc-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mc-sec-pad" style={{ background: 'linear-gradient(135deg, rgba(155, 126, 240, .05), rgba(52, 201, 142, .05))' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div data-reveal="true" className="mc-eyebrow">{settings.home_testimonials_eyebrow || 'Đánh giá từ khách hàng'}</div>
            <h2 data-reveal="true" className="mc-title" dangerouslySetInnerHTML={{ __html: settings.home_testimonials_title || 'Khách hàng tin tưởng <em>chúng tôi</em>' }} />
          </div>

          <div className="mc-testimonial-grid">
            {testimonials.map(t => (
              <div data-reveal="true" key={t.id} className="mc-testimonial-card">
                <div className="mc-testimonial-content">{t.content}</div>
                <div className="mc-testimonial-author">
                  <div className="mc-author-avatar">
                    {t.author_avatar && t.author_avatar.startsWith('http') ? <img src={t.author_avatar} alt={t.author_name} /> : (t.author_avatar || '👤')}
                  </div>
                  <div className="mc-author-info">
                    <div className="mc-author-name">{t.author_name}</div>
                    <div className="mc-author-role">{t.author_title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          <div data-reveal="true" className="mc-cta-section">
            <h2 className="mc-cta-title">{settings.home_cta_title || ''}</h2>
            <p className="mc-cta-sub">{settings.home_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-mc-light">{settings.home_cta_button || 'Yêu cầu tư vấn ngay'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
