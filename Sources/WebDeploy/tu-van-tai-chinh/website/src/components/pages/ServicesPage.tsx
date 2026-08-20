import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import { api } from '../../api/client'

interface PricingPlan {
  id: number; name: string; price: string; description: string; features: string
  is_featured: number; cta_text: string; cta_link: string
}
interface Faq { id: number; question: string; answer: string }

function parseFeatures(raw: string): string[] {
  return (raw || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
}

export default function ServicesPage() {
  const { services, settings } = useSite()
  const [pricing, setPricing] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  usePageTitle('Dịch vụ', `Các dịch vụ tư vấn tài chính tại ${settings.site_name || 'chúng tôi'}.`)

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPricing).catch(() => {})
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(() => {})
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
  }, [services, pricing, faqs])

  const displayServices = services.length > 0 ? services : [
    { id: 1, name: 'Quản lý Đầu tư', description: 'Xây dựng danh mục đầu tư tối ưu dựa trên khẩu vị rủi ro và mục tiêu tài chính.', content: 'Chúng tôi xây dựng và quản lý danh mục đầu tư đa dạng phù hợp với mục tiêu tài chính và khẩu vị rủi ro của từng khách hàng. Bao gồm cổ phiếu, trái phiếu, quỹ ETF, bất động sản và các công cụ tài chính khác.', price: '500 triệu (tối thiểu)', slug: 'quan-ly-dau-tu' },
    { id: 2, name: 'Tư vấn Thuế', description: 'Tối ưu hóa nghĩa vụ thuế cho cá nhân và doanh nghiệp, đảm bảo tuân thủ pháp luật.', content: 'Dịch vụ tư vấn thuế toàn diện cho cá nhân và doanh nghiệp. Chúng tôi giúp bạn tối ưu hóa nghĩa vụ thuế một cách hợp pháp, đảm bảo tuân thủ đúng quy định pháp luật.', price: 'Từ 5 triệu/tháng', slug: 'tu-van-thue' },
    { id: 3, name: 'Hoạch định Tài chính', description: 'Lập kế hoạch tài chính dài hạn cho hưu trí, giáo dục con cái, mua nhà.', content: 'Lập kế hoạch tài chính toàn diện cho các mục tiêu dài hạn quan trọng trong cuộc sống: hưu trí, giáo dục con cái, mua nhà, du lịch và bảo hiểm.', price: 'Tư vấn lần đầu Miễn phí', slug: 'hoach-dinh-tai-chinh' },
    { id: 4, name: 'Quản lý Rủi ro', description: 'Phân tích và xây dựng chiến lược quản lý rủi ro toàn diện, bảo vệ tài sản.', content: 'Phân tích toàn diện các rủi ro tài chính và xây dựng chiến lược phòng ngừa phù hợp. Chúng tôi giúp bạn xác định và đánh giá các rủi ro tiềm ẩn.', price: 'Tích hợp với Quản lý ĐT', slug: 'quan-ly-rui-ro' },
  ]

  return (
    <>
      {/* PAGE HERO */}
      <section className="tc-page-hero">
        <div className="wd-container">
          <p className="tc-ph-label">Giải pháp tài chính</p>
          <h1 className="tc-ph-title">Dịch vụ tư vấn<br />toàn diện</h1>
          <p className="tc-ph-sub">Từ quản lý đầu tư đến hoạch định tài chính — chúng tôi cung cấp đầy đủ các giải pháp giúp bạn đạt mục tiêu tài chính bền vững.</p>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="tc-breadcrumb">
        <div className="wd-container">
          <Link to="/">Trang chủ</Link>
          <span className="sep">/</span>
          <span className="current">Dịch vụ</span>
        </div>
      </div>

      {/* INTRO */}
      <section className="tc-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6" data-reveal="">
              <div className="tc-label">Tiếp cận toàn diện</div>
              <h2 className="tc-title">Chúng tôi không chỉ tư vấn<br />— chúng tôi <span>đồng hành</span></h2>
              <p className="tc-sub" style={{ maxWidth: '100%' }}>Mỗi khách hàng có một hành trình tài chính khác nhau. Chúng tôi xây dựng chiến lược cá nhân hóa, phù hợp với mục tiêu, khẩu vị rủi ro và hoàn cảnh riêng của bạn — không áp dụng công thức chung.</p>
            </div>
            <div className="col-lg-6" data-reveal="" data-delay="1">
              <div className="row g-3">
                {[
                  { num: '4', label: 'Lĩnh vực\ntư vấn', color: 'var(--accent)', bg: 'var(--surface)', border: true },
                  { num: '500+', label: 'Khách hàng\nđang phục vụ', color: 'var(--accent)', bg: 'var(--surface)', border: true },
                  { num: '20+', label: 'Năm\nkinh nghiệm', color: '#fff', textColor: 'rgba(255,255,255,.7)', bg: 'var(--accent)', border: false },
                  { num: '98%', label: 'Khách hàng\nhài lòng', color: 'var(--teal)', bg: 'var(--surface)', border: true },
                ].map((item, i) => (
                  <div key={i} className="col-6">
                    <div style={{ background: item.bg, border: item.border ? '1px solid var(--border)' : 'none', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: item.color, marginBottom: '4px' }}>{item.num}</div>
                      <div style={{ fontSize: '13px', color: item.textColor || 'var(--text-2)', whiteSpace: 'pre-line' }}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="tc-sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label">Danh mục dịch vụ</div>
            <h2 className="tc-title">Giải pháp tài chính <span>toàn diện</span></h2>
          </div>
          {displayServices.map((svc, i) => (
            <div key={svc.id} className="tc-service-list-item" data-reveal="">
              <div className="tc-sli-icon-wrap">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
                </svg>
              </div>
              <div className="flex-grow-1">
                <h3 className="tc-sli-title">{svc.name}</h3>
                <p className="tc-sli-desc">{svc.content || svc.description}</p>
                <div className="tc-sli-features">
                  {i === 0 && ['Phân tích thị trường','Danh mục đa dạng hóa','Tái cân bằng định kỳ','Báo cáo hiệu suất','Theo dõi 24/7'].map(tag => <span key={tag} className="tc-sli-tag">{tag}</span>)}
                  {i === 1 && ['Tối ưu thuế thu nhập','Quyết toán thuế doanh nghiệp','Tư vấn VAT','Hoàn thuế','Tuân thủ pháp luật'].map(tag => <span key={tag} className="tc-sli-tag">{tag}</span>)}
                  {i === 2 && ['Kế hoạch hưu trí','Quỹ giáo dục','Mua nhà / BĐS','Bảo hiểm nhân thọ','Di sản & thừa kế'].map(tag => <span key={tag} className="tc-sli-tag">{tag}</span>)}
                  {i === 3 && ['Phân tích rủi ro danh mục','Hedging chiến lược','Stop-loss tự động','Stress testing','Bảo hiểm đầu tư'].map(tag => <span key={tag} className="tc-sli-tag">{tag}</span>)}
                </div>
                <div className="mt-3">
                  <Link to="/lien-he" className="tc-btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>Đặt lịch tư vấn</Link>
                </div>
              </div>
              {svc.price && (
                <div style={{ minWidth: '160px', textAlign: 'right' }} className="d-none d-md-block">
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Tài sản / Phí từ</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)', lineHeight: '1.2' }}>{svc.price}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="tc-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label">Chi phí dịch vụ</div>
            <h2 className="tc-title">Gói dịch vụ <span>phù hợp</span><br />với mọi nhu cầu</h2>
            <p className="tc-sub tc-sub-center">Chúng tôi cung cấp các gói dịch vụ linh hoạt, phù hợp với quy mô tài sản và nhu cầu của từng khách hàng.</p>
          </div>
          <div className="row g-4">
            {pricing.map((pc, i) => {
              const featured = pc.is_featured === 1
              return (
                <div key={pc.id} className="col-lg-4" data-reveal="" data-delay={i > 0 ? String(i) : undefined}>
                  <div style={featured
                    ? { background: 'var(--accent)', borderRadius: '8px', padding: '32px', height: '100%', position: 'relative', boxShadow: '0 16px 48px rgba(21,101,192,.25)' }
                    : { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '32px', height: '100%' }
                  }>
                    {featured && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#fff', color: 'var(--accent)', fontSize: '11px', fontWeight: '700', padding: '5px 16px', borderRadius: '20px', whiteSpace: 'nowrap', letterSpacing: '1px' }}>PHỔ BIẾN NHẤT</div>
                    )}
                    <div style={{ fontSize: '12px', fontWeight: '600', color: featured ? 'rgba(255,255,255,.6)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>{pc.name}</div>
                    <div style={{ fontSize: '30px', fontWeight: '700', color: featured ? '#fff' : 'var(--text)', marginBottom: '4px' }}>{pc.price}</div>
                    {pc.description && (
                      <p style={{ fontSize: '13px', color: featured ? 'rgba(255,255,255,.7)' : 'var(--text-2)', marginBottom: '24px' }}>{pc.description}</p>
                    )}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {parseFeatures(pc.features).map(item => (
                        <li key={item} style={{ fontSize: '13px', color: featured ? 'rgba(255,255,255,.9)' : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" fill={featured ? '#fff' : 'var(--accent)'} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>{item}
                        </li>
                      ))}
                    </ul>
                    <Link to={pc.cta_link || '/lien-he'} className={featured ? 'tc-btn-white' : 'tc-btn-ghost'} style={{ width: '100%', textAlign: 'center', display: 'block' }}>{pc.cta_text || 'Nhận báo giá'}</Link>
                  </div>
                </div>
              )
            })}
            {pricing.length === 0 && (
              <div className="text-center" style={{ padding: '48px', color: 'var(--text-3)', width: '100%' }}>Đang tải bảng giá...</div>
            )}
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-3)', marginTop: '24px' }}>
            * Phí trên là mức tham khảo. Giá thực tế được xác định sau buổi tư vấn ban đầu miễn phí.
          </p>
        </div>
      </section>

      {/* FAQ — Accordion thật (details/summary, không cần JS) */}
      {faqs.length > 0 && (
        <section className="tc-sec-pad" style={{ background: 'var(--surface)' }} id="faq">
          <div className="wd-container">
            <div className="text-center mb-5" data-reveal="">
              <div className="tc-label" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Câu hỏi thường gặp</div>
              <h2 className="tc-title">Bạn muốn <span>tìm hiểu</span> thêm?</h2>
              <p className="tc-sub tc-sub-center">Những thắc mắc phổ biến nhất về phí dịch vụ, tính pháp lý và cam kết đầu tư — nếu chưa tìm thấy câu trả lời, hãy <Link to="/lien-he" style={{ color: 'var(--accent)' }}>liên hệ trực tiếp</Link> với chuyên gia của chúng tôi.</p>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {faqs.map(f => (
                  <details className="tc-faq-item" key={f.id} data-reveal="">
                    <summary>{f.question} <span className="tc-faq-icon" aria-hidden="true">+</span></summary>
                    <p className="tc-faq-a">{f.answer}</p>
                  </details>
                ))}
                <div className="tc-faq-disclaimer" data-reveal="">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <p>Đầu tư có rủi ro. Mọi thông tin, số liệu hiệu suất trên trang này chỉ mang tính tham khảo và không cấu thành cam kết hay lời khuyên đầu tư đảm bảo lợi nhuận.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="tc-cta-section" style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wd-container tc-cta-inner">
          <div className="text-center" data-reveal="">
            <h2 className="tc-cta-title" style={{ maxWidth: '560px', margin: '0 auto 16px' }}>Sẵn sàng bắt đầu<br />hành trình tài chính của bạn?</h2>
            <p className="tc-cta-sub" style={{ maxWidth: '440px', margin: '0 auto 32px' }}>Đặt lịch tư vấn miễn phí ngay hôm nay. Không ràng buộc, không áp lực — chỉ là lộ trình rõ ràng cho tương lai tài chính của bạn.</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/lien-he" className="tc-btn-white">Đặt lịch tư vấn miễn phí</Link>
              <Link to="/doi-ngu" className="tc-btn-outline-white">Gặp đội ngũ chuyên gia</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
