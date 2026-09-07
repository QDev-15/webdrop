import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, renderAccentText } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'
import Testimonials from '../components/Testimonials'

interface ContentBlock { id: number; icon: string; title: string; description: string }
interface MenuItem { id: number; name: string; description: string; price: number | null; image: string; badge: string }
interface Space { id: number; name: string; overlay_text: string; image: string }
interface Faq { id: number; question: string; answer: string }

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return price.toLocaleString('vi-VN') + 'đ'
}

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'MONO Coffee',
    description: settings.meta_description,
  })

  const [features, setFeatures] = useState<ContentBlock[]>([])
  const [featuredMenu, setFeaturedMenu] = useState<MenuItem[]>([])
  const [spaces, setSpaces] = useState<Space[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    Promise.all([
      api.get<ContentBlock[]>('/public/content-blocks?section=why-us'),
      api.get<MenuItem[]>('/public/featured-menu-items'),
      api.get<Space[]>('/public/spaces'),
      api.get<Faq[]>('/public/faqs'),
    ]).then(([f, m, sp, fq]) => {
      setFeatures(f); setFeaturedMenu(m); setSpaces(sp); setFaqs(fq)
    }).catch(() => {})
  }, [])

  const storyList = (settings.home_story_list || '').split('\n').filter(Boolean)

  return (
    <>
      <HeroSlider />

      {/* VÌ SAO CHỌN */}
      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.home_features_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.home_features_title)}</h2>
            <p className="chd-sec-sub">{settings.home_features_sub}</p>
          </div>
          <div className="chd-feature-grid" style={{ marginTop: 48 }}>
            {features.map((f, i) => (
              <div className="chd-feature" key={f.id} data-reveal data-delay={String((i % 4) + 1)}>
                <div className="chd-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU NỔI BẬT */}
      <section className="chd-sec chd-sec-alt">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.home_menu_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.home_menu_title)}</h2>
            <p className="chd-sec-sub">{settings.home_menu_sub}</p>
          </div>
          <div className="chd-drink-grid" style={{ marginTop: 48 }}>
            {featuredMenu.map((item, i) => (
              <div className="chd-drink-card" key={item.id} data-reveal data-delay={String((i % 4) + 1)}>
                <div className="chd-drink-thumb">
                  {item.image && <img src={item.image} alt={item.name} loading="lazy" />}
                </div>
                <div className="chd-drink-body">
                  {item.badge && <span className="chd-drink-tag">{item.badge}</span>}
                  <div className="chd-drink-name">{item.name}</div>
                  <div className="chd-drink-desc">{item.description}</div>
                  <div className="chd-drink-price">{formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <Link to="/menu" className="chd-btn chd-btn-ghost">Xem toàn bộ thực đơn</Link>
          </div>
        </div>
      </section>

      {/* TRIẾT LÝ THƯƠNG HIỆU */}
      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-story-row">
            <div className="chd-story-img" data-reveal>
              {settings.home_story_image && <img src={settings.home_story_image} alt="Hạt cà phê specialty rang mới" />}
            </div>
            <div data-reveal data-delay="1">
              <div className="chd-story-badge">{settings.home_story_badge}</div>
              <h3 className="chd-story-title">{renderAccentText(settings.home_story_title)}</h3>
              <p className="chd-story-text">{settings.home_story_text}</p>
              <ul className="chd-story-list">
                {storyList.map((li, i) => <li key={i}><i>✓</i>{li}</li>)}
              </ul>
              <Link to="/gioi-thieu" className="chd-btn chd-btn-ghost" style={{ marginTop: 8 }}>Đọc câu chuyện thương hiệu</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <section className="chd-stats">
        <div className="chd-container">
          <div className="chd-stats-grid">
            <div className="chd-stat" data-reveal><div className="chd-stat-num"><span>6</span>+</div><div className="chd-stat-label">Năm hoạt động</div></div>
            <div className="chd-stat" data-reveal data-delay="1"><div className="chd-stat-num"><span>300</span>+</div><div className="chd-stat-label">Ly phục vụ/ngày</div></div>
            <div className="chd-stat" data-reveal data-delay="2"><div className="chd-stat-num"><span>12</span></div><div className="chd-stat-label">Công thức pha chuẩn</div></div>
            <div className="chd-stat" data-reveal data-delay="3"><div className="chd-stat-num"><span>4</span>.8★</div><div className="chd-stat-label">Đánh giá trung bình</div></div>
          </div>
        </div>
      </section>

      {/* KHÔNG GIAN QUÁN — preview */}
      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.home_space_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.home_space_title)}</h2>
            <p className="chd-sec-sub">{settings.home_space_sub}</p>
          </div>
          <div className="chd-space-grid" style={{ marginTop: 48 }}>
            {spaces.map((sp, i) => (
              <div className="chd-space-card" key={sp.id} data-reveal data-delay={String(i + 1)}>
                {sp.image && <img src={sp.image} alt={sp.name} loading="lazy" />}
                <div className="chd-space-overlay"></div>
                <div className="chd-space-info">
                  <h3>{sp.name}</h3>
                  <span>{sp.overlay_text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <Link to="/khong-gian" className="chd-btn chd-btn-accent">Khám phá toàn bộ không gian</Link>
          </div>
        </div>
      </section>

      {/* ĐÁNH GIÁ */}
      <section className="chd-sec chd-sec-alt">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.home_testi_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.home_testi_title)}</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.home_faq_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.home_faq_title)}</h2>
          </div>
          <div className="chd-faq-list" style={{ marginTop: 44 }} data-reveal data-delay="1">
            {faqs.map((f, i) => (
              <div key={f.id} className={`chd-faq-item${openFaq === i ? ' chd-open' : ''}`}>
                <button className="chd-faq-q" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.question}<span className="chd-faq-icon">+</span>
                </button>
                <div className="chd-faq-a">{f.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA DARK */}
      <section className="chd-cta-dark">
        <div className="chd-container">
          <div className="chd-cta-grid">
            <div className="chd-cta-content" data-reveal>
              <div className="chd-eyebrow">{settings.home_cta_eyebrow}</div>
              <h2>{renderAccentText(settings.home_cta_title)}</h2>
              <p>{settings.home_cta_text}</p>
              <div className="chd-slide-actions" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/lien-he" className="chd-btn chd-btn-white">Đặt chỗ / Liên hệ</Link>
                <Link to="/menu" className="chd-btn chd-btn-outline-light">Xem thực đơn</Link>
              </div>
            </div>
            <div className="chd-cta-images" data-reveal data-delay="1">
              {settings.home_cta_image1 && <img src={settings.home_cta_image1} alt="Không gian quán buổi sáng" />}
              {settings.home_cta_image2 && <img src={settings.home_cta_image2} alt="Pha chế pour over" />}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
