import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

interface PricingPlan {
  id: number
  name: string
  description: string
  price: string
  unit: string
  features: string
  is_featured: number
  badge_text: string
  cta_text: string
  cta_link: string
}

interface Faq {
  id: number
  question: string
  answer: string
}

function renderEm(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => (part.startsWith('*') && part.endsWith('*')) ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>)
}

function parseFeatures(raw: string): string[] {
  return (raw || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
}

export default function ServicesPage() {
  const { settings } = useSite()
  const [pricing, setPricing] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])

  useDocumentMeta({
    title: `Dịch vụ & Bảng giá — ${settings.site_name || 'Đăng Photography'}`,
    description: settings.services_hero_sub,
  })

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPricing).catch(() => {})
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(() => {})
  }, [])

  return (
    <main>
      <section className="pna-page-hero">
        <div className="wd-container">
          <div className="pna-ph-tag" data-reveal>Dịch vụ</div>
          <h1 className="pna-ph-title" data-reveal>{renderEm(settings.services_hero_title || 'Gói dịch vụ minh bạch, không phát sinh')}</h1>
          <p className="pna-ph-sub" data-reveal>{settings.services_hero_sub}</p>
        </div>
      </section>

      {/* PROCESS — 4 bước */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="pna-sec-head-row" data-reveal>
            <div>
              <div className="pna-eyebrow">Quy trình</div>
              <h2 className="pna-sec-title pna-mb-0">4 bước làm việc <em>rõ ràng</em></h2>
            </div>
          </div>
          <div className="pna-feature-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginTop: 0 }}>
            {[1, 2, 3, 4].map(i => (
              <div className="pna-feature-item" key={i} data-reveal>
                <div className="pna-feature-num">0{i}</div>
                <div className="pna-feature-title">{settings[`process${i}_title`]}</div>
                <div className="pna-feature-text">{settings[`process${i}_desc`]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {pricing.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="pna-center" style={{ maxWidth: 640, margin: '0 auto 48px' }} data-reveal>
              <div className="pna-eyebrow" style={{ justifyContent: 'center' }}>Bảng giá</div>
              <h2 className="pna-sec-title">Chọn gói phù hợp <em>với bạn</em></h2>
              <p className="pna-sec-sub pna-mx-auto" style={{ textAlign: 'center' }}>{settings.pricing_sub}</p>
            </div>
            <div className="pna-pricing-grid">
              {pricing.map(pkg => (
                <div className={`pna-price-card${pkg.is_featured ? ' featured' : ''}`} key={pkg.id} data-reveal>
                  {!!pkg.is_featured && <div className="pna-price-badge">{pkg.badge_text || 'Phổ biến nhất'}</div>}
                  <div className="pna-price-name">{pkg.name}</div>
                  <div className="pna-price-desc">{pkg.description}</div>
                  <div className="pna-price-value">{pkg.price}</div>
                  <div className="pna-price-unit">{pkg.unit}</div>
                  <ul className="pna-price-features">
                    {parseFeatures(pkg.features).map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <Link to={pkg.cta_link || '/lien-he'} className={`pna-btn ${pkg.is_featured ? 'pna-btn-accent' : 'pna-btn-ghost'}`} style={{ width: '100%', justifyContent: 'center' }}>
                    {pkg.cta_text || 'Chọn gói này'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="pna-center" style={{ marginBottom: 48 }} data-reveal>
              <div className="pna-eyebrow" style={{ justifyContent: 'center' }}>Câu hỏi thường gặp</div>
              <h2 className="pna-sec-title">Còn thắc mắc gì <em>không?</em></h2>
            </div>
            <div className="pna-faq-list" data-reveal>
              {faqs.map(f => (
                <details className="pna-faq-item" key={f.id}>
                  <summary>{f.question} <span className="pna-faq-icon">+</span></summary>
                  <p className="pna-faq-a">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pna-full-bleed" style={{ backgroundImage: `url('${settings.services_fb_image || ''}')` }}>
        <div className="wd-container" data-reveal>
          <h2 className="pna-fb-title" dangerouslySetInnerHTML={{ __html: (settings.services_fb_title || '').replace(/\*([^*]+)\*/g, '<em>$1</em>') }} />
          <p className="pna-fb-sub">{settings.services_fb_sub}</p>
          <Link to="/lien-he" className="pna-btn pna-btn-accent">Đặt lịch tư vấn miễn phí</Link>
        </div>
      </section>
    </main>
  )
}
