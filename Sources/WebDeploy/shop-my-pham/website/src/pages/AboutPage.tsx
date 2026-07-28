import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          setStarted(true)
          const duration = 1800
          const start = performance.now()
          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            if (el) el.textContent = Math.round(target * eased).toLocaleString('vi-VN')
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      })
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return <span className="mp-counter" ref={ref} aria-live="polite">0</span>
}

export default function AboutPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Giới Thiệu — ${settings.site_name || 'LUMIÈRE Beauty'}`,
    description: `${settings.site_name || 'LUMIÈRE Beauty'} — Câu chuyện về hành trình mang đến những sản phẩm mỹ phẩm cao cấp, thành phần an toàn và vẻ đẹp đích thực từ thiên nhiên.`,
  })

  const values = [1, 2, 3, 4].map(i => ({
    title: settings[`value${i}_title`] || '',
    desc: settings[`value${i}_desc`] || '',
  })).filter(v => v.title)

  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`astat${i}_num`] || 0),
    suffix: settings[`astat${i}_suffix`] || '',
    label: settings[`astat${i}_label`] || '',
  }))

  const whys = [1, 2, 3, 4].map(i => ({
    title: settings[`why${i}_title`] || '',
    desc: settings[`why${i}_desc`] || '',
  })).filter(w => w.title)

  const testis = [1, 2, 3].map(i => ({
    text: settings[`testi${i}_text`] || '',
    name: settings[`testi${i}_name`] || '',
    role: settings[`testi${i}_role`] || '',
    stars: Number(settings[`testi${i}_stars`] || 5),
    avatar: settings[`testi${i}_avatar`] || '',
  })).filter(t => t.text)

  const policies = [1, 2, 3, 4].map(i => ({
    title: settings[`policy${i}_title`] || '',
    desc: settings[`policy${i}_desc`] || '',
  })).filter(p => p.title)

  const valueIcons = [
    <path key="1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    <><circle key="2a" cx="12" cy="12" r="10" /><line key="2b" x1="12" y1="8" x2="12" y2="12" /><line key="2c" x1="12" y1="16" x2="12.01" y2="16" /></>,
    <path key="3" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    <><path key="4a" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline key="4b" points="9 22 9 12 15 12 15 22" /></>,
  ]
  const policyIcons = [
    <><rect key="1a" x="1" y="3" width="15" height="13" /><polygon key="1b" points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle key="1c" cx="5.5" cy="18.5" r="2.5" /><circle key="1d" cx="18.5" cy="18.5" r="2.5" /></>,
    <><polyline key="2a" points="1 4 1 10 7 10" /><path key="2b" d="M3.51 15a9 9 0 1 0 .49-3.71" /></>,
    <path key="3" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    <path key="4" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  ]

  return (
    <main id="mp-main">
      <section className="mp-about-hero" aria-label={`${settings.site_name || 'LUMIÈRE Beauty'} — Câu chuyện thương hiệu`}>
        <div className="mp-about-hero-bg">
          <img src={settings.about_hero_image} alt="Phòng lab nghiên cứu mỹ phẩm LUMIÈRE" className="mp-about-hero-img" loading="eager" />
          <div className="mp-about-hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="wd-container mp-about-hero-content">
          <div className="mp-eyebrow" style={{ color: 'rgba(255,255,255,.65)' }}>{settings.about_hero_label}</div>
          <h1 className="mp-about-hero-title">{settings.about_hero_title1}<br /><em>{settings.about_hero_title2}</em></h1>
          <p className="mp-about-hero-sub">{settings.about_hero_desc}</p>
          <a href="#mp-story" className="mp-btn mp-btn-white">Khám phá hành trình →</a>
        </div>
      </section>

      <section className="mp-about-story" id="mp-story" aria-labelledby="mpStoryTitle" data-reveal>
        <div className="wd-container">
          <div className="mp-story-row">
            <div className="mp-story-img-wrap">
              <img src={settings.story1_image} alt="Nguồn gốc thương hiệu LUMIÈRE" className="mp-story-img" loading="lazy" />
            </div>
            <div className="mp-story-content">
              <div className="mp-eyebrow">{settings.story1_label}</div>
              <h2 id="mpStoryTitle" className="mp-sec-title">{settings.story1_title1}<br /><em>{settings.story1_title2}</em></h2>
              <p>{settings.story1_p1}</p>
              <p>{settings.story1_p2}</p>
            </div>
          </div>

          <div className="mp-story-row mp-story-row--reverse">
            <div className="mp-story-img-wrap">
              <img src={settings.story2_image} alt="Phòng nghiên cứu và phát triển sản phẩm" className="mp-story-img" loading="lazy" />
            </div>
            <div className="mp-story-content">
              <div className="mp-eyebrow">{settings.story2_label}</div>
              <h2 className="mp-sec-title">{settings.story2_title1}<br /><em>{settings.story2_title2}</em></h2>
              <p>{settings.story2_p1}</p>
              <p>{settings.story2_p2}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mp-about-values mp-home-section--alt" aria-labelledby="mpValuesTitle" data-reveal>
        <div className="wd-container">
          <div className="mp-sec-center">
            <div className="mp-eyebrow">Giá trị cốt lõi</div>
            <h2 id="mpValuesTitle" className="mp-sec-title">Những Điều Chúng Tôi<br /><em>Tin Tưởng</em></h2>
          </div>
          <div className="mp-values-grid">
            {values.map((v, i) => (
              <div className="mp-value-card" data-reveal key={i}>
                <div className="mp-value-icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{valueIcons[i]}</svg>
                </div>
                <h3 className="mp-value-title">{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mp-stat-bar" aria-label="Thống kê thương hiệu" data-reveal>
        <div className="wd-container">
          <div className="mp-stats-grid">
            {stats.map((s, i) => (
              <div className="mp-stat-item" key={i}>
                <div className="mp-stat-number">
                  <Counter target={s.num} />{s.suffix}
                </div>
                <div className="mp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mp-why-us" aria-labelledby="mpWhyTitle" data-reveal>
        <div className="wd-container">
          <div className="mp-sec-center">
            <div className="mp-eyebrow">Vì sao chọn chúng tôi</div>
            <h2 id="mpWhyTitle" className="mp-sec-title">Lý Do LUMIÈRE<br /><em>Khác Biệt</em></h2>
            <p className="mp-sec-sub">Không phải chúng tôi chỉ bán mỹ phẩm — chúng tôi cam kết đồng hành cùng hành trình chăm sóc da của bạn.</p>
          </div>
          <div className="mp-why-grid">
            {whys.map((w, i) => (
              <div className="mp-why-item" data-reveal key={i}>
                <div className="mp-why-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mp-why-title">{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mp-testimonials mp-home-section--alt" aria-labelledby="mpTestimTitle" data-reveal>
        <div className="wd-container">
          <div className="mp-sec-center">
            <div className="mp-eyebrow">Khách hàng nói gì</div>
            <h2 id="mpTestimTitle" className="mp-sec-title">Câu Chuyện Thực Từ<br /><em>Khách Hàng LUMIÈRE</em></h2>
          </div>
          <div className="mp-testim-grid">
            {testis.map((t, i) => (
              <blockquote className="mp-testim-card" data-reveal key={i}>
                <div className="mp-testim-stars" aria-label={`${t.stars} sao`}>{'★'.repeat(t.stars)}</div>
                <p className="mp-testim-quote">"{t.text}"</p>
                <footer className="mp-testim-author">
                  {t.avatar && <img src={t.avatar} alt={`Khách hàng ${t.name}`} className="mp-testim-avatar" loading="lazy" />}
                  <div>
                    <cite className="mp-testim-name">{t.name}</cite>
                    <div className="mp-testim-role">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mp-policy-row" aria-labelledby="mpPolicyTitle" data-reveal>
        <div className="wd-container">
          <div className="mp-sec-center">
            <div className="mp-eyebrow">Cam kết với bạn</div>
            <h2 id="mpPolicyTitle" className="mp-sec-title">Chính Sách Mua Hàng</h2>
          </div>
          <div className="mp-policy-grid">
            {policies.map((p, i) => (
              <div className="mp-policy-item" data-reveal key={i}>
                <div className="mp-policy-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{policyIcons[i]}</svg>
                </div>
                <h3 className="mp-policy-title">{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mp-about-cta" aria-label="Kêu gọi hành động" data-reveal>
        <div className="wd-container">
          <div className="mp-about-cta-inner">
            <div className="mp-eyebrow" style={{ color: 'var(--accent)' }}>{settings.about_cta_label}</div>
            <h2 className="mp-about-cta-title">{settings.about_cta_title1}<br /><em>{settings.about_cta_title2}</em></h2>
            <p className="mp-about-cta-sub">{settings.about_cta_desc}</p>
            <div className="mp-cta-btns">
              <Link to="/san-pham" className="mp-btn mp-btn-accent">Xem sản phẩm →</Link>
              <Link to="/lien-he" className="mp-btn mp-btn-ghost-dark">Liên hệ tư vấn</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
