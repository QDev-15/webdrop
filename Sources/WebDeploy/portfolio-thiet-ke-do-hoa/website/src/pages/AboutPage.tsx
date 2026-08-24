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

interface ToolSkill {
  id: number
  name: string
  level_label: string
  level_percent: number
}

export default function AboutPage() {
  const { settings, testimonials } = useSite()
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [tools, setTools] = useState<ToolSkill[]>([])

  useDocumentMeta({
    title: `Về tôi — Trần Minh Khoa | KHOA Design Studio`,
    description: settings.about_hero_sub,
  })

  useEffect(() => {
    api.get<TimelineItem[]>('/public/timeline').then(setTimeline).catch(() => {})
    api.get<ToolSkill[]>('/public/tools-skills').then(setTools).catch(() => {})
  }, [])

  return (
    <main>
      <section className="ptk-page-hero">
        <div className="ptk-container">
          <div className="ptk-crumb"><Link to="/">Trang chủ</Link> / Về tôi</div>
          <h1 className="ptk-page-title">{renderTitle(settings.about_hero_title)}</h1>
          <p className="ptk-page-sub">{settings.about_hero_sub}</p>
        </div>
      </section>

      {/* Bio — ALTERNATING-STRIPS */}
      <section className="ptk-sec">
        <div className="ptk-container">
          <div className="ptk-strip" data-reveal>
            <div>
              <div className="ptk-eyebrow">{settings.about_bio_eyebrow}</div>
              <h2 className="ptk-title">{renderTitle(settings.about_bio_title)}</h2>
              <p className="ptk-sub" style={{ maxWidth: 'none', marginBottom: 16 }}>{settings.about_bio_text1}</p>
              <p className="ptk-sub" style={{ maxWidth: 'none' }}>{settings.about_bio_text2}</p>
            </div>
            <div className="ptk-strip-media">
              {settings.about_bio_image && <img src={settings.about_bio_image} alt="Chân dung Trần Minh Khoa, nhà thiết kế đồ họa" loading="lazy" />}
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      {timeline.length > 0 && (
        <section className="ptk-sec ptk-sec-line">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>{settings.timeline_eyebrow}</div>
            <h2 className="ptk-title" data-reveal style={{ marginBottom: 44 }}>{renderTitle(settings.timeline_title)}</h2>
            <div className="ptk-timeline" data-reveal>
              {timeline.map(t => (
                <div className="ptk-tl-item" key={t.id}>
                  <div className="ptk-tl-dot"></div>
                  <div className="ptk-tl-year">{t.year}</div>
                  <div className="ptk-tl-t">{t.title}</div>
                  <p className="ptk-tl-p">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HORIZONTAL-SCROLL — công cụ */}
      {tools.length > 0 && (
        <section className="ptk-sec">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>{settings.skills_eyebrow}</div>
            <h2 className="ptk-title" data-reveal style={{ marginBottom: 36 }}>{renderTitle(settings.skills_title)}</h2>
            <div className="ptk-hscroll" data-reveal>
              {tools.map(t => (
                <div className="ptk-tool-card" key={t.id}>
                  <div className="ptk-tool-name">{t.name}</div>
                  <div className="ptk-tool-lvl">{t.level_label}</div>
                  <div className="ptk-tool-bar"><span style={{ width: `${t.level_percent}%` }}></span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials đầy đủ — GRID-CARDS */}
      {testimonials.length > 0 && (
        <section className="ptk-sec ptk-sec-dark">
          <div className="ptk-container">
            <div className="ptk-eyebrow on-dark" data-reveal>{settings.testi_full_eyebrow}</div>
            <h2 className="ptk-title" data-reveal style={{ color: '#fff', marginBottom: 40 }}>{renderTitle(settings.testi_full_title)}</h2>
            <div className="row g-4" data-reveal>
              {testimonials.map(t => (
                <div className="col-md-6" key={t.id}>
                  <div className="ptk-testi" style={{ borderColor: 'rgba(255,255,255,.15)' }}>
                    <p className="ptk-testi-quote" style={{ color: '#fff' }}>&quot;{t.content}&quot;</p>
                    <div className="ptk-testi-person">
                      {t.author_avatar && <img src={t.author_avatar} alt={`Chân dung ${t.author_name}`} className="ptk-testi-avt" loading="lazy" />}
                      <div>
                        <div className="ptk-testi-name" style={{ color: '#fff' }}>{t.author_name}</div>
                        <div className="ptk-testi-role" style={{ color: 'rgba(255,255,255,.5)' }}>{t.author_title}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ptk-cta-band">
        <div className="ptk-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }} data-reveal>
          <h2 className="ptk-cta-h">{renderTitle(settings.cta_about_title)}</h2>
          <Link to="/lien-he" className="ptk-btn ptk-btn-white" style={{ borderColor: '#fff' }}>{settings.cta_about_button || 'Nhận báo giá miễn phí'}</Link>
        </div>
      </section>
    </main>
  )
}
