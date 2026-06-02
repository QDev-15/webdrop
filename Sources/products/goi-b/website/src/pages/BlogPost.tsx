import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { get } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface Post {
  id: number; title: string; slug: string; content: string
  excerpt: string; thumbnail: string
  category_name: string; category_slug: string
  created_at: string; meta_title: string; meta_description: string
  related: { id: number; title: string; slug: string; thumbnail: string; created_at: string }[]
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function BlogPost() {
  const { slug }     = useParams<{ slug: string }>()
  const navigate     = useNavigate()
  const { settings } = useSite()
  const [post, setPost]     = useState<Post | null>(null)
  const [loading, setLoad]  = useState(true)

  useEffect(() => {
    setLoad(true)
    setPost(null)
    get<Post>(`/posts/${slug}`)
      .then(p => {
        setPost(p)
        document.title = p.meta_title || `${p.title} — ${settings.site_name || 'Website'}`
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc && p.meta_description) metaDesc.setAttribute('content', p.meta_description)
      })
      .catch(() => navigate('/blog', { replace: true }))
      .finally(() => setLoad(false))
  }, [slug, settings.site_name, navigate])

  if (loading) return (
    <div style={{ paddingTop: 62 }}>
      <section className="site-section">
        <div className="site-container">
          <div className="post-detail">
            <div className="skeleton" style={{ height: 36, marginBottom: 16, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 32, borderRadius: 4 }} />
            <div className="skeleton" style={{ aspectRatio: '16/9', marginBottom: 32, borderRadius: 12 }} />
            {[100, 90, 75, 95, 60].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 10, borderRadius: 4 }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  if (!post) return null

  return (
    <div style={{ paddingTop: 62 }}>
      <section className="site-section bg-surface">
        <div className="site-container">
          {/* Breadcrumb */}
          <div className="breadcrumb-bar mb-4">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <Link to="/blog">Tin tức</Link>
            {post.category_name && (
              <><span>›</span><Link to={`/blog?cat=${post.category_slug}`}>{post.category_name}</Link></>
            )}
            <span>›</span>
            <span style={{ color: 'var(--text)' }}>{post.title}</span>
          </div>

          <div className="post-detail">
            <h1 className="post-detail-title">{post.title}</h1>
            <div className="post-detail-meta">
              <span>{formatDate(post.created_at)}</span>
              {post.category_name && (
                <> · <Link to={`/blog?cat=${post.category_slug}`}>{post.category_name}</Link></>
              )}
            </div>

            {post.thumbnail && (
              <img className="post-detail-thumb" src={post.thumbnail} alt={post.title} />
            )}

            <div
              className="post-detail-content"
              dangerouslySetInnerHTML={{ __html: post.content || '<p>Chưa có nội dung.</p>' }}
            />
          </div>

          {/* Related posts */}
          {post.related?.length > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
              <h3 style={{ fontWeight: 600, marginBottom: 20, fontSize: 17 }}>Bài viết liên quan</h3>
              <div className="row g-3">
                {post.related.map(r => (
                  <div className="col-md-4" key={r.id}>
                    <Link to={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                      <div className="post-card">
                        <div className="post-card-thumb">
                          {r.thumbnail
                            ? <img src={r.thumbnail} alt={r.title} loading="lazy" />
                            : <div style={{ height: '100%', background: 'var(--warm2)' }} />
                          }
                        </div>
                        <div className="post-card-body">
                          <span className="post-card-title">{r.title}</span>
                          <div className="post-card-date">{formatDate(r.created_at)}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <Link to="/blog" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: 13.5 }}>← Quay lại danh sách</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
