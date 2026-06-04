import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import Reveal from '../Reveal'
import CtaForm from '../CtaForm'

export default function HomePage() {
  const { settings, slides, lawyers, cases, testimonials } = useSite()

  const heroImage    = (slides[0]?.image) || settings.hero_image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80&auto=format&fit=crop'
  const kicker       = settings.hero_kicker || 'Văn Phòng Luật Sư · Thành Lập 2009'
  const statCases    = settings.stat_cases  || '500+'
  const statYears    = settings.stat_years  || '15'
  const statLawyers  = settings.stat_lawyers|| '12'
  const statWinrate  = settings.stat_winrate|| '94%'
  const phone        = settings.site_phone  || '0900 000 000'

  const featuredLawyers = lawyers.filter(l => Number(l.is_partner) === 1).concat(
    lawyers.filter(l => Number(l.is_partner) !== 1)
  ).slice(0, 3)
  const featuredCases   = cases.slice(0, 5)
  const featuredTestis  = testimonials.slice(0, 3)

  const practiceStrips = [
    { num: '01', tag: 'Corporate & M&A', title: 'Luật Doanh Nghiệp & Mua Bán Sáp Nhập',
      desc: 'Tư vấn thành lập doanh nghiệp, soạn thảo hợp đồng, tái cơ cấu, M&A và giải thể. Đồng hành cùng doanh nghiệp từ khởi đầu đến tăng trưởng bền vững.' },
    { num: '02', tag: 'Labor Law', title: 'Luật Lao Động & Quan Hệ Người Sử Dụng',
      desc: 'Bảo vệ quyền lợi người lao động và doanh nghiệp trong các tranh chấp lao động, hợp đồng, bảo hiểm xã hội và kỷ luật sa thải.', alt: true },
    { num: '03', tag: 'Real Estate', title: 'Luật Bất Động Sản & Xây Dựng',
      desc: 'Rà soát pháp lý dự án, soạn thảo hợp đồng mua bán, thuê mướn, tranh chấp đất đai và hỗ trợ thủ tục cấp phép xây dựng.' },
    { num: '04', tag: 'Litigation', title: 'Tranh Tụng & Giải Quyết Tranh Chấp',
      desc: 'Đại diện thân chủ tại tất cả các cấp tòa án, hòa giải và trọng tài. Đội ngũ luật sư tranh tụng giàu kinh nghiệm, tỷ lệ thắng kiện cao.', alt: true },
  ]

  return (
    <>
      {/* HERO */}
      <section className="lv-hero">
        <div className="lv-panel">
          <div className="lv-hero-kicker">{kicker}</div>
          <h1 className="lv-hero-heading">
            Bảo vệ<br/>
            <em>quyền lợi</em><br/>
            của bạn.
          </h1>
          <p className="lv-hero-sub">
            {settings.hero_sub || 'Hơn 15 năm kinh nghiệm trong các lĩnh vực luật doanh nghiệp, lao động, bất động sản và tranh tụng.'}
          </p>
          <div className="lv-hero-actions">
            <Link to="/lien-he" className="lv-btn-ghost-white">Tư Vấn Miễn Phí</Link>
            <Link to="/dich-vu" className="lv-btn-ghost-gold">Lĩnh Vực Hành Nghề</Link>
          </div>
          <div className="lv-hero-stats">
            <div className="lv-stat-item">
              <div className="lv-stat-num">{statCases}</div>
              <div className="lv-stat-label">Vụ việc<br/>thành công</div>
            </div>
            <div className="lv-stat-item">
              <div className="lv-stat-num">{statYears}</div>
              <div className="lv-stat-label">Năm kinh<br/>nghiệm</div>
            </div>
            <div className="lv-stat-item">
              <div className="lv-stat-num">{statLawyers}</div>
              <div className="lv-stat-label">Luật sư<br/>chuyên sâu</div>
            </div>
          </div>
        </div>
        <div className="lv-image">
          <img src={heroImage} alt="Văn phòng luật sư uy tín" />
          <div className="lv-image-overlay" />
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="lv-sec-pad">
        <div className="wd-container" style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
          <Reveal>
            <span className="lv-section-label">Lĩnh vực hành nghề</span>
            <h2 className="lv-section-title">Chuyên môn <em>toàn diện,</em><br/>giải pháp pháp lý tối ưu.</h2>
          </Reveal>
        </div>
        <div className="lv-strips">
          {practiceStrips.map((s, i) => (
            <Reveal key={i} className={`lv-strip${s.alt ? ' lv-strip-alt' : ''}`} tag="div">
              <div className="lv-strip-num"><span>{s.num}</span></div>
              <div className="lv-strip-content">
                <div className="lv-strip-tag">{s.tag}</div>
                <h3 className="lv-strip-title">{s.title}</h3>
                <p className="lv-strip-desc">{s.desc}</p>
                <Link to="/dich-vu" className="lv-strip-link">Tìm hiểu thêm</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STAT BAR */}
      <section className="lv-stats-bar">
        <div className="wd-container">
          <div className="lv-stats-grid">
            {[
              { val: statCases,   label: 'Vụ việc thành công' },
              { val: statYears,   label: 'Năm kinh nghiệm' },
              { val: statLawyers, label: 'Luật sư chuyên sâu' },
              { val: statWinrate, label: 'Tỷ lệ thắng kiện' },
            ].map((s, i) => (
              <Reveal key={i} delay={i} className="lv-stat-cell">
                <div className="lv-stat-big"><span>{s.val}</span></div>
                <div className="lv-stat-desc">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="lv-team-section lv-sec-pad">
        <div className="wd-container">
          <Reveal className="text-center" style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
            <span className="lv-section-label">Đội ngũ</span>
            <h2 className="lv-section-title">Những <em>luật sư</em><br/>dẫn đầu ngành.</h2>
            <p className="lv-section-sub" style={{ margin: '0 auto' }}>
              Đội ngũ luật sư được đào tạo tại các trường đại học hàng đầu, với kinh nghiệm tư vấn và tranh tụng thực chiến tại Việt Nam.
            </p>
          </Reveal>
          <div className="row g-4">
            {featuredLawyers.map((l, i) => (
              <div key={l.id} className="col-md-4">
                <Reveal delay={i}>
                  <div className="lv-lawyer-card">
                    <div className="lv-lawyer-photo">
                      <img src={l.avatar} alt={l.name} />
                    </div>
                    <h3 className="lv-lawyer-name">{l.name}</h3>
                    <div className="lv-lawyer-role">{l.role}</div>
                    <p className="lv-lawyer-spec">{l.speciality}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
          <Reveal className="text-center" style={{ marginTop: '36px' }}>
            <Link to="/luat-su" className="lv-btn-outline-dark">Xem tất cả luật sư</Link>
          </Reveal>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="lv-cases-section lv-sec-pad">
        <div className="wd-container">
          <Reveal style={{ marginBottom: 'clamp(40px,5vw,60px)' }}>
            <span className="lv-section-label on-dark">Vụ việc tiêu biểu</span>
            <h2 className="lv-section-title on-dark">Chứng minh qua <em>kết quả.</em></h2>
          </Reveal>
          <div className="lv-case-list">
            {featuredCases.map((c, i) => (
              <Reveal key={c.id} delay={i} className="lv-case">
                <div className="lv-case-left">
                  <div className="lv-case-tag">{c.category}</div>
                  <div className="lv-case-title">{c.title}</div>
                  <div className="lv-case-result">{c.outcome}</div>
                </div>
                <div className="lv-case-year">{c.year}</div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: '40px' }}>
            <Link to="/du-an" className="lv-btn-ghost-gold">Xem tất cả vụ việc</Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lv-testimonials-section lv-sec-pad">
        <div className="wd-container">
          <Reveal className="text-center" style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
            <span className="lv-section-label">Nhận xét thân chủ</span>
            <h2 className="lv-section-title">Uy tín xây dựng từ <em>kết quả thực tế.</em></h2>
          </Reveal>
          <div className="lv-quotes-grid">
            {featuredTestis.map((t, i) => (
              <Reveal key={t.id} delay={i} className="lv-quote">
                <p className="lv-quote-text">"{t.content}"</p>
                <div className="lv-quote-author">
                  <div className="lv-quote-name">{t.author_name}</div>
                  <div className="lv-quote-company">{t.author_title}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaForm
        heading={`Hãy để chúng tôi<br/><em>bảo vệ quyền lợi</em> của bạn.`}
        phone={`Hotline: ${phone}`}
        buttonLabel="Đăng Ký Tư Vấn Ngay"
        subtext="Tư vấn ban đầu miễn phí · Bảo mật thông tin · Phản hồi trong 24 giờ"
      />
    </>
  )
}
