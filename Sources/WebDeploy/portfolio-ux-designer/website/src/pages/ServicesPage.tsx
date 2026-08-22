import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle, parseLines } from '../utils/text'

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

  useDocumentMeta({
    title: `Dịch vụ — ${settings.site_name || 'Đỗ Khánh Linh'} | Product Designer`,
    description: settings.services_hero_sub,
  })

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPricing).catch(() => {})
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(() => {})
  }, [])

  const feats = [1, 2, 3, 4, 5, 6].map(i => ({
    icon: settings[`feat${i}_icon`],
    title: settings[`feat${i}_title`],
    desc: settings[`feat${i}_desc`],
  })).filter(f => f.title)

  return (
    <main>
      <section className="pux-page-hero">
        <span className="blob blob-a"></span>
        <span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="pux-crumb"><Link to="/">Trang chủ</Link> / Dịch vụ</div>
          <div className="eyebrow eyebrow-light" data-reveal>{settings.services_hero_eyebrow || 'Dịch vụ'}</div>
          <h1 className="sec-title on-dark" style={{ maxWidth: 640 }} data-reveal>{renderTitle(settings.services_hero_title || 'Từ audit nhanh đến *thiết kế sản phẩm trọn gói.*')}</h1>
          <p className="sec-sub on-dark" data-reveal data-reveal-d1>{settings.services_hero_sub}</p>
        </div>
      </section>

      {/* DỊCH VỤ — FEATURE-ICON-ROW */}
      {feats.length > 0 && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="row g-5">
              {feats.map((f, i) => (
                <div className="col-lg-4" data-reveal data-reveal-d1={i % 3 === 1 ? true : undefined} data-reveal-d2={i % 3 === 2 ? true : undefined} key={i}>
                  <div className="pux-feat">
                    <div className="pux-feat-icon">{f.icon}</div>
                    <div>
                      <div className="pux-feat-title">{f.title}</div>
                      <div className="pux-feat-desc">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BẢNG GIÁ */}
      {pricing.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center mb-5">
              <div className="eyebrow justify-content-center" style={{ display: 'flex' }} data-reveal>Bảng giá</div>
              <h2 className="sec-title" data-reveal>Chọn gói phù hợp <em>với giai đoạn sản phẩm.</em></h2>
              <p className="sec-sub mx-auto" data-reveal data-reveal-d1>{settings.pricing_sub}</p>
            </div>
            <div className="row g-4 align-items-stretch">
              {pricing.map((pkg, i) => (
                <div className="col-lg-4" data-reveal data-reveal-d1={i === 1 ? true : undefined} data-reveal-d2={i === 2 ? true : undefined} key={pkg.id}>
                  <div className={`pux-price-card${pkg.is_featured ? ' hot' : ''}`}>
                    {!!pkg.is_featured && <div className="pux-price-hot-label">{pkg.tag || 'Phổ biến nhất'}</div>}
                    <div className="pux-price-tier">{pkg.name}</div>
                    <div className="pux-price-amount">{pkg.price} <span>{pkg.unit}</span></div>
                    <ul className="pux-price-list">
                      {parseLines(pkg.features).map((f, fi) => <li key={fi}>{f}</li>)}
                    </ul>
                    <Link to={pkg.cta_link || '/lien-he'} className={`pux-btn pux-btn-block${pkg.is_featured ? ' pux-btn-accent' : ' pux-btn-ghost'}`}>
                      {pkg.cta_text || 'Chọn gói này'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="sec-pad" id="faq">
          <div className="wd-container">
            <div className="row g-5">
              <div className="col-lg-4" data-reveal>
                <div className="eyebrow">{settings.faq_eyebrow || 'Câu hỏi thường gặp'}</div>
                <h2 className="sec-title">{renderTitle(settings.faq_title || 'Còn thắc mắc? *Xem giải đáp bên dưới.*')}</h2>
                <p className="sec-sub">{settings.faq_sub || 'Không tìm thấy câu trả lời bạn cần? '}<Link to="/lien-he" style={{ color: 'var(--accent)', fontWeight: 600 }}>Liên hệ trực tiếp</Link></p>
              </div>
              <div className="col-lg-8" data-reveal data-reveal-d1>
                {faqs.map((f, i) => (
                  <details className="pux-faq-item" open={i === 0} key={f.id}>
                    <summary>{f.question} <span className="pux-faq-icon">+</span></summary>
                    <p className="pux-faq-a">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="sec-dark" style={{ padding: 'clamp(64px,9vw,100px) 0' }}>
        <div className="wd-container text-center">
          <div className="eyebrow eyebrow-light justify-content-center" style={{ display: 'flex' }} data-reveal>{settings.cta_services_eyebrow || 'Bắt đầu dự án'}</div>
          <h2 className="sec-title on-dark" data-reveal>{renderTitle(settings.cta_services_title || 'Sẵn sàng thiết kế lại *trải nghiệm sản phẩm của bạn?*')}</h2>
          <p className="sec-sub on-dark mx-auto" data-reveal data-reveal-d1>{settings.cta_services_sub}</p>
          <div className="mt-4" data-reveal data-reveal-d2>
            <Link to="/lien-he" className="pux-btn pux-btn-accent">Đặt lịch trao đổi →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
