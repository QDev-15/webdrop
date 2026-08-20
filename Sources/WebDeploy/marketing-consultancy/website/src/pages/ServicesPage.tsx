import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

interface PricingPlan {
  id: number
  name: string
  price: string
  description: string
  features: string
  is_featured: number
  cta_text: string
  cta_link: string
}

interface Faq {
  id: number
  question: string
  answer: string
}

function parseFeatures(raw: string): string[] {
  return (raw || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
}

export default function ServicesPage() {
  const { settings, services } = useSite()
  const [pricing, setPricing] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])

  useDocumentMeta({
    title: `Dịch vụ — ${settings.site_name || 'Markco'}`,
    description: settings.services_hero_sub,
  })

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPricing).catch(() => {})
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(() => {})
  }, [])

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">{settings.services_hero_eyebrow || 'Các dịch vụ chính'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.services_hero_title || 'Giải pháp Marketing <em>Toàn Diện</em>' }} />
          <p className="ph-sub">{settings.services_hero_sub || ''}</p>
        </div>
      </section>

      {/* SERVICES — alternating detail list */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          {services.map((s, i) => (
            <div className="mc-project-item" key={s.id}>
              <div className="mc-project-content">
                <div className="mc-label">Dịch vụ {i + 1}</div>
                <h3>{s.title}</h3>
                <p className="mc-project-desc">{s.long_desc || s.short_desc}</p>
              </div>
              <div className="mc-project-image" style={{ background: i % 2 === 0 ? 'linear-gradient(135deg, var(--accent-light), var(--mint-light))' : 'linear-gradient(135deg, var(--mint-light), var(--accent-light))' }}>
                {s.image ? <img src={s.image} alt={s.title} /> : <span>{s.icon} {s.title}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PACKAGES — Bảng giá dịch vụ (mục I) */}
      {pricing.length > 0 && (
        <section className="mc-sec-pad" id="pricing" style={{ background: 'linear-gradient(135deg, rgba(155, 126, 240, .05), rgba(52, 201, 142, .05))' }}>
          <div className="wd-container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="mc-eyebrow">{settings.pricing_eyebrow || 'Gói dịch vụ'}</div>
              <h2 className="mc-title" dangerouslySetInnerHTML={{ __html: settings.pricing_title || 'Chọn gói phù hợp <em>cho doanh nghiệp</em> của bạn' }} />
            </div>

            <div className="mc-feature-grid">
              {pricing.map(pkg => (
                <div className={`mc-feature-card mc-pricing-card${pkg.is_featured ? ' featured' : ''}`} key={pkg.id}>
                  {!!pkg.is_featured && <div className="mc-pricing-badge">Phổ biến</div>}
                  <h3 className="mc-feature-title">{pkg.name}</h3>
                  <div className="mc-pricing-price">{pkg.price}</div>
                  {pkg.description && <p className="mc-feature-desc mc-pricing-desc">{pkg.description}</p>}
                  <ul className="mc-pricing-features">
                    {parseFeatures(pkg.features).map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <Link to={pkg.cta_link || '/lien-he'} className={`${pkg.is_featured ? 'btn-mc-primary' : 'btn-mc-secondary'} mc-pricing-cta`}>
                    {pkg.cta_text || 'Chọn gói'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ — Accordion thật (details/summary, không cần JS) (mục H) */}
      {faqs.length > 0 && (
        <section className="mc-sec-pad" id="faq">
          <div className="wd-container">
            <div className="row g-5">
              <div className="col-lg-4" data-reveal="true">
                <div className="mc-eyebrow">FAQ</div>
                <h2 className="mc-title">Câu hỏi <em>thường gặp</em></h2>
                <p className="mc-sub" style={{ margin: 0 }}>
                  Chưa tìm thấy câu trả lời bạn cần? <Link to="/lien-he" style={{ color: 'var(--accent)', fontWeight: 600 }}>Liên hệ trực tiếp</Link> — chúng tôi luôn sẵn sàng giải đáp.
                </p>
              </div>
              <div className="col-lg-8" data-reveal="true">
                {faqs.map(f => (
                  <details className="mc-faq-item" key={f.id}>
                    <summary>{f.question} <span className="mc-faq-icon">+</span></summary>
                    <p className="mc-faq-a">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mc-sec-pad">
        <div className="wd-container">
          <div className="mc-cta-section">
            <h2 className="mc-cta-title">{settings.services_cta_title || ''}</h2>
            <p className="mc-cta-sub">{settings.services_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-mc-light">{settings.services_cta_button || 'Yêu cầu tư vấn'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
