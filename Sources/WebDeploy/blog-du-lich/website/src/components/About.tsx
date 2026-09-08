import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// Tiêu đề có cú pháp *chữ* -> <strong> — khớp bản template gốc.
function renderTitle(text: string) {
  return (text || '').split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*')
      ? <strong key={i}>{part.slice(1, -1)}</strong>
      : <span key={i}>{part}</span>
  )
}

// Props data-reveal[+delay] cho phần tử thứ i trong 1 nhóm.
function revealAt(i: number): Record<string, string> {
  const p: Record<string, string> = { 'data-reveal': '' }
  if (i > 0 && i < 4) p[`data-reveal-d${i}`] = ''
  return p
}

export default function About() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Về tôi — ${settings.author_name || 'Lam Trang'} | ${settings.site_name || 'Xê Dịch'}`,
    description: settings.about_hero_sub || 'Câu chuyện đằng sau Xê Dịch — hành trình từ nhân viên văn phòng thành người viết blog du lịch toàn thời gian.',
  })

  const stats = [1, 2, 3, 4]
    .map(n => ({ num: settings[`about_stat${n}_number`], suffix: settings[`about_stat${n}_suffix`] || '', label: settings[`about_stat${n}_label`] }))
    .filter(s => s.num)

  const timeline = [1, 2, 3, 4, 5]
    .map(n => ({ year: settings[`about_timeline${n}_year`], title: settings[`about_timeline${n}_title`], text: settings[`about_timeline${n}_text`] }))
    .filter(t => t.year)

  const gear = [1, 2, 3, 4, 5]
    .map(n => ({ name: settings[`about_gear${n}_name`], desc: settings[`about_gear${n}_desc`], meta: settings[`about_gear${n}_meta`] }))
    .filter(g => g.name)

  return (
    <>
      <header className="bdl-page-hero">
        <div className="bdl-container">
          <div className="bdl-eyebrow" style={{ color: '#e0b568' }}>Xin chào</div>
          <h1 className="bdl-ph-title">Về tôi</h1>
          <p className="bdl-ph-sub">{settings.about_hero_sub || 'Người viết ra từng dòng nhật ký trên Xê Dịch — không phải một công ty du lịch, chỉ là một người thích đi hơn là đứng yên.'}</p>
        </div>
      </header>

      <section className="bdl-sec-pad">
        <div className="bdl-container">
          <div className="bdl-strip" data-reveal>
            {settings.about_strip_image && (
              <div className="bdl-strip-media">
                <img src={settings.about_strip_image} alt={`Chân dung ${settings.author_name || 'tác giả'} trong một chuyến đi`} loading="lazy" />
              </div>
            )}
            <div>
              <div className="bdl-strip-label">{settings.about_strip_label || `Xin chào, tôi là ${settings.author_name || 'Lam Trang'}`}</div>
              <h2 className="bdl-strip-title">{settings.about_strip_title || 'Từ nhân viên văn phòng đến người viết blog toàn thời gian'}</h2>
              {settings.about_strip_text1 && <p className="bdl-strip-text">{settings.about_strip_text1}</p>}
              {settings.about_strip_text2 && <p className="bdl-strip-text">{settings.about_strip_text2}</p>}
            </div>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="bdl-stat-bar">
          <div className="bdl-container">
            <div className="bdl-stats-grid">
              {stats.map((s, i) => (
                <div key={i} {...revealAt(i)}>
                  <div className="bdl-stat-num">{s.num}{s.suffix}</div>
                  <div className="bdl-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="bdl-sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="bdl-container">
            <div className="bdl-sec-head bdl-center bdl-mx-auto" style={{ maxWidth: 640 }} data-reveal>
              <div className="bdl-eyebrow" style={{ justifyContent: 'center' }}>Cột mốc</div>
              <h2 className="bdl-sec-title">Hành trình <strong>của {settings.site_name?.split(' ')[0] || 'Xê Dịch'}</strong></h2>
            </div>
            <div className="bdl-timeline" data-reveal data-reveal-d1>
              {timeline.map((t, i) => (
                <div className="bdl-tl-item" key={i}>
                  <div className="bdl-tl-dot">•</div>
                  <div className="bdl-tl-year">{t.year}</div>
                  <div className="bdl-tl-title">{t.title}</div>
                  <p className="bdl-tl-text">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gear.length > 0 && (
        <section className="bdl-sec-pad">
          <div className="bdl-container">
            <div className="bdl-sec-head" data-reveal>
              <div className="bdl-eyebrow">Được hỏi nhiều nhất</div>
              <h2 className="bdl-sec-title">Đồ nghề tôi <strong>luôn mang theo</strong></h2>
              <p className="bdl-sec-sub">Danh sách thiết bị đã đồng hành qua hầu hết các chuyến đi trong những năm qua.</p>
            </div>
            <div className="bdl-list-elegant" data-reveal data-reveal-d1>
              {gear.map((g, i) => (
                <div className="bdl-list-row" key={i}>
                  <div className="bdl-list-main">
                    <span className="bdl-list-name">{g.name}</span>
                    <div className="bdl-list-desc">{g.desc}</div>
                  </div>
                  <span className="bdl-list-meta">{g.meta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bdl-full-bleed" data-reveal>
        <div className="bdl-container">
          <h2 className="bdl-fb-title">{renderTitle(settings.about_cta_title || 'Có câu chuyện muốn *chia sẻ cùng tôi?*')}</h2>
          <p className="bdl-fb-sub">{settings.about_cta_text || 'Dù là góp ý bài viết, đề xuất hợp tác hay chỉ đơn giản là muốn hỏi đường — tôi luôn sẵn sàng lắng nghe.'}</p>
          <Link to="/lien-he" className="bdl-btn bdl-btn-accent">Liên hệ với tôi</Link>
        </div>
      </section>
    </>
  )
}
