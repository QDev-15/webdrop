import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { api } from '../api/client'
import HeroSlider from '../components/HeroSlider'
import { renderTitle } from '../utils/text'

interface Project {
  id: number
  title: string
  slug: string
  category: string
  location: string
  year: string
  image: string
  has_case_study: number
}

export default function HomePage() {
  const { settings } = useSite()
  const [featured, setFeatured] = useState<Project[]>([])

  useDocumentMeta({
    title: `${settings.site_name || 'Tuấn Đặng Studio'} — Kiến trúc sư độc lập | Nhà ở dân dụng & Cải tạo công trình cũ tại Hà Nội`,
    description: settings.site_description,
  })

  useEffect(() => {
    api.get<Project[]>('/public/featured-projects').then(setFeatured).catch(() => {})
  }, [])

  useCounterAnimation([settings])

  const listItems = [1, 2, 3, 4].map(i => ({
    num: String(i).padStart(2, '0'),
    title: settings[`home_list${i}_title`],
    desc: settings[`home_list${i}_desc`],
  })).filter(l => l.title)

  return (
    <main>
      <HeroSlider />

      {/* GIỚI THIỆU NGẮN — LIST-ELEGANT */}
      <section className="sec-pad sec-light">
        <div className="pkt-container">
          <div className="row g-5">
            <div className="col-lg-5">
              <div className="pkt-eyebrow" data-reveal>{settings.home_intro_eyebrow || 'Chuyên môn'}</div>
              <h2 className="pkt-sec-title" data-reveal>{renderTitle(settings.home_intro_title || 'Hai hướng đi, *một triết lý*')}</h2>
              <p className="pkt-sec-sub" data-reveal data-reveal-d1>{settings.home_intro_sub}</p>
            </div>
            <div className="col-lg-7">
              <ul className="pkt-list-elegant" data-reveal data-reveal-d1>
                {listItems.map(l => (
                  <li key={l.num}>
                    <span className="pkt-list-num">{l.num}</span>
                    <span className="pkt-list-title">{l.title}</span>
                    <span className="pkt-list-desc">{l.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DỰ ÁN NỔI BẬT — GRID-CARDS */}
      {featured.length > 0 && (
        <section className="sec-pad sec-surface">
          <div className="pkt-container">
            <div className="pkt-sec-head" data-reveal>
              <div className="pkt-eyebrow">{settings.home_projects_eyebrow || 'Dự án nổi bật'}</div>
              <h2 className="pkt-sec-title">{renderTitle(settings.home_projects_title || 'Một vài công trình *gần đây*')}</h2>
              <p className="pkt-sec-sub">{settings.home_projects_sub}</p>
            </div>
            <div className="pkt-featured-grid">
              {featured.map((p, i) => (
                <Link
                  key={p.id}
                  to={p.has_case_study ? `/du-an/${p.slug}` : '/du-an'}
                  className="pkt-project-card"
                  data-reveal
                  data-reveal-d1={i === 1 ? true : undefined}
                  data-reveal-d2={i === 2 ? true : undefined}
                >
                  <img className="pkt-project-thumb" src={p.image} alt={`${p.title} — ${p.location}`} loading="lazy" />
                  <div className="pkt-project-cat">{p.category} · {p.location}</div>
                  <div className="pkt-project-name">{p.title}</div>
                  <div className="pkt-project-loc">{p.year && `Hoàn thành ${p.year}`}</div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-5" data-reveal>
              <Link to="/du-an" className="pkt-btn pkt-btn-accent">
                Xem toàn bộ dự án
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* STAT-BAR */}
      <section className="sec-pad sec-dark">
        <div className="pkt-container">
          <div className="pkt-stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div data-reveal data-reveal-d1={i === 2 ? true : undefined} data-reveal-d2={i === 3 ? true : undefined} data-reveal-d3={i === 4 ? true : undefined} key={i}>
                <div className="pkt-stat-num">
                  <span data-counter={settings[`stat${i}_number`] || '0'} data-suffix={settings[`stat${i}_suffix`] || ''}>0</span>
                  {settings[`stat${i}_suffix`] && <span className="u">{settings[`stat${i}_suffix`]}</span>}
                </div>
                <div className="pkt-stat-label">{settings[`stat${i}_label`]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRIẾT LÝ — ALTERNATING-STRIPS */}
      <section className="sec-pad sec-light">
        <div className="pkt-container">
          <div className="pkt-strip">
            {settings.home_strip_image && (
              <img className="pkt-strip-img" data-reveal src={settings.home_strip_image} alt="Không gian nội thất tối giản" loading="lazy" />
            )}
            <div className="pkt-strip-text" data-reveal data-reveal-d1>
              <div className="pkt-eyebrow">{settings.home_strip_eyebrow || 'Cách chúng tôi làm việc'}</div>
              <h3>{renderTitle(settings.home_strip_title || 'Lắng nghe trước, *vẽ sau*')}</h3>
              <p>{settings.home_strip_text1}</p>
              <p>{settings.home_strip_text2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL TEASER */}
      {settings.home_testi_quote && (
        <section className="sec-pad sec-surface">
          <div className="pkt-container">
            <div className="pkt-eyebrow center" data-reveal>{settings.home_testi_eyebrow || 'Khách hàng nói gì'}</div>
            <div className="pkt-quote" data-reveal data-reveal-d1>
              <blockquote>&quot;{settings.home_testi_quote}&quot;</blockquote>
              <div className="pkt-quote-name">{settings.home_testi_name}</div>
              <div className="pkt-quote-role">{settings.home_testi_role}</div>
            </div>
            <div className="text-center mt-5" data-reveal>
              <Link to="/ve-toi" className="pkt-btn">
                Đọc thêm nhận xét khách hàng
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA BAND */}
      <section className="pkt-cta-band sec-light">
        <div className="pkt-container-narrow" data-reveal>
          <div className="pkt-eyebrow center">{settings.cta_home_eyebrow || 'Bắt đầu dự án của bạn'}</div>
          <h2>{renderTitle(settings.cta_home_title || 'Bạn đang có một khu đất, *hay một ngôi nhà cần cải tạo?*')}</h2>
          <Link to="/lien-he" className="pkt-btn pkt-btn-accent">
            Đặt lịch tư vấn miễn phí
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
