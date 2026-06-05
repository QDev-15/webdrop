import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { usePageTitle } from '../../hooks/usePageTitle'

const DEFAULT_LEADERS = [
  { id: 1, name: 'Nguyễn Minh Đức', position: 'Tổng Giám đốc (CEO)', bio: 'Với hơn 20 năm kinh nghiệm trong lĩnh vực quản lý đầu tư và tư vấn tài chính, ông Đức đã dẫn dắt nhiều danh mục đầu tư giá trị hàng nghìn tỷ đồng. Từng là Giám đốc đầu tư tại Dragon Capital và SSI Asset Management.', experience: '20 năm kinh nghiệm · Cựu quản lý quỹ tại Dragon Capital', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop&crop=face', certificates: 'CFA Level III, MBA Harvard, CPA', is_leader: 1, sort_order: 1, status: 'published' },
  { id: 2, name: 'Trần Thị Thu Hà', position: 'Phó Tổng Giám đốc (COO)', bio: 'Chuyên gia hàng đầu về quản lý rủi ro và tư vấn chiến lược tài chính doanh nghiệp. Từng là Partner tại PwC và Deloitte Vietnam, bà Hà đã tư vấn cho hàng trăm doanh nghiệp.', experience: '18 năm kinh nghiệm · Cựu Partner tại Big 4', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop&crop=face', certificates: 'ACCA Fellow, CFP, CTA', is_leader: 1, sort_order: 2, status: 'published' },
]

const DEFAULT_EXPERTS = [
  { id: 3, name: 'Lê Văn Hùng', position: 'Trưởng phòng Quản lý Đầu tư', experience: '15 năm phân tích cổ phiếu và quản lý danh mục tại VCSC và Maybank.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face', certificates: 'CFA, FRM', is_leader: 0, sort_order: 3, status: 'published' },
  { id: 4, name: 'Phạm Thị Lan Anh', position: 'Trưởng phòng Thuế Doanh nghiệp', experience: 'Hơn 12 năm tư vấn thuế cho doanh nghiệp FDI và tập đoàn trong nước.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&crop=face', certificates: 'ACCA, CTA', is_leader: 0, sort_order: 4, status: 'published' },
  { id: 5, name: 'Hoàng Văn Nam', position: 'Chuyên gia Hoạch định Cá nhân', experience: 'Chuyên sâu về kế hoạch hưu trí, giáo dục tài chính và di sản gia đình.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face', certificates: 'CFP, ChFC', is_leader: 0, sort_order: 5, status: 'published' },
  { id: 6, name: 'Nguyễn Thị Bích Ngọc', position: 'Chuyên gia Quản lý Rủi ro', experience: 'Kinh nghiệm xây dựng mô hình rủi ro và chiến lược phòng ngừa biến động thị trường.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&crop=face', certificates: 'FRM, PRM', is_leader: 0, sort_order: 6, status: 'published' },
]

export default function TeamPage() {
  usePageTitle('Đội ngũ')
  const { team } = useSite()

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
  }, [team])

  const leaders = (team.length > 0 ? team.filter(m => m.is_leader) : DEFAULT_LEADERS).slice(0, 2)
  const experts = (team.length > 0 ? team.filter(m => !m.is_leader) : DEFAULT_EXPERTS).slice(0, 8)

  return (
    <>
      <section className="tc-page-hero">
        <div className="wd-container">
          <p className="tc-ph-label">Đội ngũ</p>
          <h1 className="tc-ph-title">Chuyên gia dẫn đường<br />tài chính của bạn</h1>
          <p className="tc-ph-sub">Mỗi chuyên gia đều có chứng chỉ quốc tế và kinh nghiệm thực chiến tại các tổ chức tài chính hàng đầu Việt Nam và quốc tế.</p>
        </div>
      </section>

      <div className="tc-breadcrumb">
        <div className="wd-container">
          <Link to="/">Trang chủ</Link><span className="sep">/</span><span className="current">Đội ngũ</span>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <section style={{ background: 'var(--surface)', padding: 'clamp(36px,5vw,56px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="wd-container">
          <div className="row g-4 text-center">
            {[
              { num: '15+', label: 'Chuyên gia tài chính\nchứng chỉ quốc tế' },
              { num: '8+', label: 'Chứng chỉ quốc tế:\nCFA, ACCA, CFP, FRM' },
              { num: '200+', label: 'Năm kinh nghiệm\ntổng hợp toàn đội', teal: true },
              { num: 'Top 5', label: 'Công ty tư vấn tài chính\nuy tín tại TP.HCM' },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-3" data-reveal="" data-delay={i > 0 ? String(i) : undefined}>
                <div className="tc-achieve-card">
                  <div className="tc-achieve-num" style={item.teal ? { color: 'var(--teal)' } : undefined}>{item.num}</div>
                  <div className="tc-achieve-label" style={{ whiteSpace: 'pre-line' }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERS */}
      <section className="tc-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label">Ban lãnh đạo</div>
            <h2 className="tc-title">Những người <span>dẫn dắt</span><br />công ty</h2>
          </div>
          <div className="row g-5 mb-5">
            {leaders.map((m, i) => (
              <div key={m.id} className="col-lg-6" data-reveal="" data-delay={i > 0 ? '1' : undefined}>
                <div className="tc-expert-detail-card">
                  <img className="tc-edc-photo" src={m.avatar} alt={m.name} />
                  <div className="tc-edc-body">
                    <div className="tc-edc-name">{m.name}</div>
                    <div className="tc-edc-role">{m.position}</div>
                    <div className="tc-edc-exp">{m.experience}</div>
                    <p className="tc-edc-bio">{m.bio}</p>
                    <div className="tc-edc-certs">
                      {(m.certificates || '').split(',').map(cert => (
                        <span key={cert} className="tc-edc-cert">{cert.trim()}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTS */}
      <section className="tc-sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal="">
            <div className="tc-label">Đội ngũ chuyên gia</div>
            <h2 className="tc-title">Chuyên gia <span>từng lĩnh vực</span></h2>
            <p className="tc-sub tc-sub-center">Mỗi lĩnh vực tư vấn đều có chuyên gia giàu kinh nghiệm phụ trách, đảm bảo khách hàng luôn được tư vấn bởi người hiểu sâu nhất.</p>
          </div>
          <div className="row g-4">
            {experts.map((m, i) => (
              <div key={m.id} className="col-lg-3 col-md-6" data-reveal="" data-delay={String(i % 4)}>
                <div className="tc-expert-card">
                  <img className="tc-expert-photo" src={m.avatar} alt={m.name} />
                  <div className="tc-expert-info">
                    <div className="tc-expert-name">{m.name}</div>
                    <div className="tc-expert-title">{m.position}</div>
                    <p className="tc-expert-spec">{m.experience}</p>
                    {(m.certificates || '').split(',').map(cert => (
                      <span key={cert} className="tc-expert-badge">{cert.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="tc-cta-section" style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wd-container tc-cta-inner">
          <div className="text-center" data-reveal="">
            <h2 className="tc-cta-title" style={{ maxWidth: '560px', margin: '0 auto 16px' }}>Sẵn sàng làm việc với<br />đội ngũ chuyên gia của chúng tôi?</h2>
            <p className="tc-cta-sub" style={{ maxWidth: '440px', margin: '0 auto 32px' }}>Đặt lịch tư vấn miễn phí để gặp trực tiếp chuyên gia phù hợp với nhu cầu tài chính của bạn.</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/lien-he" className="tc-btn-white">Đặt lịch tư vấn miễn phí</Link>
              <Link to="/dich-vu" className="tc-btn-outline-white">Xem dịch vụ</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
