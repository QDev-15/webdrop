import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// dich-vu.html — nhận TOÀN BỘ nội dung marketing (hero/service grid/process/why-choose-us/stat
// bar/testimonials/policy/CTA) theo đúng biến thể SEARCH-FIRST UNIFIED (index.html chỉ có catalog).

const CARD_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><path d="M12 12v.01" /><path d="M2 10l10 5 10-5" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /><path d="M7 8h.01M11 8h6" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M5 12h14M12 5l7 7-7 7" /><path d="M3 6h2M3 12h2M3 18h2" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
]

const WHY_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>,
]

const POLICY_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><path d="M2 10l10 5 10-5" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
]

function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || doneRef.current) return
        doneRef.current = true
        const duration = 1400
        const step = target / (duration / 16)
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + step, target)
          setValue(Math.floor(current))
          if (current >= target) clearInterval(timer)
        }, 16)
        obs.unobserve(el)
      })
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <div className="vp-stat-item" data-reveal ref={ref}>
      <div className="vp-stat-num">{value}<span>{suffix}</span></div>
      <div className="vp-stat-label">{label}</div>
    </div>
  )
}

export default function ServicesPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Dịch vụ doanh nghiệp — ${settings.site_name || 'OFFICEHUB'}`,
    description: `${settings.site_name || 'OFFICEHUB'} cung cấp dịch vụ văn phòng phẩm B2B toàn diện: cung ứng định kỳ, in logo thương hiệu, giao hàng nhanh, hợp đồng doanh nghiệp linh hoạt.`,
  })

  const cards = [1, 2, 3, 4].map(i => ({
    title: settings[`dv_card${i}_title`] || '',
    desc: settings[`dv_card${i}_desc`] || '',
    list: (settings[`dv_card${i}_list`] || '').split('|').filter(Boolean),
  }))

  const processSteps = [1, 2, 3, 4].map(i => ({
    title: settings[`dv_process${i}_title`] || '',
    desc: settings[`dv_process${i}_desc`] || '',
  }))

  const whyItems = [1, 2, 3, 4, 5, 6].map(i => ({
    title: settings[`dv_why${i}_title`] || '',
    desc: settings[`dv_why${i}_desc`] || '',
  }))

  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`dv_stat${i}_num`] || 0),
    suffix: settings[`dv_stat${i}_suffix`] || '',
    label: settings[`dv_stat${i}_label`] || '',
  }))

  const testimonials = [1, 2, 3].map(i => ({
    text: settings[`dv_testi${i}_text`] || '',
    name: settings[`dv_testi${i}_name`] || '',
    title: settings[`dv_testi${i}_title`] || '',
    avatar: settings[`dv_testi${i}_avatar`] || '',
  }))

  const policies = [1, 2, 3, 4].map(i => ({
    title: settings[`dv_policy${i}_title`] || '',
    desc: settings[`dv_policy${i}_desc`] || '',
  }))

  return (
    <>
      <section className="vp-dv-hero" aria-label={`Dịch vụ doanh nghiệp ${settings.site_name || 'OFFICEHUB'}`}>
        <div className="vp-dv-hero-bg">
          <img src={settings.dv_hero_image || 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?w=1400&auto=format&fit=crop&q=80'} alt="Văn phòng doanh nghiệp hiện đại" loading="eager" />
          <div className="vp-dv-hero-overlay"></div>
        </div>
        <div className="vp-container vp-dv-hero-content">
          <nav aria-label="Breadcrumb" className="vp-breadcrumb">
            <Link to="/" style={{ color: 'rgba(255,255,255,.7)' }}>Trang chủ</Link>
            <span style={{ color: 'rgba(255,255,255,.4)' }}>›</span>
            <span aria-current="page" style={{ color: '#fff' }}>Dịch vụ</span>
          </nav>
          <h1 className="vp-dv-hero-title">{settings.dv_hero_title1 || 'Giải pháp văn phòng'}<br /><em>{settings.dv_hero_title2 || 'cho doanh nghiệp'}</em></h1>
          <p className="vp-dv-hero-sub">{settings.dv_hero_desc}</p>
          <div className="vp-dv-hero-btns">
            <Link to="/lien-he" className="vp-btn vp-btn-white">Nhận báo giá ngay</Link>
            <a href="#dv-services" className="vp-btn vp-btn-outline-white">Xem dịch vụ ↓</a>
          </div>
        </div>
      </section>

      <section className="vp-section" id="dv-services" aria-labelledby="dv-services-heading">
        <div className="vp-container">
          <div className="text-center" style={{ marginBottom: 48 }} data-reveal>
            <div className="vp-eyebrow">Dịch vụ</div>
            <h2 className="vp-sec-title" id="dv-services-heading">Những gì chúng tôi <em>cung cấp</em></h2>
            <p className="vp-sec-sub">Giải pháp văn phòng phẩm toàn diện, linh hoạt theo nhu cầu từng doanh nghiệp</p>
          </div>
          <div className="row g-4">
            {cards.map((c, i) => (
              <div className="col-md-6 col-lg-3" data-reveal key={i}>
                <div className="vp-dv-card">
                  <div className="vp-dv-card-icon">{CARD_ICONS[i]}</div>
                  <h3 className="vp-dv-card-title">{c.title}</h3>
                  <p className="vp-dv-card-desc">{c.desc}</p>
                  <ul className="vp-dv-card-list">
                    {c.list.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vp-section vp-section-warm" aria-labelledby="dv-process-heading">
        <div className="vp-container">
          <div className="text-center" style={{ marginBottom: 48 }} data-reveal>
            <div className="vp-eyebrow">Quy trình</div>
            <h2 className="vp-sec-title" id="dv-process-heading">Hợp tác <em>đơn giản</em> 4 bước</h2>
          </div>
          <div className="vp-process-row">
            {processSteps.map((s, i) => (
              <Fragment key={i}>
                <div className="vp-process-step" data-reveal>
                  <div className="vp-process-num">{String(i + 1).padStart(2, '0')}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < processSteps.length - 1 && <div className="vp-process-arrow" aria-hidden="true">→</div>}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="vp-section" aria-labelledby="dv-why-heading">
        <div className="vp-container">
          <div className="text-center" style={{ marginBottom: 48 }} data-reveal>
            <div className="vp-eyebrow">Vì sao chọn chúng tôi</div>
            <h2 className="vp-sec-title" id="dv-why-heading">Đối tác <em>đáng tin cậy</em> của hơn 500 doanh nghiệp</h2>
          </div>
          <div className="row g-4">
            {whyItems.map((w, i) => (
              <div className="col-sm-6 col-lg-4" data-reveal key={i}>
                <div className="vp-why-item">
                  <div className="vp-why-icon">{WHY_ICONS[i]}</div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vp-stat-bar" aria-label={`Số liệu ${settings.site_name || 'OFFICEHUB'}`}>
        <div className="vp-container">
          <div className="vp-stat-row">
            {stats.map((s, i) => <StatItem key={i} target={s.num} suffix={s.suffix} label={s.label} />)}
          </div>
        </div>
      </section>

      <section className="vp-section" aria-labelledby="dv-testimonials-heading">
        <div className="vp-container">
          <div className="text-center" style={{ marginBottom: 48 }} data-reveal>
            <div className="vp-eyebrow">Khách hàng nói gì</div>
            <h2 className="vp-sec-title" id="dv-testimonials-heading">Doanh nghiệp <em>tin dùng</em></h2>
          </div>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div className="col-md-4" data-reveal key={i}>
                <div className="vp-testimonial-card">
                  <div className="vp-testimonial-stars" aria-label="5 sao">★★★★★</div>
                  <p className="vp-testimonial-text">{t.text}</p>
                  <div className="vp-testimonial-author">
                    <div className="vp-testimonial-avatar">{t.avatar}</div>
                    <div>
                      <div className="vp-testimonial-name">{t.name}</div>
                      <div className="vp-testimonial-title">{t.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vp-section vp-section-dark" aria-label="Chính sách dịch vụ">
        <div className="vp-container">
          <div className="vp-policy-row">
            {policies.map((p, i) => (
              <div className="vp-policy-item" data-reveal key={i}>
                <div className="vp-policy-icon">{POLICY_ICONS[i]}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vp-cta-bar" aria-label="Liên hệ hợp tác">
        <div className="vp-container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, marginBottom: 12 }}>Sẵn sàng bắt đầu hợp tác?</h2>
          <p style={{ color: 'rgba(255,255,255,.8)', marginBottom: 28 }}>Để lại thông tin — chuyên viên sẽ liên hệ trong vòng 2 giờ làm việc</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/lien-he" className="vp-btn vp-btn-white">Gửi yêu cầu báo giá</Link>
            <Link to="/" className="vp-btn vp-btn-outline-white">Xem sản phẩm →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
