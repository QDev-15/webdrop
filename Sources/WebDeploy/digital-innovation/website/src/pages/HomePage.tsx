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

  return <div className="di-stat-number" ref={ref}>{value}{suffix}</div>
}

export default function HomePage() {
  const { settings, services } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'Digital Innovation — Giải pháp Công nghệ & Marketing số',
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

      <section className="di-sec-pad">
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div data-reveal="true" className="di-eyebrow">{settings.home_services_eyebrow || 'Giải pháp lõi'}</div>
            <h2 data-reveal="true" className="di-title" dangerouslySetInnerHTML={{ __html: settings.home_services_title || 'Công nghệ <em>Tiên tiến</em>' }} />
            <p data-reveal="true" className="di-sub" style={{ margin: '0 auto' }}>{settings.home_services_sub || ''}</p>
          </div>

          <div className="di-feature-grid">
            {services.map(s => (
              <div key={s.id} data-reveal="true" className="di-feature-card">
                <div className="di-feature-icon">{s.icon}</div>
                <h3 className="di-feature-title">{s.title}</h3>
                <p className="di-feature-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="di-stats">
        <div className="wd-container">
          <div className="di-stats-grid">
            {stats.map((s, i) => (
              <div data-reveal="true" key={i}>
                <Counter target={s.number} suffix={s.suffix} />
                <div className="di-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="di-sec-pad">
        <div className="wd-container">
          <div className="di-cta-section">
            <h2 className="di-cta-title">{settings.home_cta_title || ''}</h2>
            <p className="di-cta-sub">{settings.home_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-di-light">{settings.home_cta_button || 'Bắt đầu hôm nay'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
