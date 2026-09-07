import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Post {
  id: number
  category_id: number | null
  category_name: string | null
  category_slug: string | null
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
  views: number
  review_score: number | null
  meta_title: string
  meta_description: string
  created_at: string
}

interface RelatedPost {
  id: number
  title: string
  slug: string
  thumbnail: string
}

interface TocItem {
  id: string
  text: string
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PostDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [related, setRelated] = useState<RelatedPost[]>([])
  const [notFound, setNotFound] = useState(false)
  const [toc, setToc] = useState<TocItem[]>([])
  const proseRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: post ? (post.meta_title || `${post.title} | PIXEL.`) : 'PIXEL. Blog Công Nghệ',
    description: post ? (post.meta_description || post.excerpt) : undefined,
  })

  useEffect(() => {
    if (!slug) return
    setPost(null)
    setNotFound(false)
    api.get<Post>(`/public/posts/${slug}`)
      .then(setPost)
      .catch(() => setNotFound(true))
    api.get<RelatedPost[]>(`/public/posts/${slug}/related`).then(setRelated).catch(() => {})
  }, [slug])

  useEffect(() => {
    if (!proseRef.current) return
    const headings = Array.from(proseRef.current.querySelectorAll('h2[id]'))
    setToc(headings.map(h => ({ id: h.id, text: h.textContent || '' })))
  }, [post])

  if (notFound) {
    return (
      <section className="bcn-sec" style={{ paddingTop: 160, textAlign: 'center' }}>
        <div className="bcn-container">
          <h1>Không tìm thấy bài viết</h1>
          <p style={{ margin: '16px 0' }}>Bài viết bạn tìm không tồn tại hoặc đã bị gỡ.</p>
          <Link to="/chuyen-muc" className="bcn-btn bcn-btn-accent">Xem chuyên mục</Link>
        </div>
      </section>
    )
  }

  if (!post) {
    return <div style={{ paddingTop: 160, textAlign: 'center', color: 'var(--text-3)' }}>Đang tải bài viết...</div>
  }

  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <>
      <header className="bcn-article-hero">
        <div className="bcn-article-hero-grid" aria-hidden="true"></div>
        <div className="bcn-container">
          <div className="bcn-breadcrumb">
            <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }}></i>
            {post.category_slug && (
              <>
                <Link to={`/chuyen-muc?cat=${post.category_slug}`}>{post.category_name}</Link>
                <i className="bi bi-chevron-right" style={{ fontSize: 10 }}></i>
              </>
            )}
            <span>{post.title}</span>
          </div>
          <span className="bcn-article-cat">{post.category_name ?? 'Bài viết'}</span>
          <h1 className="bcn-article-title">{post.title}</h1>
          <div className="bcn-article-meta-row">
            <div className="bcn-article-author">
              <img src={post.author_avatar} className="bcn-article-av" alt={post.author_name} />
              <div>
                <div className="bcn-article-author-name">{post.author_name}</div>
                <div className="bcn-article-author-role">{post.author_role}</div>
              </div>
            </div>
            <span className="bcn-article-meta-item"><i className="bi bi-calendar3"></i> {fmtDate(post.created_at)}</span>
            <span className="bcn-article-meta-item"><i className="bi bi-clock"></i> {post.read_time} phút đọc</span>
            <span className="bcn-article-meta-item"><i className="bi bi-eye"></i> {post.views.toLocaleString('vi-VN')} lượt đọc</span>
          </div>
        </div>
      </header>

      <section className="bcn-sec" style={{ paddingTop: 56 }}>
        <div className="bcn-container">
          <div className="bcn-article-layout">
            <article>
              {post.thumbnail && (
                <div className="bcn-article-cover">
                  <img src={post.thumbnail} alt={post.title} />
                </div>
              )}

              <div className="bcn-prose" ref={proseRef} dangerouslySetInnerHTML={{ __html: post.content }} />

              {tags.length > 0 && (
                <div className="bcn-article-tags">
                  {tags.map(t => (
                    <Link key={t} to={post.category_slug ? `/chuyen-muc?cat=${post.category_slug}` : '/chuyen-muc'} className="bcn-tag">#{t}</Link>
                  ))}
                </div>
              )}

              {post.author_bio && (
                <div className="bcn-author-box">
                  <img src={post.author_avatar} alt={post.author_name} />
                  <div>
                    <h4>{post.author_name}</h4>
                    <p>{post.author_bio}</p>
                  </div>
                </div>
              )}
            </article>

            <aside>
              {toc.length > 0 && (
                <div className="bcn-sidebar-box">
                  <div className="bcn-sidebar-title">Mục lục</div>
                  <div className="bcn-toc-list">
                    {toc.map(t => <a key={t.id} href={`#${t.id}`}>{t.text}</a>)}
                  </div>
                </div>
              )}

              {related.length > 0 && (
                <div className="bcn-sidebar-box">
                  <div className="bcn-sidebar-title">Bài viết liên quan</div>
                  <div className="bcn-sidebar-related">
                    {related.map(r => (
                      <Link key={r.id} to={`/bai-viet/${r.slug}`} className="bcn-sidebar-related-item">
                        <img src={r.thumbnail} alt={r.title} />
                        <h5>{r.title}</h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bcn-sidebar-box" style={{ background: 'var(--ink)', borderColor: 'var(--ink)' }}>
                <div className="bcn-sidebar-title" style={{ color: '#fff' }}>Nhận bản tin</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 14, lineHeight: 1.6 }}>Tin công nghệ chọn lọc mỗi tuần, gửi thẳng vào email.</p>
                <Link to="/#bcn-newsletter" className="bcn-btn bcn-btn-accent bcn-btn-full bcn-btn-sm">Đăng ký ngay</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
