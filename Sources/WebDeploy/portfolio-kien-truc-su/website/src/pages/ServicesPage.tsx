import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle, parseLines } from '../utils/text'

// FAQ item riêng — dùng ref đo scrollHeight thật để max-height khớp chính xác nội dung
// (giống hành vi gốc template: a.style.maxHeight = a.scrollHeight + 'px'), tránh clip câu trả lời dài.
function FaqAccordionItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState(0)

  useEffect(() => {
    if (isOpen && innerRef.current) {
      setMaxHeight(innerRef.current.scrollHeight)
    }
  }, [isOpen, answer])

  return (
    <div className={`pkt-faq-item${isOpen ? ' open' : ''}`}>
      <button className="pkt-faq-q" onClick={onToggle}>
        {question}
        <span className="pkt-faq-icon"></span>
      </button>
      <div className="pkt-faq-a" style={{ maxHeight: isOpen ? maxHeight : 0 }}>
        <div className="pkt-faq-a-inner" ref={innerRef}>{answer}</div>
      </div>
    </div>
  )
}

interface PricingPlan {
  id: number
  name: string
  tag: string
  price: string
  unit: string
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

export default function ServicesPage() {
  const { settings } = useSite()
  const [pricing, setPricing] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useDocumentMeta({
    title: `Dịch vụ — ${settings.site_name || 'Tuấn Đặng Studio'}`,
    description: settings.services_hero_sub,
  })

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPricing).catch(() => {})
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(items => {
      setFaqs(items)
      if (items.length > 0) setOpenFaq(items[0].id)
    }).catch(() => {})
  }, [])

  const steps = [1, 2, 3].map(i => ({
    title: settings[`process${i}_title`],
    desc: settings[`process${i}_desc`],
  })).filter(s => s.title)

  return (
    <main>
      <section className="pkt-page-hero sec-light">
        <div className="pkt-container">
          <div className="pkt-eyebrow" data-reveal>Dịch vụ</div>
          <h1 data-reveal>{renderTitle(settings.services_hero_title || 'Ba gói dịch vụ, *một cam kết*')}</h1>
          <p data-reveal data-reveal-d1>{settings.services_hero_sub}</p>
        </div>
      </section>

      {/* FEATURE ROW — quy trình */}
      {steps.length > 0 && (
        <section className="sec-pad-sm sec-light" style={{ paddingTop: 0 }}>
          <div className="pkt-container">
            <div className="pkt-feature-row">
              {steps.map((s, i) => (
                <div className="pkt-feature" data-reveal data-reveal-d1={i === 1 ? true : undefined} data-reveal-d2={i === 2 ? true : undefined} key={i}>
                  <span className="pkt-feature-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRICING TABLE */}
      {pricing.length > 0 && (
        <section className="sec-pad sec-surface">
          <div className="pkt-container">
            <div className="pkt-sec-head center" data-reveal>
              <div className="pkt-eyebrow center">Bảng giá dịch vụ</div>
              <h2 className="pkt-sec-title">Chọn gói <em>phù hợp với bạn</em></h2>
              <p className="pkt-sec-sub">{settings.pricing_sub}</p>
            </div>

            <div className="pkt-pricing-grid" data-reveal>
              {pricing.map(pkg => (
                <div className={`pkt-pricing-card${pkg.is_featured ? ' featured' : ''}`} key={pkg.id}>
                  <div className="pkt-pricing-tag">{pkg.tag}</div>
                  <div className="pkt-pricing-name">{pkg.name}</div>
                  <div className="pkt-pricing-price"><b>{pkg.price}</b> {pkg.unit}</div>
                  <ul className="pkt-pricing-list">
                    {parseLines(pkg.features).map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                  <Link to={pkg.cta_link || '/lien-he'} className={`pkt-btn${pkg.is_featured ? ' pkt-btn-accent' : ''}`}>
                    {pkg.cta_text || 'Chọn gói này'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="sec-pad sec-light">
          <div className="pkt-container-narrow">
            <div className="pkt-sec-head" data-reveal>
              <div className="pkt-eyebrow">Câu hỏi thường gặp</div>
              <h2 className="pkt-sec-title">Những điều bạn <em>cần biết trước</em></h2>
            </div>

            <div data-reveal data-reveal-d1>
              {faqs.map(f => (
                <FaqAccordionItem
                  key={f.id}
                  question={f.question}
                  answer={f.answer}
                  isOpen={openFaq === f.id}
                  onToggle={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pkt-cta-band sec-surface">
        <div className="pkt-container-narrow" data-reveal>
          <div className="pkt-eyebrow center">{settings.cta_services_eyebrow || 'Vẫn còn băn khoăn?'}</div>
          <h2>{renderTitle(settings.cta_services_title || 'Đặt một buổi *tư vấn miễn phí 30 phút*')}</h2>
          <Link to="/lien-he" className="pkt-btn pkt-btn-accent">
            Đặt lịch ngay
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
