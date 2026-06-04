import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'

interface Feature { id: number; name: string; icon: string; description: string; featured: number }
interface Testimonial { id: number; author_name: string; author_title: string; author_avatar: string; content: string; rating: number }
interface PricingPlan { id: number; name: string; description: string; price_monthly: number; price_yearly: number; is_featured: number; is_free: number; cta_text: string; cta_link: string; items: Array<{ item: string; available: number }> }

function formatPrice(p: number) {
  if (p === 0) return ''
  return p.toLocaleString('vi-VN')
}

export default function Home() {
  const { settings } = useSite()
  const [features, setFeatures]   = useState<Feature[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [plans, setPlans]         = useState<PricingPlan[]>([])
  const [billing, setBilling]     = useState<'monthly' | 'yearly'>('monthly')
  const [ctaEmail, setCtaEmail]   = useState('')
  const [ctaMsg, setCtaMsg]       = useState('')
  useEffect(() => {
    api.get<Feature[]>('/public/features').then(setFeatures).catch(() => {})
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {})
    api.get<PricingPlan[]>('/public/pricing').then(setPlans).catch(() => {})
  }, [])

  // Reveal animation
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  })

  const trustedBy = (settings.trusted_by || 'Shopee,Grab,Tiki,MoMo,VNG Corp,Zalo').split(',').filter(Boolean)

  const bento = features.slice(0, 6)

  async function handleCtaSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.post('/public/contact', { name: 'Đăng ký dùng thử', email: ctaEmail, message: 'Đăng ký dùng thử từ trang chủ' })
      setCtaMsg('Cảm ơn! Chúng tôi sẽ liên hệ trong 24 giờ.')
      setCtaEmail('')
    } catch { setCtaMsg('Có lỗi xảy ra. Vui lòng thử lại.') }
  }

  return (
    <>
      {/* HERO */}
      <section className="st-hero" aria-label="Giới thiệu sản phẩm">
        <div className="st-blob st-blob-1" aria-hidden="true"></div>
        <div className="st-blob st-blob-2" aria-hidden="true"></div>
        <div className="st-blob st-blob-3" aria-hidden="true"></div>
        <div className="wd-container">
          <div className="st-hero-inner">
            <div className="st-hero-text">
              <div className="st-badge" data-reveal>
                <span className="st-badge-dot" aria-hidden="true"></span>
                {settings.hero_badge}
              </div>
              <h1 className="st-hero-heading" data-reveal>
                <em style={{ fontStyle: 'normal', background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {settings.hero_heading}
                </em>
              </h1>
              <p className="st-hero-sub" data-reveal>{settings.hero_sub}</p>
              <div className="st-hero-ctas" data-reveal>
                <Link to="/bang-gia" className="st-btn-primary">
                  Dùng thử miễn phí
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link to="/san-pham" className="st-btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/>
                  </svg>
                  Xem demo
                </Link>
              </div>
              <div className="st-social-proof" data-reveal>
                <div className="st-avatars" aria-label="Người dùng đại diện">
                  <span aria-hidden="true">T</span>
                  <span aria-hidden="true">H</span>
                  <span aria-hidden="true">M</span>
                  <span aria-hidden="true">A</span>
                </div>
                <div className="st-proof-text">
                  Được <strong>{settings.stat_customers} công ty</strong> tin dùng trên toàn quốc<br />
                  <span style={{ color: '#f59e0b' }}>★★★★★</span> <span style={{ fontSize: 12 }}>4.9/5 đánh giá trung bình</span>
                </div>
              </div>
            </div>

            {/* App Mockup */}
            <div className="st-hero-visual" aria-hidden="true">
              <div className="st-mockup-wrap" style={{ position: 'relative' }}>
                <div className="st-mockup-topbar">
                  <span className="mock-dot mock-dot-r"></span>
                  <span className="mock-dot mock-dot-y"></span>
                  <span className="mock-dot mock-dot-g"></span>
                  <span style={{ marginLeft: 10, fontSize: 11, color: 'rgba(200,200,240,.4)' }}>{settings.site_name} Dashboard</span>
                </div>
                <div className="st-mockup-body">
                  <div className="mock-stat-row">
                    <div className="mock-stat"><div className="mock-stat-num">{settings.stat_customers}</div><div className="mock-stat-lbl">Người dùng</div></div>
                    <div className="mock-stat"><div className="mock-stat-num">40%</div><div className="mock-stat-lbl">Tăng trưởng</div></div>
                    <div className="mock-stat"><div className="mock-stat-num">200ms</div><div className="mock-stat-lbl">Tốc độ xử lý</div></div>
                  </div>
                  <div className="mock-chart-area">
                    <div className="mock-chart-label">Hiệu suất theo tháng</div>
                    <div className="mock-bars">
                      {[40, 65, 52, 80, 70, 90, 75].map((h, i) => (
                        <div key={i} className="mock-bar-item" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="mock-list">
                    {[{ icon: '⚡', label: 'Tự động hóa' }, { icon: '📊', label: 'Analytics' }, { icon: '🔗', label: 'Tích hợp' }].map((item, i) => (
                      <div key={i} className="mock-list-item">
                        <div className="mock-list-icon">{item.icon}</div>
                        <div className="mock-list-lines">
                          <div className="mock-line w80"></div>
                          <div className="mock-line w50"></div>
                        </div>
                        <span className="mock-badge-pill">LIVE</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="st-float-badge">
                  <div className="float-badge-icon" aria-hidden="true">🚀</div>
                  <div className="float-badge-text">
                    <div className="float-badge-title">+1,200 tác vụ tự động hôm nay</div>
                    <div className="float-badge-sub">Vừa cập nhật 2 phút trước</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="st-trusted" aria-label="Thống kê nền tảng">
        <div className="wd-container">
          <div className="st-stats-row" data-reveal>
            <div className="st-stat-item">
              <div className="st-stat-num">{settings.stat_customers}</div>
              <div className="st-stat-lbl">Khách hàng đang dùng</div>
            </div>
            <div className="st-stat-item">
              <div className="st-stat-num">{settings.stat_uptime}</div>
              <div className="st-stat-lbl">Uptime đảm bảo</div>
            </div>
            <div className="st-stat-item">
              <div className="st-stat-num">{settings.stat_integrations}</div>
              <div className="st-stat-lbl">Tích hợp sẵn có</div>
            </div>
            <div className="st-stat-item">
              <div className="st-stat-num">{settings.stat_support}</div>
              <div className="st-stat-lbl">Hỗ trợ kỹ thuật</div>
            </div>
          </div>
          <div className="st-clients-strip" data-reveal>
            <div className="st-clients-label">Được tin dùng bởi</div>
            <div className="st-client-logos">
              {trustedBy.map((name, i) => <span key={i} className="st-client-name">{name}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — BENTO GRID */}
      {bento.length > 0 && (
        <section className="st-features sec-pad" aria-labelledby="feat-heading">
          <div className="wd-container">
            <div className="text-center" data-reveal>
              <div className="st-section-badge"><span aria-hidden="true">⚙</span> Tính năng</div>
              <h2 className="st-section-title" id="feat-heading">
                Mọi thứ bạn cần<br />trong một <span className="st-grad-text">nền tảng</span>
              </h2>
              <p className="st-section-sub" style={{ margin: '0 auto' }}>
                Từ tự động hóa đến phân tích chuyên sâu — {settings.site_name} mang đến toàn bộ công cụ giúp doanh nghiệp vận hành hiệu quả hơn mỗi ngày.
              </p>
            </div>
            <div className="st-bento">
              {bento[0] && (
                <div className="st-bento-item span-2" data-reveal>
                  <div className="st-glass st-feat-large">
                    <div className="st-feat-icon" aria-hidden="true">{bento[0].icon}</div>
                    <div className="st-feat-title">{bento[0].name}</div>
                    <div className="st-feat-desc">{bento[0].description}</div>
                    <div className="st-feat-visual" aria-hidden="true">
                      {[55,75,45,90,65,80].map((h,i) => <div key={i} className="feat-mini-bar" style={{ height: `${h}%` }}></div>)}
                    </div>
                  </div>
                </div>
              )}
              {bento[1] && (
                <div className="st-bento-item span-2-row" data-reveal>
                  <div className="st-glass" style={{ height: '100%' }}>
                    <div className="st-feat-icon" aria-hidden="true">{bento[1].icon}</div>
                    <div className="st-feat-title">{bento[1].name}</div>
                    <div className="st-feat-desc">{bento[1].description}</div>
                  </div>
                </div>
              )}
              {bento.slice(2).map((f) => (
                <div key={f.id} className="st-bento-item" data-reveal>
                  <div className="st-glass">
                    <div className="st-feat-icon" aria-hidden="true">{f.icon}</div>
                    <div className="st-feat-title">{f.name}</div>
                    <div className="st-feat-desc">{f.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="st-how sec-pad" aria-labelledby="how-heading">
        <div className="wd-container st-how-inner">
          <div className="text-center" data-reveal>
            <div className="st-section-badge"><span aria-hidden="true">🗺</span> Quy trình</div>
            <h2 className="st-section-title" id="how-heading">
              Bắt đầu chỉ trong<br /><span className="st-grad-text">3 bước đơn giản</span>
            </h2>
            <p className="st-section-sub" style={{ margin: '0 auto' }}>
              Không cần cài đặt phức tạp, không cần đội IT riêng. Doanh nghiệp bạn có thể hoạt động trên {settings.site_name} ngay trong ngày đầu tiên.
            </p>
          </div>
          <div className="st-steps">
            {[
              { num: '01', title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản miễn phí trong 60 giây. Không cần thẻ tín dụng, không cam kết dài hạn — thử nghiệm toàn bộ tính năng trong 14 ngày.' },
              { num: '02', title: 'Thiết lập & Tích hợp', desc: 'Kết nối các công cụ hiện có của bạn, nhập dữ liệu và cấu hình quy trình với hướng dẫn từng bước từ đội hỗ trợ.' },
              { num: '03', title: 'Tăng tốc vận hành', desc: 'Hệ thống tự động xử lý, bạn chỉ cần giám sát qua dashboard. Tiết kiệm thời gian, giảm sai sót và tăng năng suất ngay từ tuần đầu.' },
            ].map((s, i) => (
              <div key={i} className="st-step" data-reveal>
                <div className="st-step-num" aria-label={`Bước ${i + 1}`}>{s.num}</div>
                <div className="st-step-title">{s.title}</div>
                <div className="st-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="st-reviews sec-pad" aria-labelledby="review-heading">
          <div className="wd-container">
            <div className="text-center" data-reveal>
              <div className="st-section-badge"><span aria-hidden="true">★</span> Đánh giá</div>
              <h2 className="st-section-title" id="review-heading">
                Khách hàng nói gì về<br /><span className="st-grad-text">{settings.site_name}</span>
              </h2>
            </div>
            <div className="st-review-grid">
              {testimonials.map((t) => (
                <div key={t.id} className="st-review-card" data-reveal>
                  <div className="st-stars" aria-label={`${t.rating} sao`}>
                    {'★'.repeat(t.rating).split('').map((s, j) => <span key={j} className="st-star">{s}</span>)}
                  </div>
                  <p className="st-review-quote">"{t.content}"</p>
                  <div className="st-review-author">
                    {t.author_avatar
                      ? <img src={t.author_avatar} alt={t.author_name} className="st-avatar" width={40} height={40} />
                      : <div className="st-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--accent-mid)' }}>{t.author_name[0]}</div>
                    }
                    <div>
                      <div className="st-author-name">{t.author_name}</div>
                      <div className="st-author-role">{t.author_title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRICING PREVIEW */}
      {plans.length > 0 && (
        <section className="st-pricing sec-pad" aria-labelledby="price-heading">
          <div className="wd-container">
            <div className="text-center" data-reveal>
              <div className="st-section-badge"><span aria-hidden="true">💎</span> Bảng giá</div>
              <h2 className="st-section-title" id="price-heading">
                Phù hợp với mọi<br /><span className="st-grad-text">quy mô doanh nghiệp</span>
              </h2>
              <p className="st-section-sub" style={{ margin: '0 auto 24px' }}>Bắt đầu miễn phí, nâng cấp khi cần. Không ràng buộc hợp đồng dài hạn.</p>
              <div className="st-pricing-toggle" role="group" aria-label="Chu kỳ thanh toán">
                <button className={`st-toggle-btn${billing === 'monthly' ? ' active' : ''}`} onClick={() => setBilling('monthly')}>Hàng tháng</button>
                <button className={`st-toggle-btn${billing === 'yearly' ? ' active' : ''}`} onClick={() => setBilling('yearly')}>
                  Hàng năm <span className="st-toggle-badge">-20%</span>
                </button>
              </div>
            </div>
            <div className="st-pricing-grid">
              {plans.map((plan) => (
                <div key={plan.id} className={`st-pricing-card${plan.is_featured ? ' featured' : ''}`} data-reveal>
                  {plan.is_featured && <div className="st-pricing-hot-label">Phổ biến nhất</div>}
                  <div className="st-pricing-tier">{plan.name}</div>
                  <div className="st-price-wrap">
                    {plan.is_free ? (
                      <span className="st-price-amount" style={{ fontSize: 28, paddingBottom: 6 }}>Miễn phí</span>
                    ) : plan.price_monthly === 0 ? (
                      <span className="st-price-amount" style={{ fontSize: 28, paddingBottom: 6 }}>Liên hệ</span>
                    ) : (
                      <>
                        <span className="st-price-amount">{formatPrice(billing === 'monthly' ? plan.price_monthly : plan.price_yearly)}</span>
                        <span className="st-price-unit">đ</span>
                      </>
                    )}
                  </div>
                  <div className="st-price-period">
                    {plan.is_free ? 'Vĩnh viễn miễn phí' : plan.price_monthly === 0 ? 'Báo giá theo nhu cầu' : `/tháng · Thanh toán ${billing === 'monthly' ? 'hàng tháng' : 'hàng năm'}`}
                  </div>
                  <div className="st-pricing-desc">{plan.description}</div>
                  <ul className="st-pricing-feats">
                    {plan.items.map((item, j) => (
                      <li key={j} className={item.available ? '' : 'unavail'}>{item.item}</li>
                    ))}
                  </ul>
                  <Link to={plan.cta_link.startsWith('/') ? plan.cta_link : '/lien-he'} className="st-pricing-cta">{plan.cta_text}</Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-4" data-reveal>
              <Link to="/bang-gia" style={{ fontSize: 14, color: 'var(--accent-mid)', textDecoration: 'underline' }}>Xem so sánh chi tiết các gói →</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="st-cta-section sec-pad" aria-labelledby="cta-heading">
        <div className="wd-container">
          <div className="st-cta-inner" data-reveal>
            <div className="st-section-badge" style={{ margin: '0 auto 16px' }}>
              <span aria-hidden="true">🎯</span> Bắt đầu ngay hôm nay
            </div>
            <h2 className="st-cta-title" id="cta-heading">
              Dùng thử miễn phí<br />14 ngày đầy đủ tính năng
            </h2>
            <p className="st-cta-sub">
              Không cần thẻ tín dụng. Không cần cài đặt phức tạp. Chỉ cần email — bạn đã có toàn bộ sức mạnh của {settings.site_name}.
            </p>
            {ctaMsg ? (
              <div className="contact-success">{ctaMsg}</div>
            ) : (
              <form className="st-cta-form" onSubmit={handleCtaSubmit} aria-label="Đăng ký dùng thử">
                <input type="email" className="st-cta-input" placeholder="Email công ty của bạn" value={ctaEmail} onChange={e => setCtaEmail(e.target.value)} required aria-label="Email đăng ký" />
                <button type="submit" className="st-cta-submit">Bắt đầu miễn phí</button>
              </form>
            )}
            <div className="st-cta-note">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1a6 6 0 100 12A6 6 0 007 1zm0 5.5V10M7 4h.007" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Không cần thẻ tín dụng · Hủy bất cứ lúc nào · Hỗ trợ tiếng Việt
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
