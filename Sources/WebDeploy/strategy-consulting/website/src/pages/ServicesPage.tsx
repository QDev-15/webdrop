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
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])

  useDocumentMeta({
    title: `Dịch vụ — ${settings.site_name || 'Strategy & Co'}`,
    description: settings.services_hero_sub,
  })

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPlans).catch(() => {})
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(() => {})
  }, [])

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-label">{settings.services_hero_eyebrow || 'Các dịch vụ'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.services_hero_title || 'Giải pháp <em>Chiến lược</em> toàn diện' }} />
          <p className="ph-sub">{settings.services_hero_sub || ''}</p>
        </div>
      </section>

      <section className="sc-sec-pad">
        <div className="wd-container">
          <div className="sc-feature-grid">
            {services.map(s => (
              <div className="sc-feature-item" key={s.id}>
                <div className="sc-feature-icon">{s.icon}</div>
                <h3 className="sc-feature-title">{s.title}</h3>
                <p className="sc-feature-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HÌNH THỨC HỢP TÁC — engagement models thay cho bảng giá cố định (mục I) */}
      {plans.length > 0 && (
        <section className="sc-sec-pad" style={{ borderTop: '1px solid var(--border-light)' }}>
          <div className="wd-container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div className="sc-label">{settings.pricing_eyebrow || 'Hình thức hợp tác'}</div>
              <h2 className="sc-title" dangerouslySetInnerHTML={{ __html: settings.pricing_title || 'Cách <em>đồng hành</em> cùng bạn' }} />
              <p className="sc-sub">{settings.pricing_sub || ''}</p>
            </div>

            <div className="sc-engage-grid">
              {plans.map(plan => (
                <div className="sc-engage-card" key={plan.id}>
                  <div className="sc-engage-label">{plan.price}</div>
                  <h3 className="sc-engage-name">{plan.name}</h3>
                  <p className="sc-engage-desc">{plan.description}</p>
                  <ul className="sc-engage-scope">
                    {parseFeatures(plan.features).map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <Link to={plan.cta_link || '/lien-he'} className="sc-engage-cta">{plan.cta_text || 'Tìm hiểu thêm'}</Link>
                </div>
              ))}
            </div>

            {settings.pricing_footnote && (
              <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--text-3)', textAlign: 'center', marginTop: 40 }}>{settings.pricing_footnote}</p>
            )}
          </div>
        </section>
      )}

      {/* FAQ — Accordion thật (details/summary, không cần JS) (mục H) */}
      {faqs.length > 0 && (
        <section className="sc-sec-pad" id="faq" style={{ borderTop: '1px solid var(--border-light)' }}>
          <div className="wd-container">
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="sc-label">{settings.faq_eyebrow || 'Câu hỏi thường gặp'}</div>
              <h2 className="sc-title" dangerouslySetInnerHTML={{ __html: settings.faq_title || 'Giải đáp <em>Thắc mắc</em>' }} />
              <p className="sc-sub">
                Chưa tìm thấy câu trả lời bạn cần? <Link to="/lien-he" style={{ color: 'var(--accent)' }}>Liên hệ trực tiếp</Link> — chúng tôi luôn sẵn sàng trao đổi thêm.
              </p>
            </div>

            <div className="sc-faq-list" style={{ maxWidth: 760, margin: '0 auto' }}>
              {faqs.map(f => (
                <details className="sc-faq-item" key={f.id}>
                  <summary>{f.question} <span className="sc-faq-icon">+</span></summary>
                  <p className="sc-faq-a">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sc-cta-section sc-sec-pad">
        <div className="wd-container">
          <h2 className="sc-cta-title">{settings.services_cta_title || ''}</h2>
          <p className="sc-cta-sub">{settings.services_cta_sub || ''}</p>
          <Link to="/lien-he" className="btn-sc">{settings.services_cta_button || 'Liên hệ'}</Link>
        </div>
      </section>
    </>
  )
}
