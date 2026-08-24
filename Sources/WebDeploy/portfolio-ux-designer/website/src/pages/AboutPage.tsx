import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle, parseLines } from '../utils/text'

interface TimelineItem {
  id: number
  year: string
  title: string
  description: string
}

export default function AboutPage() {
  const { settings, testimonials } = useSite()
  const [timeline, setTimeline] = useState<TimelineItem[]>([])

  useDocumentMeta({
    title: `Về tôi — ${settings.site_name || 'Đỗ Khánh Linh'} | Product Designer`,
    description: settings.about_hero_sub,
  })

  useEffect(() => {
    api.get<TimelineItem[]>('/public/timeline').then(setTimeline).catch(() => {})
  }, [])

  const aboutTags = parseLines(settings.about_tags)
  const skillGroups = [1, 2, 3].map(i => ({
    label: settings[`skillgroup${i}_label`],
    items: parseLines(settings[`skillgroup${i}_items`]),
  })).filter(g => g.label)

  return (
    <main>
      <section className="pux-page-hero">
        <span className="blob blob-a"></span>
        <span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="pux-crumb"><Link to="/">Trang chủ</Link> / Về tôi</div>
          <div className="eyebrow eyebrow-light" data-reveal>{settings.about_hero_eyebrow || 'Về tôi'}</div>
          <h1 className="sec-title on-dark" style={{ maxWidth: 640 }} data-reveal>{renderTitle(settings.about_hero_title || '6 năm theo đuổi *trải nghiệm sản phẩm tốt hơn.*')}</h1>
          <p className="sec-sub on-dark" data-reveal data-reveal-d1>{settings.about_hero_sub}</p>
        </div>
      </section>

      {/* BIO */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5" data-reveal>
              <div className="pux-strip-media" style={{ position: 'relative' }}>
                {settings.about_bio_image && <img src={settings.about_bio_image} alt="Chân dung Đỗ Khánh Linh, Product Designer" loading="lazy" />}
                {settings.about_bio_badge_number && (
                  <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 22px' }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', letterSpacing: '-.5px' }}>{settings.about_bio_badge_number}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{settings.about_bio_badge_label}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="eyebrow" data-reveal>{settings.about_bio_eyebrow || 'Giới thiệu'}</div>
              <h2 className="sec-title" data-reveal>{renderTitle(settings.about_bio_title || 'Tôi tin thiết kế tốt phải *đo lường được, không chỉ đẹp hơn.*')}</h2>
              <p className="sec-sub" data-reveal data-reveal-d1>{settings.about_bio_text1}</p>
              <p className="sec-sub mt-3" data-reveal data-reveal-d2>{settings.about_bio_text2}</p>
              <div className="d-flex flex-wrap gap-2 mt-4" data-reveal data-reveal-d3>
                {aboutTags.map(tag => (
                  <span className="pux-tag" key={tag}><span className="pux-tag-dot"></span>{tag}</span>
                ))}
              </div>
              {settings.about_cv_link && (
                <div className="mt-4" data-reveal>
                  <a href={settings.about_cv_link} target="_blank" rel="noopener noreferrer" className="pux-btn pux-btn-ghost">Tải CV / Portfolio PDF ↓</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE — HÀNH TRÌNH LÀM NGHỀ */}
      {timeline.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center mb-5">
              <div className="eyebrow justify-content-center" style={{ display: 'flex' }} data-reveal>{settings.timeline_eyebrow || 'Hành trình'}</div>
              <h2 className="sec-title" data-reveal>{renderTitle(settings.timeline_title || 'Từ UI Designer đến *Product Designer độc lập.*')}</h2>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="pux-timeline">
                  {timeline.map((t, i) => (
                    <div className="pux-tl-item" data-reveal data-reveal-d1={i % 4 === 1 ? true : undefined} data-reveal-d2={i % 4 === 2 ? true : undefined} data-reveal-d3={i % 4 === 3 ? true : undefined} key={t.id}>
                      <div className="pux-tl-dot">{i + 1}</div>
                      <div className="pux-tl-year">{t.year}</div>
                      <div className="pux-tl-title">{t.title}</div>
                      <div className="pux-tl-desc">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CÔNG CỤ & KỸ NĂNG */}
      {skillGroups.length > 0 && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="row g-5 align-items-start">
              <div className="col-lg-4" data-reveal>
                <div className="eyebrow">{settings.skills_eyebrow || 'Kỹ năng'}</div>
                <h2 className="sec-title">{renderTitle(settings.skills_title || 'Công cụ & *phương pháp.*')}</h2>
                <p className="sec-sub">{settings.skills_desc}</p>
              </div>
              <div className="col-lg-8">
                {skillGroups.map((g, i) => (
                  <div className={i < skillGroups.length - 1 ? 'mb-4' : ''} data-reveal data-reveal-d1={i === 1 ? true : undefined} data-reveal-d2={i === 2 ? true : undefined} key={g.label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>{g.label}</div>
                    <div className="d-flex flex-wrap gap-2">
                      {g.items.map(item => (
                        <span className="pux-tag" key={item}><span className="pux-tag-dot"></span>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS ĐẦY ĐỦ — HORIZONTAL-SCROLL */}
      {testimonials.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center mb-5">
              <div className="eyebrow justify-content-center" style={{ display: 'flex' }} data-reveal>{settings.testi_full_eyebrow || 'Khách hàng nói gì'}</div>
              <h2 className="sec-title" data-reveal>{renderTitle(settings.testi_full_title || 'Phản hồi từ *những người đã hợp tác.*')}</h2>
            </div>
            <div className="pux-hscroll" data-reveal>
              {testimonials.map(t => (
                <div className="pux-card p-4" key={t.id}>
                  <span className="pux-quote-mark">&quot;</span>
                  <p className="pux-quote-text">{t.content}</p>
                  <div className="pux-quote-author">
                    {t.author_avatar && <img src={t.author_avatar} className="pux-quote-avatar" alt={t.author_name} loading="lazy" />}
                    <div><div className="pux-quote-name">{t.author_name}</div><div className="pux-quote-role">{t.author_title}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
