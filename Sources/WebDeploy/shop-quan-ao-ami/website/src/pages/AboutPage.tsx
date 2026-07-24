import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { onImgError } from '../lib/format'

function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let cur = 0
        const step = Math.ceil(target / 60) || 1
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          setValue(cur)
          if (cur >= target) clearInterval(t)
        }, 25)
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return (
    <div ref={ref}>
      <div className="am-stat-num">{value.toLocaleString('vi-VN')}{suffix}</div>
      <p className="am-stat-label">{label}</p>
    </div>
  )
}

const WHY_ICONS = [
  <path key="1" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />,
  <circle key="2" cx="12" cy="12" r="10" />,
  <path key="3" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />,
  <path key="4" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
]
const WHY_ICONS_EXTRA = [
  <path key="1b" d="m9 12 2 2 4-4" />,
  <polyline key="2b" points="12 6 12 12 16 14" />,
  <polyline key="3b" points="22,6 12,13 2,6" />,
  null,
]

const POLICY_ICONS = [
  <>
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </>,
  <>
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.17" />
  </>,
  <path key="p3" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  <path key="p4" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.16h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
]

export default function AboutPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'AMI Fashion'

  useDocumentMeta({
    title: `Giới thiệu ${siteName} — Thời trang tối giản`,
    description: `${siteName} ra đời từ tình yêu với thời trang tối giản. Tìm hiểu câu chuyện thương hiệu, giá trị cốt lõi và cam kết chất lượng của chúng tôi.`,
  })

  const values = [1, 2, 3].map(i => ({ title: settings[`value${i}_title`], desc: settings[`value${i}_desc`] }))
  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`astat${i}_num`] || 0),
    suffix: settings[`astat${i}_suffix`] || '',
    label: settings[`astat${i}_label`] || '',
  }))
  const whys = [1, 2, 3, 4].map(i => ({ title: settings[`why${i}_title`], desc: settings[`why${i}_desc`] }))
  const testimonials = [1, 2, 3].map(i => ({
    text: settings[`testi${i}_text`],
    name: settings[`testi${i}_name`],
    role: settings[`testi${i}_role`],
    stars: Number(settings[`testi${i}_stars`] || 5),
    avatar: settings[`testi${i}_avatar`],
  }))
  const policies = [1, 2, 3, 4].map(i => ({ title: settings[`policy${i}_title`], desc: settings[`policy${i}_desc`] }))

  return (
    <main className="am-page-body">
      <section className="am-about-hero" aria-labelledby="about-hero-heading">
        <div className="am-container">
          <p className="am-about-hero-label">{settings.about_hero_label || 'Câu chuyện AMI'}</p>
          <h1 id="about-hero-heading"><em>{settings.about_hero_title1 || 'Ít hơn,'}<br />{settings.about_hero_title2 || 'nhưng tốt hơn.'}</em></h1>
          <p>{settings.about_hero_desc}</p>
        </div>
      </section>

      <section className="am-sec" aria-labelledby="story-heading">
        <div className="am-container">
          <div className="am-story" data-reveal>
            <div className="am-story-img">
              <img src={settings.about_story_image} alt={`Xưởng may ${siteName}`} onError={onImgError} />
            </div>
            <div className="am-story-content">
              <span className="am-eyebrow">{settings.about_story_label || 'Hành trình của chúng tôi'}</span>
              <h2 id="story-heading"><em>{settings.about_story_title || 'Từ một chiếc áo thun trắng'}</em></h2>
              <p>{settings.about_story_p1}</p>
              <p>{settings.about_story_p2}</p>
              <p>{settings.about_story_p3}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="am-values" aria-labelledby="values-heading">
        <div className="am-container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }} data-reveal>
            <span className="am-eyebrow">Triết lý thiết kế</span>
            <h2 className="am-sec-title" id="values-heading"><em>Ba giá trị cốt lõi</em></h2>
          </div>
          <div className="am-value-grid">
            {values.map((v, i) => (
              <div className="am-value-item" key={i} data-reveal>
                <div className="am-value-num">{String(i + 1).padStart(2, '0')}</div>
                <p className="am-value-title">{v.title}</p>
                <p className="am-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="am-stat-bar" aria-label="Số liệu thương hiệu">
        <div className="am-container">
          <div className="am-stat-grid" data-reveal>
            {stats.map((s, i) => <StatCounter key={i} target={s.num} suffix={s.suffix} label={s.label} />)}
          </div>
        </div>
      </section>

      <section className="am-sec" aria-labelledby="why-heading">
        <div className="am-container">
          <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto 56px' }} data-reveal>
            <span className="am-eyebrow">Lý do chọn chúng tôi</span>
            <h2 className="am-sec-title" id="why-heading"><em>Vì sao chọn AMI?</em></h2>
          </div>
          <div className="am-why" data-reveal>
            {whys.map((w, i) => (
              <div className="am-why-item" key={i}>
                <div className="am-why-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {WHY_ICONS[i]}
                    {WHY_ICONS_EXTRA[i]}
                  </svg>
                </div>
                <p className="am-why-title">{w.title}</p>
                <p className="am-why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="am-sec am-testimonials" aria-labelledby="testimonials-heading">
        <div className="am-container">
          <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto 48px' }} data-reveal>
            <span className="am-eyebrow">Khách hàng nói gì</span>
            <h2 className="am-sec-title" id="testimonials-heading"><em>Cảm nhận thật</em></h2>
          </div>
          <div className="am-testimonial-grid" data-reveal>
            {testimonials.map((t, i) => (
              <div className="am-testimonial" key={i}>
                <div className="am-testimonial-stars">{'★'.repeat(t.stars)}{'☆'.repeat(Math.max(0, 5 - t.stars))}</div>
                <p className="am-testimonial-text">"{t.text}"</p>
                <div className="am-testimonial-author">
                  <div className="am-testimonial-avatar">
                    <img src={t.avatar} alt={t.name} onError={onImgError} />
                  </div>
                  <div>
                    <p className="am-testimonial-name">{t.name}</p>
                    <p className="am-testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Chính sách mua hàng">
        <div className="am-container">
          <div className="am-policy-row" data-reveal>
            {policies.map((p, i) => (
              <div className="am-policy-item" key={i}>
                <div className="am-policy-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">{POLICY_ICONS[i]}</svg>
                </div>
                <p className="am-policy-title">{p.title}</p>
                <p className="am-policy-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="am-about-cta" aria-labelledby="cta-heading">
        <div className="am-container">
          <span className="am-about-hero-label">{settings.about_cta_label || 'Sẵn sàng chưa?'}</span>
          <h2 id="cta-heading"><em>{settings.about_cta_title || 'Khám phá bộ sưu tập AMI'}</em></h2>
          <p>{settings.about_cta_desc}</p>
          <Link to="/san-pham" className="am-btn-light">Mua sắm ngay →</Link>
        </div>
      </section>
    </main>
  )
}
