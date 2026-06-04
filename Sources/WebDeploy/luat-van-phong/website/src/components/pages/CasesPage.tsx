import { useState } from 'react'
import { useSite } from '../../contexts/SiteContext'
import Reveal from '../Reveal'
import CtaForm from '../CtaForm'

const CATEGORIES = ['Tất Cả', 'Luật Doanh Nghiệp', 'Tranh Tụng', 'Bất Động Sản', 'Luật Lao Động', 'Hình Sự Kinh Tế', 'Sở Hữu Trí Tuệ']

export default function CasesPage() {
  const { settings, cases, testimonials } = useSite()
  const phone = settings.site_phone || '0900 000 000'
  const [active, setActive] = useState('Tất Cả')

  const filtered = active === 'Tất Cả' ? cases : cases.filter(c => c.category === active)

  const statCases   = settings.stat_cases   || '500+'
  const statWinrate = settings.stat_winrate || '94%'
  const statYears   = settings.stat_years   || '15'

  return (
    <>
      {/* PAGE HERO */}
      <section className="lv-page-hero">
        <div className="wd-container">
          <Reveal><div className="lv-ph-kicker">Chứng minh qua kết quả</div></Reveal>
          <Reveal delay={1}><h1 className="lv-ph-title">Vụ Việc <em>Tiêu Biểu</em></h1></Reveal>
          <Reveal delay={2}><p className="lv-ph-sub">Mỗi vụ việc là một câu chuyện về sự tận tâm, chuyên môn và cam kết không bỏ cuộc của chúng tôi vì thân chủ.</p></Reveal>
        </div>
      </section>

      {/* INTRO STATS */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(52px,7vw,80px) 0' }}>
        <div className="wd-container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <Reveal>
                <span className="lv-section-label">Thành tích tổng hợp</span>
                <h2 className="lv-section-title">Số liệu <em>nói lên tất cả.</em></h2>
                <p className="lv-section-sub">Tất cả vụ việc trong danh mục này đã được giải quyết thành công — thông tin được ẩn danh để bảo vệ thân chủ.</p>
              </Reveal>
            </div>
            <div className="col-lg-7">
              <Reveal delay={1}>
                <div className="row g-3">
                  {[
                    { val: statCases,   label: 'Vụ việc thành công' },
                    { val: statWinrate, label: 'Tỷ lệ thắng kiện tổng' },
                    { val: '200T+',     label: 'Giá trị thu hồi cho thân chủ' },
                    { val: statYears,   label: 'Năm kinh nghiệm tích lũy' },
                  ].map((s, i) => (
                    <div key={i} className="col-6">
                      <div style={{ background: 'var(--warm)', padding: '28px', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'var(--heading-font)', fontSize: '48px', fontWeight: 300, color: 'var(--accent-mid)', lineHeight: 1, marginBottom: '8px' }}>{s.val}</div>
                        <div style={{ fontFamily: 'var(--body-font)', fontSize: '12px', fontWeight: 300, color: 'var(--text-3)', letterSpacing: '.5px' }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CASE LIST WITH FILTER */}
      <section style={{ background: 'var(--warm)', padding: 'clamp(48px,6vw,72px) 0' }}>
        <div className="wd-container">
          <Reveal style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: 'clamp(32px,4vw,48px)' }}>
            <div>
              <span className="lv-section-label">Danh mục vụ việc</span>
              <h2 className="lv-section-title" style={{ marginBottom: 0 }}>Tất cả vụ việc <em>tiêu biểu.</em></h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`case-filter-btn${active === cat ? ' active' : ''}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {filtered.map((c, i) => (
            <Reveal key={c.id}>
              <div className="lv-case-card">
                <div className="lv-case-meta">
                  <span className="lv-case-badge">{c.category}</span>
                  <span className="lv-case-date">{c.year} · {c.location}</span>
                </div>
                <h3 className="lv-case-card-title">{c.title}</h3>
                <p className="lv-case-summary">{c.summary}</p>
                <div className="lv-case-outcome">
                  <span className="lv-case-outcome-label">Kết quả</span>
                  <span className="lv-case-outcome-text">{c.outcome}</span>
                </div>
              </div>
            </Reveal>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)', fontFamily: 'var(--body-font)' }}>
              Không có vụ việc nào trong danh mục này.
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lv-testimonials-section lv-sec-pad">
        <div className="wd-container">
          <Reveal className="text-center" style={{ marginBottom: 'clamp(40px,5vw,56px)' }}>
            <span className="lv-section-label">Nhận xét thân chủ</span>
            <h2 className="lv-section-title">Lòng tin được <em>trao và giữ.</em></h2>
          </Reveal>
          <div className="lv-quotes-grid">
            {testimonials.slice(0, 3).map((t, i) => (
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

      <CtaForm
        heading={`Câu chuyện <em>thành công tiếp theo</em><br/>có thể là của bạn.`}
        phone={`Hotline: ${phone}`}
        buttonLabel="Tư Vấn Miễn Phí"
        subtext="Bảo mật · Miễn phí · 24/7"
      />
    </>
  )
}
