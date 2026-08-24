import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { api } from '../api/client'
import HeroSlider from '../components/HeroSlider'
import { renderTitle, parseLines } from '../utils/text'

interface Project {
  id: number
  title: string
  slug: string
  category: string
  image: string
  has_case_study: number
}

const BENTO_CLASS = ['b-wide b-tall', 'b-tall', '', '']

export default function HomePage() {
  const { settings, testimonials } = useSite()
  const [featured, setFeatured] = useState<Project[]>([])

  useDocumentMeta({
    title: `${settings.site_name || 'Đỗ Khánh Linh'} — Product Designer | UX cho Mobile App & SaaS Dashboard`,
    description: settings.site_description,
  })

  useEffect(() => {
    api.get<Project[]>('/public/featured-projects').then(setFeatured).catch(() => {})
  }, [])

  useCounterAnimation([settings])

  const introTags = parseLines(settings.home_intro_tags)
  const teaser = testimonials.slice(0, 3)

  return (
    <main>
      <HeroSlider />

      {/* INTRO NGẮN */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5" data-reveal>
              <div className="pux-strip-media">
                {settings.home_intro_image && <img src={settings.home_intro_image} alt="Đỗ Khánh Linh làm việc tại studio thiết kế" loading="lazy" />}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="eyebrow" data-reveal>{settings.home_intro_eyebrow || 'Giới thiệu'}</div>
              <h2 className="sec-title" data-reveal>{renderTitle(settings.home_intro_title || 'Từ nghiên cứu người dùng đến *giao diện production-ready.*')}</h2>
              <p className="sec-sub" data-reveal data-reveal-d1>{settings.home_intro_text1}</p>
              <p className="sec-sub mt-3" data-reveal data-reveal-d2>{settings.home_intro_text2}</p>
              <div className="d-flex flex-wrap gap-2 mt-4" data-reveal data-reveal-d3>
                {introTags.map(tag => (
                  <span className="pux-tag" key={tag}><span className="pux-tag-dot"></span>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DỰ ÁN NỔI BẬT — BENTO-GRID */}
      {featured.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-5">
              <div>
                <div className="eyebrow" data-reveal>{settings.home_projects_eyebrow || 'Dự án nổi bật'}</div>
                <h2 className="sec-title mb-0" data-reveal>{renderTitle(settings.home_projects_title || 'Một vài công việc *gần đây.*')}</h2>
              </div>
              <Link to="/du-an" className="pux-btn pux-btn-ghost" data-reveal>Xem tất cả dự án →</Link>
            </div>
            <div className="pux-bento" data-reveal>
              {featured.map((p, i) => (
                <Link
                  key={p.id}
                  to={p.has_case_study ? `/du-an/${p.slug}` : '/du-an'}
                  className={`pux-bento-item ${BENTO_CLASS[i] ?? ''}`.trim()}
                >
                  {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
                  <div className="pux-bento-cat">{p.category}</div>
                  <div className="pux-bento-name">{p.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STAT BAR */}
      <section className="sec-dark" style={{ padding: 'clamp(56px,8vw,88px) 0' }}>
        <div className="wd-container">
          <div className="pux-stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div data-reveal data-reveal-d1={i === 2 ? true : undefined} data-reveal-d2={i === 3 ? true : undefined} data-reveal-d3={i === 4 ? true : undefined} key={i}>
                <div className="pux-stat-num" data-counter={settings[`stat${i}_number`] || '0'} data-suffix={settings[`stat${i}_suffix`] || ''}>0</div>
                <div className="pux-stat-label">{settings[`stat${i}_label`]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL TEASER */}
      {teaser.length > 0 && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="text-center mb-5">
              <div className="eyebrow justify-content-center" data-reveal style={{ display: 'flex' }}>{settings.home_testi_eyebrow || 'Khách hàng nói gì'}</div>
              <h2 className="sec-title" data-reveal>{renderTitle(settings.home_testi_title || 'Được tin tưởng bởi *đội ngũ sản phẩm.*')}</h2>
            </div>
            <div className="row g-4">
              {teaser.map((t, i) => (
                <div className="col-md-4" data-reveal data-reveal-d1={i === 1 ? true : undefined} data-reveal-d2={i === 2 ? true : undefined} key={t.id}>
                  <div className="pux-card p-4">
                    <span className="pux-quote-mark">&quot;</span>
                    <p className="pux-quote-text">{t.content}</p>
                    <div className="pux-quote-author">
                      {t.author_avatar && <img src={t.author_avatar} className="pux-quote-avatar" alt={t.author_name} loading="lazy" />}
                      <div><div className="pux-quote-name">{t.author_name}</div><div className="pux-quote-role">{t.author_title}</div></div>
                    </div>
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
