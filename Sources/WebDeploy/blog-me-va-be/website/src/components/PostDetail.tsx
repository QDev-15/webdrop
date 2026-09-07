import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

interface PostFull {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  category_slug: string
  category_name: string | null
  author_name: string
  author_avatar: string
  author_role: string
  read_time: number
  tags: string
  published_at: string
}

interface RelatedPost {
  id: number
  title: string
  slug: string
  thumbnail: string
  category_name: string | null
  read_time: number
}

function formatDate(v: string) {
  if (!v) return ''
  const d = new Date(v.replace(' ', 'T'))
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN')
}

export default function PostDetail() {
  const { slug } = useParams()
  const { settings } = useSite()
  const [post, setPost] = useState<PostFull | null>(null)
  const [related, setRelated] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    api.get<PostFull>(`/public/posts/${slug}`)
      .then(p => {
        setPost(p)
        return api.get<RelatedPost[]>(`/public/related-posts/${slug}`)
      })
      .then(setRelated)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: post ? `${post.title} — ${settings.site_name || 'Cỏ Non Blog'}` : (settings.site_name || 'Cỏ Non Blog'),
    description: post?.excerpt?.slice(0, 155),
  })

  if (loading) {
    return <main><div style={{ padding: '160px 20px 80px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải bài viết...</div></main>
  }

  if (notFound || !post) {
    return (
      <main>
        <div style={{ padding: '160px 20px 80px', textAlign: 'center' }}>
          <h1 className="bmb-sec-title">Không tìm thấy bài viết</h1>
          <p className="bmb-sec-sub" style={{ margin: '0 auto 24px' }}>Bài viết bạn tìm không tồn tại hoặc đã bị gỡ.</p>
          <Link to="/chuyen-muc" className="bmb-btn bmb-btn-primary">Xem tất cả bài viết</Link>
        </div>
      </main>
    )
  }

  const tags = (post.tags || '').split(',').map(t => t.trim()).filter(Boolean)

  return (
    <main>
      <section className="bmb-article-hero">
        <div className="bmb-container">
          {post.category_name && <span className="bmb-article-cat" data-reveal>{post.category_name}</span>}
          <h1 className="bmb-article-title" data-reveal>{post.title}</h1>
          <div className="bmb-article-meta-row" data-reveal>
            <div className="bmb-article-author">
              {post.author_avatar && <img src={post.author_avatar} alt={`Ảnh đại diện ${post.author_name}`} />}
              <div>
                <div className="bmb-article-author-name">{post.author_name}</div>
                <div className="bmb-article-author-role">{post.author_role}</div>
              </div>
            </div>
            <span className="bmb-article-sep">•</span>
            <span className="bmb-article-date">Cập nhật {formatDate(post.published_at)}</span>
            <span className="bmb-article-sep">•</span>
            <span className="bmb-article-read">{post.read_time} phút đọc</span>
          </div>
          {post.thumbnail && (
            <div className="bmb-article-cover" data-reveal>
              <img src={post.thumbnail} alt={post.title} loading="lazy" />
            </div>
          )}
        </div>
      </section>

      <section className="bmb-sec" style={{ paddingTop: 0 }}>
        <div className="bmb-container">
          <article className="bmb-article-body" data-reveal>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {tags.length > 0 && (
              <div className="bmb-article-tags">
                {tags.map(tag => (
                  <Link key={tag} to={`/chuyen-muc?cat=${post.category_slug}`}>#{tag}</Link>
                ))}
              </div>
            )}

            <div className="bmb-article-author-box">
              {post.author_avatar && <img src={post.author_avatar} alt={`Ảnh đại diện ${post.author_name}`} />}
              <div>
                <h4>Viết bởi {post.author_name}</h4>
                <p>{settings.footer_description} <Link to="/ve-toi" style={{ color: 'var(--accent)', fontWeight: 600 }}>Đọc thêm về mình →</Link></p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bmb-sec bmb-sec-tint">
          <div className="bmb-container-sm">
            <div className="bmb-eyebrow" data-reveal>📖 Đọc thêm</div>
            <h2 className="bmb-sec-title" data-reveal style={{ fontSize: 26 }}>Bài viết liên quan</h2>
            <div style={{ height: 16 }}></div>
            <div className="bmb-list-elegant" data-reveal>
              {related.map((r, i) => (
                <Link to={`/bai-viet/${r.slug}`} className="bmb-list-item" key={r.id}>
                  <span className="bmb-list-num">{String(i + 1).padStart(2, '0')}</span>
                  {r.thumbnail && <img className="bmb-list-thumb" src={r.thumbnail} alt={r.title} />}
                  <div className="bmb-list-body">
                    {r.category_name && <span className="bmb-list-cat">{r.category_name}</span>}
                    <div className="bmb-list-title">{r.title}</div>
                    <div className="bmb-list-meta">{r.read_time} phút đọc</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
