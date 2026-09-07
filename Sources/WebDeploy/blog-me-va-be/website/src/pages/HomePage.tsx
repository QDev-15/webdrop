import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderEmphasis } from '../utils/renderEmphasis'
import { api } from '../api/client'
import HeroSlider from '../components/HeroSlider'
import PostList, { PostCard, type Post } from '../components/PostList'

export default function HomePage() {
  const { settings, faqs } = useSite()
  const [featured, setFeatured] = useState<Post | null>(null)
  const [latest, setLatest] = useState<Post[]>([])
  const [popular, setPopular] = useState<Post[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [subState, setSubState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useDocumentMeta({
    title: settings.meta_title || 'Cỏ Non — Nhật Ký Nuôi Con Từ Trái Tim Một Người Mẹ',
    description: settings.meta_description,
  })

  useEffect(() => {
    api.get<Post[]>('/public/posts?featured=1&limit=1').then(r => setFeatured(r[0] || null)).catch(() => {})
    api.get<Post[]>('/public/posts?exclude_featured=1&limit=6').then(setLatest).catch(() => {})
    api.get<Post[]>('/public/posts?popular=1&limit=5').then(setPopular).catch(() => {})
  }, [])

  const stats = [1, 2, 3, 4].map(i => ({
    number: settings[`home_stat${i}_number`] || '',
    suffix: settings[`home_stat${i}_suffix`] || '',
    label: settings[`home_stat${i}_label`] || '',
  }))

  const feats = [1, 2, 3, 4].map(i => ({
    icon: settings[`home_feat${i}_icon`] || '',
    title: settings[`home_feat${i}_title`] || '',
    text: settings[`home_feat${i}_text`] || '',
  }))

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setSubState('sending')
    try {
      await api.post('/public/newsletter', { email })
      setSubState('sent')
      setEmail('')
    } catch {
      setSubState('error')
    }
  }

  return (
    <>
      <HeroSlider />

      <main>
        {/* STAT-BAR */}
        <section className="bmb-statbar">
          <div className="bmb-container">
            <div className="bmb-stats-grid">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="bmb-stat-num">{s.number}{s.suffix}</div>
                  <div className="bmb-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED POST */}
        {featured && (
          <section className="bmb-sec">
            <div className="bmb-container">
              <div className="bmb-eyebrow" data-reveal>{settings.home_featured_label || '🌟 Bài viết nổi bật'}</div>
              <h2 className="bmb-sec-title" data-reveal style={{ maxWidth: 640 }}>{renderEmphasis(settings.home_featured_title || 'Đang được đọc nhiều nhất *tuần này*')}</h2>
              <div style={{ height: 28 }}></div>
              <Link to={`/bai-viet/${featured.slug}`} className="bmb-featured" data-reveal style={{ display: 'block' }}>
                {featured.thumbnail && <img src={featured.thumbnail} className="bmb-featured-img" alt={featured.title} loading="lazy" />}
                <div className="bmb-featured-overlay"></div>
                <div className="bmb-featured-body">
                  {featured.category_name && <span className="bmb-featured-tag">{featured.category_name}</span>}
                  <h3 className="bmb-featured-title">{featured.title}</h3>
                  <p className="bmb-featured-sub">{featured.excerpt}</p>
                  <div className="bmb-featured-meta">
                    <span>{featured.author_name}</span>
                    <span>{featured.read_time} phút đọc</span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* GRID-CARDS — Latest posts */}
        <section className="bmb-sec bmb-sec-tint">
          <div className="bmb-container">
            <div className="bmb-eyebrow" data-reveal>{settings.home_latest_label || '📝 Mới đăng'}</div>
            <h2 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.home_latest_title || 'Bài viết mới nhất từ *Cỏ Non*')}</h2>
            <div style={{ height: 32 }}></div>
            <PostList posts={latest} />
            <div className="text-center" style={{ marginTop: 40 }}>
              <Link to="/chuyen-muc" className="bmb-btn bmb-btn-ghost">Xem tất cả bài viết</Link>
            </div>
          </div>
        </section>

        {/* FEATURE-ICON-ROW */}
        <section className="bmb-sec">
          <div className="bmb-container">
            <div className="bmb-eyebrow bmb-center" data-reveal style={{ display: 'flex', justifyContent: 'center' }}>{settings.home_feat_label || '🍃 Vì sao đọc Cỏ Non'}</div>
            <h2 className="bmb-sec-title bmb-center" data-reveal>{renderEmphasis(settings.home_feat_title || 'Một blog viết bằng *sự thật*, không phải công thức')}</h2>
            <div style={{ height: 44 }}></div>
            <div className="bmb-feature-row">
              {feats.map((f, i) => (
                <div className="bmb-feature-item" data-reveal data-reveal-d1={i > 0 ? true : undefined} key={i}>
                  <div className="bmb-feature-icon">{f.icon}</div>
                  <div className="bmb-feature-title">{f.title}</div>
                  <div className="bmb-feature-text">{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HORIZONTAL-SCROLL — Được đọc nhiều nhất */}
        {popular.length > 0 && (
          <section className="bmb-sec bmb-sec-peach">
            <div className="bmb-container">
              <div className="bmb-eyebrow" data-reveal>{settings.home_popular_label || '🔥 Được đọc nhiều nhất'}</div>
              <h2 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.home_popular_title || 'Mẹ nào cũng nên đọc *ít nhất một lần*')}</h2>
              <div style={{ height: 32 }}></div>
              <div className="bmb-hscroll">
                {popular.map(p => (
                  <div className="bmb-hscroll-card" key={p.id}>
                    <PostCard post={p} revealAttr={false} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="bmb-sec" id="faq">
            <div className="bmb-container">
              <div className="bmb-eyebrow bmb-center" data-reveal style={{ display: 'flex', justifyContent: 'center' }}>{settings.home_faq_label || '❓ Câu hỏi thường gặp'}</div>
              <h2 className="bmb-sec-title bmb-center" data-reveal>{renderEmphasis(settings.home_faq_title || 'Mọi điều bạn cần biết về *Cỏ Non*')}</h2>
              <div style={{ height: 36 }}></div>
              <div className="bmb-faq-list" data-reveal>
                {faqs.map((f, i) => (
                  <div className={`bmb-faq-item${openFaq === i ? ' open' : ''}`} key={f.id}>
                    <button className="bmb-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{f.question}</span>
                      <span className="bmb-faq-icon">+</span>
                    </button>
                    <div className="bmb-faq-a" style={{ maxHeight: openFaq === i ? 400 : 0 }}>
                      <div className="bmb-faq-a-inner">{f.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="bmb-sec-sm" id="newsletter">
          <div className="bmb-container">
            <div className="bmb-newsletter" data-reveal>
              <div>
                <h3 className="bmb-sec-title bmb-mb-0" style={{ fontSize: 24, marginBottom: 8 }}>{settings.newsletter_title || '💌 Đừng bỏ lỡ bài viết mới'}</h3>
                <p className="bmb-sec-sub bmb-mb-0">{settings.newsletter_text || ''}</p>
              </div>
              {subState === 'sent' ? (
                <div style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>Đăng ký thành công! Cảm ơn bạn đã theo dõi Cỏ Non. 🌱</div>
              ) : (
                <form className="bmb-newsletter-form" onSubmit={handleSubscribe}>
                  <input type="email" placeholder="Email của bạn" value={email} onChange={e => setEmail(e.target.value)} required />
                  <button type="submit" className="bmb-btn bmb-btn-peach" disabled={subState === 'sending'}>{subState === 'sending' ? 'Đang gửi...' : 'Đăng ký'}</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
