import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

interface PricingPlan { id: number; name: string; description: string; price_monthly: number; price_yearly: number; is_featured: number; is_free: number; cta_text: string; cta_link: string; items: Array<{ item: string; available: number }> }
interface Faq { id: number; question: string; answer: string }

function formatPrice(p: number) {
  if (p === 0) return ''
  return p.toLocaleString('vi-VN')
}

export default function BangGia() {
  usePageTitle('Bảng giá')
  const { settings } = useSite()
  const [plans, setPlans]   = useState<PricingPlan[]>([])
  const [faqs, setFaqs]     = useState<Faq[]>([])
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing').then(setPlans).catch(() => {})
    api.get<Faq[]>('/public/faqs').then(setFaqs).catch(() => {})
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [plans, faqs])

  return (
    <>
      <section className="st-page-hero" aria-labelledby="bg-heading">
        <div className="wd-container">
          <div className="st-ph-inner">
            <div className="st-ph-badge"><span aria-hidden="true">💎</span> Bảng giá</div>
            <h1 className="st-ph-title" id="bg-heading">
              Đơn giản, minh bạch<br />không <em>phí ẩn</em>
            </h1>
            <p className="st-ph-sub">Bắt đầu miễn phí, nâng cấp khi cần. Hủy bất cứ lúc nào — không ràng buộc hợp đồng dài hạn.</p>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }} aria-labelledby="pricing-main-heading">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="st-pricing-toggle" role="group" aria-label="Chu kỳ thanh toán">
              <button className={`st-toggle-btn${billing === 'monthly' ? ' active' : ''}`} onClick={() => setBilling('monthly')}>Hàng tháng</button>
              <button className={`st-toggle-btn${billing === 'yearly' ? ' active' : ''}`} onClick={() => setBilling('yearly')}>
                Hàng năm <span className="st-toggle-badge">Tiết kiệm 20%</span>
              </button>
            </div>
          </div>
          <div className="st-pricing-grid">
            {plans.map(plan => (
              <div key={plan.id} className={`st-pricing-card${plan.is_featured ? ' featured' : ''}`} data-reveal>
                {plan.is_featured && <div className="st-pricing-hot-label">Phổ biến nhất</div>}
                <div className="st-pricing-tier">{plan.name}</div>
                <div className="st-price-wrap">
                  {plan.is_free ? (
                    <span className="st-price-amount" style={{ fontSize: 28, paddingBottom: 6 }}>Miễn phí</span>
                  ) : plan.price_monthly === 0 ? (
                    <span className="st-price-amount" style={{ fontSize: 26, letterSpacing: '-.5px', paddingBottom: 6 }}>Liên hệ báo giá</span>
                  ) : (
                    <>
                      <span className="st-price-amount">{formatPrice(billing === 'monthly' ? plan.price_monthly : plan.price_yearly)}</span>
                      <span className="st-price-unit">đ</span>
                    </>
                  )}
                </div>
                <div className="st-price-period">
                  {plan.is_free ? 'Vĩnh viễn miễn phí · Không cần thẻ tín dụng' :
                   plan.price_monthly === 0 ? 'Tùy chỉnh theo quy mô & nhu cầu' :
                   `/tháng · Thanh toán ${billing === 'monthly' ? 'hàng tháng' : `hàng năm`}`}
                </div>
                <div className="st-pricing-desc">{plan.description}</div>
                <ul className="st-pricing-feats">
                  {plan.items.map((item, j) => <li key={j} className={item.available ? '' : 'unavail'}>{item.item}</li>)}
                </ul>
                <Link to={plan.cta_link.startsWith('/') ? plan.cta_link : '/lien-he'} className="st-pricing-cta">{plan.cta_text}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }} aria-labelledby="compare-heading">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="st-section-badge"><span aria-hidden="true">📋</span> So sánh chi tiết</div>
            <h2 className="st-section-title" id="compare-heading">So sánh các gói <span className="st-grad-text">chi tiết</span></h2>
          </div>
          <div style={{ overflowX: 'auto' }} data-reveal>
            <table className="st-compare-table" aria-label="Bảng so sánh tính năng các gói">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Tính năng</th>
                  <th style={{ textAlign: 'center' }}>Starter</th>
                  <th style={{ textAlign: 'center', background: 'rgba(124,58,237,.08)' }}>Professional</th>
                  <th style={{ textAlign: 'center' }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Quy trình tự động', '5 quy trình', 'Không giới hạn', 'Không giới hạn'],
                  ['Người dùng', '3 người', '20 người', 'Không giới hạn'],
                  ['Lưu trữ dữ liệu', '1 GB', '50 GB', 'Không giới hạn'],
                  ['Tích hợp ứng dụng', '10+', '100+', 'Tùy chỉnh'],
                  ['Phân tích & báo cáo', 'Cơ bản', 'Nâng cao + AI', 'Toàn diện'],
                  ['AI Assistant', '—', '✓', '✓'],
                  ['API & Webhook', '—', '✓', '✓'],
                  ['Custom branding', '—', '—', '✓'],
                  ['On-premise deployment', '—', '—', '✓'],
                  ['Hỗ trợ', 'Email', 'Zalo + Email ưu tiên', '24/7 Dedicated'],
                  ['SLA Uptime', '99.5%', '99.9%', '99.99% (hợp đồng)'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td style={{ textAlign: 'center' }}><span className={row[1] === '—' ? 'st-cross' : row[1] === '✓' ? 'st-check' : ''} aria-label={row[1] === '—' ? 'Không' : row[1] === '✓' ? 'Có' : undefined}>{row[1]}</span></td>
                    <td style={{ textAlign: 'center', background: 'rgba(124,58,237,.05)' }}><span className={row[2] === '—' ? 'st-cross' : row[2] === '✓' ? 'st-check' : ''} aria-label={row[2] === '—' ? 'Không' : row[2] === '✓' ? 'Có' : undefined}>{row[2]}</span></td>
                    <td style={{ textAlign: 'center' }}><span className={row[3] === '—' ? 'st-cross' : row[3] === '✓' ? 'st-check' : ''} aria-label={row[3] === '—' ? 'Không' : row[3] === '✓' ? 'Có' : undefined}>{row[3]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }} aria-labelledby="faq-heading">
          <div className="wd-container">
            <div className="row">
              <div className="col-lg-4 mb-5 mb-lg-0" data-reveal>
                <div className="st-section-badge"><span aria-hidden="true">❓</span> FAQ</div>
                <h2 className="st-section-title" id="faq-heading">Câu hỏi<br /><span className="st-grad-text">thường gặp</span></h2>
                <p className="st-section-sub" style={{ marginBottom: 24 }}>Không tìm thấy câu trả lời? Liên hệ đội hỗ trợ của chúng tôi.</p>
                <Link to="/lien-he" className="st-btn-primary">Liên hệ hỗ trợ</Link>
              </div>
              <div className="col-lg-8" data-reveal>
                {faqs.map(faq => (
                  <div key={faq.id} className="st-faq-item">
                    <div className="st-faq-q" onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} style={{ cursor: 'pointer' }}>
                      {faq.question}
                      <span className="st-faq-icon" aria-hidden="true">{openFaq === faq.id ? '−' : '+'}</span>
                    </div>
                    {openFaq === faq.id && <div className="st-faq-a">{faq.answer}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TRUST BADGES */}
      <section className="sec-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)' }} aria-label="Đảm bảo chất lượng">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="st-section-title" style={{ fontSize: 'clamp(22px,2.5vw,32px)' }}>Cam kết của chúng tôi với bạn</div>
          </div>
          <div className="row g-4" data-reveal>
            {[
              { icon: '🛡', title: 'Bảo mật ISO 27001', desc: 'Tiêu chuẩn bảo mật quốc tế được chứng nhận' },
              { icon: '⏰', title: 'Uptime 99.9%', desc: 'SLA đảm bảo với khoản bồi thường nếu vi phạm' },
              { icon: '💬', title: 'Hỗ trợ tiếng Việt', desc: 'Đội ngũ Việt Nam, phản hồi trong vài phút' },
              { icon: '🔄', title: 'Hoàn tiền 30 ngày', desc: 'Không hài lòng? Hoàn tiền 100% trong 30 ngày đầu' },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-3 text-center">
                <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="st-cta-section sec-pad" aria-labelledby="bg-cta-heading">
        <div className="wd-container">
          <div className="st-cta-inner" data-reveal>
            <h2 className="st-cta-title" id="bg-cta-heading">
              Bắt đầu hành trình<br /><span className="st-grad-text">tự động hóa ngay hôm nay</span>
            </h2>
            <p className="st-cta-sub">Tham gia cùng {settings.stat_customers}+ doanh nghiệp Việt Nam đang sử dụng {settings.site_name} để vận hành thông minh hơn.</p>
            <div className="st-hero-ctas" style={{ justifyContent: 'center' }}>
              <Link to="/lien-he" className="st-btn-primary">Dùng thử miễn phí 14 ngày</Link>
              <Link to="/lien-he" className="st-btn-ghost">Nói chuyện với team sales</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
