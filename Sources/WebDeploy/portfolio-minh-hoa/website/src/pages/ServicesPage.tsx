import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

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

function renderText(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return <span key={i}>{part}</span>
  })
}

export default function ServicesPage() {
  const { settings } = useSite()
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useDocumentMeta({
    title: `Dịch vụ & Bảng giá — ${settings.site_name || 'Lam Trúc Illustration'}`,
    description: settings.services_hero_sub || 'Các gói dịch vụ minh họa của Lam Trúc — minh họa đơn, bộ nhân vật, trọn dự án sách thiếu nhi.',
  })

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPlans).catch(() => {})
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(() => {})
  }, [])

  const serviceFeatures = [1, 2, 3, 4].map(i => ({
    icon: settings[`service_feature${i}_icon`] || '◆',
    title: settings[`service_feature${i}_title`] || '',
    text: settings[`service_feature${i}_text`] || '',
  }))

  const processSteps = [1, 2, 3, 4, 5].map(i => ({
    title: settings[`process${i}_title`] || '',
    text: settings[`process${i}_text`] || '',
    time: settings[`process${i}_time`] || '',
  }))

  return (
    <>
      <section className="pmh-page-hero">
        <div className="pmh-container inner">
          <div className="pmh-crumb"><Link to="/">Trang chủ</Link> / Dịch vụ</div>
          <h1>{renderText(settings.services_hero_title || 'Dịch vụ & *Bảng giá*')}</h1>
          <p>{settings.services_hero_sub}</p>
        </div>
      </section>

      {/* Điều bạn luôn nhận được */}
      <section className="pmh-sec-sm">
        <div className="pmh-container">
          <div className="pmh-sec-head" data-reveal>
            <div className="pmh-label">{settings.services_feat_label || 'Cam kết'}</div>
            <h2 className="pmh-sec-title">{renderText(settings.services_feat_title || 'Điều bạn *luôn nhận được*')}</h2>
          </div>
          <div className="pmh-feature-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {serviceFeatures.map((f, i) => (
              <div className="pmh-feature-item" key={i} data-reveal={`d${i + 1}`}>
                <div className="pmh-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section className="pmh-sec-sm" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="pmh-container-sm">
          <div className="pmh-sec-head" data-reveal>
            <div className="pmh-label">{settings.process_label || 'Quy trình'}</div>
            <h2 className="pmh-sec-title">{renderText(settings.process_title || '5 bước *làm việc chung*')}</h2>
          </div>
          <div className="pmh-list-elegant" data-reveal>
            {processSteps.map((step, i) => (
              <div className="pmh-list-row" key={i}>
                <div className="l"><span className="idx">{String(i + 1).padStart(2, '0')}</span><div><h4>{step.title}</h4><p>{step.text}</p></div></div>
                <span className="r">{step.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-sec-head center" data-reveal>
            <div className="pmh-label">{settings.pricing_label || 'Bảng giá'}</div>
            <h2 className="pmh-sec-title">{renderText(settings.pricing_title || 'Chọn gói *phù hợp với bạn*')}</h2>
            <p className="pmh-sec-sub">{settings.pricing_sub}</p>
          </div>
          <div className="pmh-pricing-grid">
            {plans.map((p, i) => (
              <div className={`pmh-pcard-price${p.is_featured ? ' hot' : ''}`} key={p.id} data-reveal={`d${i + 1}`}>
                {!!p.is_featured && <span className="hot-tag">{p.badge_text}</span>}
                <div className="pname">{p.name}</div>
                <div className="pprice">{p.price}</div>
                <div className="pnote">{p.unit}</div>
                <ul>
                  {(p.features || '').split(/\r?\n/).filter(Boolean).map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <Link to={p.cta_link || '/lien-he'} className={`pmh-btn ${p.is_featured ? 'pmh-btn-primary' : 'pmh-btn-outline'}`}>{p.cta_text}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pmh-sec pmh-halftone" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)' }}>
        <div className="pmh-container">
          <div className="pmh-sec-head" data-reveal>
            <div className="pmh-label">{settings.faq_label || 'Câu hỏi thường gặp'}</div>
            <h2 className="pmh-sec-title">{renderText(settings.faq_title || 'Trước khi *bắt đầu dự án*')}</h2>
          </div>
          <div className="pmh-faq" data-reveal>
            {faqs.map(f => (
              <div className={`pmh-faq-item${openFaq === f.id ? ' open' : ''}`} key={f.id}>
                <button type="button" className="pmh-faq-q" onClick={() => setOpenFaq(o => o === f.id ? null : f.id)}>
                  <span>{f.question}</span><span className="ic">+</span>
                </button>
                <div className="pmh-faq-a" style={{ maxHeight: openFaq === f.id ? '600px' : undefined }}>
                  <div className="pmh-faq-a-inner">{f.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pmh-sec-sm">
        <div className="pmh-container">
          <div className="pmh-cta-band" data-reveal>
            <div className="inner">
              <h2>{settings.services_cta_title}</h2>
              <p>{settings.services_cta_text}</p>
              <div className="pmh-cta-row">
                <Link to="/lien-he" className="pmh-btn pmh-btn-white">Nhận tư vấn miễn phí</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
