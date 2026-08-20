import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  tags: string
  featured: number
}

interface Faq {
  id: number
  question: string
  answer: string
}

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

export default function ServicesPage() {
  useDocumentMeta({
    title: 'Dịch vụ — Agency Sáng Tạo',
    description: 'Các dịch vụ agency cung cấp tại Agency Sáng Tạo: branding, thiết kế, digital marketing và creative toàn diện cho thương hiệu của bạn.',
  })
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)
  const [faqs, setFaqs]         = useState<Faq[]>([])
  const [plans, setPlans]       = useState<PricingPlan[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(console.error)
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPlans).catch(console.error)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [services, faqs, plans])

  const featuredServices = services.filter(s => s.featured)

  return (
    <main>
      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <div className="ag-ph-label" data-reveal>Dịch vụ sáng tạo</div>
          <h1 className="ag-ph-title" data-reveal>
            <span className="outline">WHAT WE</span><br/>DO BEST
          </h1>
          <p className="ag-ph-sub" data-reveal>Ba lĩnh vực cốt lõi — một quy trình nhất quán — kết quả vượt kỳ vọng. Chúng tôi không chỉ thiết kế, chúng tôi xây dựng thương hiệu.</p>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {featuredServices.length > 0 && (
            <div className="row g-4 mb-5" data-reveal>
              {featuredServices.map((svc, idx) => (
                <div key={svc.id} className="col-md-4">
                  <div className="text-center" style={{ padding: '24px 0', ...(idx === 1 ? { borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' } : {}) }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>0{idx + 1}</div>
                    <h2 style={{ fontFamily: 'var(--heading)', fontSize: '22px', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '8px' }}>{svc.name}</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.7' }}>{svc.description.substring(0, 80)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr className="ag-divider" style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }} />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>Đang tải...</div>
          ) : (
            <div className="row g-4">
              {services.map((svc) => (
                <div key={svc.id} className="col-lg-4 col-md-6" data-reveal>
                  <div className="ag-svc-card">
                    <div className="ag-svc-icon" aria-hidden="true">{svc.icon || '◆'}</div>
                    <h3 className="ag-svc-card-title">{svc.name}</h3>
                    <p className="ag-svc-card-desc">{svc.description}</p>
                    {svc.tags && (
                      <ul className="ag-svc-list">
                        {svc.tags.split(',').slice(0, 4).map((tag, i) => (
                          <li key={i}>{tag.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="ag-process-section">
        <div className="wd-container">
          <div className="ag-process-header" data-reveal>
            <div className="ag-section-label">Quy trình làm việc</div>
            <h2 className="ag-section-title">Từ brief đến <em>kết quả</em></h2>
          </div>
        </div>
        <div className="ag-process-track">
          {[
            { num: '01', name: 'Brief & Discovery', desc: 'Tiếp nhận brief và tổ chức buổi discovery workshop để hiểu sâu về thương hiệu, mục tiêu kinh doanh và đối tượng mục tiêu.' },
            { num: '02', name: 'Research & Strategy', desc: 'Phân tích thị trường, đối thủ cạnh tranh và xu hướng. Xây dựng chiến lược rõ ràng làm nền tảng cho toàn bộ dự án.' },
            { num: '03', name: 'Concept & Design', desc: 'Phát triển 2-3 concept khác nhau, trình bày và lấy feedback. Tinh chỉnh cho đến khi đạt kết quả tối ưu.' },
            { num: '04', name: 'Refine & Deliver', desc: 'Hoàn thiện chi tiết, chuẩn bị tất cả file deliverable và bàn giao đầy đủ kèm hướng dẫn sử dụng chi tiết.' },
            { num: '05', name: 'Launch & Support', desc: 'Hỗ trợ triển khai và theo dõi sau khi ra mắt. Đảm bảo thương hiệu được ứng dụng đúng và nhất quán trên mọi điểm tiếp xúc.' },
          ].map((step) => (
            <div key={step.num} className="ag-process-step">
              <div className="ag-step-num">{step.num}</div>
              <div>
                <h3 className="ag-step-name">{step.name}</h3>
                <p className="ag-step-desc">{step.desc}</p>
              </div>
              <div className="ag-step-dot" aria-hidden="true"></div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      {plans.length > 0 && (
        <section className="ag-sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center mb-5" data-reveal>
              <div className="ag-section-label" style={{ textAlign: 'center', display: 'block', marginBottom: 12 }}>Bảng giá dịch vụ</div>
              <h2 className="ag-section-title" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>Đầu tư vào <em>thương hiệu</em></h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Chúng tôi cung cấp gói dịch vụ linh hoạt phù hợp với từng giai đoạn phát triển của doanh nghiệp.</p>
            </div>
            <div className="row g-0">
              <div className="col-12" data-reveal>
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 24,
                      padding: '32px 0', borderBottom: '1px solid var(--border)',
                      ...(plan.is_featured ? { background: 'var(--accent-light)', margin: '0 -24px', paddingLeft: 24, paddingRight: 24 } : {}),
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                        {plan.name}{plan.is_featured ? ' ★ Phổ biến nhất' : ''}
                      </div>
                      <h3 style={{ fontFamily: 'var(--heading)', fontSize: 22, fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: 6 }}>{plan.name}</h3>
                      <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-2)' }}>{plan.description}</p>
                      {plan.features && (
                        <ul style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.8, marginTop: 8, paddingLeft: 18 }}>
                          {plan.features.split(/\r?\n/).filter(Boolean).map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--heading)', fontSize: 22, fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap' }}>{plan.price}</div>
                    <Link to="/lien-he" className={plan.is_featured ? 'ag-btn-primary' : 'ag-btn-outline'} style={{ whiteSpace: 'nowrap' }}>{plan.cta_text || 'Liên hệ ngay'}</Link>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 24, textTransform: 'uppercase', letterSpacing: 1 }} data-reveal>* Giá tham khảo, chính xác sau khi khảo sát yêu cầu thực tế</p>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="ag-sec-pad" style={{ background: 'var(--bg)' }} id="faq">
          <div className="wd-container">
            <div className="row g-5">
              <div className="col-lg-4" data-reveal>
                <div className="ag-section-label" style={{ marginBottom: 12 }}>FAQ</div>
                <h2 className="ag-section-title">Câu hỏi<br/><em>thường gặp</em></h2>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8, marginTop: 16 }}>
                  Không tìm thấy câu trả lời bạn cần? <Link to="/lien-he" style={{ color: 'var(--accent)' }}>Liên hệ trực tiếp</Link> — chúng tôi luôn sẵn sàng giải đáp.
                </p>
              </div>
              <div className="col-lg-8" data-reveal>
                {faqs.map(f => (
                  <details className="ag-faq-item" key={f.id}>
                    <summary>{f.question} <span className="ag-faq-icon">+</span></summary>
                    <p className="ag-faq-a">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--dark)', padding: 'clamp(72px, 9vw, 112px) 0' }}>
        <div className="wd-container text-center" data-reveal>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>Bắt đầu cùng chúng tôi</div>
          <h2 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(36px,6vw,80px)', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1.5px', lineHeight: '.92', marginBottom: '28px' }}>
            THƯƠNG HIỆU CỦA BẠN<br/><span style={{ color: 'var(--accent)' }}>XỨNG ĐÁNG</span> HƠN
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'rgba(255,255,255,.4)', maxWidth: '400px', margin: '0 auto 36px', lineHeight: '1.7' }}>Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/lien-he" className="ag-btn-accent">Nhận báo giá miễn phí</Link>
            <Link to="/du-an" className="ag-btn-ghost-dark">Xem portfolio</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
