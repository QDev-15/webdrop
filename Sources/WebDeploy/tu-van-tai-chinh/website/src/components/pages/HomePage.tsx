import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { usePageTitle } from '../../hooks/usePageTitle'

function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    // setTimeout 0 để chờ DOM paint xong sau khi async data render
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default function HomePage() {
  usePageTitle()
  const { settings, slides, services, team, testimonials } = useSite()
  const [activeSlide, setActiveSlide] = useState(0)
  useReveal([services, team, testimonials])

  const heroLabel = settings.hero_label || 'Tư Vấn Tài Chính Chuyên Nghiệp'
  const statYears = settings.stat_years || '20+'
  const statClients = settings.stat_clients || '500+'
  const statSatisfaction = settings.stat_satisfaction || '98%'
  const statExperts = settings.stat_experts || '15+'

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setActiveSlide(a => (a + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  const featuredServices = services.filter(s => s.featured).slice(0, 4)
  const displayedServices = featuredServices.length >= 4 ? featuredServices : services.slice(0, 4)
  const experts = team.filter(m => !m.is_leader).slice(0, 4)

  const currentSlide = slides[activeSlide]

  return (
    <>
      {/* HERO */}
      <section className="tc-hero">
        <div className="wd-container">
          <div className="tc-hero-inner" data-reveal="">
            <div className="tc-hero-label">{heroLabel}</div>
            {currentSlide ? (
              <>
                <h1 className="tc-hero-title" dangerouslySetInnerHTML={{ __html: currentSlide.title.replace(' & ', ' &amp; ').replace('bạn', '<span class="ht-accent">bạn</span>') }} />
                <p className="tc-hero-sub">{currentSlide.subtitle}</p>
                <div className="tc-hero-btns">
                  <Link to="/lien-he" className="tc-btn-primary">{currentSlide.button_text || 'Đặt lịch tư vấn miễn phí'}</Link>
                  <Link to="/dich-vu" className="tc-btn-ghost">Xem dịch vụ</Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="tc-hero-title">Bảo vệ &amp; gia tăng tài sản của <span className="ht-accent">bạn</span></h1>
                <p className="tc-hero-sub">Chúng tôi cung cấp giải pháp tài chính toàn diện — từ quản lý đầu tư, hoạch định tài chính đến tư vấn thuế.</p>
                <div className="tc-hero-btns">
                  <Link to="/lien-he" className="tc-btn-primary">Đặt lịch tư vấn miễn phí</Link>
                  <Link to="/dich-vu" className="tc-btn-ghost">Xem dịch vụ</Link>
                </div>
              </>
            )}

            {/* Trust bar */}
            <div className="tc-hero-trust">
              {[
                { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', num: statYears, txt: 'Năm kinh nghiệm' },
                { icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', num: statClients, txt: 'Khách hàng tin tưởng' },
                { icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z', num: statSatisfaction, txt: 'Khách hàng hài lòng' },
                { icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z', num: 'UBCKNN', txt: 'Giấy phép hành nghề' },
              ].map((item, i) => (
                <div key={i} className="tc-trust-item">
                  <div className="tc-trust-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d={item.icon}/></svg>
                  </div>
                  <div>
                    <div className="tc-trust-num">{item.num}</div>
                    <div className="tc-trust-txt">{item.txt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DICH VU */}
      <section className="tc-services-bg tc-sec-pad">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label">Giải pháp tài chính</div>
            <h2 className="tc-title">Dịch vụ tư vấn <span>toàn diện</span></h2>
            <p className="tc-sub tc-sub-center">Chúng tôi cung cấp đầy đủ các dịch vụ tư vấn tài chính, giúp bạn xây dựng và bảo vệ tài sản một cách thông minh.</p>
          </div>
          <div className="row g-0">
            {displayedServices.map((svc, i) => (
              <div key={svc.id} className={`col-lg-3 col-sm-6${i < 3 ? ' tc-sf-row' : ''}`} data-reveal="" data-delay={String(i + 1)}>
                <div className="tc-service-feature">
                  <div className="tc-sf-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
                    </svg>
                  </div>
                  <div className="tc-sf-title">{svc.name}</div>
                  <p className="tc-sf-desc">{svc.description}</p>
                  <Link to="/dich-vu" className="tc-sf-link">
                    Tìm hiểu thêm
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <hr className="tc-services-divider" />
        </div>
      </section>

      {/* STAT BAR */}
      <section className="tc-stat-bar">
        <div className="wd-container">
          <div className="row g-0 py-4">
            {[
              { num: statYears, label: 'Năm kinh nghiệm\nthực chiến' },
              { num: statClients, label: 'Khách hàng\nđang phục vụ' },
              { num: statSatisfaction, label: 'Tỷ lệ khách hàng\nhài lòng' },
              { num: statExperts, label: 'Chuyên gia tài chính\nCFA & ACCA' },
            ].map((item, i) => (
              <div key={i} className={`col-6 col-md-3 tc-stat-item${i < 3 ? ' tc-stat-divider' : ''}`} data-reveal="" data-delay={i > 0 ? String(i) : undefined}>
                <div className="tc-stat-num"><span>{item.num}</span></div>
                <div className="tc-stat-label" style={{ whiteSpace: 'pre-line' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRIPS */}
      <section className="tc-strip">
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-lg-1" data-reveal="">
              <div className="tc-strip-img" style={{ height: '380px' }}>
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80&auto=format&fit=crop" alt="Đội ngũ tư vấn tài chính chuyên nghiệp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-lg-6 order-lg-2 tc-strip-content" data-reveal="" data-delay="1">
              <div className="tc-label">Kinh nghiệm & Chuyên môn</div>
              <h2 className="tc-title">Kinh nghiệm thực chiến<br /><span>{statYears} năm</span> trên thị trường</h2>
              <p className="tc-sub">Đội ngũ chuyên gia của chúng tôi đã trải qua nhiều chu kỳ kinh tế, từ khủng hoảng đến tăng trưởng — mang đến sự am hiểu sâu sắc không thể có được từ sách vở.</p>
              <ul className="tc-strip-list">
                <li>Kinh nghiệm qua các cuộc khủng hoảng tài chính 2008, 2020</li>
                <li>Đội ngũ có chứng chỉ CFA, ACCA, CFP quốc tế</li>
                <li>Mạng lưới đối tác ngân hàng và quỹ đầu tư rộng lớn</li>
                <li>Phân tích thị trường chuyên sâu với dữ liệu thời gian thực</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="tc-strip tc-strip-alt">
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-lg-2" data-reveal="">
              <div className="tc-strip-img" style={{ height: '380px' }}>
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop" alt="Biểu đồ phân tích tài chính" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-lg-6 order-lg-1 tc-strip-content" data-reveal="" data-delay="1">
              <div className="tc-label">Minh bạch & Báo cáo</div>
              <h2 className="tc-title">Quy trình <span>minh bạch</span>,<br />báo cáo định kỳ đầy đủ</h2>
              <p className="tc-sub">Chúng tôi cam kết cung cấp thông tin đầy đủ và kịp thời. Bạn luôn biết tài sản của mình đang ở đâu và hoạt động như thế nào.</p>
              <ul className="tc-strip-list">
                <li>Báo cáo hiệu suất danh mục hàng tháng và hàng quý</li>
                <li>Cổng thông tin trực tuyến theo dõi tài sản 24/7</li>
                <li>Cuộc họp đánh giá định kỳ với chuyên gia phụ trách</li>
                <li>Phí dịch vụ minh bạch, không phát sinh chi phí ẩn</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* QUY TRINH */}
      <section className="tc-sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label">Quy trình làm việc</div>
            <h2 className="tc-title">4 bước đơn giản để <span>bắt đầu</span></h2>
            <p className="tc-sub tc-sub-center">Quy trình tư vấn được thiết kế rõ ràng và chuyên nghiệp, giúp bạn nhanh chóng có được giải pháp tài chính phù hợp.</p>
          </div>
          <div className="row g-4 mt-2">
            {[
              { num: '01', title: 'Tư vấn ban đầu', desc: 'Cuộc gặp miễn phí để tìm hiểu tình hình tài chính và mục tiêu của bạn.' },
              { num: '02', title: 'Phân tích nhu cầu', desc: 'Chuyên gia phân tích toàn diện hồ sơ tài chính và khẩu vị rủi ro.' },
              { num: '03', title: 'Đề xuất giải pháp', desc: 'Trình bày kế hoạch tài chính chi tiết, rõ ràng và phù hợp với mục tiêu.' },
              { num: '04', title: 'Triển khai & Theo dõi', desc: 'Thực hiện và theo dõi danh mục liên tục, điều chỉnh kịp thời theo thị trường.' },
            ].map((step, i) => (
              <div key={i} className="col-6 col-md-3" data-reveal="" data-delay={i > 0 ? String(i) : undefined}>
                <div className="tc-process-step">
                  <div className="tc-ps-num">{step.num}</div>
                  <div className="tc-ps-title">{step.title}</div>
                  <p className="tc-ps-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="tc-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row align-items-end g-4 mb-5">
            <div className="col-lg-7" data-reveal="">
              <div className="tc-label">Kết quả thực tế</div>
              <h2 className="tc-title">Câu chuyện thành công<br />từ <span>khách hàng</span></h2>
            </div>
            <div className="col-lg-5 text-lg-end" data-reveal="" data-delay="1">
              <Link to="/lien-he" className="tc-btn-ghost">Xem tất cả case studies</Link>
            </div>
          </div>
          <div className="row g-4">
            {[
              { tag: 'Cá nhân cao thu nhập', title: 'Tối ưu danh mục đầu tư cho doanh nhân 45 tuổi', challenge: 'Khách hàng có tài sản phân tán nhiều kênh, không có chiến lược tổng thể. Rủi ro cao, lợi nhuận thấp hơn thị trường.', metric: '+18.5%', metricLabel: 'Tăng trưởng danh mục\nsau 12 tháng' },
              { tag: 'Doanh nghiệp vừa', title: 'Tái cơ cấu tài chính và tối ưu thuế doanh nghiệp', challenge: 'Doanh nghiệp đang chịu gánh nặng thuế cao, dòng tiền không hiệu quả, thiếu kế hoạch tài chính dài hạn.', metric: '-32%', metricLabel: 'Giảm chi phí thuế\nhàng năm' },
              { tag: 'Kế hoạch hưu trí', title: 'Lập kế hoạch hưu trí cho cặp vợ chồng 50 tuổi', challenge: 'Chưa có kế hoạch hưu trí cụ thể, lo ngại về việc duy trì chất lượng sống khi nghỉ hưu ở tuổi 60.', metric: '2.8 tỷ', metricLabel: 'Quỹ hưu trí dự kiến\nđến tuổi 60' },
            ].map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6" data-reveal="" data-delay={i > 0 ? String(i) : undefined}>
                <div className="tc-case-card">
                  <div className="tc-case-tag">{item.tag}</div>
                  <div className="tc-case-title">{item.title}</div>
                  <p className="tc-case-challenge">{item.challenge}</p>
                  <div className="tc-case-divider"></div>
                  <div className="tc-case-result">
                    <div>
                      <div className="tc-case-metric">{item.metric}</div>
                      <div className="tc-case-metric-label" style={{ whiteSpace: 'pre-line' }}>{item.metricLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOI NGU preview */}
      <section className="tc-sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label">Đội ngũ chuyên gia</div>
            <h2 className="tc-title">Những người <span>dẫn đường</span><br />tài chính của bạn</h2>
            <p className="tc-sub tc-sub-center">Mỗi chuyên gia đều có chứng chỉ quốc tế và nhiều năm kinh nghiệm thực chiến tại các tổ chức tài chính hàng đầu.</p>
          </div>
          <div className="row g-4">
            {(experts.length > 0 ? experts : [
              { id: 1, name: 'Nguyễn Minh Đức', position: 'Giám đốc Đầu tư', experience: '20 năm kinh nghiệm quản lý quỹ tại SSI, Dragon Capital và VDSC.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face', certificates: 'CFA, CPA' },
              { id: 2, name: 'Trần Thị Thu Hà', position: 'Trưởng phòng Hoạch định', experience: '15 năm chuyên về lập kế hoạch tài chính cá nhân và gia đình thế hệ sau.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&crop=face', certificates: 'CFP, ACCA' },
              { id: 3, name: 'Lê Văn Hùng', position: 'Chuyên gia Thuế & Pháp lý', experience: '18 năm kinh nghiệm tư vấn thuế doanh nghiệp và tối ưu hóa cơ cấu thuế.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face', certificates: 'ACCA, CTA' },
              { id: 4, name: 'Phạm Thị Lan Anh', position: 'Chuyên gia Quản lý Rủi ro', experience: 'Chuyên phân tích rủi ro thị trường và xây dựng chiến lược bảo hiểm danh mục.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&crop=face', certificates: 'FRM, CFA' },
            ]).slice(0, 4).map((member, i) => (
              <div key={member.id} className="col-lg-3 col-sm-6" data-reveal="" data-delay={i > 0 ? String(i) : undefined}>
                <div className="tc-expert-card">
                  <img className="tc-expert-photo" src={member.avatar} alt={member.name} />
                  <div className="tc-expert-info">
                    <div className="tc-expert-name">{member.name}</div>
                    <div className="tc-expert-title">{member.position}</div>
                    <p className="tc-expert-spec">{member.experience}</p>
                    {member.certificates && member.certificates.split(',').map(cert => (
                      <span key={cert} className="tc-expert-badge">{cert.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal="">
            <Link to="/doi-ngu" className="tc-btn-ghost">Xem toàn bộ đội ngũ</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="tc-testimonials tc-sec-pad">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label tc-label-light">Phản hồi khách hàng</div>
            <h2 className="tc-title tc-title-light">Khách hàng nói gì về<br /><span style={{ color: 'var(--accent-mid)' }}>dịch vụ của chúng tôi</span></h2>
          </div>
          <div className="row g-4">
            {(testimonials.length > 0 ? testimonials : [
              { id: 1, author_name: 'Nguyễn Văn An', author_title: 'Giám đốc điều hành, Công ty ABC', author_avatar: 'N', content: 'Sau 3 năm hợp tác, danh mục đầu tư của tôi tăng trưởng vượt kỳ vọng. Đội ngũ luôn sẵn sàng giải thích và tư vấn kịp thời mỗi khi thị trường biến động.' },
              { id: 2, author_name: 'Trần Thị Bích', author_title: 'CFO, Tập đoàn XYZ', author_avatar: 'T', content: 'Dịch vụ tư vấn thuế giúp công ty tiết kiệm được khoản chi phí đáng kể mỗi năm. Quy trình làm việc chuyên nghiệp, báo cáo minh bạch rõ ràng.' },
              { id: 3, author_name: 'Phạm Văn Cường', author_title: 'Bác sĩ chuyên khoa', author_avatar: 'P', content: 'Kế hoạch hưu trí được lập rất chi tiết và thực tế. Tôi cảm thấy an tâm hơn rất nhiều về tương lai tài chính của gia đình mình.' },
            ]).slice(0, 3).map((t, i) => (
              <div key={t.id} className="col-lg-4" data-reveal="" data-delay={i > 0 ? String(i) : undefined}>
                <div className="tc-quote-card">
                  <div className="tc-quote-mark">"</div>
                  <p className="tc-quote-text">{t.content}</p>
                  <div className="tc-quote-author">
                    <div className="tc-quote-avatar">{t.author_avatar || t.author_name.charAt(0)}</div>
                    <div>
                      <div className="tc-quote-name">{t.author_name}</div>
                      <div className="tc-quote-company">{t.author_title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS & CERTS */}
      <section className="tc-partners tc-sec-pad">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label">Đối tác & Chứng nhận</div>
            <h2 className="tc-title">Được tin tưởng bởi các<br />tổ chức <span>hàng đầu</span></h2>
          </div>
          <div className="row g-3 mb-5" data-reveal="">
            {['Vietcombank', 'BIDV', 'Techcombank', 'MB Bank', 'VPBank', 'ACB'].map(name => (
              <div key={name} className="col-6 col-md-2">
                <div className="tc-partner-logo">{name}</div>
              </div>
            ))}
          </div>
          <div className="row g-3" data-reveal="">
            {[
              { icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z', name: 'UBCKNN', desc: 'Giấy phép tư vấn đầu tư' },
              { icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z', name: 'CFA Institute', desc: 'Chartered Financial Analyst' },
              { icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z', name: 'ACCA', desc: 'Kế toán công chứng quốc tế' },
              { icon: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z', name: 'ISO 9001:2015', desc: 'Chứng nhận chất lượng dịch vụ' },
            ].map((cert, i) => (
              <div key={i} className="col-md-3 col-sm-6">
                <div className="tc-cert-badge">
                  <div className="tc-cert-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d={cert.icon}/></svg>
                  </div>
                  <div>
                    <div className="tc-cert-name">{cert.name}</div>
                    <div className="tc-cert-desc">{cert.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FORM */}
      <section className="tc-cta-section tc-sec-pad">
        <div className="wd-container tc-cta-inner">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-reveal="">
              <h2 className="tc-cta-title">Đặt lịch tư vấn<br />miễn phí ngay hôm nay</h2>
              <p className="tc-cta-sub">Cuộc tư vấn đầu tiên hoàn toàn miễn phí. Chuyên gia của chúng tôi sẽ phân tích tình hình tài chính và đề xuất hướng đi phù hợp nhất cho bạn.</p>
              <div className="mt-4 d-flex gap-3 flex-wrap">
                <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="rgba(255,255,255,.5)" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  {settings.site_phone || '028 3823 4567'}
                </div>
                <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="rgba(255,255,255,.5)" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  {settings.site_email || 'info@vietfinance.vn'}
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-reveal="" data-delay="1">
              <ContactFormInline />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactFormInline() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setLoading(true)
    try {
      await fetch((import.meta.env.DEV ? '/api' : window.location.origin + '/api') + '/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, message: `Yêu cầu tư vấn: ${form.service}` }),
        credentials: 'include',
      })
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tc-form-card">
      <div className="tc-form-title">Đăng ký tư vấn miễn phí</div>
      <p className="tc-form-sub">Điền thông tin để chúng tôi liên hệ sắp xếp lịch hẹn phù hợp</p>
      {success ? (
        <div className="alert-success">Yêu cầu của bạn đã được ghi nhận! Chúng tôi sẽ liên hệ trong vòng 24 giờ làm việc.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-6">
              <div className="tc-form-group">
                <label className="tc-form-label">Họ và tên</label>
                <input type="text" className="tc-form-input" placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
            </div>
            <div className="col-6">
              <div className="tc-form-group">
                <label className="tc-form-label">Số điện thoại</label>
                <input type="tel" className="tc-form-input" placeholder="0912 345 678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
            </div>
            <div className="col-12">
              <div className="tc-form-group">
                <label className="tc-form-label">Email</label>
                <input type="email" className="tc-form-input" placeholder="email@congty.vn" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="col-12">
              <div className="tc-form-group">
                <label className="tc-form-label">Tài sản / Nhu cầu tư vấn</label>
                <select className="tc-form-select" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                  <option value="">Chọn lĩnh vực tư vấn</option>
                  <option>Quản lý đầu tư (dưới 500 triệu)</option>
                  <option>Quản lý đầu tư (500 triệu - 5 tỷ)</option>
                  <option>Quản lý đầu tư (trên 5 tỷ)</option>
                  <option>Tư vấn thuế cá nhân</option>
                  <option>Tư vấn thuế doanh nghiệp</option>
                  <option>Kế hoạch hưu trí</option>
                  <option>Quản lý rủi ro</option>
                </select>
              </div>
            </div>
            <div className="col-12">
              <button type="submit" className="tc-form-btn" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Đặt lịch tư vấn miễn phí'}
              </button>
              <p className="tc-form-note">Thông tin của bạn được bảo mật tuyệt đối. Chúng tôi sẽ liên hệ trong vòng 24 giờ làm việc.</p>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
