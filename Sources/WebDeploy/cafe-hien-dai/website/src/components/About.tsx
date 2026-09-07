import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, renderAccentText } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ContentBlock { id: number; icon: string; title: string; description: string }
interface TimelineItem { id: number; year: string; phase: string; title: string; description: string }
interface TeamMember { id: number; name: string; position: string; bio: string; avatar: string }

export default function About() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `${settings.about_page_title || 'Giới thiệu'} — ${settings.site_name || 'MONO Coffee'}`,
    description: settings.about_page_sub,
  })

  const [values, setValues] = useState<ContentBlock[]>([])
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    Promise.all([
      api.get<ContentBlock[]>('/public/content-blocks?section=values'),
      api.get<TimelineItem[]>('/public/timeline-items'),
      api.get<TeamMember[]>('/public/team-members'),
    ]).then(([v, tl, tm]) => {
      setValues(v); setTimeline(tl); setTeam(tm)
    }).catch(() => {})
  }, [])

  const story1Paragraphs = (settings.about_story1_text || '').split('\n\n').filter(Boolean)
  const story2List = (settings.about_story2_list || '').split('\n').filter(Boolean)

  return (
    <>
      <header className="chd-page-hero">
        <div className="chd-container">
          <div className="chd-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Giới thiệu</span></div>
          <h1 className="chd-page-title">{settings.about_page_title || 'Giới thiệu'}</h1>
          <p className="chd-page-sub">{settings.about_page_sub}</p>
        </div>
      </header>

      {/* CÂU CHUYỆN */}
      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-story-row">
            <div className="chd-story-img" data-reveal>
              {settings.about_story1_image && <img src={settings.about_story1_image} alt={`Người sáng lập ${settings.site_name || 'MONO Coffee'} tại quầy pha chế`} />}
            </div>
            <div data-reveal data-delay="1">
              <div className="chd-story-badge">{settings.about_story1_badge}</div>
              <h2 className="chd-story-title">{renderAccentText(settings.about_story1_title)}</h2>
              {story1Paragraphs.map((p, i) => <p className="chd-story-text" key={i}>{p}</p>)}
            </div>
          </div>

          <div className="chd-story-row chd-reverse">
            <div className="chd-story-img" data-reveal>
              {settings.about_story2_image && <img src={settings.about_story2_image} alt="Hạt cà phê specialty được chọn lọc kỹ càng" />}
            </div>
            <div data-reveal data-delay="1">
              <div className="chd-story-badge">{settings.about_story2_badge}</div>
              <h2 className="chd-story-title">{renderAccentText(settings.about_story2_title)}</h2>
              <p className="chd-story-text">{settings.about_story2_text}</p>
              <ul className="chd-story-list">
                {story2List.map((li, i) => <li key={i}><i>✓</i>{li}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GIÁ TRỊ CỐT LÕI */}
      <section className="chd-sec chd-sec-alt">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.about_values_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.about_values_title)}</h2>
          </div>
          <div className="chd-values-grid" style={{ marginTop: 44 }}>
            {values.map((v, i) => (
              <div className="chd-value-card" key={v.id} data-reveal data-delay={String(i + 1)}>
                <div className="chd-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HÀNH TRÌNH */}
      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.about_timeline_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.about_timeline_title)}</h2>
          </div>
          <div className="chd-timeline" style={{ marginTop: 52 }}>
            {timeline.map((t, i) => (
              <div className="chd-timeline-item" key={t.id} data-reveal data-delay={String(i)}>
                <div className="chd-timeline-dot">{t.year}</div>
                <div className="chd-timeline-content">
                  <div className="chd-timeline-year">{t.phase}</div>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ĐỘI NGŨ */}
      <section className="chd-sec chd-sec-alt">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.about_team_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.about_team_title)}</h2>
            <p className="chd-sec-sub">{settings.about_team_sub}</p>
          </div>
          <div className="chd-team-grid" style={{ marginTop: 44 }}>
            {team.map((m, i) => (
              <div className="chd-team-card" key={m.id} data-reveal data-delay={String(i + 1)}>
                <div className="chd-team-photo">
                  {m.avatar && <img src={m.avatar} alt={`${m.name}, ${m.position}`} />}
                </div>
                <div className="chd-team-name">{m.name}</div>
                <div className="chd-team-role">{m.position}</div>
                <div className="chd-team-desc">{m.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="chd-cta-dark">
        <div className="chd-container">
          <div className="chd-cta-grid">
            <div className="chd-cta-content" data-reveal>
              <div className="chd-eyebrow">{settings.about_cta_eyebrow}</div>
              <h2>{renderAccentText(settings.about_cta_title)}</h2>
              <p>{settings.about_cta_text}</p>
              <Link to="/lien-he" className="chd-btn chd-btn-white">Liên hệ ngay</Link>
            </div>
            <div className="chd-cta-images" data-reveal data-delay="1">
              {settings.about_cta_image1 && <img src={settings.about_cta_image1} alt="Barista pha chế tại quầy" />}
              {settings.about_cta_image2 && <img src={settings.about_cta_image2} alt="Không gian quán tối giản" />}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
