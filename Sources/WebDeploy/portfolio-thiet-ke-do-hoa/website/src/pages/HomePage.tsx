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
  image: string
  has_case_study: number
}

// Bento layout khớp template: item 1 = b-lg (lớn), item 2 = b-sm (dọc), item 3-4 = ô thường
const BENTO_CLASS = ['b-lg', 'b-sm', '', '']

export default function HomePage() {
  const { settings, testimonials } = useSite()
  const [featured, setFeatured] = useState<Project[]>([])

  useDocumentMeta({
    title: settings.meta_title || 'KHOA Design Studio — Thiết kế Nhận diện Thương hiệu & Bao bì',
    description: settings.meta_description,
  })

  useEffect(() => {
    api.get<Project[]>('/public/featured-projects').then(setFeatured).catch(() => {})
  }, [])

  useCounterAnimation([settings])

  const teaser = testimonials[0]

  return (
    <main>
      <HeroSlider />

      {/* FEATURE-ICON-ROW — 3 chuyên môn */}
      <section className="ptk-sec-tight">
        <div className="ptk-container">
          <div className="ptk-feat-row" data-reveal>
            <div className="ptk-feat">
              <div className="ptk-feat-num">01</div>
              <div className="ptk-feat-t">{settings.home_feat1_title}</div>
              <p className="ptk-feat-p">{settings.home_feat1_desc}</p>
            </div>
            <div className="ptk-feat">
              <div className="ptk-feat-num">02</div>
              <div className="ptk-feat-t">{settings.home_feat2_title}</div>
              <p className="ptk-feat-p">{settings.home_feat2_desc}</p>
            </div>
            <div className="ptk-feat">
              <div className="ptk-feat-num">03</div>
              <div className="ptk-feat-t">{settings.home_feat3_title}</div>
              <p className="ptk-feat-p">{settings.home_feat3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO-GRID — dự án nổi bật */}
      {featured.length > 0 && (
        <section className="ptk-sec ptk-sec-line">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>{settings.home_bento_eyebrow}</div>
            <h2 className="ptk-title" data-reveal>{renderTitle(settings.home_bento_title)}</h2>
            <p className="ptk-sub" data-reveal style={{ marginBottom: 44 }}>{settings.home_bento_sub}</p>
            <div className="ptk-bento" data-reveal>
              {featured.map((p, i) => (
                <Link key={p.id} to={p.has_case_study ? `/du-an/${p.slug}` : '/du-an'} className={`ptk-bento-item ${BENTO_CLASS[i] ?? ''}`.trim()}>
                  {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
                  <div className="ptk-bento-cap"><span className="ptk-bento-tag">{p.category}</span><span className="ptk-bento-name">{p.title}</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STAT-BAR */}
      <section className="ptk-sec-tight ptk-sec-dark">
        <div className="ptk-container">
          <div className="ptk-stats-grid" data-reveal>
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <div className="ptk-stat-num" data-counter={settings[`stat${i}_number`] || '0'} data-suffix={settings[`stat${i}_suffix`] || ''}>0</div>
                <div className="ptk-stat-label">{settings[`stat${i}_label`]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial teaser */}
      {teaser && (
        <section className="ptk-sec">
          <div className="ptk-container">
            <div className="ptk-2col">
              <div data-reveal>
                <div className="ptk-eyebrow">{settings.home_testi_eyebrow}</div>
                <h2 className="ptk-title">{renderTitle(settings.home_testi_title)}</h2>
                <Link to="/ve-toi" className="ptk-btn" style={{ marginTop: 24 }}>{settings.home_testi_link_text || 'Xem tất cả đánh giá'}</Link>
              </div>
              <div className="ptk-testi" data-reveal>
                <p className="ptk-testi-quote">&quot;{teaser.content}&quot;</p>
                <div className="ptk-testi-person">
                  {teaser.author_avatar && <img src={teaser.author_avatar} alt={`Chân dung ${teaser.author_name}`} className="ptk-testi-avt" loading="lazy" />}
                  <div>
                    <div className="ptk-testi-name">{teaser.author_name}</div>
                    <div className="ptk-testi-role">{teaser.author_title}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="ptk-cta-band">
        <div className="ptk-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }} data-reveal>
          <h2 className="ptk-cta-h">{renderTitle(settings.cta_home_title)}</h2>
          <Link to="/lien-he" className="ptk-btn ptk-btn-white" style={{ borderColor: '#fff' }}>{settings.cta_home_button || 'Nhận báo giá miễn phí'}</Link>
        </div>
      </section>
    </main>
  )
}
