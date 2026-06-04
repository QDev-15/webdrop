import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import RevealObserver from '../RevealObserver'

export default function ServicesPage() {
  const { services, processSteps } = useSite()

  const detailServices = services.length > 0 ? services : [
    { id: 1, name: 'Logo & Visual Identity', number: '', slug: '', description: 'Thiết kế logo độc đáo và hệ thống nhận diện hình ảnh nhất quán.', tags: 'Logo Design,Color Palette,Typography,Brand Usage', featured: 0, sort_order: 4 },
    { id: 2, name: 'Brand Strategy', number: '', slug: '', description: 'Xây dựng nền tảng chiến lược thương hiệu vững chắc — định vị, giá trị cốt lõi, brand voice.', tags: 'Brand Positioning,Target Audience,Brand Personality,Competitive Analysis', featured: 0, sort_order: 5 },
    { id: 3, name: 'Brand Collateral', number: '', slug: '', description: 'Thiết kế toàn bộ ấn phẩm thương hiệu — từ name card, letterhead đến bao bì, catalog.', tags: 'Business Card,Packaging,Catalog,Signage', featured: 0, sort_order: 6 },
    { id: 4, name: 'UI/UX Design', number: '', slug: '', description: 'Thiết kế giao diện người dùng đẹp và trải nghiệm sử dụng mượt mà.', tags: 'User Research,Wireframe,High-fidelity UI,Prototype', featured: 0, sort_order: 7 },
    { id: 5, name: 'Web Design', number: '', slug: '', description: 'Thiết kế website đẹp, hiện đại và hiệu quả chuyển đổi.', tags: 'Landing Page,Corporate Website,E-commerce,Design System', featured: 0, sort_order: 8 },
    { id: 6, name: 'Campaign Creative', number: '', slug: '', description: 'Lên ý tưởng và triển khai chiến dịch truyền thông sáng tạo.', tags: 'Campaign Concept,Key Visual,Multi-channel,Performance', featured: 0, sort_order: 9 },
  ]

  const displayProcess = processSteps.length > 0 ? processSteps : [
    { id: 1, number: '01', name: 'Brief & Discovery', description: 'Tiếp nhận brief và tổ chức buổi discovery workshop để hiểu sâu về thương hiệu và mục tiêu.', sort_order: 1 },
    { id: 2, number: '02', name: 'Research & Strategy', description: 'Phân tích thị trường, đối thủ cạnh tranh và xu hướng. Xây dựng chiến lược rõ ràng.', sort_order: 2 },
    { id: 3, number: '03', name: 'Concept & Design', description: 'Phát triển 2-3 concept khác nhau, trình bày và lấy feedback. Tinh chỉnh cho đến khi đạt tối ưu.', sort_order: 3 },
    { id: 4, number: '04', name: 'Refine & Deliver', description: 'Hoàn thiện chi tiết, chuẩn bị tất cả file deliverable và bàn giao đầy đủ.', sort_order: 4 },
    { id: 5, number: '05', name: 'Launch & Support', description: 'Hỗ trợ triển khai và theo dõi sau khi ra mắt. Đảm bảo thương hiệu được ứng dụng đúng.', sort_order: 5 },
  ]

  const icons = ['◆', '■', '▲', '◇', '□', '△']

  return (
    <>
      <RevealObserver />

      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <div className="ag-ph-label" data-reveal>Dịch vụ sáng tạo</div>
          <h1 className="ag-ph-title" data-reveal>
            <span className="outline">WHAT WE</span><br />DO BEST
          </h1>
          <p className="ag-ph-sub" data-reveal>
            Ba lĩnh vực cốt lõi — một quy trình nhất quán — kết quả vượt kỳ vọng. Chúng tôi không chỉ thiết kế, chúng tôi xây dựng thương hiệu.
          </p>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-4 mb-5" data-reveal>
            {[
              { num: '01', title: 'Brand Identity', desc: 'Nhận diện thương hiệu toàn diện — từ chiến lược đến hình ảnh' },
              { num: '02', title: 'Digital Design', desc: 'Thiết kế kỹ thuật số chuyên nghiệp — web, app, UI/UX' },
              { num: '03', title: 'Campaign', desc: 'Chiến dịch sáng tạo — concept, content, execution' },
            ].map((item) => (
              <div key={item.num} className="col-md-4">
                <div className="text-center" style={{ padding: '24px 0', borderLeft: item.num !== '01' ? '1px solid var(--border)' : undefined, borderRight: item.num !== '03' ? undefined : undefined }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{item.num}</div>
                  <h2 style={{ fontFamily: 'var(--sans)', fontSize: '22px', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '8px' }}>{item.title}</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="ag-divider" style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }} />

          <div className="row g-4">
            {detailServices.map((svc, idx) => (
              <div key={svc.id} className="col-lg-4 col-md-6" data-reveal>
                <div className="ag-svc-card">
                  <div className="ag-svc-icon" aria-hidden="true">{icons[idx % icons.length]}</div>
                  <h3 className="ag-svc-card-title">{svc.name}</h3>
                  <p className="ag-svc-card-desc">{svc.description}</p>
                  <ul className="ag-svc-list">
                    {svc.tags.split(',').map((tag, i) => (
                      <li key={i}>{tag.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
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
          {displayProcess.map((step) => (
            <div key={step.id} className="ag-process-step">
              <div className="ag-step-num">{step.number}</div>
              <div>
                <h3 className="ag-step-name">{step.name}</h3>
                <p className="ag-step-desc">{step.description}</p>
              </div>
              <div className="ag-step-dot" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="ag-sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="ag-section-label" style={{ textAlign: 'center', display: 'block', marginBottom: '12px' }}>Bảng giá dịch vụ</div>
            <h2 className="ag-section-title" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>Đầu tư vào <em>thương hiệu</em></h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              Chúng tôi cung cấp gói dịch vụ linh hoạt phù hợp với từng giai đoạn phát triển của doanh nghiệp.
            </p>
          </div>

          <div className="row g-0">
            <div className="col-12" data-reveal>
              {[
                { tier: 'Starter', title: 'Brand Starter Pack', desc: 'Logo + màu sắc + font + name card. Phù hợp cho startup mới bắt đầu.', price: 'Từ 15 triệu', cta: 'Tư vấn', style: {} },
                { tier: 'Standard ★ Phổ biến nhất', title: 'Full Brand Identity', desc: 'Bộ nhận diện đầy đủ + brand guideline + bộ ấn phẩm cơ bản. Dành cho SME.', price: 'Từ 35 triệu', cta: 'Tư vấn ngay', style: { background: 'var(--accent-light)', margin: '0 -24px', paddingLeft: '24px', paddingRight: '24px' } },
                { tier: 'Enterprise', title: 'Brand + Digital + Campaign', desc: 'Giải pháp toàn diện — brand identity, website, campaign và nội dung.', price: 'Liên hệ', cta: 'Tư vấn', style: {} },
              ].map((pkg, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: '24px', padding: '32px 0', borderBottom: '1px solid var(--border)', ...pkg.style }}>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>{pkg.tier}</div>
                    <h3 style={{ fontFamily: 'var(--sans)', fontSize: '22px', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '6px' }}>{pkg.title}</h3>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-2)' }}>{pkg.desc}</p>
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '22px', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap' }}>{pkg.price}</div>
                  <Link to="/lien-he" className={i === 1 ? 'ag-btn-primary' : 'ag-btn-outline'} style={{ whiteSpace: 'nowrap' }}>{pkg.cta}</Link>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', marginTop: '24px', textTransform: 'uppercase', letterSpacing: '1px' }} data-reveal>
            * Giá tham khảo, chính xác sau khi khảo sát yêu cầu thực tế
          </p>
        </div>
      </section>

      {/* TICKER */}
      <div className="ag-ticker-wrap" aria-hidden="true">
        <div className="ag-ticker-track">
          {['Brand Identity', 'Digital Design', 'Campaign', 'UI/UX', 'Web Design', 'Social Media',
            'Brand Identity', 'Digital Design', 'Campaign', 'UI/UX', 'Web Design', 'Social Media'].map((item, i) => (
            <span key={i} className="ag-ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section style={{ background: 'var(--dark)', padding: 'clamp(72px, 9vw, 112px) 0' }}>
        <div className="wd-container text-center" data-reveal>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>Bắt đầu cùng chúng tôi</div>
          <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(36px,6vw,80px)', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '-3px', lineHeight: .92, marginBottom: '28px' }}>
            THƯƠNG HIỆU CỦA BẠN<br /><span style={{ color: 'var(--accent)' }}>XỨNG ĐÁNG</span> HƠN
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'rgba(255,255,255,.4)', maxWidth: '400px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/lien-he" className="ag-btn-accent">Nhận báo giá miễn phí</Link>
            <Link to="/du-an" className="ag-btn-ghost-dark">Xem portfolio</Link>
          </div>
        </div>
      </section>
    </>
  )
}
