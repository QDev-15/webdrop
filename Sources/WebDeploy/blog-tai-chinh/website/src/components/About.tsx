import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { renderTitle } from '../utils/text'

const VALUE_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
]

export default function About() {
  const { settings, timeline } = useSite()

  useDocumentMeta({
    title: `Về tôi — ${settings.site_name || 'La Bàn Tài Chính'}`,
    description: settings.about_intro,
  })

  useCounterAnimation([timeline.length, settings.stat_years_experience])

  const values = [1, 2, 3].map(i => ({
    title: settings[`about_value${i}_title`],
    desc: settings[`about_value${i}_desc`],
  }))

  return (
    <>
      <header className="btc-page-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=60')" }}>
        <div className="wd-container btc-page-header-in">
          <div className="btc-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Về tôi</span></div>
          <div className="btc-tag">{settings.about_tag || 'Người đứng sau La Bàn Tài Chính'}</div>
          <h1>Xin chào, tôi là <em style={{ color: 'var(--accent-mid)', fontStyle: 'normal' }}>{settings.about_name || 'Minh Thư'}</em></h1>
          <p>{settings.about_intro}</p>
        </div>
      </header>

      <section className="btc-sec">
        <div className="wd-container">
          <div className="btc-strip" data-reveal>
            <div className="btc-strip-visual">
              {settings.about_photo && (
                <img src={settings.about_photo} alt={`${settings.about_name || 'Minh Thư'} — người sáng lập La Bàn Tài Chính`} style={{ borderRadius: 14 }} />
              )}
            </div>
            <div className="btc-strip-text">
              <div className="btc-tag">{settings.about_story_tag || 'Câu chuyện của tôi'}</div>
              <h2 className="btc-h2">{renderTitle(settings.about_story_title || 'Từ ngân hàng đến *trang viết*')}</h2>
              <p className="btc-sub" style={{ maxWidth: '100%' }}>{settings.about_story_p1}</p>
              <p className="btc-sub" style={{ maxWidth: '100%', marginTop: 14 }}>{settings.about_story_p2}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="btc-sec btc-sec-dark">
        <div className="wd-container">
          <div className="btc-stats-grid">
            <div data-reveal><div className="btc-stat-num" data-counter={settings.stat_years_experience || '7'}>0</div><div className="btc-stat-label">Năm kinh nghiệm ngành tài chính</div></div>
            <div data-reveal data-delay="1"><div className="btc-stat-num" data-counter="180">0</div><div className="btc-stat-label">Bài viết đã xuất bản</div></div>
            <div data-reveal data-delay="2"><div className="btc-stat-num" data-counter={settings.stat_monthly_readers_num || '42'} data-suffix={settings.stat_monthly_readers_suffix || 'k'}>0</div><div className="btc-stat-label">Độc giả mỗi tháng</div></div>
            <div data-reveal data-delay="3"><div className="btc-stat-num" data-counter={settings.stat_newsletter_num || '12'} data-suffix={settings.stat_newsletter_suffix || 'k'}>0</div><div className="btc-stat-label">Người theo dõi bản tin</div></div>
          </div>
        </div>
      </section>

      {timeline.length > 0 && (
        <section className="btc-sec">
          <div className="wd-container">
            <div className="btc-center" data-reveal style={{ marginBottom: 48 }}>
              <div className="btc-tag" style={{ justifyContent: 'center' }}>{settings.about_timeline_tag || 'Hành trình'}</div>
              <h2 className="btc-h2">{renderTitle(settings.about_timeline_title || 'Các cột mốc *quan trọng*')}</h2>
            </div>
            <div className="btc-timeline" data-reveal data-delay="1">
              {timeline.map(item => (
                <div className="btc-timeline-item" key={item.id}>
                  <span className="btc-timeline-dot"></span>
                  <div className="btc-timeline-year">{item.year}</div>
                  <div className="btc-timeline-title">{item.title}</div>
                  <div className="btc-timeline-desc">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="btc-sec btc-sec-tint">
        <div className="wd-container">
          <div className="btc-center" data-reveal style={{ marginBottom: 44 }}>
            <div className="btc-tag" style={{ justifyContent: 'center' }}>{settings.about_value_tag || 'Nguyên tắc viết'}</div>
            <h2 className="btc-h2">{renderTitle(settings.about_value_title || 'Giá trị tôi *theo đuổi*')}</h2>
          </div>
          <div className="btc-value-row" data-reveal data-delay="1">
            {values.map((v, i) => (
              <div className="btc-value-item" key={i}>
                <span className="btc-value-icon">{VALUE_ICONS[i]}</span>
                <div className="btc-value-title">{v.title}</div>
                <div className="btc-value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="btc-sec-sm">
        <div className="wd-container">
          <div className="btc-cta-band" data-reveal>
            <div>
              <div className="btc-cta-title">{renderTitle(settings.about_cta_title || 'Có câu hỏi muốn *trao đổi riêng?*')}</div>
              <div className="btc-cta-sub">{settings.about_cta_sub}</div>
            </div>
            <Link to="/lien-he" className="btc-btn btc-btn-white">Liên hệ với tôi</Link>
          </div>
        </div>
      </section>
    </>
  )
}
