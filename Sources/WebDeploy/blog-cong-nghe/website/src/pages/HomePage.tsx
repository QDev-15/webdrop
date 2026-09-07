import { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  thumbnail: string
  author_name: string
  author_avatar: string
  featured: number
  read_time: number
  views: number
  review_score: number | null
  review_score_label: string
  category_name: string | null
  category_slug: string | null
  created_at: string
}

interface Faq {
  id: number
  question: string
  answer: string
}

const CAT_ICON: Record<string, string> = {
  'tin-tuc': 'bi-broadcast',
  'danh-gia': 'bi-star',
  'thu-thuat': 'bi-lightbulb',
  'ai-xu-huong': 'bi-cpu',
  'bao-mat': 'bi-shield-lock',
  'di-dong': 'bi-phone',
}

function fmtDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function CounterNum({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let cur = 0
        const step = Math.ceil(target / 60) || 1
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          setVal(cur)
          if (cur >= target) clearInterval(t)
        }, 25)
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])
  return <div className="bcn-stat-num" ref={ref}>{val.toLocaleString('vi-VN')}{suffix}</div>
}

export default function HomePage() {
  useDocumentMeta({
    title: 'PIXEL. — Blog Công Nghệ | Tin tức, đánh giá & thủ thuật công nghệ',
    description: 'PIXEL. — blog công nghệ cập nhật tin tức, đánh giá sản phẩm và thủ thuật hữu ích mỗi ngày. Nội dung chọn lọc, không giật tít.',
  })

  const { categories, settings } = useSite()
  const location = useLocation()
  const [featured, setFeatured] = useState<Post | null>(null)
  const [latest, setLatest] = useState<Post[]>([])
  const [trending, setTrending] = useState<Post[]>([])
  const [reviews, setReviews] = useState<Post[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [newsletterMsg, setNewsletterMsg] = useState('')

  useEffect(() => {
    api.get<Post[]>('/public/posts?featured=1&limit=1').then(r => setFeatured(r[0] ?? null)).catch(() => {})
    api.get<Post[]>('/public/posts?limit=7').then(setLatest).catch(() => {})
    api.get<Post[]>('/public/posts?order_by=views&limit=5').then(setTrending).catch(() => {})
    api.get<Post[]>('/public/posts?type=review&limit=4').then(setReviews).catch(() => {})
    api.get<Faq[]>('/public/faqs').then(setFaqs).catch(() => {})
    Promise.all([
      api.getPaged<Post[]>('/public/posts?limit=1'),
      api.getPaged<Post[]>('/public/posts?type=review&limit=1'),
    ]).then(([a, b]) => setTotalPosts(a.total + b.total)).catch(() => {})
  }, [])

  useEffect(() => {
    if (location.hash === '#bcn-newsletter') {
      const el = document.getElementById('bcn-newsletter')
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300)
    }
  }, [location.hash])

  const latestGrid = latest.filter(p => p.id !== featured?.id).slice(0, 6)

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNewsletterMsg('Cảm ơn bạn đã đăng ký nhận bản tin!')
    setTimeout(() => setNewsletterMsg(''), 4000)
  }

  return (
    <>
      <HeroSlider />

      {/* ============ CATEGORY QUICK-NAV ============ */}
      <section className="bcn-sec" style={{ paddingTop: 56 }}>
        <div className="bcn-container">
          <div className="bcn-cat-row" data-reveal>
            {categories.map(c => (
              <Link key={c.id} to={`/chuyen-muc?cat=${c.slug}`} className="bcn-cat-item">
                <span className="bcn-cat-icon"><i className={`bi ${c.icon || CAT_ICON[c.slug] || 'bi-file-text'}`}></i></span>
                <span className="bcn-cat-name">{c.name}</span>
                <span className="bcn-cat-count">{c.post_count} bài viết</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED + LATEST ============ */}
      <section className="bcn-sec">
        <div className="bcn-container">
          <div className="bcn-sec-header bcn-split" data-reveal>
            <div>
              <div className="bcn-eyebrow">Nổi bật</div>
              <h2 className="bcn-sec-title">Bài viết đang được quan tâm</h2>
            </div>
            <Link to="/chuyen-muc" className="bcn-btn bcn-btn-ghost bcn-btn-sm">Xem tất cả <i className="bi bi-arrow-right"></i></Link>
          </div>

          {featured && (
            <Link to={`/bai-viet/${featured.slug}`} className="bcn-featured" style={{ textDecoration: 'none', marginBottom: 32, display: 'grid' }} data-reveal>
              <div className="bcn-featured-media">
                <img src={featured.thumbnail} alt={featured.title} />
              </div>
              <div className="bcn-featured-body">
                <span className="bcn-featured-cat">{featured.category_name ?? 'Bài viết'}</span>
                <h3 className="bcn-featured-title">{featured.title}</h3>
                <p className="bcn-featured-excerpt">{featured.excerpt}</p>
                <div className="bcn-featured-meta">
                  <span>{featured.author_name}</span>
                  <span>{fmtDate(featured.created_at)}</span>
                  <span>{featured.read_time} phút đọc</span>
                </div>
              </div>
            </Link>
          )}

          <div className="bcn-post-grid">
            {latestGrid.map((p, i) => (
              <Link key={p.id} to={`/bai-viet/${p.slug}`} className="bcn-post-card" style={{ textDecoration: 'none' }} data-reveal data-delay={String((i % 3) + 1)}>
                <div className="bcn-post-thumb">
                  <span className="bcn-post-cat-tag">{p.category_name ?? 'Bài viết'}</span>
                  <img src={p.thumbnail} alt={p.title} />
                </div>
                <div className="bcn-post-body">
                  <div className="bcn-post-meta"><span>{new Date(p.created_at).toLocaleDateString('vi-VN')}</span><span>{p.read_time} phút đọc</span></div>
                  <h4 className="bcn-post-title">{p.title}</h4>
                  <p className="bcn-post-excerpt">{p.excerpt}</p>
                  <div className="bcn-post-foot">
                    <div className="bcn-post-author">
                      <img src={p.author_avatar} className="bcn-post-av" alt={p.author_name} />
                      <span className="bcn-post-author-name">{p.author_name}</span>
                    </div>
                    <span className="bcn-post-more">Đọc tiếp →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STAT-BAR ============ */}
      <section className="bcn-sec bcn-sec-dark">
        <div className="bcn-container">
          <div className="bcn-stats-grid">
            <div className="bcn-stat-item" data-reveal>
              <CounterNum target={totalPosts} suffix="+" />
              <div className="bcn-stat-label">Bài viết đã đăng</div>
            </div>
            <div className="bcn-stat-item" data-reveal data-delay="1">
              <CounterNum target={parseInt(settings.stats_monthly_reads || '0', 10)} suffix="K+" />
              <div className="bcn-stat-label">Lượt đọc / tháng</div>
            </div>
            <div className="bcn-stat-item" data-reveal data-delay="2">
              <CounterNum target={parseInt(settings.stats_newsletter_subs || '0', 10)} suffix="K+" />
              <div className="bcn-stat-label">Người đăng ký bản tin</div>
            </div>
            <div className="bcn-stat-item" data-reveal data-delay="3">
              <CounterNum target={parseInt(settings.stats_years_active || '0', 10)} suffix="+" />
              <div className="bcn-stat-label">Năm hoạt động</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BENTO-GRID ============ */}
      <section className="bcn-sec bcn-sec-alt">
        <div className="bcn-container">
          <div className="bcn-sec-header" data-reveal>
            <div className="bcn-eyebrow">Tuần này</div>
            <h2 className="bcn-sec-title">Nổi bật trong tuần</h2>
            <p className="bcn-sec-sub">Những câu chuyện công nghệ được đọc và chia sẻ nhiều nhất tuần qua.</p>
          </div>
          <div className="bcn-bento" style={{ marginTop: 32 }} data-reveal>
            {trending.map((p, i) => (
              <Link key={p.id} to={`/bai-viet/${p.slug}`} className={`bcn-bento-item${i === 0 ? ' bcn-big' : ''}`}>
                <img src={p.thumbnail} alt={p.title} />
                <div className="bcn-bento-overlay">
                  <span className="bcn-bento-cat">{p.category_name ?? 'Bài viết'}</span>
                  <span className="bcn-bento-title">{p.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HORIZONTAL-SCROLL — Đánh giá mới nhất ============ */}
      <section className="bcn-sec">
        <div className="bcn-container">
          <div className="bcn-sec-header bcn-split" data-reveal>
            <div>
              <div className="bcn-eyebrow">Review</div>
              <h2 className="bcn-sec-title">Đánh giá sản phẩm mới nhất</h2>
            </div>
            <Link to="/danh-gia-san-pham" className="bcn-btn bcn-btn-ghost bcn-btn-sm">Tất cả đánh giá <i className="bi bi-arrow-right"></i></Link>
          </div>
          <div className="bcn-hscroll" data-reveal>
            {reviews.map(r => (
              <Link key={r.id} to={`/bai-viet/${r.slug}`} className="bcn-review-card" style={{ textDecoration: 'none' }}>
                <div className="bcn-review-thumb"><img src={r.thumbnail} alt={r.title} /></div>
                <div className="bcn-review-body">
                  <span className="bcn-review-score">{r.review_score}/10</span>
                  <h4 className="bcn-review-title">{r.title}</h4>
                  <p className="bcn-review-excerpt">{r.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="bcn-newsletter" id="bcn-newsletter">
        <div className="bcn-newsletter-grid" aria-hidden="true"></div>
        <div className="bcn-container bcn-newsletter-inner" data-reveal>
          <div className="bcn-newsletter-text">
            <h3>Nhận bản tin công nghệ mỗi tuần</h3>
            <p>Tổng hợp tin tức, đánh giá và thủ thuật đáng chú ý nhất — gửi thẳng vào hộp thư, không spam.</p>
          </div>
          <form className="bcn-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input type="email" placeholder="Email của bạn" required aria-label="Email đăng ký nhận bản tin" />
            <button type="submit" className="bcn-btn bcn-btn-dark">{newsletterMsg || 'Đăng ký ngay'}</button>
          </form>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bcn-sec">
        <div className="bcn-container">
          <div className="bcn-sec-header bcn-center" data-reveal>
            <div className="bcn-eyebrow">Hỏi đáp</div>
            <h2 className="bcn-sec-title">Câu hỏi thường gặp</h2>
            <p className="bcn-sec-sub">Một vài điều độc giả và đối tác thường thắc mắc về PIXEL.</p>
          </div>
          <div className="bcn-faq-list" style={{ marginTop: 36 }} data-reveal>
            {faqs.map((f, i) => (
              <details className="bcn-faq-item" key={f.id} open={i === 0}>
                <summary><span>{f.question}</span><span className="bcn-faq-plus"></span></summary>
                <div className="bcn-faq-answer">{f.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
