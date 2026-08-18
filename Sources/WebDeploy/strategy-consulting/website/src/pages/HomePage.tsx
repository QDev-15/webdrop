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

  return <div className="sc-stat-number" ref={ref}>{value}{suffix}</div>
}

export default function HomePage() {
  const { settings, services } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'Strategy Consulting — Tư vấn Chiến lược Kinh doanh',
    description: settings.meta_description,
  })

  const stats = [1, 2, 3, 4].map(i => ({
    number: parseInt(settings[`stat${i}_number`] || '0', 10),
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  }))

  return (
    <>
      <HeroSlider />

      <section className="sc-sec-pad">
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div data-reveal="true" className="sc-label">{settings.home_services_eyebrow || 'Dịch vụ chính'}</div>
            <h2 data-reveal="true" className="sc-title" dangerouslySetInnerHTML={{ __html: settings.home_services_title || 'Giải pháp <em>Toàn diện</em>' }} />
            <p data-reveal="true" className="sc-sub" style={{ margin: '0 auto' }}>{settings.home_services_sub || ''}</p>
          </div>

          <div className="sc-feature-grid">
            {services.map(s => (
              <div key={s.id} data-reveal="true" className="sc-feature-item">
                <div className="sc-feature-icon">{s.icon}</div>
                <h3 className="sc-feature-title">{s.title}</h3>
                <p className="sc-feature-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sc-stats">
        <div className="wd-container">
          <div className="sc-stats-grid">
            {stats.map((s, i) => (
              <div data-reveal="true" key={i}>
                <Counter target={s.number} suffix={s.suffix} />
                <div className="sc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sc-sec-pad">
        <div className="wd-container">
          <div className="sc-cta-section">
            <h2 className="sc-cta-title">{settings.home_cta_title || ''}</h2>
            <p className="sc-cta-sub">{settings.home_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-sc">{settings.home_cta_button || 'Yêu cầu tư vấn'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
