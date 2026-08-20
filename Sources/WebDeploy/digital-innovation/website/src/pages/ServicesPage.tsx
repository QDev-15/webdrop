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
    title: `Dịch vụ — ${settings.site_name || 'Digital Innovation'}`,
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
          <div className="ph-eyebrow">{settings.services_hero_eyebrow || 'Các dịch vụ'}</div>
          <h1 className="ph-title" dangerouslySetInnerHTML={{ __html: settings.services_hero_title || 'Giải pháp <em>Công nghệ</em> toàn diện' }} />
          <p className="ph-sub">{settings.services_hero_sub || ''}</p>
        </div>
      </section>

      <section className="di-sec-pad">
        <div className="wd-container">
          <div className="di-feature-grid">
            {services.map(s => (
              <div className="di-feature-card" key={s.id}>
                <div className="di-feature-icon">{s.icon}</div>
                <h3 className="di-feature-title">{s.title}</h3>
                <p className="di-feature-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — Bảng giá dịch vụ (mục I) */}
      {pricing.length > 0 && (
        <section className="di-sec-pad" id="pricing">
          <div className="wd-container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div data-reveal="true" className="di-eyebrow">Bảng giá dịch vụ</div>
              <h2 data-reveal="true" className="di-title">Gói giải pháp <em>phù hợp</em> bạn</h2>
              <p data-reveal="true" className="di-sub" style={{ margin: '0 auto' }}>
                Từ startup mới triển khai AI đến doanh nghiệp cần hạ tầng số hóa toàn diện — chọn gói phù hợp với quy mô của bạn.
              </p>
            </div>
            <div className="di-pricing-grid">
              {pricing.map(pc => (
                <div className={`di-pricing-card${pc.is_featured ? ' featured' : ''}`} data-reveal="true" key={pc.id}>
                  {!!pc.is_featured && <div className="di-price-badge">Phổ biến nhất</div>}
                  <div className="di-price-tier">{pc.name}</div>
                  <h3 className="di-price-name">{pc.name}</h3>
                  <div className="di-price-value">{pc.price}</div>
                  {pc.description && <p className="di-price-desc">{pc.description}</p>}
                  <ul className="di-price-features">
                    {parseFeatures(pc.features).map(item => <li key={item}>{item}</li>)}
                  </ul>
                  <Link to={pc.cta_link || '/lien-he'} className={pc.is_featured ? 'btn-di-primary' : 'btn-di-secondary'} style={{ textAlign: 'center' }}>
                    {pc.cta_text || 'Yêu cầu demo'}
                  </Link>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 }} data-reveal="true">
              * Giá tham khảo, báo giá chính xác sau khi khảo sát yêu cầu thực tế
            </p>
          </div>
        </section>
      )}

      {/* FAQ — Accordion thật (details/summary, không cần JS) (mục H) */}
      {faqs.length > 0 && (
        <section className="di-sec-pad" id="faq" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="wd-container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div data-reveal="true" className="di-eyebrow">FAQ</div>
              <h2 data-reveal="true" className="di-title">Câu hỏi <em>thường gặp</em></h2>
              <p data-reveal="true" className="di-sub" style={{ margin: '0 auto' }}>
                Chưa tìm thấy câu trả lời bạn cần? <Link to="/lien-he" style={{ color: 'var(--accent)' }}>Liên hệ trực tiếp</Link> — đội ngũ kỹ thuật của chúng tôi luôn sẵn sàng giải đáp.
              </p>
            </div>
            <div className="di-faq-list" data-reveal="true">
              {faqs.map(f => (
                <details className="di-faq-item" key={f.id}>
                  <summary>{f.question} <span className="di-faq-icon">+</span></summary>
                  <p className="di-faq-a">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="di-sec-pad">
        <div className="wd-container">
          <div className="di-cta-section">
            <h2 className="di-cta-title">{settings.services_cta_title || ''}</h2>
            <p className="di-cta-sub">{settings.services_cta_sub || ''}</p>
            <Link to="/lien-he" className="btn-di-light">{settings.services_cta_button || 'Yêu cầu demo'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
