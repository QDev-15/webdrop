import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle, parseLines } from '../utils/text'

interface PricingPlan {
  id: number
  name: string
  price: string
  note: string
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

export default function ServicesPage() {
  const { settings } = useSite()
  const [pricing, setPricing] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useDocumentMeta({
    title: `Dịch vụ & Bảng giá — KHOA Design Studio`,
    description: settings.services_hero_sub,
  })

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPricing).catch(() => {})
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(() => {})
  }, [])

  const services = [1, 2, 3, 4].map(i => ({
    title: settings[`svc${i}_title`],
    desc: settings[`svc${i}_desc`],
  })).filter(s => s.title)

  return (
    <main>
      <section className="ptk-page-hero">
        <div className="ptk-container">
          <div className="ptk-crumb"><Link to="/">Trang chủ</Link> / Dịch vụ</div>
          <h1 className="ptk-page-title">{renderTitle(settings.services_hero_title)}</h1>
          <p className="ptk-page-sub">{settings.services_hero_sub}</p>
        </div>
      </section>

      {/* LIST-ELEGANT — 4 dịch vụ */}
      {services.length > 0 && (
        <section className="ptk-sec">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>{settings.services_eyebrow}</div>
            <h2 className="ptk-title" data-reveal style={{ marginBottom: 40 }}>{renderTitle(settings.services_title)}</h2>
            <ul className="ptk-list-elegant" data-reveal>
              {services.map((s, i) => (
                <li key={i}>
                  <div><div className="le-t">{s.title}</div><p className="le-p">{s.desc}</p></div>
                  <span className="le-n">{String(i + 1).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* PRICING — 3 tiers */}
      {pricing.length > 0 && (
        <section className="ptk-sec ptk-sec-line">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>{settings.pricing_eyebrow}</div>
            <h2 className="ptk-title" data-reveal style={{ marginBottom: 40 }}>{renderTitle(settings.pricing_title)}</h2>
            <div className="ptk-pricing" data-reveal>
              {pricing.map(pl => (
                <div className={`ptk-price-card${pl.is_featured ? ' hot' : ''}`} key={pl.id}>
                  {!!pl.is_featured && <div className="ptk-price-hot-tag">{pl.badge_text || 'Được chọn nhiều nhất'}</div>}
                  <div className="ptk-price-body">
                    <div className="ptk-price-name">{pl.name}</div>
                    <div className="ptk-price-val">{pl.price}</div>
                    <div className="ptk-price-note">{pl.note}</div>
                    <ul className="ptk-price-feats">
                      {parseLines(pl.features).map((f, fi) => <li key={fi}>{f}</li>)}
                    </ul>
                    <Link to={pl.cta_link || '/lien-he'} className={`ptk-btn${pl.is_featured ? ' ptk-btn-solid' : ''}`} style={{ width: '100%', justifyContent: 'center' }}>
                      {pl.cta_text || 'Chọn gói này'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {settings.pricing_note && (
              <p className="ptk-sub" data-reveal style={{ marginTop: 24 }}>
                {settings.pricing_note}{' '}
                <Link to="/lien-he" style={{ color: 'var(--accent)', fontWeight: 700 }}>{settings.pricing_note_link || 'Liên hệ để nhận báo giá riêng.'}</Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="ptk-sec">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>{settings.faq_eyebrow}</div>
            <h2 className="ptk-title" data-reveal style={{ marginBottom: 40 }}>{renderTitle(settings.faq_title)}</h2>
            <div className="ptk-faq" data-reveal>
              {faqs.map((f, i) => {
                const isOpen = openFaq === i
                return (
                  <div className={`ptk-faq-item${isOpen ? ' open' : ''}`} key={f.id}>
                    <button className="ptk-faq-q" onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen}>
                      <span className="ptk-faq-q-t">{f.question}</span>
                      <span className="ptk-faq-icon">+</span>
                    </button>
                    <div className="ptk-faq-a" style={isOpen ? { maxHeight: 500 } : undefined}>
                      <div className="ptk-faq-a-in">{f.answer}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="ptk-cta-band">
        <div className="ptk-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }} data-reveal>
          <h2 className="ptk-cta-h">{renderTitle(settings.cta_services_title)}</h2>
          <Link to="/lien-he" className="ptk-btn ptk-btn-white" style={{ borderColor: '#fff' }}>{settings.cta_services_button || 'Nhắn tin cho tôi'}</Link>
        </div>
      </section>
    </main>
  )
}
