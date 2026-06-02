import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import ContactForm from '../components/ContactForm'

interface Banner { id: number; title: string; image: string; link: string; target: string }
interface Post { id: number; title: string; slug: string; excerpt: string; thumbnail: string; category_name: string; created_at: string }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Home() {
  const { settings }           = useSite()
  const [banners, setBanners]  = useState<Banner[]>([])
  const [posts, setPosts]      = useState<Post[]>([])
  const [activeSlide, setSlide] = useState(0)

  useEffect(() => {
    get<Banner[]>('/banners?position=homepage_hero').then(setBanners).catch(() => {})
    get<{ posts: Post[] }>('/posts?limit=6').then(r => setPosts(r.posts)).catch(() => {})
    document.title = settings.site_name || 'Trang chủ'
  }, [settings.site_name])

  // Auto-slide hero
  useEffect(() => {
    if (banners.length < 2) return
    const t = setInterval(() => setSlide(s => (s + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners.length])

  const hero = banners[activeSlide]
  const s    = settings

  return (
    <>
      {/* Hero section */}
      <section className="site-hero">
        {hero ? (
          <>
            <div className="hero-bg" style={{ backgroundImage: `url(${hero.image})` }} />
            <div className="hero-overlay" />
          </>
        ) : (
          <div className="hero-bg" style={{ background: 'linear-gradient(135deg, #0c0b09 0%, #1a6b52 100%)' }} />
        )}
        <div className="site-container hero-content w-100">
          <div style={{ maxWidth: 600 }}>
            {s.site_description && <div className="hero-eyebrow">{s.site_description}</div>}
            <h1 className="hero-title">
              {hero?.title || s.site_name || 'Chào mừng'} <em>đến với chúng tôi</em>
            </h1>
            <p className="hero-desc">
              {s.site_description || 'Chúng tôi cung cấp dịch vụ chất lượng cao, tận tâm và chuyên nghiệp.'}
            </p>
            <div className="hero-actions">
              <Link to="/lien-he" className="btn-hero-primary">Liên hệ ngay</Link>
              <Link to="/blog" className="btn-hero-ghost">Xem tin tức →</Link>
            </div>
          </div>
        </div>
        {/* Dots indicator */}
        {banners.length > 1 && (
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                style={{
                  width: i === activeSlide ? 20 : 7, height: 7,
                  borderRadius: 4, border: 'none',
                  background: i === activeSlide ? '#4ade80' : 'rgba(255,255,255,.3)',
                  cursor: 'pointer', padding: 0, transition: 'all .3s',
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* About / intro section */}
      {s.site_description && (
        <section className="site-section bg-surface">
          <div className="site-container text-center">
            <div className="section-eyebrow">Về chúng tôi</div>
            <h2 className="section-title">{s.site_name || 'Giới thiệu'}</h2>
            <p className="section-sub mx-auto">{s.site_description}</p>
          </div>
        </section>
      )}

      {/* Posts section */}
      {posts.length > 0 && (
        <section className="site-section bg-warm">
          <div className="site-container">
            <div className="text-center mb-5">
              <div className="section-eyebrow">Tin tức</div>
              <h2 className="section-title">Bài viết <em>mới nhất</em></h2>
            </div>
            <div className="row g-3">
              {posts.map(p => (
                <div className="col-md-6 col-lg-4" key={p.id}>
                  <Link to={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <div className="post-card">
                      <div className="post-card-thumb">
                        {p.thumbnail
                          ? <img src={p.thumbnail} alt={p.title} loading="lazy" />
                          : <div className="skeleton" style={{ width: '100%', height: '100%' }} />
                        }
                      </div>
                      <div className="post-card-body">
                        {p.category_name && <div className="post-card-cat">{p.category_name}</div>}
                        <span className="post-card-title">{p.title}</span>
                        {p.excerpt && <p className="post-card-excerpt">{p.excerpt}</p>}
                        <div className="post-card-date">{formatDate(p.created_at)}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to="/blog" style={{
                display: 'inline-block',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 9,
                padding: '10px 24px',
                fontSize: 13.5,
                color: 'var(--text-2)',
                textDecoration: 'none',
                transition: 'all .15s',
              }}>
                Xem tất cả bài viết →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact section */}
      <section className="site-section bg-surface">
        <div className="site-container">
          <ContactForm
            title="Liên hệ với chúng tôi"
            subtitle="Để lại thông tin, chúng tôi sẽ phản hồi trong thời gian sớm nhất."
          />
        </div>
      </section>

      {/* Zalo float */}
      {s.social_zalo && (
        <div className="zalo-float">
          <a href={s.social_zalo} target="_blank" rel="noopener noreferrer" title="Chat Zalo">💬</a>
        </div>
      )}
    </>
  )
}
