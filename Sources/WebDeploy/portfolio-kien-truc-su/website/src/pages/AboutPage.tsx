import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle } from '../utils/text'

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
    title: `Về tôi — ${settings.site_name || 'Tuấn Đặng Studio'}`,
    description: settings.about_hero_sub,
  })

  useEffect(() => {
    api.get<TimelineItem[]>('/public/timeline').then(setTimeline).catch(() => {})
  }, [])

  const philosophy = [1, 2, 3].map(i => ({
    title: settings[`philosophy${i}_title`],
    text: settings[`philosophy${i}_text`],
  })).filter(p => p.title)

  return (
    <main>
      <section className="pkt-page-hero sec-light">
        <div className="pkt-container">
          <div className="pkt-eyebrow" data-reveal>Về tôi</div>
          <h1 data-reveal>{renderTitle(settings.about_hero_title || 'Đặng Minh Tuấn\n*Kiến trúc sư độc lập*')}</h1>
          <p data-reveal data-reveal-d1>{settings.about_hero_sub}</p>
        </div>
      </section>

      {/* BIO — ALTERNATING STRIP */}
      <section className="sec-pad sec-light" style={{ paddingTop: 0 }}>
        <div className="pkt-container">
          <div className="pkt-strip">
            {settings.about_bio_image && (
              <img className="pkt-strip-img" data-reveal src={settings.about_bio_image} alt="Kiến trúc sư tại studio" loading="lazy" />
            )}
            <div className="pkt-strip-text" data-reveal data-reveal-d1>
              <div className="pkt-eyebrow">{settings.about_bio_eyebrow || 'Đôi nét về tôi'}</div>
              <h3>{renderTitle(settings.about_bio_title || 'Từ văn phòng lớn *đến studio của riêng mình*')}</h3>
              <p>{settings.about_bio_text1}</p>
              <p>{settings.about_bio_text2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRIẾT LÝ */}
      {philosophy.length > 0 && (
        <section className="sec-pad sec-surface">
          <div className="pkt-container">
            <div className="pkt-sec-head center" data-reveal>
              <div className="pkt-eyebrow center">{settings.philosophy_eyebrow || 'Triết lý thiết kế'}</div>
              <h2 className="pkt-sec-title">{renderTitle(settings.philosophy_title || 'Kiến trúc phục vụ *cách sống,*\nkhông phải ngược lại')}</h2>
            </div>
            <div className="pkt-feature-row" data-reveal data-reveal-d1>
              {philosophy.map((p, i) => (
                <div className="pkt-feature" key={i}>
                  <span className="pkt-feature-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIMELINE */}
      {timeline.length > 0 && (
        <section className="sec-pad sec-light">
          <div className="pkt-container-narrow">
            <div className="pkt-sec-head" data-reveal>
              <div className="pkt-eyebrow">{settings.timeline_eyebrow || 'Hành trình'}</div>
              <h2 className="pkt-sec-title">{renderTitle(settings.timeline_title || '15 năm *làm nghề*')}</h2>
            </div>
            <div className="pkt-timeline" data-reveal data-reveal-d1>
              {timeline.map(t => (
                <div className="pkt-tl-item" key={t.id}>
                  <div className="pkt-tl-year">{t.year}</div>
                  <div className="pkt-tl-body">
                    <h4>{t.title}</h4>
                    <p>{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS ĐẦY ĐỦ */}
      {testimonials.length > 0 && (
        <section className="sec-pad sec-surface">
          <div className="pkt-container">
            <div className="pkt-sec-head center" data-reveal>
              <div className="pkt-eyebrow center">{settings.testi_full_eyebrow || 'Khách hàng nói gì'}</div>
              <h2 className="pkt-sec-title">{renderTitle(settings.testi_full_title || 'Những nhận xét *tôi trân trọng nhất*')}</h2>
            </div>
            <div className="pkt-testi-grid" data-reveal data-reveal-d1>
              {testimonials.map(t => (
                <div className="pkt-testi-card" key={t.id}>
                  <blockquote>&quot;{t.content}&quot;</blockquote>
                  <cite><b>{t.author_name}</b> — {t.author_title}</cite>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pkt-cta-band sec-light">
        <div className="pkt-container-narrow" data-reveal>
          <div className="pkt-eyebrow center">{settings.cta_about_eyebrow || 'Cùng làm việc'}</div>
          <h2>{renderTitle(settings.cta_about_title || 'Kể cho tôi nghe *về ngôi nhà bạn đang nghĩ tới*')}</h2>
          <Link to="/lien-he" className="pkt-btn pkt-btn-accent">
            Đặt lịch tư vấn miễn phí
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
