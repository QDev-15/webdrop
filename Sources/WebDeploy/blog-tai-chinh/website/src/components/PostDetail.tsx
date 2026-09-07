import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

interface RelatedPost {
  id: number
  title: string
  slug: string
  thumbnail: string
  read_time: number
  published_at: string
}

interface PostDetailData {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  author_name: string
  author_avatar: string
  author_role: string
  author_bio: string
  tags: string
  read_time: number
  published_at: string
  category_name: string | null
  category_slug: string | null
  related: RelatedPost[]
}

interface TocItem { id: string; label: string }

function fmtDate(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { settings } = useSite()
  const [post, setPost] = useState<PostDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toc, setToc] = useState<TocItem[]>([])
  const [newsletterSent, setNewsletterSent] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: post ? `${post.title} — ${settings.site_name || 'La Bàn Tài Chính'}` : (settings.site_name || 'La Bàn Tài Chính'),
    description: post?.excerpt,
  })

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError('')
    api.get<PostDetailData>(`/public/posts/${slug}`)
      .then(setPost)
      .catch(() => setError('Bài viết không tồn tại hoặc đã bị xóa.'))
      .finally(() => setLoading(false))
  }, [slug])

  // Tự sinh mục lục từ thẻ <h2> trong nội dung — TOC luôn khớp đúng nội dung thực tế
  // mà không cần admin phải quản lý riêng danh sách mục lục.
  useEffect(() => {
    if (!contentRef.current) return
    const headings = Array.from(contentRef.current.querySelectorAll('h2'))
    const items: TocItem[] = headings.map((h, i) => {
      const id = h.id || `s${i + 1}`
      h.id = id
      return { id, label: h.textContent || '' }
    })
    setToc(items)
  }, [post])

  const tags = (post?.tags || '').split(',').map(t => t.trim()).filter(Boolean)

  async function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setNewsletterSent(true)
    e.currentTarget.reset()
    setTimeout(() => setNewsletterSent(false), 2400)
  }

  if (loading) {
    return (
      <main style={{ paddingTop: 150, minHeight: '60vh' }}>
        <div className="wd-container" style={{ textAlign: 'center', color: 'var(--text-3)' }}>Đang tải bài viết...</div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main style={{ paddingTop: 150, minHeight: '60vh', textAlign: 'center', paddingBottom: 60 }}>
        <div className="wd-container">
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>Không tìm thấy bài viết</h1>
          <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>{error}</p>
          <Link to="/chuyen-muc" className="btc-btn btc-btn-primary">Xem tất cả bài viết</Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <header className="btc-page-header" style={{ backgroundImage: `url('${post.thumbnail}')` }}>
        <div className="wd-container btc-article-head">
          <div className="btc-breadcrumb" style={{ justifyContent: 'center' }}>
            <Link to="/">Trang chủ</Link><span>/</span>
            {post.category_slug && <Link to={`/chuyen-muc?cat=${post.category_slug}`}>{post.category_name}</Link>}
          </div>
          {post.category_name && <div className="btc-tag">{post.category_name}</div>}
          <h1>{post.title}</h1>
          <div className="btc-article-meta-row">
            <div className="btc-article-author">
              {post.author_avatar && <img src={post.author_avatar} alt={post.author_name} />}
              <span className="btc-article-author-name">{post.author_name}</span>
            </div>
            <span className="btc-article-meta-sep">·</span><span className="btc-article-meta-item">{fmtDate(post.published_at)}</span>
            <span className="btc-article-meta-sep">·</span><span className="btc-article-meta-item">{post.read_time} phút đọc</span>
          </div>
        </div>
      </header>

      <section className="btc-sec">
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-8">
              <article className="btc-article-body">
                <div ref={contentRef} dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }} />

                {tags.length > 0 && (
                  <div className="btc-tags-row">
                    {tags.map(t => <span key={t} className="btc-article-tag">{t}</span>)}
                  </div>
                )}

                <div className="btc-share-row">
                  <span className="btc-share-label">Chia sẻ bài viết</span>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="btc-share-btn" aria-label="Chia sẻ Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(window.location.href)}`} className="btc-share-btn" aria-label="Chia sẻ qua email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
                  </a>
                  <button
                    type="button"
                    className="btc-share-btn"
                    aria-label="Sao chép liên kết"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.5-1.5"/></svg>
                  </button>
                </div>

                {post.author_bio && (
                  <div className="btc-author-box">
                    {post.author_avatar && <img src={post.author_avatar} alt={post.author_name} />}
                    <div>
                      <div className="btc-author-box-name">{post.author_name}</div>
                      <div className="btc-author-box-role">{post.author_role}</div>
                      <div className="btc-author-box-desc">{post.author_bio}</div>
                    </div>
                  </div>
                )}
              </article>

              {post.related.length > 0 && (
                <div className="btc-sec" style={{ paddingBottom: 0 }}>
                  <div className="btc-head-row" data-reveal>
                    <h2 className="btc-h2">Bài viết <em>liên quan</em></h2>
                  </div>
                  <div className="btc-grid-cards btc-grid-3" data-reveal data-delay="1">
                    {post.related.map(r => (
                      <Link key={r.id} to={`/bai-viet/${r.slug}`} className="btc-post-card">
                        <div className="btc-post-thumb"><img src={r.thumbnail} alt={r.title} /></div>
                        <div className="btc-post-body">
                          <h3 className="btc-post-title">{r.title}</h3>
                          <div className="btc-post-meta"><span>{fmtDate(r.published_at)}</span><span>·</span><span>{r.read_time} phút đọc</span></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="col-lg-4">
              {toc.length > 0 && (
                <div className="btc-toc">
                  <div className="btc-toc-title">Mục lục bài viết</div>
                  <div className="btc-toc-list">
                    {toc.map(t => <a key={t.id} href={`#${t.id}`}>{t.label}</a>)}
                  </div>
                </div>
              )}
              <div className="btc-sidebar-box btc-promo">
                <div className="btc-footer-title" style={{ color: '#fff' }}>Thử ngay công cụ</div>
                <p>Tính chính xác số tiền bạn có thể tích lũy được với công cụ lãi kép miễn phí.</p>
                <Link to="/cong-cu-tinh-toan" className="btc-btn btc-btn-primary btc-btn-block">Mở công cụ tính lãi kép</Link>
              </div>
              <div className="btc-sidebar-box">
                <div className="btc-footer-title">Đăng ký bản tin</div>
                <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                  <input type="email" placeholder={newsletterSent ? 'Đã đăng ký!' : 'Email của bạn'} required style={{ padding: '12px 14px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 14 }} />
                  <button type="submit" className="btc-btn btc-btn-primary btc-btn-block">{newsletterSent ? 'Đã đăng ký!' : 'Đăng ký'}</button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
